import { useParams, Link } from "react-router-dom";
import '../css/SeriesDetail.css'

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
    ];

    const cardLists =  seriesSets.find(data => data.index === numId).data
    console.log(cardLists)

    return(
        <div id="SeriesDetail">
            <div className="top">
                <img src={`${cardSeries[id].logo}.webp`} alt={cardSeries[0].name}/>
            </div>
            <div className="bottom">
                <ul>
                    {cardLists.map(cardList =>
                        <Link key={cardList.id} to={`/card/${cardList.id}`}>
                            <li>
                                <img src={`${cardList.image}/high.webp`}/>
                                <p className="cardName">{cardList.name}</p>
                                <p className="cardId">{cardList.id}</p>
                            </li>
                        </Link>
                    )}
                </ul>
            </div>
        </div>
    )
}

export default SeriesDetail;