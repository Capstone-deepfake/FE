// Home.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Typewriter } from 'react-simple-typewriter';

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

    try {
      const response = await fetch('http://127.0.0.1:8000/api/upload/', {
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
      {/* 상단 바 */}
      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        style={{ backgroundColor: '#282c34', padding: '20px', color: 'white' }}
      >
        <h2 style={{ margin: 0 }}>DE-fake it</h2>
      </motion.div>

      {/* 본문 */}
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', height: 'calc(100vh - 80px)'
      }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={transition}
          style={{ display: 'flex', gap: '100px', alignItems: 'center', paddingTop: '40px' }}
        >
          {/* 왼쪽 설명 */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={transition}
            style={{ maxWidth: '500px', fontSize: '1.25rem', lineHeight: '1.6' }}
          >
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
              minWidth: '520px',
              textAlign: 'center',
              boxShadow: '0 0 10px rgba(0,0,0,0.1)'
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
