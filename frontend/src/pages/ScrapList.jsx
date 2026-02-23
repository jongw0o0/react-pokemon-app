import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../css/ScrapList.css';
import '../css/DeckRecipeBoard.css';

const ScrapList = () => {
    const [scrappedDecks, setScrappedDecks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMyScraps = async () => {
            try {
                const response = await axios.get("http://localhost:8000/api/decks/my-scraps", { withCredentials: true });
                setScrappedDecks(response.data);
            } catch (error) {
                console.error("스크랩 목록 로드 실패", error);
            }
        };
        fetchMyScraps();
    }, []);

    return (
        <div className="recipe-board-container">
            <div className="board-header">
                <h1 className="board-title">나의 스크랩 목록 🔖</h1>
                <div className="board-stats">총 {scrappedDecks.length}개의 덱</div>
            </div>

            <div className="recipe-grid">
                {scrappedDecks.length > 0 ? (
                    scrappedDecks.map((deck) => (
                        <div key={deck.deckId} className="recipe-card">
                            <Link to={`/deck/${deck.deckId}`} style={{ textDecoration: 'none' }}>
                                <div className="card-tag">content</div>
                                
                                <div className="card-image-container">
                                    <img 
                                        src={deck.representativeImageUrl} 
                                        alt={deck.deckName} 
                                        className="deck-thumb" 
                                    />
                                </div>

                                <div className="recipe-content">
                                    <h3 className="deck-title">{deck.deckName}</h3>
                                    <div className="deck-author">By. {deck.userName}</div>
                                    <p className="deck-comment">
                                        {deck.deckComment || "등록된 설명이 없습니다."}
                                    </p>
                                </div>

                                <div className="recipe-footer">
                                    <div className="detail-btn" style={{textAlign: 'center'}}>
                                        상세보기
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))
                ) : (
                    <div className="empty-message">
                        <p>아직 스크랩한 덱이 없습니다. 😂</p>
                        <Link to="/deckRecipes" className="go-recipes-btn">덱 구경하러 가기</Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ScrapList;