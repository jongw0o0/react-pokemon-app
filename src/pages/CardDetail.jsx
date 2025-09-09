import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import TCGdex from "@tcgdex/sdk";

const CardDetail = () => {
    const { id } = useParams();
    const [card, setCard] = useState({});

    useEffect(() => {
        fetchData();
    }, [id])

    const fetchData = async () => {
        const sdk = new TCGdex('en');
        try {
            const res = await sdk.fetch('cards', id);
            setCard(res)
        } catch (e) {
            console.error("Error fetching tcgp:", e);
        }
    }

    return(
        <div id="CardDetail">
            {card.name}
            <img src={`${card.image}/high.webp`}/>
            {card.description}
            {card.types}
            {/* {card.attacks[0].name} */}
        </div>
    )
}

export default CardDetail;