import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TCGdex from "@tcgdex/sdk";
import { Link } from 'react-router-dom';
import '../css/MyCollection.css';

const MyCollection = () => {
    const [likedCards, setLikedCards] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const memberId = localStorage.getItem("memberId");

    useEffect(() => {
        const fetchMyLikes = async () => {
            if (!memberId) return;
            try {
                const res = await axios.get(`http://localhost:8000/api/cards/like/list`, {
                    params: { memberId: memberId }
                });
                const cardIds = res.data;

                const sdk = new TCGdex('en');
                const cardDetails = await Promise.all(
                    cardIds.map(id => sdk.fetch('cards', id))
                );
                setLikedCards(cardDetails);
            } catch (e) {
                console.error("컬렉션 로딩 실패", e);
            } finally {
                setLoading(false);
            }
        };
        fetchMyLikes();
    }, [memberId]);

    const handleRemoveCard = async (cardId) => {
        if (!window.confirm("이 카드를 컬렉션에서 삭제하시겠습니까?")) return;
        
        try {
            await axios.post("http://localhost:8000/api/cards/like", {
                memberId: Number(memberId),
                cardId: cardId
            });
            // ⭐ 화면에서 즉시 제거 (서버 다시 안 불러와도 됨)
            setLikedCards(prev => prev.filter(card => card.id !== cardId));
        } catch (e) {
            console.error("삭제 실패:", e);
        }
    };

    // 3. 검색어에 따른 필터링 결과
    const filteredCards = likedCards.filter(card => 
        card.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (!memberId) return <div className="error-msg">로그인이 필요한 서비스입니다.</div>;

    return (
        <div id="MyCollection" className="recipe-board-container"> {/* 클래스 추가 */}
            <div className="board-header"> {/* 헤더 구조 변경 */}
                <h1 className="board-title">내 카드 컬렉션 ❤️</h1>
                <div className="board-stats">총 {filteredCards.length}장의 카드를 수집했습니다.</div>
                
                {/* 검색바 위치 조정 */}
                <div className="collection-search-bar" style={{ marginTop: '20px' }}>
                    <input 
                        type="text" 
                        placeholder="카드 이름 검색..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="collection-grid">
                {filteredCards.map(card => (
                    <div key={card.id} className="collection-card-wrapper">
                        <button className="remove-card-btn" onClick={() => handleRemoveCard(card.id)}>×</button>
                        <Link to={`/card/${card.id}`}>
                            <img src={`${card.image}/low.webp`} alt={card.name} className="collection-img" />
                            <div className="card-overlay"><span>{card.name}</span></div>
                        </Link>
                    </div>
                ))}
            </div>

            {filteredCards.length === 0 && (
                <div className="empty-message">
                    <p>수집한 카드가 없거나 검색 결과가 없습니다. 😅</p>
                    <Link to="/search" className="go-recipes-btn">카드 구경하러 가기</Link>
                </div>
            )}
        </div>
    );
};

export default MyCollection;