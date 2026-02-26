import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../css/DeckDetail.css'; 
import { handleImageError } from '../utils/imageHelper';

const DeckDetail = () => {
    // URL 파라미터에서 deckId 추출
    const { deckId } = useParams();
    const navigate = useNavigate();
    
    const [deck, setDeck] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isOwner, setIsOwner] = useState(false);
    const [isScrapped, setIsScrapped] = useState(false);
    const [isLiked, setIsLiked] = useState(false);  // 추천

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
                const response = await axios.get(`http://localhost:8000/api/decks/${deckId}`, { withCredentials: true });
                setDeck(response.data);
                setIsScrapped(response.data.scrapped);
                // setIsLiked(response.data.liked);
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

    useEffect(() => {
        if (deck && deck.memberId) {
            // 현재 로그인한 사용자 정보 가져오기
            const myId = localStorage.getItem("memberId");
            
            if (String(deck.memberId) === String(myId)) {
                setIsOwner(true);
            } else {
                setIsOwner(false);
            }
        }
    }, [deck]);

    const handleDelete = async () => {
        if (window.confirm("정말로 이 덱 레시피를 삭제하시겠습니까?")) {
            try {
                await axios.delete(`http://localhost:8000/api/decks/${deckId}`, {
                    withCredentials: true 
                });
                alert("성공적으로 삭제되었습니다.");
                
                navigate('/deckRecipes'); 
            } catch (error) {
                console.error("삭제 실패:", error);
                alert("삭제 중 오류가 발생했습니다. 본인 덱이 맞는지 확인해 주세요.");
            }
        }
    };

    const handleLike = async () => {
        const memberId = localStorage.getItem("memberId");
        if (!memberId) {
            alert("로그인 후 이용 가능합니다.");
            return;
        }
        try {
            await axios.post(`http://localhost:8000/api/decks/${deckId}/like`, {}, { withCredentials: true });
            const newStatus = !isLiked;
            setIsLiked(newStatus);
            setDeck(prev => ({
                ...prev,
                likeCount: newStatus ? (prev.likeCount + 1) : (prev.likeCount - 1)
            }));
        } catch (error) {
            console.error("추천 오류:", error);
        }
    };

    const handleScrap = async () => {
        const memberId = localStorage.getItem("memberId");
        if (!memberId) {
            alert("로그인 후 이용 가능합니다.");
            return;
        }
        // setIsScrapped(!isScrapped);
        try {
            await axios.post(`http://localhost:8000/api/decks/${deckId}/scrap`, {}, { withCredentials: true });
            const newScrapStatus = !isScrapped;
            setIsScrapped(newScrapStatus);
                setDeck(prev => ({
                ...prev,
                // 스크랩 성공 시 +1, 취소 시 -1
                scrapCount: newScrapStatus 
                    ? (Number(prev.scrapCount) || 0) + 1 
                    : Math.max(0, (Number(prev.scrapCount) || 0) - 1)
            }));

            // alert(newScrapStatus ? "덱을 스크랩했습니다!" : "스크랩이 취소되었습니다.");
        } catch (error) {
            console.error("스크랩 오류:", error);
        }
    };

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
                <div className="header-top-actions">
                    <button className="back-btn" onClick={() => navigate(-1)}>← 뒤로가기</button>
                    <div className="owner-actions">
                        {isOwner && (
                            <>
                                <button className="edit-btn" onClick={() => navigate(`/deck/edit/${deckId}`)}>수정</button>
                                <button className="delete-btn" onClick={handleDelete}>삭제</button>
                            </>
                        )}
                    </div>
                </div>
                <div className="header-content">
                    <div className="title-wrapper" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <h1>{deck.deckName}</h1>    
                        <div className="action-buttons-group">
                            <button 
                                className={`like-btn ${isLiked ? 'active' : ''}`} 
                                onClick={handleLike}
                                title="이 덱 추천하기"
                            >
                                <span className="icon">👍</span>
                                <span className="count">{deck.likeCount || 0}</span>
                            </button>

                            <button 
                                className={`scrap-btn ${isScrapped ? 'active' : ''}`} 
                                onClick={handleScrap}
                                title={isScrapped ? "스크랩 취소" : "덱 스크랩"}
                            >
                                <span className="icon">🔖</span>
                                <span className="count">{deck.scrapCount || 0}</span>
                            </button>

                            <div className="views-info">
                                <span className="icon">👁️</span>
                                <span className="count">{deck.views || 0}</span>
                            </div>
                        </div>
                    </div>
                    {deck.energies && deck.energies.length > 0 && (
                        <div className="deck-header-energies">
                            {deck.energies.map((type) => (
                                <div key={type} className={`energy-badge ${type.toLowerCase()}`}>
                                    <span className="energy-text">{type}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="deck-meta-info">
                        <span className="author">작성자: {deck.userName}</span>
                        <p className="deck-comment">{deck.deckComment}</p>
                    </div>
                </div>
            </header>
            <div className="deck-detail-content">
                <div className="representative-section">
                    <Link to={getInternalCardPath(deck.representativeCardId)} className="rep-card-link">
                        <img 
                            src={deck.representativeImageUrl} 
                            onError={handleImageError}
                            alt="대표 카드" 
                            className="rep-card-img" 
                        />
                    </Link>
                </div>
                <div className="card-grid-section">
                    <div className="deck-grid">
                        {uniqueCardIds.map((id) => (
                            <div key={id} className="grid-item card-wrapper">
                                <Link to={getInternalCardPath(id)} className="card-link">
                                    <img 
                                        src={getImageUrl(id)} 
                                        alt="카드"
                                        onError={handleImageError}
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