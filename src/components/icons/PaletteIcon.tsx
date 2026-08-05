
import { SVGProps } from 'react';

export function PaletteIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 2a10 10 0 0 0-9 9c0 5.523 4.477 10 10 10 5.523 0 10-4.477 10-10a10 10 0 0 0-9-9z" />
      <path d="M12 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
      <path d="M12 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" />
      <path d="M12 12a2 2 0 1 0 4 0 2 2 0 0 0-4 0z" />
      <path d="M12 12a2 2 0 1 0-4 0 2 2 0 0 0 4 0z" />
    </svg>
  );
}
