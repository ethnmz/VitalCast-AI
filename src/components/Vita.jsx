/**
 * Vita mascot — heart in mint circle with AI lightning badge
 */
export default function Vita({ size = 'md', animated = false }) {
  const sizes = {
    sm: { outer: 40, inner: 24, badge: 14 },
    md: { outer: 64, inner: 38, badge: 20 },
    lg: { outer: 96, inner: 56, badge: 28 },
    xl: { outer: 128, inner: 76, badge: 36 },
  }
  const s = sizes[size] || sizes.md

  return (
    <div
      className={`relative inline-flex items-center justify-center ${animated ? 'animate-[float_3s_ease-in-out_infinite]' : ''}`}
      style={{ width: s.outer, height: s.outer }}
    >
      {/* Outer glow ring */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(0,209,84,0.15) 0%, transparent 70%)',
        }}
      />

      {/* Main circle */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: 'linear-gradient(145deg, #e8fef0 0%, #c8f5da 60%, #a8ebb8 100%)',
          boxShadow: '0 2px 12px rgba(0, 209, 84, 0.25), inset 0 1px 2px rgba(255,255,255,0.8)',
        }}
      />

      {/* Heart SVG */}
      <svg
        width={s.inner}
        height={s.inner}
        viewBox="0 0 24 24"
        fill="none"
        className="relative z-10"
      >
        <path
          d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
          fill="#004D2C"
          opacity="0.9"
        />
        {/* Heartbeat line through the heart */}
        <path
          d="M7 11h2l1-2 2 4 1-2h2"
          stroke="#00D154"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>

      {/* Lightning bolt badge */}
      <div
        className="absolute flex items-center justify-center rounded-full"
        style={{
          width: s.badge,
          height: s.badge,
          bottom: -2,
          right: -2,
          background: 'linear-gradient(135deg, #00D154, #00a843)',
          boxShadow: '0 1px 4px rgba(0, 209, 84, 0.5)',
          zIndex: 20,
        }}
      >
        <svg
          width={s.badge * 0.55}
          height={s.badge * 0.55}
          viewBox="0 0 10 14"
          fill="none"
        >
          <path
            d="M6 1L1 8h4l-1 5 5-7H5L6 1z"
            fill="white"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  )
}
