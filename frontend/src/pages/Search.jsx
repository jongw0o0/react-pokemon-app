import TCGdex from "@tcgdex/sdk";
import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";

import '../css/Search.css' // 기존 CSS 재활용


const RARITIES = ["One Diamond", "Two Diamond", "Three Diamond", "Four Diamond", "One Star", "Two Star", "Three Star", "Crown", "None"];
const CATEGORIES = ["Pokemon", "Trainer"];
const TYPES = ["Grass", "Fire", "Water", "Lightning", "Psychic", "Fighting", "Darkness", "Metal", "Colorless", "Dragon"];
const STAGES = ["Basic", "Stage1", "Stage2"];
const RETREATS = ["0", "1", "2", "3", "4"];
const TRAINER_SUBTYPES = [
    { label: "아이템", value: "Item" }, { label: "서포트", value: "Supporter" },
    { label: "스타디움", value: "Stadium" }, { label: "포켓몬의 도구", value: "Tool" },
    { label: "화석", value: "Item (Fossil)" }
];

const Search = ({ cardSeries }) => {
    
    const navigate = useNavigate();
    
    const [detailedCards, setDetailedCards] = useState([]);
    const [isDetailLoading, setIsDetailLoading] = useState(false);
    const [displayCount, setDisplayCount] = useState(40);

    const [searchCard, setSearchCard] = useState("");
    const [selectedSet, setSelectedSet] = useState("all");
    const [selectedRarity, setSelectedRarity] = useState("all");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [selectedType, setSelectedType] = useState("all");
    const [selectedStage, setSelectedStage] = useState("all");
    const [selectedRetreat, setSelectedRetreat] = useState("all");
    const [selectedSubtype, setSelectedSubtype] = useState("all");

    const [allowedRarityIds, setAllowedRarityIds] = useState(null);
    const [allowedCategoryIds, setAllowedCategoryIds] = useState(null);
    const [allowedTypeIds, setAllowedTypeIds] = useState(null);
    const [allowedStageIds, setAllowedStageIds] = useState(null);
    const [allowedRetreatIds, setAllowedRetreatIds] = useState(null);
    const [allowedSubtypeIds, setAllowedSubtypeIds] = useState(null);

    const [selectedCard, setSelectedCard] = useState(null);

    // 카드 목록 로드
    useEffect(() => {
        const fetchPocketSummary = async () => {
            const sdk = new TCGdex('en');
            setIsDetailLoading(true);
            try {
                const series = await sdk.fetch('series', 'tcgp');
                
                const allSets = await Promise.all(
                    series.sets.map(async (s) => {
                        const setDetails = await sdk.fetch('sets', s.id);
                        return setDetails.cards; 
                    })
                );
                setDetailedCards(allSets.flat());
            } catch (e) { 
                console.error("로드 실패", e); 
            } finally { 
                setIsDetailLoading(false); 
            }
        };
        fetchPocketSummary();
    }, []);

    // 필터링 조건에 따른 카드 ID 목록 업데이트(ID만 저장하여 필터링 최적화)
    useEffect(() => {
        let ignore = false;

        const updateFilters = async () => {
            const fetchPromises = [];
            if (selectedRarity !== "all") {
                fetchPromises.push(fetch(`https://api.tcgdex.net/v2/en/rarities/${encodeURIComponent(selectedRarity)}`)
                    .then(res => res.json()).then(data => { if (!ignore) setAllowedRarityIds(data.cards.map(c => c.id)); }));
            } else setAllowedRarityIds(null);
            if (selectedCategory !== "all") {
                fetchPromises.push(
                    fetch(`https://api.tcgdex.net/v2/en/categories/${encodeURIComponent(selectedCategory)}`)
                        .then(res => res.json())
                        .then(data => { if (!ignore) setAllowedCategoryIds(data.cards.map(c => c.id)); })
                );
            } else setAllowedCategoryIds(null);
            if (selectedType !== "all") {
                fetchPromises.push(
                    fetch(`https://api.tcgdex.net/v2/en/cards?types=${selectedType}`)
                        .then(res => res.json())
                        .then(data => { if (!ignore) setAllowedTypeIds(data.map(c => c.id)); })
                );
            } else setAllowedTypeIds(null);
            if (selectedStage !== "all") {
                fetchPromises.push(
                    fetch(`https://api.tcgdex.net/v2/en/stages/${selectedStage.toLowerCase()}`)
                        .then(res => res.json())
                        .then(data => { if (!ignore) setAllowedStageIds(data.cards.map(c => c.id)); })
                );
            } else setAllowedStageIds(null);
            if (selectedRetreat !== "all") {
                fetchPromises.push(
                    fetch(`https://api.tcgdex.net/v2/en/cards?retreat=${selectedRetreat}`)
                        .then(res => res.json())
                        .then(data => { if (!ignore) setAllowedRetreatIds(data.map(c => c.id)); })
                );
            } else setAllowedRetreatIds(null);
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

        updateFilters();
        setDisplayCount(40);

        return () => { 
            ignore = true; 
        };
    }, [selectedRarity, selectedCategory, selectedType, selectedStage, selectedRetreat, selectedSubtype]);

    // 3. 필터링 연산
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
            const matchesRetreat = isIdAllowed(allowedRetreatIds, card.id);
            const matchesSubtype = isIdAllowed(allowedSubtypeIds, card.id);

            return matchesSearch && matchesSet && matchesRarity && matchesCategory && matchesType && matchesStage && matchesRetreat && matchesSubtype;
        });
    }, [detailedCards, searchCard, selectedSet, allowedRarityIds, allowedCategoryIds, allowedStageIds, allowedTypeIds, allowedRetreatIds, selectedType, selectedSubtype]);

    return (
        <div id="SearchPage" style={{ padding: '20px' }}>
            <h2>카드 도감 검색</h2>
            <div className='searchCard' style={{ marginBottom: '30px' }}>
                <div className="searchBar">
                    <input type='text' placeholder='카드 이름 검색' value={searchCard} onChange={(e) => setSearchCard(e.target.value)} />
                </div>
                <div className="selectOpts">
                    <select value={selectedSet} onChange={(e) => setSelectedSet(e.target.value)}>
                        <option value="all">모든 확장팩</option>
                        {cardSeries?.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>

                    <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                        <option value="all">모든 카테고리</option>
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>

                    <select value={selectedRarity} onChange={(e) => setSelectedRarity(e.target.value)}>
                        <option value="all">모든 희귀도</option>
                        {RARITIES.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
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
                            <select value={selectedRetreat} onChange={(e) => setSelectedRetreat(e.target.value)}>
                                <option value="all">후퇴 비용</option>
                                {RETREATS.map(rt => <option key={rt} value={rt}>{rt}</option>)}
                            </select>
                        </>
                    )}
                </div>
                <div className="cardLists">
                    {isDetailLoading ? <p className="loadingText">데이터를 불러오는 중...</p> : (
                        <ul>
                            {filteredCards.slice(0, displayCount).map((card) => (
                                <li key={card.id} onClick={() => setSelectedCard(card)}>
                                    <img src={`${card.image}/low.webp`} alt={card.name} loading="lazy" />
                                    <p>{card.name}</p>
                                </li>
                            ))}
                        </ul>
                    )}
                    {filteredCards.length > displayCount && (
                        <button onClick={() => setDisplayCount(prev => prev + 40)} className="loadMoreBtn">
                            카드 더 보기 ({displayCount} / {filteredCards.length})
                        </button>
                    )}
                </div>
            </div>
            {selectedCard && (
                <div className="modal-overlay" onClick={() => setSelectedCard(null)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close" onClick={() => setSelectedCard(null)}>X</button>
                        <div className="modal-body">
                            <div className="modal-img">
                                <img src={`${selectedCard.image}/high.png`} alt={selectedCard.name} />
                            </div>
                            <div className="modal-info">
                                <h3>{selectedCard.name}</h3>
                                <p><strong>ID:</strong> {selectedCard.id}</p>
                                {selectedCard.illustrator && <p><strong>Illustrator:</strong> {selectedCard.illustrator}</p>}
                                <div className="modal-actions">
                                    <button onClick={() => navigate(`/card/${selectedCard.id}`)}>상세 정보 페이지로 이동</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Search;