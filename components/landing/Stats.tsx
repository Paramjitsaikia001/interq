'use client';
import React, { useEffect, useState, useRef } from 'react';

// A simple animated counter using React state
function AnimatedCounter({ value, duration = 1500 }: { value: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );
    
    if (elementRef.current) {
      observer.observe(elementRef.current);
    }
    
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    
    let startTimestamp: number;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // Ease out cubic
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeOut * value));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setCount(value);
      }
    };
    window.requestAnimationFrame(step);
  }, [isVisible, value, duration]);

  return <span ref={elementRef}>{count.toLocaleString()}</span>;
}

export function Stats() {
  const stats = [
    { label: 'Questions', value: 12450, suffix: '+' },
    { label: 'Companies', value: 850, suffix: '+' },
    { label: 'Users', value: 45000, suffix: '+' },
    { label: 'Answers', value: 135000, suffix: '+' },
    { label: 'Bookmarks', value: 89000, suffix: '+' },
  ];

  return (
    <section className="w-full py-16 border-y border-outline-variant bg-surface-container-lowest my-12">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 text-center divide-x-0 md:divide-x md:divide-outline-variant">
          {stats.map((stat, i) => (
            <div key={stat.label} className="flex flex-col items-center justify-center space-y-2">
              <div className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight">
                <AnimatedCounter value={stat.value} />{stat.suffix}
              </div>
              <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
