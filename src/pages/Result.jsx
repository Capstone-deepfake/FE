import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

function Result() {
  const location = useLocation();
  const navigate = useNavigate();
  const { fileUrl, result, confidence, explanation } = location.state || {};

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div>
      {/* 상단바 */}
      <div style={{
        backgroundColor: '#282c34',
        padding: '20px',
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <motion.h2
          onClick={handleGoHome}
          style={{ margin: 0, cursor: 'pointer' }}
          whileHover={{ scale: 1.05, color: '#61dafb' }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          DE-fake it
        </motion.h2>

        <motion.button
          onClick={handleGoHome}
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

      {/* 본문 영역 */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px',
        gap: '20px'
      }}>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <video controls width="600">
            <source src={`http://127.0.0.1:8000${fileUrl}`} type="video/mp4" />
            브라우저가 video 태그를 지원하지 않습니다.
          </video>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          style={{
            border: '1px solid #ccc',
            borderRadius: '10px',
            padding: '20px',
            maxWidth: '600px',
            backgroundColor: '#f9f9f9'
          }}
        >
          <motion.h3
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            딥페이크 판별 결과
          </motion.h3>

          {/* result 등이 없을 때 대체 문구로 처리 */}
          <motion.p transition={{ delay: 0.7 }}>
            <strong>결과:</strong> {result || '분석 결과 없음'}
          </motion.p>
          <motion.p transition={{ delay: 0.8 }}>
            <strong>신뢰도:</strong> {confidence !== undefined ? `${confidence}%` : '데이터 없음'}
          </motion.p>
          <motion.p transition={{ delay: 0.9 }}>
            <strong>설명:</strong> {explanation || '설명 정보 없음'}
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}

export default Result;
