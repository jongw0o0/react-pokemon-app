import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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
      // 백엔드 컨트롤러 경로와 일치해야 합니다.
      const response = await axios.post('http://localhost:8000/api/members/join', formData);
      alert('회원가입 성공! 이제 로그인해 보세요.');

      navigate('/login'); // 가입 후 로그인 페이지로 이동
    } catch (error) {
      // 백엔드 Service에서 던진 "already used" 메시지가 여기 찍힙니다.
      alert(error.response?.data || '가입 도중 오류가 발생했습니다.');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>회원가입</h2>
      <form onSubmit={handleSubmit}>
        <input name="loginId" placeholder="아이디" onChange={handleChange} required /><br/>
        <input name="password" type="password" placeholder="비밀번호" onChange={handleChange} required /><br/>
        <input name="name" placeholder="이름" onChange={handleChange} required /><br/>
        <input name="email" type="email" placeholder="이메일" onChange={handleChange} required /><br/>
        <input name="address" placeholder="주소" onChange={handleChange} required /><br/>
        <button type="submit">가입하기</button>
      </form>
    </div>
  );
};

export default Join;