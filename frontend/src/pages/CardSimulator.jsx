import React, { useState } from 'react';
import '../css/CardSimulator.css';

const CardSimulator = () => {
    const [pack, setPack] = useState([]);
    const [isDrawing, setIsDrawing] = useState(false);
    const [showProb, setShowProb] = useState(false);

    const cardPool = {
        "1다이아": ["A1a-001", "A1a-004", "A1a-007", "A1a-010", "A1a-013", "A1a-015", "A1a-016", "A1a-017", "A1a-020", "A1a-022", "A1a-024", "A1a-025", "A1a-028", "A1a-030", "A1a-034", "A1a-036", "A1a-037", "A1a-039", "A1a-040", "A1a-041", "A1a-042", "A1a-043", "A1a-049", "A1a-051", "A1a-052", "A1a-053", "A1a-054", "A1a-057", "A1a-058", "A1a-061", "A1a-062", "A1a-063"],
        "2다이아": ["A1a-002", "A1a-005", "A1a-008", "A1a-009", "A1a-011", "A1a-012", "A1a-021", "A1a-023", "A1a-027", "A1a-029", "A1a-033", "A1a-035", "A1a-038", "A1a-044", "A1a-048", "A1a-050", "A1a-055", "A1a-056", "A1a-064", "A1a-065", "A1a-066", "A1a-067", "A1a-068"],
        "3다이아": ["A1a-006", "A1a-014", "A1a-019", "A1a-026", "A1a-031", "A1a-045", "A1a-047", "A1a-060"],
        "4다이아": ["A1a-003", "A1a-018", "A1a-032", "A1a-046", "A1a-059"],
        "1성": ["A1a-069", "A1a-070", "A1a-071", "A1a-072", "A1a-073", "A1a-074"],
        "2성": ["A1a-075", "A1a-076", "A1a-077", "A1a-078", "A1a-079", "A1a-080", "A1a-081", "A1a-082", "A1a-083", "A1a-084"],
        "이머시브": ["A1a-085"],
        "크라운": ["A1a-086"]
    };

    const getImageUrl = (cardId) => {
        if (!cardId) return "";
        const lastIndex = cardId.lastIndexOf("-");
        const set = cardId.substring(0, lastIndex);
        const id = cardId.substring(lastIndex + 1).padStart(3, '0');
        return `https://assets.tcgdex.net/en/tcgp/${set}/${id}/high.webp`;
    };

    const drawOneCard = (type, isRarePack = false) => {
        const rand = Math.random() * 100;
        let grade = "";
        if (isRarePack) {
            if (rand <= 5.555) grade = "크라운";
            else if (rand <= 11.110) grade = "이머시브";
            else if (rand <= 66.665) grade = "2성";
            else grade = "1성";
        } 
        else {
            if (type === "basic") grade = "1다이아";
            else if (type === "4th") {
                if (rand <= 0.040) grade = "크라운";
                else if (rand <= 0.222) grade = "이머시브";
                else if (rand <= 0.500) grade = "2성";
                else if (rand <= 2.572) grade = "1성";
                else if (rand <= 1.666) grade = "4다이아";
                else if (rand <= 5.000) grade = "3다이아";
                else grade = "2다이아";
            } else {
                if (rand <= 0.160) grade = "크라운";
                else if (rand <= 0.888) grade = "이머시브";
                else if (rand <= 2.000) grade = "2성";
                else if (rand <= 10.288) grade = "1성";
                else if (rand <= 6.664) grade = "4다이아";
                else if (rand <= 20.000) grade = "3다이아";
                else grade = "2다이아";
            }
        }
        
        const pool = cardPool[grade];
        const randomCardId = pool[Math.floor(Math.random() * pool.length)];
        return { grade, id: randomCardId };
    };

    const handleDrawPack = () => {
        setPack([]); 
        setIsDrawing(true);
        
        const isRarePack = Math.random() * 100 <= 0.05;
        // const isRarePack = 1;
        
        const newPack = isRarePack 
            ? Array(5).fill().map(() => drawOneCard("rare", true))
            : [
                drawOneCard("basic"), drawOneCard("basic"), drawOneCard("basic"), 
                drawOneCard("4th"), drawOneCard("5th")
            ];
        
        setTimeout(() => {
            setPack(newPack);
            setIsDrawing(false);
            if(isRarePack) alert("축하합니다! 레어 팩에 당첨되었습니다!");
        }, 600);
    };

    return (
        <div className="card-sim-container">
            <div className="sim-header">
                <h1 className="sim-title">카드 뽑기 시뮬레이터</h1>
                <p className="sim-subtitle">당신의 운을 시험해 보세요..</p>
                <button 
                    className="draw-btn" 
                    onClick={handleDrawPack}
                    disabled={isDrawing}
                >
                    {isDrawing ? "팩 뜯는 중..." : "환상이 있는 섬 확장팩 1회 개봉 (5장)"}
                </button>
            </div>

            <div className="pack-result-grid">
                {pack.map((card, idx) => (
                    <div 
                        key={`${card.id}-${idx}`} 
                        className={`sim-card-item grade-${card.grade.replace(/\s+/g, '')}`}
                        style={{ animationDelay: `${idx * 0.35}s` }}
                    >
                        <img src={getImageUrl(card.id)} alt={card.grade} className="sim-card-img" />
                        
                        {/* 등급이 높을 때만 나오는 반짝임 레이어 추가 */}
                        {(card.grade.includes('성') || card.grade === '크라운') && <div className="card-shine-effect"></div>}
                    </div>
                ))}
            </div>

            <div className="prob-section">
                <button className="prob-toggle-btn" onClick={() => setShowProb(!showProb)}>
                    {showProb ? "확률표 닫기 ▲" : "확률표 자세히 보기 ▼"}
                </button>
                
                {showProb && (
                    <div className="prob-content fade-in">
                        <div className="prob-card">
                            <h3>일반 팩 확률: 0.950%</h3>
                            <table className="prob-table">
                                <thead>
                                    <tr><th>등급</th><th>1~3장째</th><th>4장째</th><th>5장째</th></tr>
                                </thead>
                                <tbody>
                                    <tr><td>크라운</td><td>-</td><td>0.040%</td><td>0.160%</td></tr>
                                    <tr><td>이머시브</td><td>-</td><td>0.222%</td><td>0.888%</td></tr>
                                    <tr><td>2성</td><td>-</td><td>0.500%</td><td>2.000%</td></tr>
                                    <tr><td>2성</td><td>-</td><td>0.500%</td><td>2.000%</td></tr>
                                    <tr><td>2성</td><td>-</td><td>0.500%</td><td>2.000%</td></tr>
                                    <tr><td>2성</td><td>-</td><td>0.500%</td><td>2.000%</td></tr>
                                    <tr><td>2성</td><td>-</td><td>0.500%</td><td>2.000%</td></tr>
                                    <tr><td>2성</td><td>-</td><td>0.500%</td><td>2.000%</td></tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="prob-card rare-info">
                            <h3>레어 팩 확률: 0.050%</h3>
                            <table className="prob-table">
                                <thead>
                                    <tr><th>등급</th><th>1~3장째</th></tr>
                                </thead>
                                <tbody>
                                    <tr><td>크라운</td><td>-</td></tr>
                                    <tr><td>이머시브</td><td>-</td></tr>
                                    <tr><td>2성</td><td>-</td></tr>
                                    <tr><td>2성</td><td>-</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CardSimulator;