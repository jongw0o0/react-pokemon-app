import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../css/DeckRecipeBoard.css';

const MyDeckList = () => {
    const [myDecks, setMyDecks] = useState([]);

    useEffect(() => {
        const fetchMyDecks = async () => {
            try {
                const response = await axios.get("http://localhost:8000/api/decks/me", { withCredentials: true });
                setMyDecks(response.data);
            } catch (error) {
                console.error("내 덱 목록 로드 실패:", error);
            }
        };
        fetchMyDecks();
    }, []);

    return (
        <div className="recipe-board-container">
            <div className="board-header">
                <h1 className="board-title">내가 만든 덱 🛠️</h1>
                <div className="board-stats">총 {myDecks.length}개의 덱을 제작했습니다.</div>
            </div>

            <div className="recipe-grid">
                {myDecks.length > 0 ? (
                    myDecks.map((deck) => (
                        <div key={deck.deckId} className="recipe-card">
                            <Link to={`/deck/${deck.deckId}`} style={{ textDecoration: 'none' }}>
                                <div className="card-tag" style={{ background: '#3d7dca', color: 'white' }}>MY DECK</div>
                                
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
                        <p>아직 만든 덱이 없네요. 😅</p>
                        <Link to="/deckMaker" className="go-recipes-btn">첫 번째 덱 만들러 가기</Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyDeckList;