import { SVGProps } from 'react';

export function MusicIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m9 9 10.5-3.21M21 12V5.25m0 0L12 8.25m9-3V5.25m0 0v12a3 3 0 0 1-3 3H6.75a3 3 0 0 1-3-3V9.75m15 0a3 3 0 0 0-3-3H9.75a3 3 0 0 0-3 3m15 0v3.75"
      />
    </svg>
  );
}
