import TCGdex from "@tcgdex/sdk";
import axios from "axios";

import '../css/DeckMaker.css'
import { useState } from "react";
import { useMemo } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom"; 


const DeckMaker = ({seriesData, cardSeries}) => {

    const navigate = useNavigate();

    // 카드의 상세 정보를 불러올 때 사용하는 상태들
    const [detailedCards, setDetailedCards] = useState([]);
    const [isDetailLoading, setIsDetailLoading] = useState(false);

    // 선택된 카드 목록
    const [selectedCards, setSelectedCards] = useState([]); 

    // 덱 이름과 덱 설명, 대표 이미지 URL
    const [deckName, setDeckName] = useState("");
    const [deckComment, setDeckComment] = useState("");
    const [representativeCardId, setRepresentativeCardId] = useState(null);
    const [representativeImgUrl, setRepresentativeImgUrl] = useState(null);

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
        
        if (!deckName.trim()) {
            alert("덱 이름을 입력해주세요.");
            return;
        }

        // 백엔드의 DectCreateDto 참고
        const deckData = {
            deckName: deckName,
            deckComment: deckComment,
            apiCardIds: selectedCards.map(card => card.id),
            representativeCardId: representativeCardId,
            representativeImageUrl: representativeImgUrl
        };

        try {
            // Axios를 사용해 백엔드 saveDeckService(컨트롤러)로 전송
            const response = await axios.post('http://localhost:8000/api/saveDeck', deckData, {withCredentials: true});
            console.log("백엔드로 전송할 데이터:", deckData);
            alert("덱이 성공적으로 저장되었습니다!");
            navigate('/deckRecipes'); // 저장 후 덱 레시피 게시판으로 이동
        } catch (error) {
            console.error("저장 실패:", error);
            alert("저장 중 오류가 발생했습니다.");
        }

    }

    // console.log(seriesData)
    // console.log(cardSeries)
    console.log(selectedCards);  
    // console.log(detailedCards[0])

    return (
        <div id="DeckMaker">
            {/* --- [신규] 왼쪽: 덱 정보 입력 섹션 --- */}
            <div className="deck-info-section">
                <div className="info-box">
                    <h3>📝 덱 설정</h3>
                    <div className="input-group">
                        <label>덱 이름</label>
                        <input 
                            type="text" 
                            placeholder="이름을 입력하세요" 
                            value={deckName}
                            onChange={(e) => setDeckName(e.target.value)}
                        />
                    </div>
                    <div className="input-group">
                        <label>덱 설명</label>
                        <textarea 
                            placeholder="덱 컨셉을 설명해주세요" 
                            value={deckComment}
                            onChange={(e) => setDeckComment(e.target.value)}
                        />
                    </div>
                    
                    <div className="count-display">
                        선택된 카드: <strong>{selectedCards.length}</strong> / 20
                    </div>

                    <button 
                        className="save-btn"
                        onClick={saveDeck}
                        disabled={selectedCards.length !== 20}
                    >
                        💾 덱 저장하기
                    </button>
                </div>
            </div>

            {/* --- [기존] 오른쪽: 덱 빌더 메인 영역 --- */}
            <div className="deck-builder-main">
                <div className='newDeck'>
                    <h2>새로운 덱 구성</h2>
                    <ul>
                        {selectedCards.map((card, idx) => (
                            
                            <li key={`selected-${idx}`} className="filled">
                                <img 
                                    src={`${card.image}/low.webp`} 
                                    alt={card.name} 
                                    onClick={() => handleRemoveCard(idx)} 
                                    title="클릭하면 삭제됩니다"
                                />
                                <button 
                                    className={`rep-btn ${representativeCardId === card.id ? 'active' : ''}`}
                                    onClick={(e) => {
                                        e.stopPropagation(); // 클릭 시 삭제 이벤트가 발생하는 것을 방지
                                        
                                        // 이미지 주소 조립 (하이픈 규칙 적용)
                                        const cardId = card.id;
                                        const lastIndex = cardId.lastIndexOf("-");
                                        const formattedPath = (lastIndex !== -1) 
                                            ? cardId.substring(0, lastIndex) + "/" + cardId.substring(lastIndex + 1) 
                                            : cardId;
                                        const finalUrl = `https://assets.tcgdex.net/en/tcgp/${formattedPath}/low.png`;

                                        setRepresentativeCardId(card.id); // 아이디 저장 (UI 표시용)
                                        setRepresentativeImgUrl(finalUrl);  // 실제 저장용 URL 저장
                                    }}
                                >
                                    {representativeCardId === card.id ? '★' : '☆'}
                                </button>
                            </li>
                        ))}
                        {Array.from({ length: 20 - selectedCards.length }).map((_, idx) => (
                            <li key={`empty-${idx}`} className="empty"></li>
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
                    
                    {/* 기존의 selectOpts 영역은 그대로 유지됩니다 */}
                    <div className="selectOpts">
                        <select value={selectedSet} onChange={(e) => setSelectedSet(e.target.value)}>
                            <option value="all">모든 확장팩</option>
                            {cardSeries.map(series => (
                                <option key={series.id} value={series.id}>{series.name}</option>
                            ))}
                        </select>

                        <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                            <option value="all">모든 카테고리</option>
                            <option value="Pokemon">포켓몬</option>
                            <option value="Trainer">트레이너</option>
                            <option value="Energy">에너지</option>
                        </select>
                        
                        {/* ... 나머지 레어도 등의 select들도 동일하게 유지 ... */}
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
        </div>
    );
}

export default DeckMaker;