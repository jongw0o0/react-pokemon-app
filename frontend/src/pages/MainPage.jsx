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
            <header className="main-header">
                <h1 className="title">
                    <span className="count">{total.toLocaleString()}</span> 종류의 카드를 
                    <span className="brand-name"> PokeArch</span>에서 만나보세요
                </h1>
                <p className="subtitle">subtitle</p>
            </header>
            <div className="slider-container">
                <div className="imageSlides">
                    {/* 무한 슬라이드를 위해 3번 반복해서 배치 (끊김 방지) */}
                    {[...randCards, ...randCards, ...randCards].map((randCard, index) => (
                        <div className="slide" key={`${randCard.id}-${index}`}>
                            <div className="card-wrapper">
                                <Link to={`/card/${randCard.id}`}>
                                    <div className="shine-effect"></div>
                                    <img src={`${randCard.image}/high.webp`} alt={randCard.name} loading="lazy" />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default MainPage;