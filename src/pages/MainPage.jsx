import { useEffect, useState } from "react";
import axios from "axios";
import TCGdex from "@tcgdex/sdk";

const MainPage = ({seriseData}) => {
    const [randCard, setRandCard] = useState({});
    
    useEffect(() => {
        fetchData()
    }, [])
    
    const fetchData = async () => {
        const sdk = new TCGdex('en');
        try {
            const res = await sdk.random.card("series", "tcgp");
            setRandCard(res)
        } catch (e) {
            console.error("Error fetching tcgp:", e);
        }
    }
    console.log(randCard)
    return(
        <div id="MainPage">
            <img src={`${randCard.image}/high.webp`}/>
        </div>
    )
}

export default MainPage;