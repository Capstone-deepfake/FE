import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Intro.css';
import bgImage from '../assets/intro-background.png';

function Intro() {
  const navigate = useNavigate();

  return (
    <div className="intro-container">
      {/* 고정된 배경 이미지 */}
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

      {/* 어두운 오버레이 (조금만) */}
      <div className="overlay" />

      {/* 글리치 효과만 들어갈 영역 */}
      <div className="glitch-area-container">
        <div className="glitch-area" style={{ backgroundImage: `url(${bgImage})` }} />
      </div>

      {/* 메인 콘텐츠 */}
      <div className="intro-content">
        <h1>🔎 DE-fake it</h1>
        <p>
          본 시스템은 다양한 딥페이크 탐지 모델을 비교하여 정확한 판별을 제공합니다.<br />
          아래 표는 주요 모델의 정확도와 특성을 요약한 것입니다.
        </p>

        <table>
          <thead>
            <tr>
              <th>모델</th>
              <th>정확도</th>
              <th>특징</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>XceptionNet</td>
              <td>91%</td>
              <td>CNN 기반, 강력한 정확도</td>
            </tr>
            <tr>
              <td>MesoNet</td>
              <td>84%</td>
              <td>경량 모델, 실시간 처리에 적합</td>
            </tr>
            <tr>
              <td>EfficientNet</td>
              <td>88%</td>
              <td>최적화 구조, 속도/성능 균형</td>
            </tr>
          </tbody>
        </table>

        <button onClick={() => navigate('/home')}>Detect Now →</button>
      </div>
    </div>
  );
}

export default Intro;
