import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/Join.css';

const Join = () => {

  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    loginId: '',
    password: '',
    name: '',
    email: '',
    address: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/api/members/join', formData);
      alert('회원가입 성공! 이제 로그인해 보세요.');

      navigate('/login'); // 가입 후 로그인 페이지로 이동
    } catch (error) {
      alert(error.response?.data || '가입 도중 오류가 발생했습니다.');
    }
  };

  return (
    <div id="JoinPage">
      <div className="join-container">
        <div className="join-header">
          <h2>Create Account</h2>
          <p>PokeArch의 멤버가 되어보세요</p>
        </div>

        <form onSubmit={handleSubmit} className="join-form">
          <div className="input-row">
            <div className="input-group">
              <label>아이디</label>
              <input name="loginId" placeholder="아이디" onChange={handleChange} required />
            </div>
            <div className="input-group">
              <label>이름</label>
              <input name="name" placeholder="실명 또는 닉네임" onChange={handleChange} required />
            </div>
          </div>

          <div className="input-group">
            <label>비밀번호</label>
            <input name="password" type="password" placeholder="비밀번호" onChange={handleChange} required />
          </div>

          <div className="input-group">
            <label>이메일</label>
            <input name="email" type="email" placeholder="example@email.com" onChange={handleChange} required />
          </div>

          <div className="input-group">
            <label>주소</label>
            <input name="address" placeholder="거주 지역 또는 주소" onChange={handleChange} required />
          </div>

          <button type="submit" className="join-main-btn">가입하기</button>
        </form>

        <div className="join-footer">
          이미 계정이 있으신가요? <span onClick={() => navigate('/login')}>로그인</span>
        </div>
      </div>
    </div>
  );
};

export default Join;