import React from 'react';
import MenuButton from './MenuButton';

const NavigationButtons = ({ setActiveSection, retro90sStyle }) => {
  const containerStyle = {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: '10px',
    padding: '10px',
    backgroundColor: '#D3D3D3',
    borderBottom: '2px solid #000000',
  };

  return (
    <div style={containerStyle}>
      <MenuButton
        label={<strong><b>Front Page</b></strong>}
        onClick={() => setActiveSection('front_page')}
        retro90sStyle={{
          ...retro90sStyle,
          backgroundColor: '#32CD32', // Lime green background
          color: '#FFFFFF', // White text
          border: '3px solid #006400', // Dark green border
          boxShadow: '0 0 10px #32CD32, 0 0 20px #006400', // Green glow
          transform: 'scale(1.08)', // Slightly larger
          transition: 'all 0.3s ease-in-out',
          animation: 'pulse 2.5s infinite', // Pulsing animation
        }}
      />
      <MenuButton
        label={<strong><b>Blog</b></strong>}
        onClick={() => setActiveSection('blog')}
        retro90sStyle={retro90sStyle}
      />
      <MenuButton
        label={<strong><b>todo nyc</b></strong>}
        onClick={() => setActiveSection('todo-nyc')}
        retro90sStyle={retro90sStyle}
      />
      <MenuButton
        label={<strong><b>Graffiti</b></strong>}
        onClick={() => setActiveSection('graffiti')}
        retro90sStyle={retro90sStyle}
      />
      <MenuButton
        label={<strong>How this website works</strong>}
        onClick={() => setActiveSection('ai-safety')}
        retro90sStyle={{
          ...retro90sStyle,
          border: '3px solid red',
          boxShadow: '0 0 10px red',
          transform: 'scale(1.05)',
          transition: 'all 0.3s ease-in-out'
        }}
      />
      <MenuButton
        label={<strong><b>Chatbot</b></strong>}
        onClick={() => setActiveSection('chatbot')}
        retro90sStyle={{
          ...retro90sStyle,
          backgroundColor: '#FF69B4', // Hot pink background
          color: '#000000', // Black text
          border: '3px solid #FF1493', // Deep pink border
          boxShadow: '0 0 10px #FF69B4, 0 0 20px #FF1493', // Pink glow
          transform: 'scale(1.05)',
          transition: 'all 0.3s ease-in-out'
        }}
      />
      <a href="https://forms.gle/kDMh3s8N7Q9fXhJj6" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
        <MenuButton
          label={<strong>Feedback</strong>}
          retro90sStyle={{
            ...retro90sStyle,
            color: 'black',
            fontWeight: 'bold',
            border: '3px solid #0080FF',
            boxShadow: '0 0 10px #00BFFF',
            transform: 'scale(1.05)',
            transition: 'all 0.3s ease-in-out'
          }}
        />
      </a>
    </div>
  );
};

export default NavigationButtons;
