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
        label={<strong>how ai is used on this site</strong>}
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
          label={<strong>Feedback</strong>}
          retro90sStyle={{
            ...retro90sStyle,
            // backgroundColor: '#00BFFF', // Bright blue color
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
