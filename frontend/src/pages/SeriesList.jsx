import { useState } from "react";
import { Link } from "react-router-dom";
import '../css/SeriesList.css'

const SeriesList = ({seriesData, cardSeries}) => {
    const [A1, setA1] = useState(seriesData.A1);
    const [A1a, setA1a] = useState(seriesData.A1a);
    const [A2, setA2] = useState(seriesData.A2);
    const [A2a, setA2a] = useState(seriesData.A2a);
    const [A2b, setA2b] = useState(seriesData.A2b);
    const [A3, setA3] = useState(seriesData.A3);
    const [A3a, setA3a] = useState(seriesData.A3a);
    const [A3b, setA3b] = useState(seriesData.A3b);
    const [A4, setA4] = useState(seriesData.A4);
    const [A4a, setA4a] = useState(seriesData.A4a);
    const [B1, setB1] = useState(seriesData.B1);
    const [B1a, setB1a] = useState(seriesData.B1a);
    const [pA, setPA] = useState(seriesData["P-A"]); // 하이픈 있는 key는 별칭으로

    console.log(seriesData)
    return(
        <div id="SeriesList">
            <header className="series-header">
                <h1 className="title">확장팩 목록</h1>
                <p className="subtitle">포켓몬 카드 게임 포켓의 다양한 시리즈를 탐색해보세요.</p>
            </header>
            <div className="series-grid">
                {cardSeries.map((set, index) => (
                    <Link to={`/series/detail/${index}`} key={set.id} className="series-card">
                        <div className="card-inner">
                            <div className="logo-wrapper">
                                <img src={`${set.logo}.webp`} alt={set.name} className="series-logo" />
                            </div>
                            <div className="info-wrapper">
                                <span className="series-id">{set.id.toUpperCase()}</span>
                                <h3 className="series-name">{set.name}</h3>
                                <div className="view-more">카드 보기</div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default SeriesList;