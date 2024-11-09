import React, { useRef, useState, ReactNode } from 'react';

interface HighlightProps {
  children: ReactNode;
}

const Highlight: React.FC<HighlightProps> = ({ children }) => {
  const elementRef = useRef<HTMLDivElement | null>(null);
  const [bgColor, setBgColor] = useState<string | undefined>(undefined);

  const onMouseEnter = () => {
    setBgColor('yellow');
  };

  const onMouseLeave = () => {
    setBgColor(undefined);  // Usamos `undefined` en lugar de `null`
  };

  return (
    <div
      ref={elementRef}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{ backgroundColor: bgColor ?? '' }}  // Usa un valor vacío si bgColor es undefined
    >
      {children}
    </div>
  );
};

export default Highlight;
