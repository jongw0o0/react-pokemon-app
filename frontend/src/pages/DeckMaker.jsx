import TCGdex from "@tcgdex/sdk";

import '../css/DeckMaker.css'

const DeckMaker = ({seriesData, cardSeries}) => {
    
    const newDeck = Array.from({length: 20})
    console.log(seriesData)
    console.log(cardSeries)
    return(
        <div id="DeckMaker">
            <div className='newDeck'>
                <h2>새로운 덱</h2>
                <ul>
                    {newDeck.map((nd, idx) => 
                        <li key={idx}></li>
                    )}
                </ul>
            </div>
            <div className='searchCard'>
                <div className="searchBar">
                    <input 
                        type='text'
                        placeholder='카드 이름 검색'
                    />
                </div>
                <div className="selectOpts">
                    <select>
                        <option>모든 카드 타입</option>
                        <option>dd</option>
                        <option>dd</option>
                        <option>dd</option>
                    </select>
                    <select>
                        <option>모든 에너지 타입</option>
                    </select>
                    <select>
                        <option>모든 포켓몬</option>
                    </select>
                    <select>
                        <option>전체 세트</option>
                    </select>
                    <select>
                        <option>dd</option>
                    </select>
                    <select>
                        <option>오름차순</option>
                        <option>내림차순</option>
                    </select>
                    <select>
                        <option>18개씩 보기</option>
                    </select>
                </div>
            </div>
            <div className="cardLists">
                cardlists
            </div>
        </div>
    )
}

export default DeckMaker;