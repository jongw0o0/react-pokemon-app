import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/DeckRecipeBoard.css';

const DeckRecipeBoard = () => {
    const navigate = useNavigate();

    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortType, setSortType] = useState("latest");

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

    const sortedRecipes = [...recipes].sort((a, b) => {
        if (sortType === "latest") {
            return new Date(b.createdAt) - new Date(a.createdAt);
        } else if (sortType === "views") {
            return (b.views || 0) - (a.views || 0);
        } else if (sortType === "scraps") {
            return (b.scrapCount || 0) - (a.scrapCount || 0);
        }
        return 0;
    });

    if (loading) return <div className="loading-screen">포켓몬 도감을 동기화 중...</div>;

    return (
        <div className="recipe-board-container">
                <header className="board-header">
                    <h1>Deck Recipe Board</h1>
                    <p>최고의 트레이너들이 공유하는 덱 구성 비법을 확인하세요.</p>
                    <div className="board-stats">
                        현재 등록된 덱: <strong>{recipes.length}</strong>개
                    </div>
                    <div className="filter-group">
                        <button className={sortType === "latest" ? "active" : ""} onClick={() => setSortType("latest")}>최신순</button>
                        <button className={sortType === "views" ? "active" : ""} onClick={() => setSortType("views")}>조회수순</button>
                        <button className={sortType === "scraps" ? "active" : ""} onClick={() => setSortType("scraps")}>스크랩순</button>
                    </div>
                </header>

                <div className="recipe-grid">
                    {sortedRecipes.map((recipe) => (
                        <div key={recipe.deckId} className="recipe-card">
                            <div className="card-image-container">
                                {recipe.representativeImageUrl ? ( 
                                    <img 
                                        src={recipe.representativeImageUrl} 
                                        alt="대표 카드" 
                                        className="deck-thumb"
                                        onError={(e) => {
                                            if (!e.target.dataset.error) {
                                                e.target.dataset.error = "true";
                                                e.target.src = "https://assets.tcgdex.net/en/tcgp/B1/1/low"; 
                                            }
                                        }}
                                    />
                                ) : (
                                    <div className="no-image">No Card</div>
                                )}
                            </div>
                            <div className="card-tag">NEW</div>
                            <div className="recipe-content">
                                <h3 className="deck-title">{recipe.deckName}</h3>
                                <p className="deck-author">@ {recipe.userName}</p>
                                <p className="deck-comment">{recipe.deckComment}</p>
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
                    ))}
                </div>
        </div>
    );
};

export default DeckRecipeBoard;