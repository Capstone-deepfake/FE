import React, { useEffect, useState, useRef } from 'react';
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
  
  // Chat state
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [displayedResponse, setDisplayedResponse] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const responseQueueRef = useRef([]);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);

  // Chat functions
  const handleSendMessage = async () => {
    if (!chatMessage.trim()) return;

    const userMessage = chatMessage.trim();
    setChatMessage("");
    setIsLoading(true);

    // Add user message to chat history
    setChatHistory(prev => [...prev, { role: 'user', content: userMessage }]);

    try {
      const response = await fetch(`${BASE_URL}/api/chat/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          context: {
            result,
            confidence,
            video_url: `${BASE_URL}${fileUrl}`
          }
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Add AI response to chat history
        setChatHistory(prev => [...prev, { 
          role: 'assistant', 
          content: data.response,
          displayedContent: '',
          id: Date.now()
        }]);
        
        // Start character animation
        setCurrentCharIndex(0);
        setIsTyping(true);
      } else {
        console.error('Chat error:', data.error);
        setChatHistory(prev => [...prev, { 
          role: 'assistant', 
          content: '죄송합니다. 응답을 생성하는 중에 오류가 발생했습니다. 🙇‍♂️',
          displayedContent: '죄송합니다. 응답을 생성하는 중에 오류가 발생했습니다. 🙇‍♂️'
        }]);
      }
    } catch (error) {
      console.error('Chat error:', error);
      setChatHistory(prev => [...prev, { 
        role: 'assistant', 
        content: '죄송합니다. 서버와 통신하는 중에 오류가 발생했습니다. 🔧',
        displayedContent: '죄송합니다. 서버와 통신하는 중에 오류가 발생했습니다. 🔧'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Character animation effect
  useEffect(() => {
    if (isTyping && chatHistory.length > 0) {
      const lastMessage = chatHistory[chatHistory.length - 1];
      if (lastMessage.role === 'assistant' && currentCharIndex < lastMessage.content.length) {
        const timer = setTimeout(() => {
          setChatHistory(prev => {
            const updated = [...prev];
            const lastMsg = updated[updated.length - 1];
            lastMsg.displayedContent = lastMsg.content.slice(0, currentCharIndex + 1);
            return updated;
          });
          setCurrentCharIndex(prev => prev + 1);
        }, 30); // Adjust speed here (lower = faster)
        
        return () => clearTimeout(timer);
      } else if (currentCharIndex >= lastMessage.content.length) {
        setIsTyping(false);
      }
    }
  }, [isTyping, currentCharIndex, chatHistory]);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

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

          {/* Chat Interface */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            style={{
              marginTop: '40px',
              padding: '30px',
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              border: '1px solid #e0e0e0'
            }}
          >
            <h3 style={{ 
              marginBottom: '25px', 
              color: '#2c3e50',
              fontSize: '1.8rem',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              justifyContent: 'center'
            }}>
              <span role="img" aria-label="robot">🤖</span> 
              AI 전문가와 대화하기
              <span role="img" aria-label="sparkles">✨</span>
            </h3>
            
            {/* Chat History */}
            <div style={{
              maxHeight: '400px',
              overflowY: 'auto',
              marginBottom: '25px',
              padding: '20px',
              backgroundColor: '#f8f9fa',
              borderRadius: '15px',
              textAlign: 'left',
              border: '1px solid #e9ecef'
            }}>
              {chatHistory.length === 0 && (
                <div style={{
                  textAlign: 'center',
                  color: '#6c757d',
                  padding: '40px 20px',
                  fontSize: '1.1rem'
                }}>
                  <div style={{ fontSize: '2rem', marginBottom: '15px' }}>👋</div>
                  딥페이크 탐지 결과에 대해 궁금한 점을 물어보세요!
                </div>
              )}
              {chatHistory.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    marginBottom: '15px',
                    display: 'flex',
                    flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                    alignItems: 'flex-start',
                    gap: '10px'
                  }}
                >
                  <div style={{
                    width: '35px',
                    height: '35px',
                    borderRadius: '50%',
                    backgroundColor: msg.role === 'user' ? '#1976d2' : '#2ecc71',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '1.2rem'
                  }}>
                    {msg.role === 'user' ? '👤' : '🤖'}
                  </div>
                  <div style={{
                    backgroundColor: msg.role === 'user' ? '#e3f2fd' : '#ffffff',
                    padding: '12px 16px',
                    borderRadius: '15px',
                    maxWidth: '70%',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                    border: '1px solid ' + (msg.role === 'user' ? '#bbdefb' : '#e0e0e0'),
                    fontSize: '1rem',
                    lineHeight: '1.5',
                    whiteSpace: 'pre-wrap'
                  }}>
                    {msg.role === 'assistant' && idx === chatHistory.length - 1 && isTyping ? (
                      <>
                        {msg.displayedContent}
                        <span style={{ 
                          display: 'inline-block',
                          width: '2px',
                          height: '1em',
                          backgroundColor: '#000',
                          verticalAlign: 'middle',
                          marginLeft: '2px',
                          animation: 'blink 1s infinite'
                        }}>|</span>
                      </>
                    ) : (
                      msg.content
                    )}
                  </div>
                </motion.div>
              ))}
              {isLoading && !isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{
                    textAlign: 'center',
                    padding: '15px',
                    color: '#666',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  <span role="img" aria-label="thinking">🤔</span>
                  <span>생각하는 중...</span>
                </motion.div>
              )}
            </div>

            {/* Add blinking cursor animation */}
            <style>
              {`
                @keyframes blink {
                  0%, 100% { opacity: 1; }
                  50% { opacity: 0; }
                }
              `}
            </style>

            {/* Chat Input */}
            <div style={{
              display: 'flex',
              gap: '12px',
              position: 'relative'
            }}>
              <textarea
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="질문을 입력하세요... (Enter를 누르면 전송됩니다) 💭"
                style={{
                  flex: 1,
                  padding: '15px',
                  paddingRight: '50px',
                  borderRadius: '12px',
                  border: '2px solid #e0e0e0',
                  resize: 'none',
                  height: '50px',
                  fontFamily: 'inherit',
                  fontSize: '1rem',
                  transition: 'border-color 0.3s ease',
                  ':focus': {
                    borderColor: '#1976d2',
                    outline: 'none'
                  }
                }}
              />
              <motion.button
                onClick={handleSendMessage}
                disabled={isLoading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  padding: '0 25px',
                  backgroundColor: '#1976d2',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  height: '50px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'background-color 0.3s ease'
                }}
              >
                전송 <span role="img" aria-label="send">📨</span>
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default Result;
