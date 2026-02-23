import TCGdex from "@tcgdex/sdk";
import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";

import '../css/Search.css'


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

const ILLUSTRATORS = ["5ban Graphics","0313","AKIRA EGAWA","Akira Komayama","Anesaki Dynamic","Apios","Asako Ito","Atsuko Nishida","Atsushi Furusawa","Aya Kusube","Ayaka Yoshida","Ayako Ozaki","Cona Nitanda","DOM","Dsuke","En Morikura","Eri Yamaki","Eske Yoshinob","Fujimoto Gold","GIDORA","GOSSAN","GOTO minori","Gapao","Gemi","HAGIYA Kaoru","HYOGONOSUKE","Hajime Kusajima","Haru Akasaka","Hasuno","Hideki Ishikawa","Hiroki Asanuma","Hiroyuki Yamamoto","Hisao Nakamura","Hitoshi Ariga","IKEDA Saki","Jerky","Jiro Sasumo","June","KEIICHIRO ITO","KIYOTAKA OSHIYAMA","Kagemaru Himeno","Kanako Eo","Kanami Ogata","Kariya","Kazuma Koda","Kazumasa Yasukuni","Kedamahadaitai Yawarakai","Keisin","Ken Sugimori","Kent Kanetsuna","Koji Nakata","Kouki Saitou","Krgc","Kurata So","Kuroimori","Kyoko Koizumi","Kyoko Umemoto","LINNE","Ligton","M. Akiyama","MAHOU","MARINA Chikazawa","MINAMINAMI Take","Makura Tami","Masa","Masakazu Fukuda","Masako Tomii","Masako Yamashita","Megumi Mizutani","Midori Harada","Miki Tanaka","Mina Nakai","Minahamu","Misa Tsutsui","Mitsuhiro Arita","Mizue","Mori Yuu","Mousho","Mugi Hamada","Mékayu","N-DESIGN Inc.","NC Empire","Nagimiso","Nagomi Nijo","Naoki Saito","Naoyo Kimura","Narumi Sato","Natsumi Yoshida","Nelnal","Nisota Niso","Noriaki Tanimura","Nurikabe","OKACHEKE","OKUBO","OOYAMA","Orca","Oswaldo KATO","Ounishi","PLANETA CG Works","PLANETA Igarashi","PLANETA Mochizuki","PLANETA Saito","PLANETA Tsuji","PLANETA Yamashita","Pani Kobayashi","REND","Raita Kazama","Rianti Hidayat","Rond","Ryo Ueda","Ryota Murayama","Ryuta Fuse","SATOSHI NAKAI","SIE NANAHARA","Saboteri","Sachiko Adachi","Sanosuke Sakuma","Satoshi Shirai","Saya Tsuruta","Scav","Sekio","Shiburingaru","Shibuzoh.","Shigenori Negishi","Shimaris Yukichi","Shin Nagasawa","Shinji Kanda","Shinya Komatsu","Souichirou Gunjima","Studio Bora Inc.","Sumiyoshi Kizuki","Susumu Maeya","Suwama Chiaki","Taiga Kasai","Taiga Kayama","Taira Akitsu","Takeshi Nakamura","Takumi Wada","Teeziro","Terada Tera","Tetsu Kayama","Tika Matsuno","Tomokazu Komiya","Tomomi Ozaki","Tomowaka","Toshinao Aoki","Toyste Beach","Tsuyoshi Nagano","USGMEN","Uninori","Uta","Whisker","YASHIRO Nanaco","Yoko Hishida","Yoriyuki Ikegami","Yoshimi Miyoshi","Yoshinobu Saito","Yoshioka","You Iribi","Yuka Morii","Yuka Tanaka","Yukihiro Tada","Yukiko Baba","Yumi","Yuriko Akase","Yuu Nishida","Yuya Oka","akagi","aoki","aspara","buchi","burari","chibi","cochi8i","danciao","hatachu","hechima","hncl","imoniii","inose yukie","kamonabe","kantaro","kawayoo","kirisAki","kodama","kurumitsu","mashu","matazo","match","mele","miki kudo","mingo","nagimiso","nisimono","okayamatakatoshi","osare","otumami","rika","ryoma uratsuka","saino misaki","sowsow","sui","takashi shiraishi","takuyoa","tetsuya koizumi","tono","toriyufu","whomor Inc.","yuu"];

