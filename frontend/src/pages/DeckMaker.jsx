import TCGdex from "@tcgdex/sdk";
import axios from "axios";

import '../css/DeckMaker.css'
import { useState } from "react";
import { useMemo } from "react";
import { useEffect } from "react";

const DeckMaker = ({seriesData, cardSeries}) => {

    // 카드의 상세 정보를 불러올 때 사용하는 상태들
    const [detailedCards, setDetailedCards] = useState([]);
    const [isDetailLoading, setIsDetailLoading] = useState(false);

    // 선택된 카드 목록
    const [selectedCards, setSelectedCards] = useState([]); 

    // 검색 조건들
    const [searchCard, setSearchCard] = useState("");                   // 카드 검색
    const [selectedSet, setSelectedSet] = useState("all");              // 선택된 확장팩
    const [selectedCategory, setSelectedCategory] = useState("all");    // 카드 카테고리(아이템, 포켓몬, 서포트 등)
    const [selectedRarity, setSelectedRarity] = useState("all");        // 레어도
    const [hpRange, setHpRange] = useState("all");                      // HP 범위

    // 카드 선택
    const handleCardClick = (card) => {
        
        if (selectedCards.length >= 20) {
            alert("덱은 최대 20장까지 구성할 수 있습니다.");
            return;
        }
        
        // 같은 이름의 카드는 최대 2장까지만 선택 가능
        const sameNameCount = selectedCards.filter(c => c.name === card.name).length;
        if (sameNameCount >= 2) {
            alert("같은 이름의 카드는 2장까지만 넣을 수 있습니다.");
            return;
        }

        setSelectedCards([...selectedCards, card]);
    }

    // 선택된 카드를 다시 클릭해서 취소
    const handleRemoveCard = (index) => {
        setSelectedCards(selectedCards.filter((_, i) => i !== index));
    };

    // 전체 카드 목록
    const allCards = useMemo(() => {
        return seriesData ? Object.values(seriesData).flat() : [];
    }, [seriesData]);

    // 2. 확장팩(selectedSet)이 바뀔 때마다 상세 정보 로드
    useEffect(() => {
        const fetchSetDetails = async () => {
            if (selectedSet === "all") {
                // 모든 확장팩일 때는 기존 요약 데이터(allCards) 사용
                setDetailedCards(allCards);
                return;
            }

            setIsDetailLoading(true);
            const sdk = new TCGdex('en');
            try {
                // 'sets' 엔드포인트를 사용해 해당 세트의 모든 카드 상세 정보를 한 번에 가져옴
                const res = await sdk.fetch('sets', selectedSet);
                if (res && res.cards) {
                    setDetailedCards(res.cards); // 여기에는 HP, Rarity, Types 등이 포함됨
                }
            } catch (e) {
                console.error("세트 상세 정보 로드 실패:", e);
            } finally {
                setIsDetailLoading(false);
            }
        };

        fetchSetDetails();
    }, [selectedSet, allCards]);

    // 레어도 목록 추출 (CardDetail의 RARE_LIST 참고)
    const rarities = useMemo(() => {
        const set = new Set(detailedCards.map(c => c.rarity).filter(Boolean));
        return Array.from(set);
    }, [detailedCards]);

    // 카테고리 목록 추출 (Pokemon, Trainer, Energy 등)
    const categories = useMemo(() => {
        const set = new Set(detailedCards.map(c => c.category).filter(Boolean));
        return Array.from(set);
    }, [detailedCards]);

    // 필터링된 카드 목록
    const filteredCards = useMemo(() => {
        return detailedCards.filter(card => {
            // 이름 검색 필터
            const matchesSearch = card.name.toLowerCase().includes(searchCard.toLowerCase());

            // 확장팩(세트) 필터 : ID가 'P-A-001' 형식이므로 앞의 'P-A' 부분을 추출해서 비교
            const cardSetId = card.set?.id || card.id.substring(0, card.id.lastIndexOf('-'));
            const matchesSet = selectedSet === "all" || cardSetId === selectedSet;
            
            // 카테고리 필터
            const matchesCategory = selectedCategory === "all" || card.category === selectedCategory;
            
            // 레어도 필터 (value로 비교)
            const matchesRarity = selectedRarity === "all" || card.rarity === selectedRarity;

            // HP 필터 (예: 100 이상만 보기)
            const matchesHp = hpRange === "all" || (card.hp && card.hp >= parseInt(hpRange));
            
            return matchesSearch && matchesSet && matchesCategory && matchesRarity && matchesHp;
        });
    }, [detailedCards, searchCard, selectedSet, selectedCategory, selectedRarity, hpRange]);
    

    // 덱 저장
    const saveDeck = async () => {
        
        if (selectedCards.length !== 20) {
            alert("20장을 모두 채워야 저장할 수 있습니다!");
            return;
        }

        // 백엔드의 DectCreateDto 참고
        const deckData = {
            deckName: "내 포켓몬 덱", // 나중에 input으로 바꿀 수 있어요
            deckComment: "덱 설명입니다.",
            apiCardIds: selectedCards.map(card => card.id)
        };

        try {
            // Axios를 사용해 백엔드 saveDeckService(컨트롤러)로 전송
            const response = await axios.post('http://localhost:8000/api/saveDeck', deckData, {withCredentials: true});
            console.log("백엔드로 전송할 데이터:", deckData);
            alert("덱이 성공적으로 저장되었습니다!");
        } catch (error) {
            console.error("저장 실패:", error);
            alert("저장 중 오류가 발생했습니다.");
        }

    }

    // console.log(seriesData)
    // console.log(cardSeries)
    console.log(selectedCards);  
    // console.log(detailedCards[0])

    return(
        <div id="DeckMaker">
            <div className='newDeck'>
                <h2>새로운 덱 ({selectedCards.length} / 20)</h2>
                <button 
                    className={`save-button ${selectedCards.length === 20 ? 'active' : ''}`}
                    onClick={saveDeck}
                    disabled={selectedCards.length !== 20}
                >
                    덱 저장하기
                </button>
                <ul>
                    {/* 내가 선택한 카드들을 먼저 보여줌 */}
                    {selectedCards.map((card, idx) => (
                        <li key={`selected-${idx}`} className="filled" onClick={() => handleRemoveCard(idx)}>
                            <img src={`${card.image}/low.webp`} alt={card.name} />
                        </li>
                    ))}

                    {/* 20장에서 모자란 만큼 빈 슬롯(li)을 그려줌 */}
                    {Array.from({ length: 20 - selectedCards.length }).map((_, idx) => (
                        <li key={`empty-${idx}`} className="empty">
                        </li>
                    ))}
                </ul>
            </div>
            <div className='searchCard'>
                <div className="searchBar">
                    <input 
                        type='text'
                        placeholder='카드 이름 검색'
                        value={searchCard}
                        onChange={(e) => setSearchCard(e.target.value)}
                    />
                </div>
                <div className="selectOpts">
                    <select value={selectedSet} onChange={(e) => setSelectedSet(e.target.value)}>
                        <option value="all">모든 확장팩</option>
                        {cardSeries.map(series => (
                            <option key={series.id} value={series.id}>{series.name}</option>
                        ))}
                    </select>
                    <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                        <option value="all">모든 카테고리</option>
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                    <select value={selectedRarity} onChange={(e) => setSelectedRarity(e.target.value)}>
                        <option value="all">모든 레어도</option>
                        {rarities.map(rare => {
                            // CardDetail의 RARE_LIST를 참고하여 이름 변환
                            const rareObj = RARE_LIST.find(r => r.value === rare);
                            return <option key={rare} value={rare}>{rareObj ? rareObj.name : rare}</option>;
                        })}
                    </select>
                    <select>
                        <option>기타</option>
                        <option>특성 있음, 특성 없음, 포켓몬 ex, 메가진화 ex..</option>
                    </select>
                    <select>
                        <option>hp</option>
                        <option>hp의 상~하한</option>
                    </select>
                    <select>
                        <option>기술의 데미지</option>
                        <option>데미지의 상~하한</option>
                    </select>
                    <select>
                        <option>오름차순</option>
                        <option>내림차순</option>
                    </select>
                </div>
            </div>
            <div className="cardLists">
                <ul>
                    {filteredCards.length > 0 ? (
                        filteredCards.map((card) => (
                            <li key={card.id} onClick={() => handleCardClick(card)}>
                                <img src={`${card.image}/low.webp`} alt={card.name} />
                                <p>{card.name}</p>
                            </li>
                        ))
                    ) : (
                        <p>조건에 맞는 카드가 없습니다.</p>
                    )}
                </ul>
            </div>
        </div>
    )
}

export default DeckMaker;