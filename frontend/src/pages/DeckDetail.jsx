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
    const [isOwner, setIsOwner] = useState(false);
    const [isScrapped, setIsScrapped] = useState(false);

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
        // 1. 사용자에게 한 번 더 물어보기 (실수 방지)
        if (window.confirm("정말로 이 덱 레시피를 삭제하시겠습니까?")) {
            try {
                // 2. 백엔드 삭제 API 호출
                await axios.delete(`http://localhost:8000/api/decks/${deckId}`, {
                    withCredentials: true 
                });
                alert("성공적으로 삭제되었습니다.");
                
                // 3. 삭제 후 목록 페이지로 이동
                navigate('/deckRecipes'); 
            } catch (error) {
                console.error("삭제 실패:", error);
                alert("삭제 중 오류가 발생했습니다. 본인 덱이 맞는지 확인해 주세요.");
            }
        }
    };

    const handleScrap = async () => {
        const memberId = localStorage.getItem("memberId");
        if (!memberId) {
            alert("로그인 후 이용 가능합니다.");
            return;
        }
        setIsScrapped(!isScrapped); // UI 즉시 반영 (낙관적 업데이트)
        // try {
        //     // 백엔드: ScrapController에서 처리 (memberId, deckId 전송)
        //     await axios.post(`http://localhost:8000/api/decks/${deckId}/scrap`, {}, { withCredentials: true });
        //     setIsScrapped(!isScrapped); // 상태 토글
        //     alert(isScrapped ? "스크랩이 취소되었습니다." : "덱을 스크랩했습니다!");
        // } catch (error) {
        //     console.error("스크랩 오류:", error);
        // }
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
                    {isOwner && (
                        <div className="owner-actions">
                            <button className="edit-btn" onClick={() => navigate(`/deck/edit/${deckId}`)}>수정</button>
                            <button className="delete-btn" onClick={handleDelete}>삭제</button>
                        </div>
                    )}
                    <button 
                        className={`scrap-btn ${isScrapped ? 'active' : ''}`} 
                        onClick={handleScrap}
                    >
                        {isScrapped ? '스크랩 됨' : '덱 스크랩'}
                    </button>
                </div>
                <div className="header-content">
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