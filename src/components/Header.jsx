import { Link } from 'react-router-dom';
import '../css/Header.css'

const Header = () => {
    return(
        <header id="Header">
            <div className='left'>
                <Link to='/'>포켓몬카드</Link>
            </div>
            <div className='right'>
                <ul>
                    <li><Link to='/series/list'>확장팩</Link></li>
                    <li><Link to='/deckmaker'>덱 만들기</Link></li>
                    <li><Link to=''>카드깡 시뮬레이터</Link></li>
                    <li><Link to='/search'>검색</Link></li>
                </ul>
            </div>
        </header>
    )
}

export default Header;