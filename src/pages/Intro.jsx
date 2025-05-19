import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Intro.css';
import bgImage from '../assets/intro-background.png';

function Intro() {
  const navigate = useNavigate();

  return (
    <div className="intro-container" style={{ color: 'black' }}>
      {/* 배경 */}
      <div
        className="background-layer"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          opacity: 1,
          zIndex: 0
        }}
      />

      {/* 오버레이 */}
      <div className="overlay" />

      {/* 글리치 영역 */}
      <div className="glitch-area-container">
        <div className="glitch-area" style={{ backgroundImage: `url(${bgImage})` }} />
      </div>

      {/* 메인 콘텐츠 */}
      <div className="intro-content">
        <h1>🔎 <span style={{ color: 'black' }}>DE-fake it</span></h1>
        <p>
          본 시스템은 다양한 딥페이크 탐지 모델을 비교하여 정확한 판별을 제공합니다.<br />
          아래 표는 주요 모델의 정확도와 특성을 요약한 것입니다.
        </p>

        {/* 행/열 바꾼 표 + 테두리 추가 */}
        <table
          style={{
            backgroundColor: 'rgba(255,255,255,0.9)',
            color: 'black',
            borderCollapse: 'collapse',
            margin: '0 auto 40px',
            fontSize: '1rem'
          }}
        >
          <thead>
            <tr>
              <th style={cellStyle}></th>
              <th style={cellStyle}>XceptionNet</th>
              <th style={cellStyle}>MesoNet</th>
              <th style={cellStyle}>EfficientNet</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={cellStyle}>정확도</td>
              <td style={cellStyle}>91%</td>
              <td style={cellStyle}>84%</td>
              <td style={cellStyle}>88%</td>
            </tr>
            <tr>
              <td style={cellStyle}>특징</td>
              <td style={cellStyle}>CNN 기반, 강력한 정확도</td>
              <td style={cellStyle}>경량 모델, 실시간 처리에 적합</td>
              <td style={cellStyle}>최적화 구조, 속도/성능 균형</td>
            </tr>
          </tbody>
        </table>

        <button onClick={() => navigate('/home')}>Detect Now →</button>
      </div>
    </div>
  );
}

// 🔽 셀 공통 스타일
const cellStyle = {
  border: '1px solid #ccc',
  padding: '12px 20px',
  textAlign: 'center'
};

export default Intro;
