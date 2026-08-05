import React, { useId } from 'react';

export function LogoIcon({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  const id = useId().replace(/:/g, '');
  const backgroundId = `nextgen-background-${id}`;
  const accentId = `nextgen-accent-${id}`;

  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="NextGen AI"
      {...props}
    >
      <defs>
        <linearGradient id={backgroundId} x1="8" y1="5" x2="56" y2="59" gradientUnits="userSpaceOnUse">
          <stop stopColor="#111827" />
          <stop offset="0.56" stopColor="#312E81" />
          <stop offset="1" stopColor="#155E75" />
        </linearGradient>
        <linearGradient id={accentId} x1="12" y1="48" x2="52" y2="13" gradientUnits="userSpaceOnUse">
          <stop stopColor="#67E8F9" />
          <stop offset="1" stopColor="#C4B5FD" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="60" height="60" rx="18" fill={`url(#${backgroundId})`} />
      <rect x="2.75" y="2.75" width="58.5" height="58.5" rx="17.25" stroke="white" strokeOpacity="0.14" strokeWidth="1.5" />
      <path
        d="M16.5 45V20.5C16.5 18.2 19.35 17.15 20.83 18.9L43.5 45V19"
        stroke="white"
        strokeWidth="5.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M16.5 45V34.5" stroke={`url(#${accentId})`} strokeWidth="5.5" strokeLinecap="round" />
      <path
        d="M48.5 8.5C49.28 12.72 51.28 14.72 55.5 15.5C51.28 16.28 49.28 18.28 48.5 22.5C47.72 18.28 45.72 16.28 41.5 15.5C45.72 14.72 47.72 12.72 48.5 8.5Z"
        fill={`url(#${accentId})`}
      />
      <circle cx="12" cy="13" r="2" fill="#67E8F9" fillOpacity="0.9" />
    </svg>
  );
}
