import React from 'react';

export default function StreakBadge({ streak }) {
  if (streak < 1) return null;

  const emoji = streak >= 30 ? '🔥🔥🔥' : streak >= 14 ? '🔥🔥' : '🔥';
  const label = streak === 1 ? '1 day streak' : `${streak} day streak`;

  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      background: '#fff4e0',
      border: '1.5px solid #f9c74f',
      borderRadius: 20,
      padding: '4px 14px',
      fontSize: 13,
      fontWeight: 600,
      color: '#b5640a',
      margin: '0 auto 1rem',
    }}>
      <span style={{ fontSize: 16 }}>{emoji}</span>
      {label}
    </div>
  );
}
