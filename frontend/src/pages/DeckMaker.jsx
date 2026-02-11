import TCGdex from "@tcgdex/sdk";
import axios from "axios";

import '../css/DeckMaker.css'
import { useState } from "react";
import { useMemo } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom"; 

const RARITIES = [
    "One Diamond", 
    "Two Diamond", 
    "Three Diamond", 
    "Four Diamond", 
    "One Star", 
    "Two Star", 
    "Three Star", 
    "Crown", 
    "None"
];
const CATEGORIES = ["Pokemon", "Trainer"];
const TYPES = [
    "Grass", 
    "Fire", 
    "Water", 
    "Lightning", 
    "Psychic", 
    "Fighting", 
    "Darkness", 
    "Metal", 
    "Colorless", 
    "Dragon"
];
const STAGES = ["Basic", "Stage1", "Stage2"];
const RETREATS = ["0", "1", "2", "3", "4"];
const TRAINER_SUBTYPES = [
    { label: "아이템", value: "Item" },
    { label: "서포트", value: "Supporter" },
    { label: "스타디움", value: "Stadium" },
    { label: "포켓몬의 도구", value: "Tool" },
    { label: "화석", value: "Item (Fossil)" }
];

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

    // 검색 조건들(필터)
    const [searchCard, setSearchCard] = useState("");                   // 이름
    const [selectedSet, setSelectedSet] = useState("all");              // 확장팩
    const [selectedRarity, setSelectedRarity] = useState("all");        // 레어도
    const [selectedCategory, setSelectedCategory] = useState("all");    // 카드 종류(포켓몬/트레이너스)
    const [selectedType, setSelectedType] = useState("all");            // 타입
    const [selectedStage, setSelectedStage] = useState("all");          // 진화 단계
    // const [hpRange, setHpRange] = useState("all");                      // HP 범위
    // const [selectedRetreat, setSelectedRetreat] = useState("all");      // 후퇴 코스트
    const [selectedSubtype, setSelectedSubtype] = useState("all");      // 트레이너스 세부 종류

    // 필터링에 사용할 허용된 카드 ID 명단(얘들은 useEffect에서 API로 불러옴)
    const [allowedRarityIds, setAllowedRarityIds] = useState(null);
    const [allowedCategoryIds, setAllowedCategoryIds] = useState(null);
    const [allowedTypeIds, setAllowedTypeIds] = useState(null);
    const [allowedStageIds, setAllowedStageIds] = useState(null);
    // const [allowedRetreatIds, setAllowedRetreatIds] = useState(null);
    const [displayCount, setDisplayCount] = useState(40);
    const [allowedSubtypeIds, setAllowedSubtypeIds] = useState(null);

    // 전체 카드 목록 로드 (UI 렌더링용 최소 데이터)
    useEffect(() => {
        const fetchPocketSummary = async () => {
            const sdk = new TCGdex('en');
            setIsDetailLoading(true);
            try {
                const series = await sdk.fetch('series', 'tcgp');
                
                // 각 세트에 포함된 카드들의 기본 정보
                const allSets = await Promise.all(
                    series.sets.map(async (s) => {
                        const setDetails = await sdk.fetch('sets', s.id);
                        return setDetails.cards; 
                    })
                );
                const allSummary = allSets.flat();
                
                console.log("로드된 카드 샘플:", allSummary[allSummary.length - 1], "총 카드 수:", allSummary.length); 
                
                setDetailedCards(allSummary);
            } catch (e) { 
                console.error("카드 목록 로드 실패:", e); 
            } finally { 
                setIsDetailLoading(false); 
            }
        };
        fetchPocketSummary();
    }, []);

    // 선택한 조건에 맞는 카드 ID 명단 불러오기
    useEffect(() => {
        
        // 새로운 요청이 들어오면 이전 요청을 무시하기 위한 플래그
        let ignore = false; 

        const updateFilters = async () => {
            
            const fetchPromises = [];

            // 1. 레어도 필터
            if (selectedRarity !== "all") {
                fetchPromises.push(
                    fetch(`https://api.tcgdex.net/v2/en/rarities/${encodeURIComponent(selectedRarity)}`)
                        .then(res => res.json())
                        .then(data => { 
                            if (!ignore) { 
                                const ids = data.cards.map(c => c.id); 
                                setAllowedRarityIds(ids); 
                                console.log(`${selectedRarity} 레어도 ID 명단:`, ids); 
                            } 
                        })
                );
            } else setAllowedRarityIds(null);

            // 2. 카테고리 필터
            if (selectedCategory !== "all") {
                fetchPromises.push(
                    fetch(`https://api.tcgdex.net/v2/en/categories/${encodeURIComponent(selectedCategory)}`)
                        .then(res => res.json())
                        .then(data => { if (!ignore) setAllowedCategoryIds(data.cards.map(c => c.id)); })
                );
            } else setAllowedCategoryIds(null);

            // 3. 타입 필터
            if (selectedType !== "all") {
                fetchPromises.push(
                    fetch(`https://api.tcgdex.net/v2/en/cards?types=${selectedType}`)
                        .then(res => res.json())
                        .then(data => { if (!ignore) setAllowedTypeIds(data.map(c => c.id)); })
                );
            } else setAllowedTypeIds(null);

            // 4. 스테이지 필터
            if (selectedStage !== "all") {
                fetchPromises.push(
                    fetch(`https://api.tcgdex.net/v2/en/stages/${selectedStage.toLowerCase()}`)
                        .then(res => res.json())
                        .then(data => { if (!ignore) setAllowedStageIds(data.cards.map(c => c.id)); })
                );
            } else setAllowedStageIds(null);
        
            // 5. 트레이너스 필터
            if (selectedCategory === "Trainer" && selectedSubtype !== "all") {
                // 화석인 경우와 일반 아이템/서포트를 나누어 처리
                const queryType = selectedSubtype === "Item (Fossil)" ? "Item" : selectedSubtype;
                
                fetchPromises.push(
                    fetch(`https://api.tcgdex.net/v2/en/cards?trainerType=${encodeURIComponent(queryType)}`)
                        .then(res => res.json())
                        .then(data => {
                            if (!ignore) {
                                let finalIds = data.map(c => c.id);
                                if (selectedSubtype === "Item (Fossil)") {
                                    finalIds = data
                                        .filter(c => c.name.toLowerCase().includes("fossil") || c.name.toLowerCase().includes("amber"))
                                        .map(c => c.id);
                                }
                                setAllowedSubtypeIds(finalIds);
                            }
                        })
                );
            } else setAllowedSubtypeIds(null);

            await Promise.all(fetchPromises);
        };

        // 필터 업데이트 호출 및 표시 개수 초기화
        updateFilters();
        setDisplayCount(40);

        // 컴포넌트가 리렌더링되거나 필터가 바뀔 때 이전 요청 무시
        return () => {
            ignore = true;
        };

    }, [selectedRarity, selectedCategory, selectedType, selectedStage, selectedSubtype]);

    // 카드 필터링
    const filteredCards = useMemo(() => {
        
        // ID 명단에 카드가 포함되는지 확인하는 헬퍼 함수
        const isIdAllowed = (allowedIds, cardId) => {
            if (!allowedIds) return true; // 명단이 없으면(필터 미선택/로딩 중) 모든 카드 통과
            const lowerCardId = cardId.toLowerCase();
            return allowedIds.some(id => id.toLowerCase() === lowerCardId);
        };

        return detailedCards.filter(card => {
            // 이름 검색
            const matchesSearch = card.name.toLowerCase().includes(searchCard.toLowerCase());

            // 확장팩 필터
            const lastHyphenIndex = card.id.lastIndexOf('-');
            const cardSetId = lastHyphenIndex !== -1 ? card.id.substring(0, lastHyphenIndex) : card.id;
            const matchesSet = selectedSet === "all" || cardSetId === selectedSet;

            // 기타 필터들
            const matchesRarity = isIdAllowed(allowedRarityIds, card.id);
            const matchesCategory = isIdAllowed(allowedCategoryIds, card.id);
            const matchesType = isIdAllowed(allowedTypeIds, card.id);
            const matchesStage = isIdAllowed(allowedStageIds, card.id);
            const matchesSubtype = isIdAllowed(allowedSubtypeIds, card.id);

            return matchesSearch && matchesSet && matchesRarity && matchesCategory && matchesType && matchesStage && matchesSubtype;
        });
    }, [detailedCards, searchCard, selectedSet, allowedRarityIds, allowedCategoryIds, allowedStageIds, allowedTypeIds, selectedType, selectedSubtype]);

    // 현재 화면에 보이는 카드들 (무한 스크롤)
    const visibleCards = useMemo(() => {
        return filteredCards.slice(0, displayCount);
    }, [filteredCards, displayCount]);

    // 카테고리가 바뀌면 타입/스테이지/트레이너스 세부종류 초기화
    useEffect(() => {
        setSelectedType("all");
        setSelectedStage("all");
        setSelectedSubtype("all");
    }, [selectedCategory]);

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
        console.log("클릭한 카드의 진짜 속성들:", card);
        setSelectedCards([...selectedCards, card]);
    }

    // 선택된 카드를 다시 클릭해서 취소
    const handleRemoveCard = (index) => {
        setSelectedCards(selectedCards.filter((_, i) => i !== index));
    };

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

    return (
        <div id="DeckMaker">
            <div className="deck-info-section">
                <div className="info-box">
                    <h3>덱 설정</h3>
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
                        덱 저장하기
                    </button>
                </div>
            </div>

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
                                        
                                        // 이미지 주소 조립
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
                    <div className="selectOpts">
                        <select value={selectedSet} onChange={(e) => setSelectedSet(e.target.value)}>
                            <option value="all">모든 확장팩</option>
                            {cardSeries?.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                        <select value={selectedRarity} onChange={(e) => setSelectedRarity(e.target.value)}>
                            <option value="all">모든 레어도</option>
                            {RARITIES.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                        <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                            <option value="all">모든 카테고리</option>
                            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        {selectedCategory === "Trainer" && (
                            <select value={selectedSubtype} onChange={(e) => setSelectedSubtype(e.target.value)}>
                                <option value="all">모든 트레이너스 종류</option>
                                {TRAINER_SUBTYPES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                            </select>
                        )}
                        {selectedCategory === "Pokemon" && (
                            <>
                                <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
                                    <option value="all">모든 타입</option>
                                    {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                                <select value={selectedStage} onChange={(e) => setSelectedStage(e.target.value)}>
                                    <option value="all">모든 진화 단계</option>
                                    {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </>
                        )}
                    </div>
                </div>
                <div className="cardLists">
                    <ul>
                        {visibleCards.map((card) => (
                            <li key={card.id} onClick={() => handleCardClick(card)}>
                                {/* /low.webp를 붙여 저용량으로 호출, lazy 로딩으로 브라우저 부하 방지 */}
                                <img src={`${card.image}/low.webp`} alt={card.name} loading="lazy" />
                                <p>{card.name}</p>
                            </li>
                        ))}
                    </ul>
                    {filteredCards.length > displayCount && (
                        <button onClick={() => setDisplayCount(prev => prev + 40)} className="loadMoreBtn">
                            카드 더 보기 ({displayCount} / {filteredCards.length})
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default DeckMaker;