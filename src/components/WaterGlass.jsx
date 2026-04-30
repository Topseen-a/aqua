import React from 'react';

export default function WaterGlass({ pct }) {
  const clampedPct = Math.min(Math.max(pct, 0), 1);
  const totalH = 160;
  const waterH = Math.round(clampedPct * totalH);
  const waterY = 20 + (totalH - waterH);

  return (
    <svg viewBox="0 0 140 200" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
      <defs>
        <clipPath id="glassClip">
          <path d="M20 20 L14 180 H126 L120 20 Z" />
        </clipPath>
      </defs>

      <path d="M20 20 L14 180 H126 L120 20 Z" fill="#f0f8ff" />

      {waterH > 0 && (
        <g clipPath="url(#glassClip)">
          <rect x="0" y={waterY} width="140" height={waterH + 10} fill="#3b9edd" opacity="0.85" />
          {/* Wave */}
          <path
            d={`M0 ${waterY} Q35 ${waterY - 6} 70 ${waterY} Q105 ${waterY + 6} 140 ${waterY} V${waterY - 4} Q105 ${waterY + 2} 70 ${waterY - 4} Q35 ${waterY - 10} 0 ${waterY - 4} Z`}
            fill="#7ac9f5"
            opacity="0.7"
          />
          <rect x="30" y={waterY + 10} width="8" height={Math.max(0, waterH - 14)} rx="4" fill="#fff" opacity="0.18" />
          <rect x="46" y={waterY + 18} width="5" height={Math.max(0, waterH - 24)} rx="2.5" fill="#fff" opacity="0.12" />
        </g>
      )}

      {[0.25, 0.5, 0.75].map(f => {
        const y = 20 + totalH * (1 - f);
        return <line key={f} x1="14" y1={y} x2="32" y2={y} stroke="#1a7ac8" strokeWidth="1.2" opacity="0.3" />;
      })}

      <path d="M20 20 L14 180 H126 L120 20 Z" stroke="#1a7ac8" strokeWidth="3" fill="none" strokeLinejoin="round" />
      <line x1="18" y1="20" x2="122" y2="20" stroke="#1a7ac8" strokeWidth="3" strokeLinecap="round" />

      {clampedPct <= 0.35 && (
        <text x="70" y="110" textAnchor="middle" fill="#1a4f72" fontSize="22" fontWeight="700" fontFamily="DM Sans, sans-serif">
          {Math.round(clampedPct * 100)}%
        </text>
      )}
      {clampedPct > 0.1 && (
        <text x="70" y={Math.max(waterY + 24, 48)} textAnchor="middle" fill="#fff" fontSize="18" fontWeight="700" fontFamily="DM Sans, sans-serif">
          {Math.round(clampedPct * 100)}%
        </text>
      )}
    </svg>
  );
}
