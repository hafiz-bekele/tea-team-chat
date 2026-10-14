import React, { useEffect, useState } from 'react';

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [trailingPos, setTrailingPos] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only enable custom cursor on devices that support fine pointer (mouse)
    const mediaQuery = window.matchMedia('(pointer: fine)');
    if (!mediaQuery.matches) return;

    let targetX = -100;
    let targetY = -100;
    let currentX = -100;
    let currentY = -100;
    let animationFrameId;

    const handleMouseMove = (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseDown = () => setIsClicked(true);
    const handleMouseUp = () => setIsClicked(false);

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    // Smooth trailing animation loop
    const render = () => {
      const ease = 0.18;
      currentX += (targetX - currentX) * ease;
      currentY += (targetY - currentY) * ease;
      setTrailingPos({ x: currentX, y: currentY });
      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    // Check for interactive element hovering
    const handleMouseOver = (e) => {
      const target = e.target;
      const isInteractive = target.closest('button, a, input, textarea, select, [role="button"], .clickable, .glass-card, .interactive-hover');
      setIsHovered(!!isInteractive);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <>
      {/* Outer translucent trailing glass halo */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          pointerEvents: 'none',
          zIndex: 99999,
          width: isHovered ? 48 : isClicked ? 28 : 36,
          height: isHovered ? 48 : isClicked ? 28 : 36,
          borderRadius: '50%',
          transform: `translate3d(${trailingPos.x}px, ${trailingPos.y}px, 0) translate(-50%, -50%)`,
          backgroundColor: isHovered ? 'rgba(245, 166, 35, 0.22)' : 'rgba(245, 166, 35, 0.12)',
          border: isHovered ? '2px solid rgba(245, 166, 35, 0.85)' : '1.5px solid rgba(245, 166, 35, 0.55)',
          backdropFilter: 'blur(3px)',
          WebkitBackdropFilter: 'blur(3px)',
          boxShadow: isHovered 
            ? '0 0 20px rgba(245, 166, 35, 0.55), inset 0 0 10px rgba(255, 215, 0, 0.3)' 
            : '0 0 10px rgba(245, 166, 35, 0.25)',
          transition: 'width 0.2s cubic-bezier(0.2, 0, 0.2, 1), height 0.2s cubic-bezier(0.2, 0, 0.2, 1), background-color 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease',
          willChange: 'transform',
        }}
      />
      {/* Center sharp glowing dot */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          pointerEvents: 'none',
          zIndex: 100000,
          width: isHovered ? 8 : isClicked ? 10 : 6,
          height: isHovered ? 8 : isClicked ? 10 : 6,
          borderRadius: '50%',
          transform: `translate3d(${position.x}px, ${position.y}px, 0) translate(-50%, -50%)`,
          backgroundColor: '#F5A623',
          boxShadow: '0 0 8px #FFD700, 0 0 16px rgba(245, 166, 35, 0.8)',
          transition: 'width 0.15s ease, height 0.15s ease',
          willChange: 'transform',
        }}
      />
    </>
  );
};

export default CustomCursor;
