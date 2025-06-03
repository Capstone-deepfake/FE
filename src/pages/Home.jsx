import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Typewriter } from 'react-simple-typewriter';
import searching from '../assets/searching.png';
import bgImage from '../assets/intro-background.png';

const transition = { duration: 0.6 };

function Home() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showAbout, setShowAbout] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.overflow = showAbout ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showAbout]);

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
      {/* 상단 바 */}
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

      {/* About 팝업 */}
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
            <div style={{
              maxWidth: '900px',
              margin: '0 auto',
              position: 'relative',
              zIndex: 2
            }}>
              <h1>🔎 <span style={{ color: '#000' }}>DE-fake it</span></h1>
              <p>
                본 시스템은 FaceForensics++와 DFDC 데이터셋을 기반으로 다양한 딥페이크 탐지 모델을 비교 분석하고,<br />
                최종적으로 ResNeXt50과 MesoNet을 선정해 신뢰성 높은 탐지 결과를 제공합니다.<br />
                아래 표는 모델들의 정확도와 특성을 요약한 것입니다.
              </p>
              <table style={{
                width: '100%',
                textAlign: 'center',
                lineHeight: '1.6',
                borderCollapse: 'collapse'
              }}>
                <thead>
                  <tr>
                    <th style={{ padding: '12px' }}></th>
                    <th style={{ padding: '12px' }}>ResNeXt50</th>
                    <th style={{ padding: '12px' }}>MesoNet</th>
                    <th style={{ padding: '12px' }}>EfficientNet-B0</th>
                    <th style={{ padding: '12px' }}>Xception</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ padding: '12px' }}>정확도</td>
                    <td style={{ padding: '12px', fontWeight: 'bold', color: 'blue' }}>92%</td> {/* ResNeXt50 */}
                    <td style={{ padding: '12px', fontWeight: 'bold', color: 'blue' }}>91%</td>  {/* MesoNet */}
                    <td style={{ padding: '12px' }}>89%</td> {/* EfficientNet-B0 */}
                    <td style={{ padding: '12px' }}>89%</td> {/* Xception */}
                  </tr>
                  <tr>
                    <td style={{ padding: '12px' }}>특성</td>
                    <td style={{ padding: '12px' }}>고성능 CNN 구조,<br />복잡한 패턴 탐지</td>
                    <td style={{ padding: '12px' }}>경량 모델,<br />실시간 처리 최적화</td>
                    <td style={{ padding: '12px' }}>효율적 구조,<br />연산량 대비 높은 정확도</td>
                    <td style={{ padding: '12px' }}>깊은 네트워크,<br />강력한 특징 추출</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

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
                * 업로드할 수 있는 영상 크기는 10MB 이하만 가능합니다!
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
