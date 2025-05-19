import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

function Result() {
  const BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const location = useLocation();
  const navigate = useNavigate();
  const { fileUrl, result, confidence, explanation } = location.state || {};

  const [displayedExplanation, setDisplayedExplanation] = useState("");
  const [index, setIndex] = useState(0);
  const cleanedExplanation = explanation?.replace('undefined', '').trim() || "";

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

  const resultColor = result === "Fake" ? 'red' : 'green';

  return (
    <div>
      {/* 상단 고정 바 - Home.jsx와 동일하게 유지 */}
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
            transition: 'all 0.3s',
            marginRight: '40px'
          }}
        >
          🏠 Home
        </motion.button>
      </div>

      {/* 본문 내용 */}
      <div style={{
        marginTop: '120px',
        padding: '40px',
        textAlign: 'center',
        fontSize: '1.4rem'
      }}>
        {/* 영상 */}
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

        {/* 결과 내용 */}
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
