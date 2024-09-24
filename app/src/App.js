import React, { useState, useEffect } from 'react';
import './App.css';
import BlogPage from './components/blog_page';
import HamburgerMenu from './components/hamburger-menu';
import ChatbotPanel from './components/chatbot-panel';
import AISafetyPage from './components/ai-safety-page';
import ChatbotWrapper from './services/chatbot';

// Create a global instance of ChatbotWrapper
export const globalChatbot = new ChatbotWrapper();

function App() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [activeSection, setActiveSection] = useState('blog');

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const retro90sStyle = {
    fontFamily: '"Courier New", monospace',
    backgroundColor: '#D3D3D3',
    color: 'black',
    border: '2px solid #000000',
    borderRadius: '10px',
    padding: '10px',
  };

  return (
    <div className="App" style={{ ...retro90sStyle, display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <h1 style={{ textAlign: 'center', textShadow: '2px 2px #FF69B4', margin: '10px 0' }}>The Herald</h1>
      <h2 style={{ textAlign: 'center', textShadow: '2px 2px #FF69B4', margin: '10px 0' }}>The People's Paper!</h2>
      <HamburgerMenu setActiveSection={setActiveSection} retro90sStyle={retro90sStyle} />
      <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', flex: 1, overflow: 'hidden' }}>
        {activeSection === 'blog' && (
          <div className="posts-section" style={{ width: '100%', overflowY: 'auto', padding: '20px' }}>
            <BlogPage sectionName="blog" retro90sStyle={retro90sStyle} />
          </div>  
        )}
        {activeSection === 'todo-nyc' && (
          <div className="todo-nyc-section" style={{ width: '100%', overflowY: 'auto', padding: '20px' }}>
            <BlogPage sectionName="todo nyc" retro90sStyle={retro90sStyle} />
          </div>
        )}
        {activeSection === 'graffiti' && (
          <div className="graffiti-section" style={{ width: '100%', overflowY: 'auto', padding: '20px' }}>
            <BlogPage sectionName="graffiti" retro90sStyle={retro90sStyle} />
          </div>
        )}
        {activeSection === 'ai-safety' && (
          <div className="markdown-section" style={{ width: '100%', overflowY: 'auto', padding: '20px' }}>
            <AISafetyPage />
          </div>
        )}
        <ChatbotPanel retro90sStyle={retro90sStyle} chatbot={globalChatbot} />
      </div>
    </div>
  );
}

export default App;
