'use client'

import Script from 'next/script';

export function FlowbiteScript() {
  return (
    <Script
      src="https://cdn.jsdelivr.net/npm/flowbite@4.0.1/dist/flowbite.min.js"
      strategy="afterInteractive"
      onLoad={() => {
        if (typeof window !== 'undefined' && (window as any).initFlowbite) {
          (window as any).initFlowbite();
        }
      }}
    />
  );
}
