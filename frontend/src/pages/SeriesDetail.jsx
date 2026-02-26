import { useParams, Link } from "react-router-dom";
import { TiltCard } from "../components";
import '../css/SeriesDetail.css'

import { handleImageError } from '../utils/imageHelper';

const SeriesDetail = ({seriesData, cardSeries}) => {
    const {id} = useParams();
    const numId = Number(id)
    
    const seriesSets = [
        { id: "P-A", data: seriesData["P-A"], index: 0 },
        { id: "A1", data: seriesData.A1, index: 1 },
        { id: "A1a", data: seriesData.A1a, index: 2 },
        { id: "A2", data: seriesData.A2, index: 3 },
        { id: "A2a", data: seriesData.A2a, index: 4 },
        { id: "A2b", data: seriesData.A2b, index: 5 },
        { id: "A3", data: seriesData.A3, index: 6 },
        { id: "A3a", data: seriesData.A3a, index: 7 },
        { id: "A3b", data: seriesData.A3b, index: 8 },
        { id: "A4", data: seriesData.A4, index: 9 },
        { id: "A4a", data: seriesData.A4a, index: 10 },
        { id: "B1", data: seriesData.B1, index: 11 },
        { id: "B1a", data: seriesData.B1a, index: 12 },
        { id: "B2", data: seriesData.B2, index: 13 }
    ];

    const currentSet = seriesSets.find(data => data.index === numId);
    const cardLists = currentSet ? currentSet.data : [];

    return(
        <div id="SeriesDetail">
            <div className="series-banner">
                <div className="banner-content">
                    <Link to="/series/list" className="back-to-list">← 전체 목록으로</Link>
                    <div className="logo-container">
                        <img 
                            src={`${cardSeries[id].logo}.webp`} 
                            alt={cardSeries[id].name}
                            className="detail-main-logo"
                        />
                    </div>
                    <h2 className="detail-series-name">{cardSeries[id].name}</h2>
                    <p className="card-count-info">총 <strong>{cardLists.length}</strong>장의 카드가 포함되어 있습니다.</p>
                </div>
            </div>
            <div className="card-list-section">
                <div className="card-grid">
                    {cardLists.map(card => (
                        <div key={card.id} className="card-item-wrapper">
                            <Link to={`/card/${card.id}`} className="card-link">
                                <div className="card-image-box">
                                    <img 
                                        src={card.image + '/low.png'} 
                                        alt={card.name}
                                        onError={handleImageError}
                                        loading="lazy"
                                    />
                                    <div className="card-overlay">
                                        <span>상세 정보 보기</span>
                                    </div>
                                </div>
                                <div className="card-meta">
                                    <span className="card-number">{card.id.split('-').pop()}</span>
                                    <p className="card-name">{card.name}</p>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default SeriesDetail;