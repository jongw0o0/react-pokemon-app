import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // 로그인 성공 후 페이지 이동을 위해 필요
import '../css/Login.css';

const Login = () => {
  const [loginData, setLoginData] = useState({
    loginId: '',
    password: ''
  });
  const [rememberId, setRememberId] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setLoginData({
      ...loginData, 
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 백엔드의 @PostMapping("/api/members/login") 호출
      const response = await axios.post('http://localhost:8000/api/members/login', loginData, {withCredentials: true }); // 중요! 세션 쿠키를 주고받기 위해 설정

      const welcomeMsg = response.data.message; 
      const userName = response.data.userName;
      const memberId = response.data.memberId;

      // 로그인 성공 시 사용자 정보와 환영 메시지를 로컬 스토리지에 저장
      localStorage.setItem("userName", userName); 
      localStorage.setItem("memberId", memberId);
      alert(`${userName}님, ${welcomeMsg}`); 
      // console.log("로그인 응답 전체 데이터:", response.data)

      window.location.href = '/'; 
    } catch (error) {
      // console.error('로그인 실패:', error.response?.data);
      alert(error.response?.data || '아이디 또는 비밀번호를 확인해주세요.');
    }
    
  };

  return (
    <div id="LoginPage">
      <div className="login-container">
        <div className="login-header">
          <h2>Welcome</h2>
          <p>PokeArch에 오신 것을 환영합니다</p>
        </div>
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <label>아이디</label>
            <input 
              type="text" 
              name="loginId" 
              placeholder="아이디를 입력하세요"
              value={loginData.loginId} 
              onChange={handleChange} 
              required 
            />
          </div>
          <div className="input-group">
            <label>비밀번호</label>
            <input 
              type="password" 
              name="password" 
              placeholder="비밀번호를 입력하세요"
              value={loginData.password} 
              onChange={handleChange} 
              required 
            />
          </div>
          <div className="login-options">
            <label className="remember-me">
              <input 
                type="checkbox" 
                checked={rememberId} 
                onChange={(e) => setRememberId(e.target.checked)} 
              />
              <span>아이디 저장</span>
            </label>
            <span className="find-pw">비밀번호 찾기</span>
          </div>

          <button type="submit" className="login-main-btn">로그인</button>
        </form>
        <div className="divider-text">간편 로그인</div>

        <div className="social-login-group">
          <button className="social-btn google">
            <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="G" />
            Google로 계속하기
          </button>
          <button className="social-btn kakao">
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/KakaoTalk_logo.svg" alt="Kakao" />
            카카오로 계속하기
          </button>
        </div>

        <div className="login-footer">
          아직 회원이 아니신가요? <span onClick={() => navigate('/join')}>회원가입</span>
        </div>
      </div>
    </div>
  );
};

export default Login;