import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Typewriter } from 'react-simple-typewriter';
import magnifier from '../assets/magnifier.png'; // 돋보기 이미지

const transition = { duration: 0.6 };

function Home() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleDetect = async () => {
    if (!file) {
      alert("⚠️ 파일을 선택해주세요!");
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setLoading(true);
    setError("");

    const BASE_URL = process.env.REACT_APP_API_BASE_URL;

    try {
      const response = await fetch(`${BASE_URL}/api/upload/`, {
        method: 'POST',
        body: formData,
      });


      const data = await response.json();

      if (response.ok) {
        navigate('/result', {
          state: {
            fileUrl: data.file_url,
            result: data.result,
            confidence: data.confidence,
            explanation: data.explanation
          }
        });
      } else {
        alert('❌ 파일 업로드 실패');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      setError("서버 요청 중 오류 발생");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* 상단 고정 바 */}
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
          onClick={() => window.location.reload()}
          style={{ margin: 0, cursor: 'pointer' }}
          whileHover={{ scale: 1.05, color: '#61dafb' }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          DE-fake it
        </motion.h2>
      </div>

      {/* 본문 */}
      <div style={{
        marginTop: '120px',
        height: 'calc(100vh - 120px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px'
      }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={transition}
          style={{
            display: 'flex',
            gap: '100px',
            alignItems: 'center',
            flexWrap: 'wrap',
            justifyContent: 'center'
          }}
        >
          {/* 왼쪽 설명 */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={transition}
            style={{
              maxWidth: '500px',
              fontSize: '1.25rem',
              lineHeight: '1.6',
              position: 'relative',
              padding: '20px',
              minHeight: '180px'
            }}
          >
            <img
              src={magnifier}
              alt="돋보기"
              style={{
                position: 'absolute',
                top: '-260px',
                left: '-570px',
                width: '1200px',
                height: '1200px',
                opacity: 0.9,
                zIndex: 0
              }}
            />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <h1 style={{ fontWeight: 'bold', fontSize: '2rem', marginBottom: '20px' }}>
                단순 판별은 그만,<br />“왜” 그런지도 함께 확인하세요!
              </h1>
              <Typewriter
                words={['AI가 딥페이크 여부와 그 근거를 함께 보여줍니다.']}
                loop={1}
                typeSpeed={50}
                deleteSpeed={0}
                delaySpeed={1000}
              />
            </div>
          </motion.div>

          {/* 오른쪽 업로드 박스 */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={transition}
            style={{
              border: '1px solid lightgray',
              padding: '60px',
              borderRadius: '12px',
              minWidth: '420px',
              textAlign: 'center',
              boxShadow: '0 0 10px rgba(0,0,0,0.1)',
              marginLeft: '100px'
            }}
          >
            <input
              type="file"
              accept="video/*,audio/*"
              onChange={handleFileChange}
              disabled={loading}
              style={{ width: '100%', marginBottom: '30px', fontSize: '1rem' }}
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDetect}
              disabled={loading}
              style={{
                backgroundColor: loading ? 'gray' : '#007bff',
                color: 'white',
                border: 'none',
                padding: '14px 28px',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '1.1rem'
              }}
            >
              {loading ? "분석 중..." : "Detect Now"}
            </motion.button>

            {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default Home;
