import React from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/Home.page';
import { CodePage } from './pages/Code.page';
import { NotFoundPage } from './pages/NotFound.page';
import { Navbar } from './components/navbar/Navbar';

function App() {
  console.log('App render');
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/code/:roomId" element={<CodePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
}

export default App;
