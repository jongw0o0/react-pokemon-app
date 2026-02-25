import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";  
import TCGdex from "@tcgdex/sdk";
import '../css/CardDetail.css';

const RARE_LIST = [
    {value : 'One Diamond', name : '♦︎'}, {value : 'Two Diamond', name : '♦︎♦︎'},
    {value : 'Three Diamond', name : '♦︎♦︎♦︎'}, {value : 'Four Diamond', name : '♦︎♦︎♦︎♦︎'},
    {value : 'One Star', name : '⭐'}, {value : 'Two Star', name : '⭐⭐'},
    {value : 'Three Star', name : '⭐⭐⭐'}, {value : 'One Shiny', name : '✨'},
    {value : 'Two Shiny', name : '✨✨'}, {value : 'Crown', name : '👑'},
    {value : 'None', name : 'PROMO'}
];

const CardDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [card, setCard] = useState(null);
    const [loading, setLoading] = useState(true);

    const currentUserId = localStorage.getItem("memberId") || "guest";
    const [isLiked, setIsLiked] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const memberId = localStorage.getItem("memberId");

            try {
                const sdk = new TCGdex('en');
                const res = await sdk.fetch('cards', id);
                setCard(res);
                console.log(res);

                if (memberId) {
                    const likeRes = await fetch(`http://localhost:8000/api/cards/like/status?memberId=${memberId}&cardId=${id}`);
                    if (likeRes.ok) {
                        const isLikedStatus = await likeRes.json();
                        setIsLiked(isLikedStatus);
                    }
                }
            } catch (e) { 
                console.error("데이터 로드 실패:", e); 
            } finally { 
                setLoading(false); 
            }
        };
        fetchData();
    }, [id]);

    const toggleLike = async () => {
        const memberId = localStorage.getItem("memberId"); 
        
        if (!memberId) {
            alert("로그인이 필요한 기능입니다!");
            return;
        }

        try {
            await axios.post("http://localhost:8000/api/cards/like", {
                memberId: Number(memberId),
                cardId: id
            });
            
            setIsLiked(!isLiked); 
            
        } catch (e) { 
            console.error("좋아요 실패:", e); 
        }
    };

    // 마우스 위치에 따라 카드가 3D로 기울어지는 효과
    const handleMouseMove = (e) => {
        const el = e.currentTarget;
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        el.style.setProperty('--x', `${x}px`);
        el.style.setProperty('--y', `${y}px`);
        const xR = (y - rect.height / 2) / (rect.height / 2) * -10;
        const yR = (x - rect.width / 2) / (rect.width / 2) * 10;
        el.style.transform = `perspective(1000px) rotateX(${xR}deg) rotateY(${yR}deg)`;
    };

    const handleMouseLeave = (e) => {
        e.currentTarget.style.transform = `perspective(1000px) rotateX(0) rotateY(0)`;
    };

    const rarity = card ? (RARE_LIST.find(r => r.value === card.rarity)?.name || card.rarity) : "";
    const imgUrl = card?.image ? `${card.image}/high.webp` : "";

    return (
        <div id="CardDetail">
            {/* 배경 레이어 */}
            <div 
                className={`card-bg-blur ${card ? 'loaded' : ''}`} 
                style={{ backgroundImage: imgUrl ? `url(${imgUrl})` : 'none' }}
            />
            <div className="detail-container">
                {loading ? (
                    <div className="card-loading-wrapper">
                        <div className="loading-spinner" />
                        <p>데이터를 불러오는 중입니다...</p>
                    </div>
                ) : card ? (
                    <div className="fade-in-content">
                        <button className="back-btn" onClick={() => navigate(-1)}>← 뒤로가기</button>
                        <div className="content-wrapper">
                            <div className="left">
                                <div className="card-visual-wrap" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
                                    <img src={imgUrl} alt={card.name} className="main-card-img" />
                                    <div className="shine-layer" />
                                </div>
                            </div>
                            <div className="right">
                                <header className="info-header">
                                    <span className="rarity-tag">{rarity}</span>
                                    <h1 className="card-name">{card.name}</h1>
                                    <div className="card-header-row">
                                        <h2>{card.name}</h2>
                                        <button 
                                            className={`like-btn ${isLiked ? 'active' : ''}`} 
                                            onClick={toggleLike}
                                        >
                                            {isLiked ? '❤️' : '🤍'}
                                        </button>
                                    </div>
                                    {card.description && <p className="card-desc">"{card.description}"</p>}
                                </header>

                                <section className="stats-grid">
                                    {card.hp && <div className="stat-box"><span className="label">HP</span><span className="val">{card.hp}</span></div>}
                                    {card.types && <div className="stat-box"><span className="label">Type</span><span className="val">{card.types}</span></div>}
                                    {card.retreat !== undefined && <div className="stat-box"><span className="label">Retreat</span><span className="val">{card.retreat}</span></div>}
                                </section>

                                <section className="detail-sections">
                                    {card.abilities?.map((a, i) => (
                                        <div key={i} className="ability-card">
                                            <span className="type-badge">Ability</span>
                                            <h4>{a.name}</h4><p>{a.effect}</p>
                                        </div>
                                    ))}
                                    {card.attacks?.map((a, i) => (
                                        <div key={i} className="attack-card">
                                            <div className="atk-header">
                                                <div className="atk-left"><span>● {a.cost?.length || 0}</span><h4>{a.name}</h4></div>
                                                {a.damage && <span className="damage">{a.damage}</span>}
                                            </div>
                                            {a.effect && <p className="effect">{a.effect}</p>}
                                        </div>
                                    ))}
                                    {card.effect && <div className="trainer-effect"><h4>Effect</h4><p>{card.effect}</p></div>}
                                </section>

                                <footer className="footer-meta">
                                    <div className="meta-item"><span className="label">Illustrator</span><span className="val">{card.illustrator}</span></div>
                                    <div className="meta-item"><span className="label">Set</span><span className="val">{card.set?.name}</span></div>
                                </footer>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="card-error">카드를 찾을 수 없습니다.</div>
                )}
            </div>
        </div>
    );
};

export default CardDetail;