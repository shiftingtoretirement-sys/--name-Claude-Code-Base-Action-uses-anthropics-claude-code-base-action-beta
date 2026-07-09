import React from "react";

// Minimal line icons drawn to a 24x24 viewBox; color via `stroke`/`currentColor`.

export const SuitcaseIcon: React.FC<{ size?: number; color: string }> = ({
  size = 48,
  color,
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <rect x="3" y="7" width="18" height="13" rx="2" stroke={color} strokeWidth="2" />
    <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke={color} strokeWidth="2" />
    <line x1="3" y1="12" x2="21" y2="12" stroke={color} strokeWidth="2" />
  </svg>
);

export const HouseIcon: React.FC<{ size?: number; color: string }> = ({
  size = 48,
  color,
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M3 11.5 12 4l9 7.5"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M5 10v10h14V10"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <rect x="10" y="14" width="4" height="6" stroke={color} strokeWidth="2" />
  </svg>
);

export const MedicalIcon: React.FC<{ size?: number; color: string }> = ({
  size = 48,
  color,
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <rect x="4" y="4" width="16" height="16" rx="3" stroke={color} strokeWidth="2" />
    <line x1="12" y1="8" x2="12" y2="16" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="8" y1="12" x2="16" y2="12" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </svg>
);
