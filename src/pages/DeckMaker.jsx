import '../css/DeckMaker.css'

const DeckMaker = ({seriesData, cardSeries}) => {
    
    const newDeck = Array.from({length: 20})
    // console.log(newDeck)
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
                <input 
                    type='text'
                    placeholder='카드 이름 검색'
                />
            </div>
        </div>
    )
}

export default DeckMaker;