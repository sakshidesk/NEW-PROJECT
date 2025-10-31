import React from 'react';

interface CalculatorButtonProps {
  onClick: () => void;
  label: React.ReactNode;
  className?: string;
  gridSpan?: number;
  justify?: 'start' | 'center' | 'end';
}

const CalculatorButton: React.FC<CalculatorButtonProps> = ({ onClick, label, className = '', gridSpan = 1, justify = 'center' }) => {
  const spanClass = gridSpan === 2 ? 'col-span-2' : 'col-span-1';
  
  let justifyClass = `justify-${justify}`;
  if (justify === 'start') {
      justifyClass += ' pl-8'; // Add padding for left-aligned text
  }

  return (
    <button
      onClick={onClick}
      className={`flex items-center text-3xl h-20 
                 active:bg-gray-200/75 transition-colors duration-100
                 font-light
                 ${spanClass} ${justifyClass} ${className}`}
    >
      {label}
    </button>
  );
};

export default CalculatorButton;
