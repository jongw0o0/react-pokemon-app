import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // 로그인 성공 후 페이지 이동을 위해 필요

const Login = () => {
  const [loginData, setLoginData] = useState({
    loginId: '',
    password: ''
  });
  
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
      // 아까 Join과 마찬가지로 DTO 필드명(loginId, password)을 맞춰줍니다.
      const response = await axios.post('http://localhost:8000/api/members/login', loginData, {withCredentials: true }); // 중요! 세션 쿠키를 주고받기 위해 설정

      localStorage.setItem("userName", response.data); // "이종우님" 저장
      alert(response.data); // "이종우님 환영합니다!" 메시지 출력
      
    //   navigate('/'); // 로그인 성공 시 메인 페이지로 이동
        window.location.href = '/'; // 페이지 새로고침과 함께 메인 페이지로 이동
    } catch (error) {
      console.error('로그인 실패:', error.response?.data);
      alert(error.response?.data || '아이디 또는 비밀번호를 확인해주세요.');
    }
    
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label>ID:</label>
          <input 
            type="text" 
            name="loginId" 
            value={loginData.loginId} 
            onChange={handleChange} 
            style={{ width: '100%' }}
            required 
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Password:</label>
          <input 
            type="password" 
            name="password" 
            value={loginData.password} 
            onChange={handleChange} 
            style={{ width: '100%' }}
            required 
          />
        </div>
        <div>
            <ul>
                <li><button type="submit" style={{ width: '100%', padding: '10px' }}>로그인</button></li>
                <li><button type="button" style={{ width: '100%', padding: '10px' }} onClick={() => navigate('/join')}>회원가입</button></li>
            </ul>
        </div>
      </form>
    </div>
  );
};

export default Login;