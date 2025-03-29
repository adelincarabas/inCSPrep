import React from 'react';

const MenuButton: React.FC<{ text: string }> = ({ text }) => {
  const handleClick = (event: any) => {
    console.log('Button clicked!', event);
    console.log(text)
  };

  return (
    <button onClick={handleClick}>
      {text}
    </button>
  );
};

export default MenuButton;