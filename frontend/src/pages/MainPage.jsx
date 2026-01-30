import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import TCGdex, { Query } from "@tcgdex/sdk";
import '../css/MainPage.css'

const MainPage = ({seriesData}) => {
    const [randCards, setRandCard] = useState([]);

    useEffect(() => {
        fetchData()
    }, []);

    const fetchData = async () => {
        try{
            const tcgdex = new TCGdex("en");
            const series = await tcgdex.fetch("series", "tcgp");

            // 시리즈 목록 중 하나 랜덤 선택
            const sets = series.sets
            const randomSeries = sets[Math.floor(Math.random() * sets.length)]

            const cards = await tcgdex.card.list(
                Query.create().equal("set", randomSeries.id)
            );

            const pickedCards = Array.from({length: 10}, () => 
                cards[Math.floor(Math.random() * cards.length)]
            );
            setRandCard(pickedCards)
        } catch (e) {
            console.error("Error fetching data:", e);
        }
    }

    let total = 0;
    for (const arr of Object.values(seriesData)) {
    total += arr.length;
    }
    
    return(
        <div id="MainPage">
            <div className="title">{total}개</div>
            <div className="imageSlides">
                {randCards.map(randCard => (
                    <div className="slide" key={randCard.id}>
                        <div className="train-card">
                            <Link key={randCard.id} to={`/card/${randCard.id}`}>
                                <img src={`${randCard.image}/high.webp`} alt={randCard.name} />
                            </Link>
                        </div>
                    </div>
                ))}
                {randCards.map(randCard => (
                    <div className="slide" key={randCard.id + "-dup"}>
                        <div className="train-card">
                            <Link key={randCard.id} to={`/card/${randCard.id}`}>
                                <img src={`${randCard.image}/high.webp`} alt={randCard.name} />
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default MainPage;