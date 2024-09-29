import React, { useState, useEffect } from 'react';
import './App.css';
import BlogPage from './components/BlogPage';
import HamburgerMenu from './components/HamburgerMenu';
import AISafetyPage from './components/AiSafetyPage';
import AiInterface from './services/AiInterface';
import FrontPage from './components/FrontPage';
import ChatbotPanel from './components/ChatbotPanel';

function App() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [activeSection, setActiveSection] = useState('blog');
  const [aiInterface, setAiInterface] = useState(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    const initializeApp = async () => {
      const aiInterfaceInstance = await AiInterface.create();
      setAiInterface(aiInterfaceInstance);
    };

    window.addEventListener('resize', handleResize);
    initializeApp();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!aiInterface) {
    return <div>Loading...</div>; // Or any loading indicator you prefer
  }

  const retro90sStyle = {
    fontFamily: '"Courier New", monospace',
    backgroundColor: '#D3D3D3',
    color: 'black',
    border: '2px solid #000000',
    borderRadius: '10px',
    padding: '10px',
  };

  return (
    <div className="App" style={{ ...retro90sStyle, display: 'flex', flexDirection: 'column', height: '100vh', position: 'relative' }}>
      <h1 style={{ textAlign: 'center', textShadow: '2px 2px #FF69B4', margin: '10px 0' }}>The Herald</h1>
      <h2 style={{ textAlign: 'center', textShadow: '2px 2px #FF69B4', margin: '10px 0' }}>The People's Paper!</h2>
      <HamburgerMenu setActiveSection={setActiveSection} retro90sStyle={retro90sStyle} />
      <div style={{ flex: 1, overflow: 'auto', padding: '20px' }}>
        {activeSection === 'front_page' && <FrontPage aiInterface={aiInterface} retro90sStyle={retro90sStyle} />}
        {activeSection === 'blog' && <BlogPage sectionName="blog" retro90sStyle={retro90sStyle} />}
        {activeSection === 'todo-nyc' && <BlogPage sectionName="todo nyc" retro90sStyle={retro90sStyle} />}
        {activeSection === 'graffiti' && <BlogPage sectionName="graffiti" retro90sStyle={retro90sStyle} />}
        {activeSection === 'ai-safety' && <AISafetyPage />}
      </div>
      {/* <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 1000 }}>
        <ChatbotPanel aiInterface={aiInterface} retro90sStyle={retro90sStyle} />
      </div> */}
    </div>
  );
}

export default App;
