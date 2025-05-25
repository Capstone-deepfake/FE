import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './Intro.css';
import bgImage from '../assets/intro-background.png';

function Result() {
  const BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const location = useLocation();
  const navigate = useNavigate();
  const { fileUrl, result, confidence, explanation } = location.state || {};

  const [displayedExplanation, setDisplayedExplanation] = useState("");
  const [index, setIndex] = useState(0);
  const cleanedExplanation = explanation?.replace('undefined', '').trim() || "";
  const [showAbout, setShowAbout] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      if (index < cleanedExplanation.length) {
        setDisplayedExplanation((prev) => prev + cleanedExplanation[index]);
        setIndex((prev) => prev + 1);
      } else {
        clearInterval(timer);
      }
    }, 90);
    return () => clearInterval(timer);
  }, [index, cleanedExplanation]);

  useEffect(() => {
    document.body.style.overflow = showAbout ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showAbout]);

  const resultColor = result === "Fake" ? 'red' : 'green';

  return (
    <div style={{ minHeight: '100vh', paddingTop: '120px', overflowY: 'auto' }}>
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        zIndex: 1000,
        backgroundColor: '#282c34',
        padding: '20px',
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <motion.h2
          onClick={() => navigate('/')}
          style={{ margin: 0, cursor: 'pointer' }}
          whileHover={{ scale: 1.05, color: '#61dafb' }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          DE-fake it
        </motion.h2>

        <div style={{ display: 'flex', gap: '10px', marginRight: '40px' }}>
          <motion.button
            onClick={() => setShowAbout(true)}
            whileHover={{ scale: 1.05, backgroundColor: '#ffffff22' }}
            style={{
              backgroundColor: 'transparent',
              border: '1px solid white',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '5px',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
          >
            About Us
          </motion.button>

          <motion.button
            onClick={() => navigate('/')}
            whileHover={{ scale: 1.05, backgroundColor: '#ffffff22' }}
            style={{
              backgroundColor: 'transparent',
              border: '1px solid white',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '5px',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
          >
            🏠 Home
          </motion.button>
        </div>
      </div>

      {showAbout && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          zIndex: 1500,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }} onClick={() => setShowAbout(false)}>
          <div style={{
            position: 'relative',
            width: '95%',
            maxWidth: '960px',
            maxHeight: '90vh',
            overflowY: 'auto',
            backgroundColor: '#f0f0f0',
            color: '#000',
            padding: '30px 20px',
            borderRadius: '20px',
            zIndex: 2000,
            boxShadow: '0 0 20px rgba(0,0,0,0.5)'
          }} onClick={(e) => e.stopPropagation()}>
            <div
              style={{
                position: 'absolute',
                top: '12px',
                right: '16px',
                fontSize: '24px',
                color: '#666',
                cursor: 'pointer',
                transition: 'color 0.2s ease'
              }}
              onMouseEnter={e => e.target.style.color = '#000'}
              onMouseLeave={e => e.target.style.color = '#666'}
              onClick={() => setShowAbout(false)}
            >
              ✖
            </div>
            <div style={{ maxWidth: '900px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
              <h1>🔎 <span style={{ color: '#000' }}>DE-fake it</span></h1>
              <p>
                본 시스템은 다양한 딥페이크 탐지 모델을 비교하여 정확한 판별을 제공합니다.<br />
                아래 표는 주요 모델의 정확도와 특성을 요약한 것입니다.
              </p>
              <table>
                <thead>
                  <tr>
                    <th></th>
                    <th>XceptionNet</th>
                    <th>MesoNet</th>
                    <th>EfficientNet</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>정확도</td>
                    <td>91%</td>
                    <td>84%</td>
                    <td>88%</td>
                  </tr>
                  <tr>
                    <td>특징</td>
                    <td>CNN 기반, 강력한 정확도</td>
                    <td>경량 모델, 실시간 처리에 적합</td>
                    <td>최적화 구조, 속도/성능 균형</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      <div style={{ padding: '40px', textAlign: 'center', fontSize: '1.4rem' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          style={{ marginBottom: '40px' }}
        >
          <video autoPlay muted controls width="720">
            <source src={`${BASE_URL}${fileUrl}`} type="video/mp4" />
            브라우저가 video 태그를 지원하지 않습니다.
          </video>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          style={{ maxWidth: '900px', margin: '0 auto' }}
        >
          <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
            딥페이크 판별 결과
          </motion.h2>

          <motion.p style={{ fontWeight: 'bold', fontSize: '1.4rem', margin: '8px 0' }}>
            결과: <span style={{ color: resultColor }}>{result}</span>
          </motion.p>

          <motion.p style={{ fontWeight: 'bold', fontSize: '1.4rem', margin: '8px 0' }}>
            신뢰도: <span style={{ fontWeight: '900' }}>{Number(confidence).toFixed(1)}%</span>
          </motion.p>

          <motion.p style={{ fontWeight: 'bold', fontSize: '1.4rem', display: 'inline-block', margin: '8px 0' }}>
            설명:&nbsp;
          </motion.p>
          <motion.span style={{ fontSize: '1.4rem' }}>
            {displayedExplanation}
          </motion.span>
        </motion.div>
      </div>
    </div>
  );
}

export default Result;
