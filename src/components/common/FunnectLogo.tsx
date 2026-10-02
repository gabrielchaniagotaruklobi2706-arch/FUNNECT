import React from 'react';

interface FunnectLogoProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  iconOnly?: boolean;
  variant?: 'color' | 'white';
}

export const FunnectLogo: React.FC<FunnectLogoProps> = ({
  className = '',
  size = 'md',
  showTagline = true,
  iconOnly = false,
  variant = 'color',
}) => {
  // Dimensions map
  const sizeMap = {
    xs: { height: 26, mascotSize: 26 },
    sm: { height: 34, mascotSize: 34 },
    md: { height: 44, mascotSize: 44 },
    lg: { height: 56, mascotSize: 56 },
    xl: { height: 76, mascotSize: 76 },
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  const blueMain = variant === 'white' ? '#FFFFFF' : '#1D64F2';
  const blueDark = variant === 'white' ? '#E2E8F0' : '#0D52ED';
  const yellowMain = variant === 'white' ? '#FEF08A' : '#F59E0B';
  const yellowDark = variant === 'white' ? '#FDE047' : '#D97706';
  const textColor = variant === 'white' ? '#FFFFFF' : '#1D64F2';

  // Mascot SVG: 6 Interlocking Connector Bars forming a hexagon with smiley face in center
  const renderMascot = (pixelSize: number) => (
    <svg
      width={pixelSize}
      height={pixelSize}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 drop-shadow-sm select-none"
    >
      {/* Confetti particles */}
      <polygon points="12,18 16,24 8,23" fill={blueMain} opacity="0.9" />
      <circle cx="106" cy="20" r="3.2" fill={blueMain} />
      <circle cx="102" cy="8" r="3.6" fill={yellowMain} />
      <polygon points="6,44 12,46 9,52" fill={yellowMain} opacity="0.9" />
      <circle cx="112" cy="55" r="2.8" fill={yellowMain} />

      {/* Mascot Hexagon Container */}
      <g transform="translate(-14, -18)">
        {/* Face in center */}
        <ellipse cx="74" cy="76" rx="3.2" ry="4.4" fill="#0F172A" />
        <ellipse cx="90" cy="76" rx="3.2" ry="4.4" fill="#0F172A" />
        <path
          d="M 78 82 Q 82 88 86 82"
          stroke="#0F172A"
          strokeWidth="2.4"
          strokeLinecap="round"
          fill="none"
        />

        {/* 6 Connector Links with pin holes */}
        {/* Link 1: Top Left (Blue) */}
        <line
          x1="82"
          y1="34"
          x2="48"
          y2="54"
          stroke={blueMain}
          strokeWidth="16"
          strokeLinecap="round"
        />
        <circle cx="82" cy="34" r="3.8" fill="#FFFFFF" />
        <circle cx="48" cy="54" r="3.8" fill="#FFFFFF" />

        {/* Link 2: Left Vertical (Blue) */}
        <line
          x1="48"
          y1="54"
          x2="48"
          y2="98"
          stroke={blueDark}
          strokeWidth="16"
          strokeLinecap="round"
        />
        <circle cx="48" cy="54" r="3.8" fill="#FFFFFF" />
        <circle cx="48" cy="98" r="3.8" fill="#FFFFFF" />

        {/* Link 3: Bottom Left (Blue) */}
        <line
          x1="48"
          y1="98"
          x2="82"
          y2="118"
          stroke={blueMain}
          strokeWidth="16"
          strokeLinecap="round"
        />
        <circle cx="48" cy="98" r="3.8" fill="#FFFFFF" />
        <circle cx="82" cy="118" r="3.8" fill="#FFFFFF" />

        {/* Link 4: Top Right (Yellow) */}
        <line
          x1="82"
          y1="34"
          x2="116"
          y2="54"
          stroke={yellowMain}
          strokeWidth="16"
          strokeLinecap="round"
        />
        <circle cx="82" cy="34" r="3.8" fill="#FFFFFF" />
        <circle cx="116" cy="54" r="3.8" fill="#FFFFFF" />

        {/* Link 5: Right Vertical (Yellow) */}
        <line
          x1="116"
          y1="54"
          x2="116"
          y2="98"
          stroke={yellowDark}
          strokeWidth="16"
          strokeLinecap="round"
        />
        <circle cx="116" cy="54" r="3.8" fill="#FFFFFF" />
        <circle cx="116" cy="98" r="3.8" fill="#FFFFFF" />

        {/* Link 6: Bottom Right (Yellow) */}
        <line
          x1="116"
          y1="98"
          x2="82"
          y2="118"
          stroke={yellowMain}
          strokeWidth="16"
          strokeLinecap="round"
        />
        <circle cx="116" cy="98" r="3.8" fill="#FFFFFF" />
        <circle cx="82" cy="118" r="3.8" fill="#FFFFFF" />
      </g>
    </svg>
  );

  if (iconOnly) {
    return <div className={`inline-flex items-center justify-center ${className}`}>{renderMascot(currentSize.mascotSize)}</div>;
  }

  return (
    <div className={`inline-flex items-center gap-2.5 sm:gap-3.5 select-none ${className}`}>
      {renderMascot(currentSize.mascotSize)}
      <div className="flex flex-col justify-center leading-none">
        {/* FUNNECT Wordmark */}
        <div className="flex items-center font-black tracking-tight" style={{ fontSize: currentSize.height * 0.58 }}>
          <span style={{ color: yellowMain }} className="font-black">FUN</span>
          {/* Connector link visual connector between N and N */}
          <span style={{ color: blueMain }} className="font-black">NECT</span>
        </div>

        {/* Tagline: Connect. Build. Have Fun. */}
        {showTagline && (
          <span
            className="font-bold tracking-tight opacity-95 mt-0.5"
            style={{
              color: textColor,
              fontSize: Math.max(9, Math.round(currentSize.height * 0.22)),
            }}
          >
            Connect. Build. Have Fun.
          </span>
        )}
      </div>
    </div>
  );
};
