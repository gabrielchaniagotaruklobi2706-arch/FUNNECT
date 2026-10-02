import React, { useState } from 'react';

export type MascotExpression = 'happy' | 'thinking' | 'excited' | 'helping' | 'success' | 'confused';

interface FunnectMascotProps {
  expression?: MascotExpression;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  speechText?: string;
  onSpeechDismiss?: () => void;
  onClick?: () => void;
  animated?: boolean;
  className?: string;
  showBadge?: boolean;
}

export const FunnectMascot: React.FC<FunnectMascotProps> = ({
  expression = 'happy',
  size = 'md',
  speechText,
  onSpeechDismiss,
  onClick,
  animated = true,
  className = '',
  showBadge = false
}) => {
  const [internalDismissed, setInternalDismissed] = useState(false);

  const sizeDimensions = {
    xs: { width: 36, height: 42, text: 'text-[10px]' },
    sm: { width: 48, height: 56, text: 'text-xs' },
    md: { width: 72, height: 84, text: 'text-xs' },
    lg: { width: 110, height: 128, text: 'text-sm' },
    xl: { width: 160, height: 186, text: 'text-base' }
  }[size];

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    setInternalDismissed(true);
    if (onSpeechDismiss) onSpeechDismiss();
  };

  // Eyes and Mouth rendering according to expression
  const renderFace = () => {
    switch (expression) {
      case 'thinking':
        return (
          <g>
            {/* Thinking Eyes looking up-right */}
            <circle cx="44" cy="46" r="5" fill="#38BDF8" />
            <circle cx="46" cy="44" r="2" fill="#FFFFFF" />
            <circle cx="68" cy="46" r="5" fill="#38BDF8" />
            <circle cx="70" cy="44" r="2" fill="#FFFFFF" />
            {/* Cute puckered mouth */}
            <circle cx="56" cy="57" r="2.5" fill="#38BDF8" />
          </g>
        );

      case 'excited':
        return (
          <g>
            {/* Star twinkle eyes */}
            <path d="M44 42 L46 47 L51 47 L47 50 L49 55 L44 52 L39 55 L41 50 L37 47 L42 47 Z" fill="#FACC15" />
            <path d="M68 42 L70 47 L75 47 L71 50 L73 55 L68 52 L63 55 L65 50 L61 47 L66 47 Z" fill="#FACC15" />
            {/* Big happy open mouth */}
            <path d="M48 56 Q56 65 64 56" fill="#EA580C" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" />
          </g>
        );

      case 'helping':
        return (
          <g>
            {/* Winking left eye, open right eye */}
            <path d="M39 48 Q44 43 49 48" stroke="#38BDF8" strokeWidth="3.5" strokeLinecap="round" fill="none" />
            <circle cx="68" cy="47" r="5.5" fill="#38BDF8" />
            <circle cx="70" cy="45" r="2" fill="#FFFFFF" />
            {/* Friendly smile */}
            <path d="M49 57 Q56 63 63 57" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          </g>
        );

      case 'success':
        return (
          <g>
            {/* Happy arch eyes (^_^) */}
            <path d="M39 49 Q44 41 49 49" stroke="#10B981" strokeWidth="4" strokeLinecap="round" fill="none" />
            <path d="M63 49 Q68 41 73 49" stroke="#10B981" strokeWidth="4" strokeLinecap="round" fill="none" />
            {/* Wide celebratory smile */}
            <path d="M47 56 Q56 66 65 56 Z" fill="#10B981" />
          </g>
        );

      case 'confused':
        return (
          <g>
            {/* Spiral / uneven eyes */}
            <circle cx="43" cy="47" r="6" fill="#38BDF8" />
            <circle cx="43" cy="47" r="2" fill="#0F172A" />
            <circle cx="69" cy="45" r="4.5" fill="#38BDF8" />
            <circle cx="69" cy="45" r="1.5" fill="#0F172A" />
            {/* Wavy mouth */}
            <path d="M48 58 Q52 55 56 58 Q60 61 64 58" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          </g>
        );

      case 'happy':
      default:
        return (
          <g>
            {/* Round friendly luminous eyes */}
            <circle cx="44" cy="47" r="5.5" fill="#38BDF8" />
            <circle cx="46" cy="45" r="2" fill="#FFFFFF" />
            <circle cx="68" cy="47" r="5.5" fill="#38BDF8" />
            <circle cx="70" cy="45" r="2" fill="#FFFFFF" />
            {/* Sweet curved smile */}
            <path d="M49 56 Q56 64 63 56" stroke="#38BDF8" strokeWidth="2.8" strokeLinecap="round" fill="none" />
            {/* Subtle cheek blush */}
            <ellipse cx="38" cy="54" rx="3" ry="1.5" fill="#F472B6" opacity="0.6" />
            <ellipse cx="74" cy="54" rx="3" ry="1.5" fill="#F472B6" opacity="0.6" />
          </g>
        );
    }
  };

  return (
    <div className={`relative inline-flex items-center select-none group ${className}`}>
      {/* Speech Bubble */}
      {speechText && !internalDismissed && (
        <div
          className={`absolute bottom-full mb-2 left-1/2 -translate-x-1/2 z-30 min-w-[160px] max-w-[240px] px-3.5 py-2.5 bg-white text-slate-800 rounded-2xl shadow-xl border border-blue-200/80 backdrop-blur-md transition-all duration-300 transform animate-in fade-in zoom-in-95 ${sizeDimensions.text}`}
        >
          <div className="relative font-bold leading-snug">
            {speechText}
            {onSpeechDismiss && (
              <button
                onClick={handleDismiss}
                className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-600 text-[10px] flex items-center justify-center transition-colors"
                title="Dismiss tip"
              >
                ✕
              </button>
            )}
          </div>
          {/* Speech Bubble Arrow pointing to mascot */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-6 border-x-transparent border-t-6 border-t-white" />
        </div>
      )}

      {/* Mascot SVG */}
      <div
        onClick={onClick}
        className={`relative transition-transform duration-300 ${
          onClick ? 'cursor-pointer hover:scale-105 active:scale-95' : ''
        } ${animated ? 'hover:-translate-y-1' : ''}`}
        style={{ width: sizeDimensions.width, height: sizeDimensions.height }}
      >
        <svg
          viewBox="0 0 112 130"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-md"
        >
          <defs>
            {/* Core Body Gradient */}
            <linearGradient id="mascotBodyGrad" x1="16" y1="20" x2="96" y2="100" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FFFFFF" />
              <stop offset="0.7" stopColor="#EFF6FF" />
              <stop offset="1" stopColor="#DBEAFE" />
            </linearGradient>

            {/* Blue Trim Gradient */}
            <linearGradient id="mascotBlueGrad" x1="0" y1="0" x2="1" y2="1">
              <stop stopColor="#2563EB" />
              <stop offset="1" stopColor="#1D4ED8" />
            </linearGradient>

            {/* Screen Visor Gradient */}
            <linearGradient id="mascotScreenGrad" x1="28" y1="36" x2="84" y2="70" gradientUnits="userSpaceOnUse">
              <stop stopColor="#0F172A" />
              <stop offset="1" stopColor="#1E293B" />
            </linearGradient>

            {/* Ear Pin Connectors */}
            <linearGradient id="connectorPinGrad" x1="0" y1="0" x2="1" y2="1">
              <stop stopColor="#F59E0B" />
              <stop offset="1" stopColor="#D97706" />
            </linearGradient>
          </defs>

          {/* Left Ear Connector Pin (STEM connector style) */}
          <rect x="8" y="44" width="10" height="18" rx="4" fill="url(#connectorPinGrad)" stroke="#B45309" strokeWidth="1" />
          <circle cx="13" cy="53" r="2.5" fill="#FEF3C7" />

          {/* Right Ear Connector Pin */}
          <rect x="94" y="44" width="10" height="18" rx="4" fill="url(#connectorPinGrad)" stroke="#B45309" strokeWidth="1" />
          <circle cx="99" cy="53" r="2.5" fill="#FEF3C7" />

          {/* Head Antenna / Port Nub */}
          <rect x="52" y="8" width="8" height="12" rx="3" fill="#3B82F6" />
          <circle cx="56" cy="7" r="5" fill="#F59E0B" stroke="#D97706" strokeWidth="1" />
          <circle cx="57" cy="6" r="1.5" fill="#FFFFFF" />

          {/* Cute Floating Hover Shadows */}
          <ellipse cx="56" cy="122" rx="26" ry="6" fill="#0F172A" opacity="0.12" />

          {/* Main Rounded Core Body */}
          <rect
            x="18"
            y="18"
            width="76"
            height="76"
            rx="24"
            fill="url(#mascotBodyGrad)"
            stroke="#BFDBFE"
            strokeWidth="2.5"
          />

          {/* Top Brand Stripe (Like FUNNECT Core) */}
          <rect x="34" y="22" width="44" height="4" rx="2" fill="#3B82F6" />

          {/* Curved OLED Screen Visor */}
          <rect
            x="28"
            y="32"
            width="56"
            height="38"
            rx="14"
            fill="url(#mascotScreenGrad)"
            stroke="#334155"
            strokeWidth="1.5"
          />

          {/* Render Expression Faces */}
          {renderFace()}

          {/* Status Heartbeat LED (Glows green) */}
          <circle cx="82" cy="24" r="2.5" fill="#10B981" />
          <circle cx="82" cy="24" r="4.5" fill="#10B981" opacity="0.3" />

          {/* Left Arm / Connector Peg */}
          <g className={animated ? 'animate-wiggle' : ''}>
            <rect x="14" y="66" width="9" height="14" rx="4.5" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="1" />
            <circle cx="18.5" cy="73" r="2" fill="#93C5FD" />
          </g>

          {/* Right Arm */}
          <g>
            <rect x="89" y="66" width="9" height="14" rx="4.5" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="1" />
            <circle cx="93.5" cy="73" r="2" fill="#93C5FD" />
          </g>

          {/* Dual Rounded Magnetic Feet / Skids */}
          <rect x="34" y="92" width="16" height="14" rx="6" fill="#1E293B" stroke="#0F172A" strokeWidth="1" />
          <rect x="62" y="92" width="16" height="14" rx="6" fill="#1E293B" stroke="#0F172A" strokeWidth="1" />
          <rect x="37" y="103" width="10" height="3" rx="1.5" fill="#38BDF8" opacity="0.8" />
          <rect x="65" y="103" width="10" height="3" rx="1.5" fill="#38BDF8" opacity="0.8" />
        </svg>
      </div>

      {/* Optional Helper Badge */}
      {showBadge && (
        <span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-full bg-blue-600 text-white text-[9px] font-black uppercase tracking-wider shadow">
          BOTTI
        </span>
      )}
    </div>
  );
};
