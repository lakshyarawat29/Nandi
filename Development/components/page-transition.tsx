'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

interface PageTransitionProps {
  children: React.ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Start exit animation
    setIsExiting(true);
    setIsVisible(false);

    // Small delay to ensure smooth transition
    const timer = setTimeout(() => {
      setIsExiting(false);
      setIsVisible(true);
    }, 150);

    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <div
      className={`transition-all duration-700 ease-out ${
        isVisible && !isExiting
          ? 'opacity-100 translate-y-0 scale-100'
          : 'opacity-0 translate-y-8 scale-95'
      }`}
      style={{
        transform:
          isVisible && !isExiting
            ? 'translateY(0) scale(1)'
            : 'translateY(32px) scale(0.95)',
      }}
    >
      {children}
    </div>
  );
}
