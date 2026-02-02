import { Link } from 'react-router-dom';
import '../css/Header.css'

const Header = () => {
    
    const userName = localStorage.getItem("userName");

    const handleLogout = () => {
        // 로그아웃 시 저장된 정보를 지우고 페이지 새로고침
        localStorage.removeItem("userName");
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
                    <li><Link to='/deckmaker'>덱 레시피</Link></li>
                    <li><Link to='/simulator'>카드 뽑기 시뮬레이터</Link></li>
                    <li><Link to='/search'>검색</Link></li>
                    {/* userName이 있으면 이름과 로그아웃, 없으면 로그인 링크를 보여줌 */}
                    {userName ? (
                        <>
                            <li className="user-name" style={{ color: '#ffcb05', fontWeight: 'bold' }}>
                                {userName}
                            </li>
                            <li>
                                <button onClick={handleLogout} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px' }}>
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