import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Typewriter } from 'react-simple-typewriter';
import searching from '../assets/searching.png';

const transition = { duration: 0.6 };

function Home() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    const maxSizeMB = 100;
    const maxSizeBytes = maxSizeMB * 1024 * 1024;

    if (selectedFile.size > maxSizeBytes) {
      setError(`❌ 파일 크기는 ${maxSizeMB}MB 이하만 업로드할 수 있습니다.`);
      setFile(null);
      return;
    }

    setError("");
    setFile(selectedFile);
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
      // ✅ [테스트용 지연] 로딩바 확인용. 실제 배포 시 반드시 제거할 것!
      await new Promise(resolve => setTimeout(resolve, 3000));

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

      {/* 본문 */}
      <div style={{
        marginTop: '60px',
        minHeight: 'calc(100vh - 120px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px',
        position: 'relative'
      }}>
        <img
          src={searching}
          alt="탐지하는 사람"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: 0.5,
            zIndex: 0
          }}
        />

        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            style={{
              textAlign: 'center',
              padding: '80px',
              backgroundColor: 'rgba(255,255,255,0.9)',
              borderRadius: '12px',
              zIndex: 2
            }}
          >
            <div style={{
              border: '6px solid #eee',
              borderTop: '6px solid #007bff',
              borderRadius: '50%',
              width: '48px',
              height: '48px',
              animation: 'spin 1s linear infinite',
              margin: '0 auto'
            }} />
            <p style={{ marginTop: '20px', fontSize: '1.1rem' }}>
              딥페이크 분석 중입니다... 잠시만 기다려주세요 🙏
            </p>
          </motion.div>
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={transition}
              style={{
                textAlign: 'center',
                maxWidth: '600px',
                marginBottom: '40px',
                position: 'relative',
                zIndex: 1
              }}
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

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={transition}
              style={{
                border: '1px solid lightgray',
                padding: '40px',
                borderRadius: '12px',
                width: '360px',
                textAlign: 'center',
                boxShadow: '0 0 10px rgba(0,0,0,0.1)',
                backgroundColor: 'white',
                position: 'relative',
                zIndex: 1
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
                Detect Now
              </motion.button>

              <p style={{ fontSize: '0.85rem', color: 'red', marginTop: '12px' }}>
                * 업로드할 수 있는 영상 크기는 100MB 이하만 가능합니다!
              </p>

              {error && <p style={{ color: 'red', marginTop: '6px' }}>{error}</p>}
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}

export default Home;
