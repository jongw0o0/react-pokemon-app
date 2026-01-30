import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { TiltCard } from "../components";
import TCGdex from "@tcgdex/sdk";
import '../css/CardDetail.css'


const RARE_LIST = [
    {value : 'None', name : 'None(PROMO)'},
    {value : 'One Diamond', name : '♦︎'},
    {value : 'Two Diamond', name : '♦︎♦︎'},
    {value : 'Three Diamond', name : '♦︎♦︎♦︎'},
    {value : 'Four Diamond', name : '♦︎♦︎♦︎♦︎'},
    {value : 'One Star', name : '⭐'},
    {value : 'Two Star', name : '⭐⭐'},
    {value : 'Three Star', name : '⭐⭐⭐'},
    {value : 'One Shiny', name : '✨'},
    {value : 'Two Shiny', name : '✨✨'},
    {value : 'Crown', name : '👑'},
];


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
    
    const rarity = RARE_LIST.find(r => r.value === card.rarity)?.name || card.rarity;

    console.log(card)

    return(
        <div id="CardDetail">
            <div className="left">
                <div className="imgWrap">
                    <img src={`${card.image}/high.webp`}/>
                </div>
            </div>
            <div className="right">
                <p className="cardName">{card.name}</p>
                <p className="cardDesc">{card.description}</p>
                <div className="cardInfo">
                    {card.types && 
                        <div>
                            <p className="title">타입</p>
                            <p className="content">{card.types}</p>
                        </div>
                    }
                    {card.hp && 
                        <div>
                            <p className="title">HP</p>
                            <p className="content">{card.hp}</p>
                        </div>
                    }
                    {card.abilities && card.abilities.length > 0 &&
                        <div>
                            <p className="title">특성</p>
                            <p className="content name">{card.abilities[0].name}</p>
                            <p className="content">{card.abilities[0].effect}</p>
                        </div>
                    }
                    {card.attacks && card.attacks.length > 0 && card.attacks.map((atk, idx) => 
                        <div key={idx}>
                            <p className="title">기술{idx + 1}</p>
                            <p className="content name">{atk.name} </p>
                            <p className="content">{atk.effect}</p>
                            <p className="content">{atk.cost? atk.cost.length : 0}에너지({atk.cost ? atk.cost.join(', ') : '-'}) </p>
                            {atk.damage ? <p className="content">{atk.damage}데미지</p> : ''}
                        </div>
                    )}
                    {card.effect && 
                        <div>
                            <p className="title">효과</p>
                            <p className="content">{card.effect}</p>
                        </div>
                    }
                    {card.weaknesses && card.weaknesses.length > 0 && 
                        <div>
                            <p className="title">약점</p>
                            <p className="content">{card.weaknesses[0].type} {card.weaknesses[0].value}</p>
                        </div>
                    }
                    {(card.retreat || card.retreat === 0) &&  
                        <div>
                            <p className="title">후퇴</p>
                            <p className="content">{card.retreat}</p>
                        </div>
                    }
                    <div>
                        <p className="title">일러스트</p>
                        <p className="content">{card.illustrator}</p>
                    </div>
                    <div>
                        <p className="title">레어도</p>
                        <p className="content">{rarity}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CardDetail;