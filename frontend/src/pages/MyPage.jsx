import React, { useState } from 'react';
import MyDeckList from './MyDeckList';
import ScrapList from './ScrapList';
import '../css/MyPage.css';

const MyPage = () => {
    const [activeTab, setActiveTab] = useState('my');

    return (
        <div className="recipe-board-container">
            <div className="board-header">
                <h1 className="board-title">마이페이지 👤</h1>
                <div className="tab-menu">
                    <button 
                        className={`tab-btn ${activeTab === 'my' ? 'active' : ''}`}
                        onClick={() => setActiveTab('my')}
                    >
                        내가 만든 덱
                    </button>
                    <button 
                        className={`tab-btn ${activeTab === 'scrap' ? 'active' : ''}`}
                        onClick={() => setActiveTab('scrap')}
                    >
                        스크랩한 덱
                    </button>
                </div>
            </div>

            <div className="tab-content">
                {activeTab === 'my' ? <MyDeckList /> : <ScrapList />}
            </div>
        </div>
    );
};

export default MyPage;