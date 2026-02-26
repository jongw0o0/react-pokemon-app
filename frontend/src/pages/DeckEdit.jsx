import TCGdex from "@tcgdex/sdk";
import axios from "axios";
import '../css/DeckMaker.css';
import { useState, useMemo, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const RARITIES = ["One Diamond", "Two Diamond", "Three Diamond", "Four Diamond", "One Star", "Two Star", "Three Star", "Crown", "None"];
const CATEGORIES = ["Pokemon", "Trainer"];
const TYPES = ["Grass", "Fire", "Water", "Lightning", "Psychic", "Fighting", "Darkness", "Metal", "Colorless", "Dragon"];
const STAGES = ["Basic", "Stage1", "Stage2"];
const TRAINER_SUBTYPES = [
    { label: "아이템", value: "Item" },
    { label: "서포트", value: "Supporter" },
    { label: "스타디움", value: "Stadium" },
    { label: "포켓몬의 도구", value: "Tool" },
    { label: "화석", value: "Item (Fossil)" }
];

const DeckEdit = ({ cardSeries }) => {
    const navigate = useNavigate();
    const { deckId } = useParams();

    const [detailedCards, setDetailedCards] = useState([]);
    const [isDetailLoading, setIsDetailLoading] = useState(false);
    const [selectedCards, setSelectedCards] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [deckName, setDeckName] = useState("");
    const [energies, setEnergies] = useState([]);
    const [deckComment, setDeckComment] = useState("");
    const [representativeCardId, setRepresentativeCardId] = useState(null);
    const [representativeImgUrl, setRepresentativeImgUrl] = useState(null);
    const [isPublic, setIsPublic] = useState(true);

    // 검색 필터 상태
    const [searchCard, setSearchCard] = useState("");
    const [selectedSet, setSelectedSet] = useState("all");
    const [selectedRarity, setSelectedRarity] = useState("all");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [selectedType, setSelectedType] = useState("all");
    const [selectedStage, setSelectedStage] = useState("all");
    const [selectedSubtype, setSelectedSubtype] = useState("all");

    const [allowedRarityIds, setAllowedRarityIds] = useState(null);
    const [allowedCategoryIds, setAllowedCategoryIds] = useState(null);
    const [allowedTypeIds, setAllowedTypeIds] = useState(null);
    const [allowedStageIds, setAllowedStageIds] = useState(null);
    const [allowedSubtypeIds, setAllowedSubtypeIds] = useState(null);
    const [displayCount, setDisplayCount] = useState(40);

    const usedTypes = useMemo(() => {
        const types = selectedCards
            .filter(card => card.types && card.types.length > 0)
            .flatMap(card => card.types);
        return [...new Set(types)];
    }, [selectedCards]);

    // 전체 카드 목록 로드
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
            } catch (e) { console.error(e); } finally { setIsDetailLoading(false); }
        };
        fetchPocketSummary();
    }, []);

    // 기존 덱 데이터 로드 및 상세 정보 매핑 (상세 데이터가 로드된 후 실행)
    useEffect(() => {
        const fetchOriginalDeck = async () => {
            if (!detailedCards.length) return;
            try {
                const response = await axios.get(`http://localhost:8000/api/decks/${deckId}`);
                const data = response.data;
                setDeckName(data.deckName);
                setDeckComment(data.deckComment);
                setIsPublic(data.isPublic === "Y"); 

                if (data.energies) {
                    setEnergies(data.energies); 
                }

                // 저장된 ID를 상세 데이터와 매핑하여 types 정보가 포함된 객체로 변환
                const mappedCards = await Promise.all(data.apiCardIds.map(async (id) => {
                    const found = detailedCards.find(c => c.id === id);
                    // 여기서 상세 정보를 가져오되, setEnergies를 호출하면 안 됨
                    if (found && (!found.types || !found.rarity)) {
                        const res = await fetch(`https://api.tcgdex.net/v2/en/cards/${id}`);
                        return await res.json();
                    }
                    return found;
                }));

                setSelectedCards(mappedCards.filter(Boolean));
                setRepresentativeCardId(data.representativeCardId);
                setRepresentativeImgUrl(data.representativeImageUrl);
            } catch (error) { console.error("데이터 로드 실패:", error); }
        };
        fetchOriginalDeck();
    }, [deckId, detailedCards]);

    // 필터 데이터 fetch 로직 (기존과 동일)
    useEffect(() => {
        let ignore = false;
        const updateFilters = async () => {
            const fetchPromises = [];
            if (selectedRarity !== "all") {
                fetchPromises.push(fetch(`https://api.tcgdex.net/v2/en/rarities/${encodeURIComponent(selectedRarity)}`).then(res => res.json()).then(data => { if (!ignore) setAllowedRarityIds(data.cards.map(c => c.id)); }));
            } else setAllowedRarityIds(null);
            if (selectedCategory !== "all") {
                fetchPromises.push(fetch(`https://api.tcgdex.net/v2/en/categories/${encodeURIComponent(selectedCategory)}`).then(res => res.json()).then(data => { if (!ignore) setAllowedCategoryIds(data.cards.map(c => c.id)); }));
            } else setAllowedCategoryIds(null);
            if (selectedType !== "all") {
                fetchPromises.push(fetch(`https://api.tcgdex.net/v2/en/cards?types=${selectedType}`).then(res => res.json()).then(data => { if (!ignore) setAllowedTypeIds(data.map(c => c.id)); }));
            } else setAllowedTypeIds(null);
            if (selectedStage !== "all") {
                fetchPromises.push(fetch(`https://api.tcgdex.net/v2/en/stages/${selectedStage.toLowerCase()}`).then(res => res.json()).then(data => { if (!ignore) setAllowedStageIds(data.cards.map(c => c.id)); }));
            } else setAllowedStageIds(null);
            if (selectedCategory === "Trainer" && selectedSubtype !== "all") {
                const queryType = selectedSubtype === "Item (Fossil)" ? "Item" : selectedSubtype;
                fetchPromises.push(fetch(`https://api.tcgdex.net/v2/en/cards?trainerType=${encodeURIComponent(queryType)}`).then(res => res.json()).then(data => {
                    if (!ignore) {
                        let finalIds = data.map(c => c.id);
                        if (selectedSubtype === "Item (Fossil)") finalIds = data.filter(c => c.name.toLowerCase().includes("fossil") || c.name.toLowerCase().includes("amber")).map(c => c.id);
                        setAllowedSubtypeIds(finalIds);
                    }
                }));
            } else setAllowedSubtypeIds(null);
            await Promise.all(fetchPromises);
        };
        updateFilters();
        setDisplayCount(40);
        return () => { ignore = true; };
    }, [selectedRarity, selectedCategory, selectedType, selectedStage, selectedSubtype]);

    // 필터링/가시성 카드 계산
    const filteredCards = useMemo(() => {
        const isIdAllowed = (allowedIds, cardId) => {
            if (!allowedIds) return true;
            return allowedIds.some(id => id.toLowerCase() === cardId.toLowerCase());
        };
        return detailedCards.filter(card => {
            const matchesSearch = card.name.toLowerCase().includes(searchCard.toLowerCase());
            const lastHyphenIndex = card.id.lastIndexOf('-');
            const cardSetId = lastHyphenIndex !== -1 ? card.id.substring(0, lastHyphenIndex) : card.id;
            const matchesSet = selectedSet === "all" || cardSetId === selectedSet;
            return matchesSearch && matchesSet && isIdAllowed(allowedRarityIds, card.id) && isIdAllowed(allowedCategoryIds, card.id) && isIdAllowed(allowedTypeIds, card.id) && isIdAllowed(allowedStageIds, card.id) && isIdAllowed(allowedSubtypeIds, card.id);
        });
    }, [detailedCards, searchCard, selectedSet, allowedRarityIds, allowedCategoryIds, allowedStageIds, allowedTypeIds, selectedSubtype]);

    const visibleCards = useMemo(() => filteredCards.slice(0, displayCount), [filteredCards, displayCount]);

    // 카드 핸들러 (상세 정보 fetch 포함)
    const handleCardClick = async (card) => {
        if (selectedCards.length >= 20) { alert("덱은 최대 20장까지 구성할 수 있습니다."); return; }
        const sameNameCount = selectedCards.filter(c => c.name === card.name).length;
        if (sameNameCount >= 2) { alert("같은 이름의 카드는 2장까지만 넣을 수 있습니다."); return; }

        try {
            let detailedData = card;
            if (!card.types || !card.rarity) {
                const response = await fetch(`https://api.tcgdex.net/v2/en/cards/${card.id}`);
                detailedData = await response.json();
            }
            if (detailedData.types) {
                setEnergies(prev => {
                    // Set을 사용하여 기존 값과 새로운 값을 합치며 중복을 자동 제거
                    const newEnergySet = new Set([...prev, ...detailedData.types]);
                    return Array.from(newEnergySet);
                });
            }
            setSelectedCards([...selectedCards, detailedData]);
        } catch (error) {
            setSelectedCards([...selectedCards, card]);
        }
    };

    // 에너지 관리
    const toggleEnergy = (type) => {
        setEnergies(prev => 
            prev.includes(type) 
                ? prev.filter(t => t !== type)
                : [...prev, type]
        );
    };

    const handleRemoveCard = (index) => setSelectedCards(selectedCards.filter((_, i) => i !== index));

    const handleUpdate = async () => {
        if (selectedCards.length !== 20) { alert("20장을 모두 채워야 수정할 수 있습니다!"); return; }
        const deckData = {
            deckName,
            energies: energies,
            deckComment,
            apiCardIds: selectedCards.map(card => card.id),
            representativeCardId,
            representativeImageUrl: representativeImgUrl,
            isPublic: isPublic ? "Y" : "N"
        };
        try {
            await axios.put(`http://localhost:8000/api/decks/${deckId}`, deckData, { withCredentials: true });
            alert("성공적으로 수정되었습니다!");
            navigate(`/deck/${deckId}`);
        } catch (error) { alert("수정 중 오류가 발생했습니다."); }
    };

    return (
        <div id="DeckMaker">
            <div className="deck-info-section">
                <div className="info-box">
                    <h3>덱 수정하기</h3>
                    <div className="input-group">
                        <label>덱 이름</label>
                        <input type="text" value={deckName} onChange={(e) => setDeckName(e.target.value)} />
                    </div>

                    <div className="input-group">
                        <label>사용 에너지</label>
                        <div className="used-types-display interactive">
                            {usedTypes.length > 0 ? (
                                usedTypes.map(type => {
                                    const isActive = energies.includes(type);
                                    return (
                                        <button 
                                            key={type} 
                                            type="button"
                                            className={`type-btn ${isActive ? 'active' : ''}`}
                                            onClick={() => toggleEnergy(type)}
                                            title={isActive ? `${type} 사용 중` : `${type} 비활성화됨`}
                                        >
                                            <span>{type}</span>
                                        </button>
                                    );
                                })
                            ) : (
                                <span className="no-types"></span>
                            )}
                        </div>
                    </div>

                    <div className="input-group">
                        <label>덱 설명</label>
                        <textarea value={deckComment} onChange={(e) => setDeckComment(e.target.value)} />
                    </div>

                    <button className="open-modal-btn" onClick={() => setIsModalOpen(true)}>카드 수정 및 검색</button>
                    <div className="count-display">선택된 카드: <strong>{selectedCards.length}</strong> / 20</div>

                    <div className="switch-container">
                        <span className={`status-text ${isPublic ? 'public' : 'private'}`}>{isPublic ? "전체 공개" : "나만 보기"}</span>
                        <label className="toggle-switch">
                            <input type="checkbox" checked={isPublic} onChange={() => setIsPublic(!isPublic)} />
                            <span className="slider"></span>
                        </label>
                    </div>

                    <button className="save-btn" onClick={handleUpdate} disabled={selectedCards.length !== 20}>수정 완료</button>
                </div>
            </div>

            <div className="deck-builder-main">
                <div className='newDeck'>
                    <h2>{deckName || "수정 중인 덱"}</h2>
                    <ul>
                        {selectedCards.map((card, idx) => (
                            <li key={`selected-${idx}`} className="filled">
                                <img src={`${card.image}/low.webp`} alt={card.name} onClick={() => handleRemoveCard(idx)} />
                                <button className={`rep-btn ${representativeCardId === card.id ? 'active' : ''}`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        const cardId = card.id;
                                        const lastIndex = cardId.lastIndexOf("-");
                                        const formattedPath = (lastIndex !== -1) ? cardId.substring(0, lastIndex) + "/" + cardId.substring(lastIndex + 1) : cardId;
                                        setRepresentativeCardId(card.id);
                                        setRepresentativeImgUrl(`https://assets.tcgdex.net/en/tcgp/${formattedPath}/low.png`);
                                    }}
                                >
                                    {representativeCardId === card.id ? '★' : '☆'}
                                </button>
                            </li>
                        ))}
                        {Array.from({ length: 20 - selectedCards.length }).map((_, idx) => (
                            <li key={`empty-${idx}`} className="empty" onClick={() => setIsModalOpen(true)} style={{ cursor: 'pointer' }}>
                                <span className="plus-icon">+</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {isModalOpen && (
                    <div className="search-modal-overlay" onClick={() => setIsModalOpen(false)}>
                        <div className="search-modal-content" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <h2>카드 검색 및 교체</h2>
                                <button className="close-btn" onClick={() => setIsModalOpen(false)}>&times;</button>
                            </div>
                            <div className='searchCard'>
                                <div className="searchBar">
                                    <input type='text' placeholder='카드 이름 검색' value={searchCard} onChange={(e) => setSearchCard(e.target.value)} />
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
                                    {selectedCategory === "Pokemon" && (
                                        <>
                                            <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
                                                <option value="all">모든 타입</option>
                                                {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                                            </select>
                                        </>
                                    )}
                                </div>
                            </div>
                            <div className="cardLists">
                                <ul>
                                    {visibleCards.map((card) => (
                                        <li key={card.id} onClick={() => handleCardClick(card)}>
                                            <img src={`${card.image}/low.webp`} alt={card.name} loading="lazy" />
                                            <p>{card.name}</p>
                                        </li>
                                    ))}
                                </ul>
                                {filteredCards.length > displayCount && (
                                    <button onClick={() => setDisplayCount(prev => prev + 40)} className="loadMoreBtn">더 보기</button>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DeckEdit;