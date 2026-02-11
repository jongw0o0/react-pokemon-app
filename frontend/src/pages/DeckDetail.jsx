import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../css/DeckDetail.css'; 

const DeckDetail = () => {
    // URL 파라미터에서 deckId 추출
    const { deckId } = useParams();
    const navigate = useNavigate();
    
    const [deck, setDeck] = useState(null);
    const [loading, setLoading] = useState(true);

    // API ID를 이미지 URL로 변환 (A1-218 -> A1/218)
    const getImageUrl = (cardId) => {
        if (!cardId) return "";
        const lastIndex = cardId.lastIndexOf("-");
        const formattedPath = (lastIndex !== -1) 
            ? `${cardId.substring(0, lastIndex)}/${cardId.substring(lastIndex + 1)}` 
            : cardId;
        return `https://assets.tcgdex.net/en/tcgp/${formattedPath}/low.png`;
    };

    const getInternalCardPath = (cardId) => `/card/${cardId}`;

    useEffect(() => {
        const fetchDeckDetail = async () => {
            try {
                // 백엔드 상세 조회 API 호출
                const response = await axios.get(`http://localhost:8000/api/decks/${deckId}`);
                setDeck(response.data);
            } catch (error) {
                console.error("덱 정보를 불러오는 데 실패했습니다.", error);
                alert("존재하지 않는 덱이거나 불러오기에 실패했습니다.");
                navigate('/deckRecipes');
            } finally {
                setLoading(false);
            }
        };
        fetchDeckDetail();
    }, [deckId, navigate]);

    // 덱 정보가 있을 때만 실행
    const cardCounts = deck?.apiCardIds.reduce((acc, id) => {
        acc[id] = (acc[id] || 0) + 1;
        return acc;
    }, {});

    // 중복 제거된 유니크 ID 배열
    const uniqueCardIds = Object.keys(cardCounts || {});

    if (loading) return <div className="loading-container">덱 구성 정보를 가져오는 중...</div>;
    if (!deck) return <div className="error-container">덱 정보를 찾을 수 없습니다.</div>;

    return (
        <div id="DeckDetail">
            <header className="deck-detail-header">
                <div className="header-content">
                    <button className="back-btn" onClick={() => navigate(-1)}>← 뒤로가기</button>
                    <h1>{deck.deckName}</h1>
                    <div className="deck-meta">
                        <span className="author">By. <strong>{deck.userName}</strong></span>
                    </div>
                    <p className="deck-desc">{deck.deckComment || "등록된 설명이 없습니다."}</p>
                </div>
            </header>
            <div className="deck-detail-content">
                <div className="representative-section">
                    <img 
                        src={deck.representativeImageUrl} 
                        alt="대표 카드" 
                        className="rep-card-img" 
                    />
                </div>
                <div className="card-grid-section">
                    <div className="deck-grid">
                        {uniqueCardIds.map((id) => (
                            <div key={id} className="grid-item card-wrapper">
                                <Link to={getInternalCardPath(id)} className="card-link">
                                    <img 
                                        src={getImageUrl(id)} 
                                        alt="카드" 
                                        loading="lazy"
                                        title={`클릭하여 카드 정보 상세보기`}
                                    />
                                    {cardCounts[id] > 1 && (
                                        <div className="card-count-badge">
                                            {cardCounts[id]}
                                        </div>
                                    )}
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeckDetail;