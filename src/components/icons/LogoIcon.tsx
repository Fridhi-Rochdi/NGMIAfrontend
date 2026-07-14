import React from 'react';

export function LogoIcon({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg 
      viewBox="0 0 40 40" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      {/* Lettre N stylisée - Partie gauche et diagonale (s'adapte à la couleur du texte) */}
      <path 
        d="M8 32V8" 
        stroke="currentColor" 
        strokeWidth="6" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <path 
        d="M8 8L28 32" 
        stroke="currentColor" 
        strokeWidth="6" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      
      {/* Barre droite et point (Bleu marketing/IA) */}
      <path 
        d="M32 32V14" 
        stroke="#3B82F6" 
        strokeWidth="6" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <circle cx="32" cy="6" r="4" fill="#3B82F6"/>
    </svg>
  );
}
