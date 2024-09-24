import React from 'react';
import MenuButton from './menu-button';

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
        label="Blog"
        onClick={() => setActiveSection('blog')}
        retro90sStyle={retro90sStyle}
      />
      <MenuButton
        label="todo nyc"
        onClick={() => setActiveSection('todo-nyc')}
        retro90sStyle={retro90sStyle}
      />
      <MenuButton
        label="Graffiti"
        onClick={() => setActiveSection('graffiti')}
        retro90sStyle={retro90sStyle}
      />
      <MenuButton
        label="how ai is used on this site"
        onClick={() => setActiveSection('ai-safety')}
        retro90sStyle={{
          ...retro90sStyle,
          border: '3px solid red',
          boxShadow: '0 0 10px red',
          transform: 'scale(1.05)',
          transition: 'all 0.3s ease-in-out'
        }}
      />
      <a href="https://forms.gle/kDMh3s8N7Q9fXhJj6" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
        <MenuButton
          label="Feedback"
          retro90sStyle={retro90sStyle}
        />
      </a>
    </div>
  );
};

export default NavigationButtons;
