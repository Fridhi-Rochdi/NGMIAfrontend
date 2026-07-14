"use client";

import { SVGProps } from 'react';

export function TextIcon(props: SVGProps<SVGSVGElement>) {
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
      <path d="M4 7V4h16v3" />
      <path d="M9 20h6" />
      <path d="M5 14h14" />
      <path d="M5 10h14" />
    </svg>
  );
}