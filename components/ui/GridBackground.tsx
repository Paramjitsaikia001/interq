'use client';
import React, { useEffect, useState } from 'react';

export function GridBackground() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none bg-background">
      {/* Pure CSS Animations injected directly for the floating glow */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes hero-glow-float-1 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.15; }
          50% { transform: translate(-40px, 30px) scale(1.1); opacity: 0.3; }
        }
        @keyframes hero-glow-float-2 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.15; }
          50% { transform: translate(40px, -20px) scale(0.95); opacity: 0.25; }
        }
        .animate-glow-1 {
          animation: hero-glow-float-1 25s ease-in-out infinite;
        }
        .animate-glow-2 {
          animation: hero-glow-float-2 30s ease-in-out infinite;
        }
      `}} />

      {/* 
        Grid Layer 
        Increased opacity slightly so it's more visible.
        Fades toward edges using radial mask.
      */}
      <div 
        className="absolute inset-0 w-full h-full opacity-60"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(128, 128, 128, 0.25) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(128, 128, 128, 0.25) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          backgroundPosition: 'center top',
          maskImage: 'radial-gradient(circle at 50% 0%, black, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(circle at 50% 0%, black, transparent 80%)'
        }}
      />

      {/* Radial gradient overlay: Brighter near hero, darker near edges */}
      <div 
        className="absolute inset-0 w-full h-full"
        style={{
          background: 'radial-gradient(circle at top center, rgba(59, 130, 246, 0.15), transparent 60%)'
        }}
      />

      {/* Cursor tracking glow */}
      <div 
        className="absolute inset-0 w-full h-full transition-opacity duration-300"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(59, 130, 246, 0.15), transparent 40%)`
        }}
      />

      {/* Soft blue glow behind hero (Left) */}
      <div 
        className="absolute top-[-5%] left-1/2 w-[600px] h-[600px] bg-primary/30 rounded-full blur-[120px] mix-blend-screen animate-glow-1"
        style={{ marginLeft: '-500px' }}
      />
      
      {/* Soft blue glow behind hero (Right) */}
      <div 
        className="absolute top-[5%] left-1/2 w-[500px] h-[500px] bg-blue-500/30 rounded-full blur-[100px] mix-blend-screen animate-glow-2"
        style={{ marginLeft: '100px' }}
      />
    </div>
  );
}
