import { Link } from 'react-router-dom';
import '../css/Header.css'
import { useState } from 'react'; // 드롭다운 상태 관리를 위해 추가

const Header = () => {
    const userName = localStorage.getItem("userName");
    const [isDeckHovered, setIsDeckHovered] = useState(false); // 드롭다운 상태

    const handleLogout = () => {
        localStorage.removeItem("userName");
        localStorage.removeItem("memberId"); // memberId도 같이 지워주는 게 좋습니다
        window.location.reload();
    };
    
    return(
        <header id="Header">
            <div className='left'>
                <Link to='/'>포켓몬카드</Link>
            </div>
            <div className='right'>
                <ul>
                    <li><Link to='/series/list'>확장팩</Link></li>
                    
                    {/* 덱 레시피 드롭다운 메뉴 */}
                    <li 
                        className="dropdown" 
                        onMouseEnter={() => setIsDeckHovered(true)} 
                        onMouseLeave={() => setIsDeckHovered(false)}
                    >
                        <Link to='/deckmaker' className="dropdown-title">덱 레시피</Link>
                        {isDeckHovered && (
                            <ul className="dropdown-menu">
                                <li><Link to='/deckRecipes'>덱 목록</Link></li>
                                <li><Link to='/deckmaker'>덱 만들기</Link></li>
                            </ul>
                        )}
                    </li>

                    <li><Link to='/simulator'>카드 뽑기 시뮬레이터</Link></li>
                    <li><Link to='/search'>검색</Link></li>
                    
                    {userName ? (
                        <>
                            <li className="user-name" style={{ color: '#ffcb05', fontWeight: 'bold' }}>
                                {userName}
                            </li>
                            <li>
                                <button onClick={handleLogout} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', color: '#fff' }}>
                                    로그아웃
                                </button>
                            </li>
                        </>
                    ) : (
                        <li><Link to='/login'>로그인</Link></li>
                    )}
                </ul>
            </div>
        </header>
    )
}

export default Header;