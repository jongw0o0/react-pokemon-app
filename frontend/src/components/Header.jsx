import { Link, useNavigate } from 'react-router-dom';
import '../css/Header.css'
import { useState } from 'react';

const Header = () => {

    const navigate = useNavigate();

    const userName = localStorage.getItem("userName");
    const [isDeckHovered, setIsDeckHovered] = useState(false);
    const [isUserHovered, setIsUserHovered] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem("userName");
        localStorage.removeItem("memberId");
        navigate('/');
        window.location.reload();
    };
    
    return(
        <header id="Header">
            <div className="header-inner">
                <div className='left'>
                    <Link to='/' className="logo">
                        <span className="logo-text">PokeArch</span>
                    </Link>
                </div>
                
                <div className='right'>
                    <ul className="nav-list">
                        <li><Link to='/series/list'>확장팩</Link></li>
                        
                        <li 
                            className="dropdown" 
                            onMouseEnter={() => setIsDeckHovered(true)} 
                            onMouseLeave={() => setIsDeckHovered(false)}
                        >
                            <Link to='/deckRecipes' className="nav-item">덱 레시피</Link>
                            {isDeckHovered && (
                                <ul className="dropdown-menu">
                                    <li><Link to='/deckRecipes'>덱 목록</Link></li>
                                    <li><Link to='/deckmaker'>덱 만들기</Link></li>
                                </ul>
                            )}
                        </li>

                        <li><Link to='/simulator'>시뮬레이터</Link></li>
                        <li><Link to='/search'>검색</Link></li>
                        
                        {userName ? (
                            <li 
                                className="dropdown" 
                                onMouseEnter={() => setIsUserHovered(true)} 
                                onMouseLeave={() => setIsUserHovered(false)}
                            >
                                <span className="user-name nav-item">
                                    {userName} ▼
                                </span>
                                {isUserHovered && (
                                    <ul className="dropdown-menu">
                                        <li><Link to='/mypage/my-decks'>내가 만든 덱</Link></li>
                                        <li><Link to='/mypage/scrapped-decks'>스크랩한 덱</Link></li>
                                        <li><Link to='/my-collection'>좋아요한 카드</Link></li>
                                        <li className="divider"></li>
                                        <li><button onClick={handleLogout} className="logout-btn">로그아웃</button></li>
                                    </ul>
                                )}
                            </li>
                        ) : (
                            <li><Link to='/login' className="login-btn">로그인</Link></li>
                        )}
                    </ul>
                </div>
            </div>
        </header>
    )
}

export default Header;