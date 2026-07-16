import React from 'react';

export function LogoIcon({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg 
      viewBox="0 0 110 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <defs>
        <linearGradient id="logo-left" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
        <linearGradient id="logo-diag" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
        <linearGradient id="logo-right" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#d946ef" />
        </linearGradient>
      </defs>

      {/* Left Bar */}
      <rect x="15" y="20" width="20" height="70" fill="url(#logo-left)" />
      
      {/* Diagonal */}
      <path d="M15 20 L35 20 L85 90 L65 90 Z" fill="url(#logo-diag)" />
      
      {/* Right Bar - Arrow for growth */}
      <path d="M65 30 L75 10 L85 30 L85 90 L65 90 Z" fill="url(#logo-right)" />
      
      {/* AI Sparkle */}
      <path d="M90 3 L92.5 12.5 L102 15 L92.5 17.5 L90 27 L87.5 17.5 L78 15 L87.5 12.5 Z" fill="#06b6d4" />
    </svg>
  );
}
