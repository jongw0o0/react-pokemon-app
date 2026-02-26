import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/DeckRecipeBoard.css';
import { handleImageError } from '../utils/imageHelper';

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
    "Dragon",
    // "Multi"
];

const DeckRecipeBoard = () => {
    const navigate = useNavigate();

    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortType, setSortType] = useState("latest");
    const [energyFilter, setEnergyFilter] = useState("all");
    
    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                // 전체 덱 조회 API 호출
                const response = await axios.get('http://localhost:8000/api/decks');
                setRecipes(response.data);
            } catch (error) {
                console.error("레시피를 불러오지 못했습니다.", error);
            } finally { 
                setLoading(false);
            }
        };
        fetchRecipes();
    }, []);

    const filteredAndSortedRecipes = useMemo(() => {
        let result = [...recipes];

        if (energyFilter !== "all") {
            if (energyFilter === "multi") {
                result = result.filter(r => r.energies && r.energies.length >= 2);
            } else {
                result = result.filter(r => r.energies && r.energies.includes(energyFilter));
            }
        }

        result.sort((a, b) => {
            try {
                if (sortType === "latest") {
                    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                    return dateB - dateA;
                }
                if (sortType === "oldest") {
                    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                    return dateA - dateB;
                }
                if (sortType === "views") {
                    return (Number(b.views) || 0) - (Number(a.views) || 0);
                }
                if (sortType === "scraps") {
                    return (Number(b.scrapCount) || 0) - (Number(a.scrapCount) || 0);
                }
                if (sortType === "likes") {
                    return (Number(b.likeCount) || 0) - (Number(a.likeCount || 0));
                }
            } catch (e) {
                console.error("정렬 중 오류 발생:", e);
            }
            return 0;
        });

        console.log(recipes)
        return result;
    }, [recipes, sortType, energyFilter]);

    if (loading) return <div className="loading-screen">포켓몬 도감을 동기화 중...</div>;

    return (
        <div className="recipe-board-container">
                <header className="board-header">
                    <h1>Deck Recipe Board</h1>
                    <p>최고의 트레이너들이 공유하는 덱 구성 비법을 확인하세요.</p>
                    <div className="board-stats">
                        현재 등록된 덱: <strong>{recipes.length}</strong>개
                    </div>
                    <div className="filter-section">
                        <div className="sort-group">
                            {[
                                { id: "latest", label: "최신순" },
                                { id: "oldest", label: "오래된순" },
                                { id: "views", label: "조회수순" },
                                { id: "scraps", label: "스크랩순" },
                                { id: "likes", label: "추천순" }
                            ].map(sort => (
                                <button 
                                    key={sort.id}
                                    className={`sort-chip ${sortType === sort.id ? 'active' : ''}`}
                                    onClick={() => setSortType(sort.id)}
                                >
                                    {sort.label}
                                </button>
                            ))}
                        </div>

                        <div className="energy-filter-scroll">
                            <button 
                                className={`energy-chip all ${energyFilter === 'all' ? 'active' : ''}`}
                                onClick={() => setEnergyFilter('all')}
                            >
                                전체
                            </button>
                            {TYPES.filter(t => t !== "Colorless" && t !== "Dragon").map(type => (
                                <button 
                                    key={type}
                                    className={`energy-chip ${type.toLowerCase()} ${energyFilter === type ? 'active' : ''}`}
                                    onClick={() => setEnergyFilter(prev => prev === type ? 'all' : type)}
                                >
                                    <span className="dot"></span> {type}
                                </button>
                            ))}
                            <button 
                                className={`energy-chip multi ${energyFilter === 'multi' ? 'active' : ''}`}
                                onClick={() => setEnergyFilter(prev => prev === 'multi' ? 'all' : 'multi')}
                            >
                                <span className="dot"></span> 복합
                            </button>
                        </div>
                    </div>
                </header>

                <div className="recipe-grid">
                    {filteredAndSortedRecipes.length > 0 ? (
                        filteredAndSortedRecipes.map((recipe) => {
                            const energyList = recipe.energies || [];
                            let mainType = "default";
                            if (energyList.length >= 2) {
                                mainType = "multi";
                            } else if (energyList.length === 1) {
                                mainType = energyList[0].toLowerCase();
                            }

                            return (
                                <div key={recipe.deckId} className="recipe-card">
                                    <div className={`card-image-container bg-${mainType}`}>
                                        {recipe.representativeImageUrl ? (
                                            <img
                                                src={recipe.representativeImageUrl}
                                                onError={handleImageError}
                                                alt="대표 카드"
                                                className="deck-thumb"
                                            />
                                        ) : (
                                            <div className="no-image">No Card</div>
                                        )}

                                        <div className="card-energies-mini">
                                            {energyList.map((type) => (
                                                <span key={type} className={`mini-badge ${type.toLowerCase()}`} title={type}></span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* <div className="card-tag">NEW</div> */}
                                    <div className="recipe-content">
                                        <h3 className="deck-title">{recipe.deckName}</h3>
                                        <p className="deck-author">@ {recipe.userName}</p>
                                        <div className="deck-stats-row">
                                            <span className="stat-item" title="추천 수">
                                                <span className="stat-icon">👍</span> {recipe.likeCount || 0}
                                            </span>
                                            <span className="stat-item" title="스크랩 수">
                                                <span className="stat-icon">🔖</span> {recipe.scrapCount || 0}
                                            </span>
                                            <span className="stat-item" title="조회수">
                                                <span className="stat-icon">👁️</span> {recipe.views || 0}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="recipe-footer">
                                        <button
                                            className="detail-btn"
                                            onClick={() => navigate(`/deck/${recipe.deckId}`)}
                                        >
                                            자세히 보기
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="no-results">
                            <div className="no-results-icon">🔍</div>
                            <h3>검색 결과가 없습니다.</h3>
                            <p>선택하신 조건에 맞는 덱 레시피가 아직 등록되지 않았습니다.</p>
                            <button
                                className="reset-filter-btn"
                                onClick={() => {
                                    setEnergyFilter('all');
                                    setSortType('latest');
                                }}
                            >
                                필터 초기화
                            </button>
                        </div>
                    )}
                </div>
        </div>
    );
};

export default DeckRecipeBoard;