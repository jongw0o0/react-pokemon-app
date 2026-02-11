import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/DeckRecipeBoard.css';

const DeckRecipeBoard = () => {
    const navigate = useNavigate();

    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);

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

    if (loading) return <div className="loading-screen">포켓몬 도감을 동기화 중...</div>;

    return (
        <div className="recipe-board-container">
                <header className="board-header">
                    <h1>Deck Recipe Board</h1>
                    <p>최고의 트레이너들이 공유하는 덱 구성 비법을 확인하세요.</p>
                    <div className="board-stats">
                        현재 등록된 덱: <strong>{recipes.length}</strong>개
                    </div>
                </header>

                <div className="recipe-grid">
                    {recipes.map((recipe) => (
                        <div key={recipe.deckId} className="recipe-card">
                            <div className="card-image-container">
                                {/* ImageUrl이 비어있지 않은지 확인 */}
                                {recipe.representativeImageUrl ? ( 
                                    <img 
                                        src={recipe.representativeImageUrl} 
                                        alt="대표 카드" 
                                        className="deck-thumb"
                                        onError={(e) => {
                                            // 이미 한 번 에러가 났던 주소면 더 이상 시도하지 않도록 flag 설정
                                            if (!e.target.dataset.error) {
                                                e.target.dataset.error = "true";
                                                // 확실히 존재하는 이미지 주소(구글 로고나 빈 이미지 등)로 대체
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