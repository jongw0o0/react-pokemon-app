import React, { useState } from 'react';
import '../css/CardSimulator.css';

const CardSimulator = () => {
    const [pack, setPack] = useState([]);
    const [isDrawing, setIsDrawing] = useState(false);

    const cardPool = {
        "1다이아": ["A1-1", "A1-15", "A1-34", "A1-60", "A1-80"],
        "2다이아": ["A1-35", "A1-55", "A1-90", "A1-120"],
        "3다이아": ["A1-4", "A1-37", "A1-100"],
        "4다이아": ["A1-129", "A1-130"],
        "1성": ["A1-221", "A1-225"],
        "2성": ["A1-271", "A1-275"],
        "이머시브": ["A1-285"],
        "크라운": ["A1-286"]
    };

    const getImageUrl = (cardId) => {
        if (!cardId) return "";
        const lastIndex = cardId.lastIndexOf("-");
        const set = cardId.substring(0, lastIndex);
        const id = cardId.substring(lastIndex + 1).padStart(3, '0');
        return `https://assets.tcgdex.net/en/tcgp/${set}/${id}/high.webp`;
    };

    const drawOneCard = (type) => {
        const rand = Math.random() * 100;
        let grade = "";
        if (type === "basic") grade = "1다이아";
        else if (type === "4th") {
            if (rand <= 0.04) grade = "크라운";
            else if (rand <= 0.262) grade = "이머시브";
            else if (rand <= 0.762) grade = "2성";
            else if (rand <= 3.334) grade = "1성";
            else if (rand <= 5.000) grade = "4다이아";
            else if (rand <= 10.000) grade = "3다이아";
            else grade = "2다이아";
        } else {
            if (rand <= 0.16) grade = "크라운";
            else if (rand <= 1.048) grade = "이머시브";
            else if (rand <= 3.048) grade = "2성";
            else if (rand <= 13.336) grade = "1성";
            else if (rand <= 20.000) grade = "4다이아";
            else if (rand <= 40.000) grade = "3다이아";
            else grade = "2다이아";
        }
        const pool = cardPool[grade];
        const randomCardId = pool[Math.floor(Math.random() * pool.length)];
        return { grade, id: randomCardId };
    };

    const handleDrawPack = () => {
        setPack([]); 
        
        setIsDrawing(true);
        
        const newPack = [
            drawOneCard("basic"), 
            drawOneCard("basic"), 
            drawOneCard("basic"), 
            drawOneCard("4th"), 
            drawOneCard("5th")
        ];
        
        setTimeout(() => {
            setPack(newPack);
            setIsDrawing(false);
        }, 600);
    };

    return (
        <div className="card-sim-container">
            <div className="sim-header">
                <h1 className="sim-title">카드 뽑기 시뮬레이터</h1>
                <p className="sim-subtitle">text..</p>
                <button 
                    className="draw-btn" 
                    onClick={handleDrawPack}
                    disabled={isDrawing}
                >
                    {isDrawing ? "팩 뜯는 중..." : "{}확장팩 1회 개봉 (5장)"}
                </button>
            </div>

            <div className="pack-result-grid">
                {pack.map((card, idx) => (
                    <div 
                        key={`${card.id}-${idx}`}
                        className="sim-card-item"
                        style={{ animationDelay: `${idx * 0.35}s` }}
                    >
                        <img src={getImageUrl(card.id)} alt={card.grade} className="sim-card-img" />
                    </div>
                ))}
            </div>

            <div className="prob-footer">
                <hr />
                <h3>데이터 출처: 실제 게임 확률표</h3>
                <p>기본 확률 : 99.950% (1~3장 1다이아 고정)</p>
            </div>
        </div>
    );
};

export default CardSimulator;