// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Intro from './pages/Intro';       
import Home from './pages/Home'; 
import Result from './pages/Result';     

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Intro />} />     {/* 처음 들어왔을 때는 Intro 페이지 보여줌 */}
        <Route path="/home" element={<Home />} />  {/* 버튼 클릭 시 이동될 업로드 페이지 */}
        <Route path="/result" element={<Result />} /> {/* 탐지 결과 페이지 */}
      </Routes>
    </Router>
  );
}

export default App;
