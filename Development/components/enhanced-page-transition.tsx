'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

interface EnhancedPageTransitionProps {
  children: React.ReactNode;
}

export function EnhancedPageTransition({
  children,
}: EnhancedPageTransitionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [animationClass, setAnimationClass] = useState('');
  const pathname = usePathname();

  useEffect(() => {
    // Start exit animation
    setIsExiting(true);
    setAnimationClass('page-exit page-exit-active');

    // Small delay to ensure smooth transition
    const timer = setTimeout(() => {
      setIsExiting(false);
      setAnimationClass('page-enter');

      // Trigger enter animation
      requestAnimationFrame(() => {
        setAnimationClass('page-enter page-enter-active');
        setIsVisible(true);
      });
    }, 150);

    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <div
      className={`${animationClass} transition-all duration-700 ease-out`}
      style={{
        minHeight: '100vh',
        willChange: 'opacity, transform',
      }}
    >
      {children}
    </div>
  );
}
