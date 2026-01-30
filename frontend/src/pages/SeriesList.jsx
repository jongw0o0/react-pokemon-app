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
            <ul>
                {cardSeries.map((set, index) => (
                    <li key={set.id} className={set.name}>
                        <button>
                            <Link to={`/series/detail/${index}`}>
                                <img src={`${set.logo}.webp`} alt={set.name} />
                                <p>{set.name}</p>
                            </Link>
                        </button>
                    </li>
                ))}
            </ul>

            {/* <img src={`${cardSeries[1].logo}.webp`} alt={cardSeries[0].name}/>
            {A1[0].name}
            <img src={`${A1[0].image}/high.webp`} alt={A1[0].name} /> */}
        </div>
    )
}

export default SeriesList;