const Search = ({ cardSeries }) => {
    
    const navigate = useNavigate();
    const [isFilterLoading, setIsFilterLoading] = useState(false);

    const [detailedCards, setDetailedCards] = useState([]);
    const [isDetailLoading, setIsDetailLoading] = useState(false);
    const [displayCount, setDisplayCount] = useState(24);

    const [searchCard, setSearchCard] = useState("");
    const [selectedSet, setSelectedSet] = useState("all");
    const [selectedRarity, setSelectedRarity] = useState("all");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [selectedType, setSelectedType] = useState("all");
    const [selectedStage, setSelectedStage] = useState("all");
    const [selectedRetreat, setSelectedRetreat] = useState("all");
    const [selectedSubtype, setSelectedSubtype] = useState("all");
    const [selectedIllust, setSelectedIllust] = useState("");

    const [allowedRarityIds, setAllowedRarityIds] = useState(null);
    const [allowedCategoryIds, setAllowedCategoryIds] = useState(null);
    const [allowedTypeIds, setAllowedTypeIds] = useState(null);
    const [allowedStageIds, setAllowedStageIds] = useState(null);
    const [allowedRetreatIds, setAllowedRetreatIds] = useState(null);
    const [allowedSubtypeIds, setAllowedSubtypeIds] = useState(null);
    const [allowedIllustIds, setAllowedIllustIds] = useState(null);

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
            setIsFilterLoading(true);

            // 필터가 바뀔 때마다 기존 허용 ID 목록들을 초기화해서 한 박자 늦는 현상 방지
            setAllowedRarityIds(null);
            setAllowedCategoryIds(null);
            setAllowedTypeIds(null);
            setAllowedStageIds(null);
            setAllowedRetreatIds(null);
            setAllowedSubtypeIds(null);
            setAllowedIllustIds(null);

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
            if (selectedIllust !== "") {
                fetchPromises.push(
                    fetch(`https://api.tcgdex.net/v2/en/illustrators/${encodeURIComponent(selectedIllust)}`)
                        .then(res => res.json())
                        .then(data => { 
                            if (!ignore && data.cards) {
                                setAllowedIllustIds(data.cards.map(c => c.id)); 
                            }
                        })
                        .catch(err => {
                            console.error("일러스트레이터 검색 실패:", err);
                            if (!ignore) setAllowedIllustIds([]);
                        })
                );
            } else {
                setAllowedIllustIds(null);
            }

            await Promise.all(fetchPromises);
            if (!ignore) setIsFilterLoading(false);
        };

        updateFilters();    
        setDisplayCount(24);

        return () => { 
            ignore = true; 
        };
    }, [selectedRarity, selectedCategory, selectedType, selectedStage, selectedRetreat, selectedSubtype, selectedIllust]);

    // 3. 필터링 연산
    const filteredCards = useMemo(() => {

        if (isFilterLoading) return [];
        
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
            const matchesIllust = isIdAllowed(allowedIllustIds, card.id);

            return matchesSearch && matchesSet && matchesRarity && matchesCategory && matchesType && matchesStage && matchesRetreat && matchesSubtype && matchesIllust;
        });
    }, [detailedCards, searchCard, selectedSet, allowedRarityIds, allowedCategoryIds, allowedStageIds, allowedTypeIds, allowedRetreatIds,allowedSubtypeIds,allowedIllustIds, selectedType, selectedSubtype, selectedIllust, isFilterLoading]);

    return (
        <div id="SearchPage">
            <header className="search-header">
                <h1>Card Database</h1>
                <p>포켓몬 카드 게임 데이터 포켓의 모든 카드를 검색하세요.</p>
            </header>

            <section className="filter-section">
                <div className="search-input-wrap">
                    <input 
                        type='text' 
                        placeholder='찾으시는 카드의 이름을 입력하세요...' 
                        value={searchCard} 
                        onChange={(e) => {setSearchCard(e.target.value); setDisplayCount(24);}} 
                    />
                    <i className="search-icon">🔍</i>
                </div>

                <div className="filter-group">
                    <div className="select-box">
                        <label>Expansion</label>
                        <select value={selectedSet} onChange={(e) => {setSelectedSet(e.target.value); setDisplayCount(24);}}>
                            <option value="all">모든 확장팩</option>
                            {cardSeries?.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                    </div>

                    <div className="select-box">
                        <label>Category</label>
                        <select value={selectedCategory} onChange={(e) => {setSelectedCategory(e.target.value); setDisplayCount(24);}}>
                            <option value="all">모든 카테고리</option>
                            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>

                    <div className="select-box">
                        <label>Rarity</label>
                        <select value={selectedRarity} onChange={(e) => {setSelectedRarity(e.target.value); setDisplayCount(24);}}>
                            <option value="all">모든 희귀도</option>
                            {RARITIES.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                    </div>

                    <div className="select-box">
                        <label>Illustrator</label>
                        <select 
                            value={selectedIllust} 
                            onChange={(e) => {
                                setSelectedIllust(e.target.value); 
                                setDisplayCount(24);
                            }}
                            disabled={isFilterLoading}
                        >
                            <option value="">모든 일러스트레이터</option>
                            {ILLUSTRATORS.map(name => (
                                <option key={name} value={name}>
                                    {name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </section>

            <section className="results-section">
                {isDetailLoading ? (
                    <div className="search-loading">
                        <div className="spinner"></div>
                        <p>카드 도감을 불러오는 중입니다...</p>
                    </div>
                ) : (
                    <>
                        <div className="results-info">
                            {isFilterLoading ? (
                                <span>카드를 검색하고 있습니다...</span>
                            ) : (
                                <>총 <strong>{filteredCards.length}</strong>장의 카드가 검색되었습니다.</>
                            )}
                        </div>
                        <div className="card-grid">
                            {filteredCards.slice(0, displayCount).map((card) => (
                                <div key={card.id} className="search-card-item" onClick={() => setSelectedCard(card)}>
                                    <div className="img-wrap">
                                        <img src={`${card.image}/low.webp`} alt={card.name} loading="lazy" />
                                    </div>
                                    <div className="info-wrap">
                                        <p className="card-id">{card.id.split('-').pop()}</p>
                                        <p className="card-name">{card.name}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        {filteredCards.length > displayCount && (
                            <button onClick={() => setDisplayCount(prev => prev + 24)} className="load-more-btn">
                                더 보기 ({displayCount} / {filteredCards.length})
                            </button>
                        )}
                    </>
                )}
            </section>
            {selectedCard && (
                <div className="search-modal-overlay" onClick={() => setSelectedCard(null)}>
                    <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                        <button className="close-btn" onClick={() => setSelectedCard(null)}>×</button>
                        <div className="modal-content">
                            <div className="modal-left">
                                <img src={`${selectedCard.image}/high.webp`} alt={selectedCard.name} />
                            </div>
                            <div className="modal-right">
                                <span className="modal-rarity">{selectedCard.rarity}</span>
                                <h2>{selectedCard.name}</h2>
                                <p className="modal-illust">Illustrator: <strong>{selectedCard.illustrator || "Unknown"}</strong></p>
                                <button className="go-detail-btn" onClick={() => navigate(`/card/${selectedCard.id}`)}>
                                    상세 정보 및 효과 보기
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Search;