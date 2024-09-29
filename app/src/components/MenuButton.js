import React from 'react';

const MenuButton = ({ label, onClick, retro90sStyle }) => {
  const buttonStyle = {
    ...retro90sStyle,
    cursor: 'pointer',
    display: 'block',
    width: '250px',
    marginBottom: '5px',
    marginLeft: '20px',
  };

  return (
    <button onClick={onClick} style={buttonStyle}>
      {label}
    </button>
  );
};

export default MenuButton;