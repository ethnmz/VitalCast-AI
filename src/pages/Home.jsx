import { useNavigate } from 'react-router-dom'
import mascotWaving from '../assets/mascot_waving.png'

// ── Figma asset URLs ──────────────────────────────────────────────────────────
const IMG_MASCOT_LOGO = 'https://www.figma.com/api/mcp/asset/f1e470f6-824d-42d2-983e-7d1b4ec04e29'
const IMG_ARROW = 'https://www.figma.com/api/mcp/asset/cf40c111-e985-4f44-a298-c5fc5be49c8f'

function RightPanelAnimation() {
  return (
    <div style={{ flex: 1, background: '#F8FAF8', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

      {/* Background radial highlight */}
      <div style={{ position: 'absolute', width: 800, height: 800, background: 'radial-gradient(circle, rgba(45,146,76,0.06) 0%, transparent 60%)', top: '10%', left: '5%' }} />

      {/* Floating App Preview Card */}
      <div className="app-preview-card" style={{
        width: 420, height: 480, background: '#ffffff', borderRadius: 32,
        boxShadow: '0 40px 80px rgba(0,0,0,0.1), 0 0 0 12px rgba(255,255,255,0.4)',
        border: '1px solid #E5E7EB', display: 'flex', flexDirection: 'column',
        padding: 24, zIndex: 10, position: 'relative'
      }}>

        {/* Mock App Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 48, height: 48, borderRadius: 16, background: '#ccffe5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: '#2D924C', fontWeight: 900, fontSize: 22, fontFamily: "'DM Sans', sans-serif" }}>V</span>
            </div>
            <div>
              <div style={{ fontSize: 13, color: '#6B7280', fontWeight: 600 }}>Health Outlook</div>
              <div style={{ fontSize: 20, color: '#004D2C', fontWeight: 800 }}>Excellent</div>
            </div>
          </div>
          <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#F3F4F6' }} />
        </div>

        {/* Mock App Main Chart Area */}
        <div style={{ height: 180, background: '#F8FAF8', borderRadius: 24, marginBottom: 16, position: 'relative', overflow: 'hidden', border: '1px solid #E5E7EB' }}>
          {/* Animated Bar Chart Drawing */}
          <div style={{ position: 'absolute', bottom: 0, left: 24, right: 24, height: 120, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
            {[30, 50, 40, 75, 60, 95, 80].map((h, i) => (
              <div key={i} className={`chart-bar bar-${i}`} style={{ width: 26, height: `${h}%`, background: '#2D924C', borderRadius: '8px 8px 0 0', transformOrigin: 'bottom' }} />
            ))}
          </div>
        </div>

        {/* Mock App Bottom Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, flex: 1 }}>
          <div style={{ background: '#EFF6FF', borderRadius: 24, padding: 20, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ width: 36, height: 36, borderRadius: 12, background: '#DBEAFE', color: '#3B82F6', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10, fontSize: 16 }}>☾</div>
            <div style={{ fontSize: 13, color: '#6B7280', fontWeight: 600 }}>Sleep</div>
            <div style={{ fontSize: 26, color: '#004D2C', fontWeight: 800 }}>7.2<span style={{ fontSize: 15 }}>h</span></div>
          </div>
          <div style={{ background: '#FEE2E2', borderRadius: 24, padding: 20, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ width: 36, height: 36, borderRadius: 12, background: '#FECACA', color: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10, fontSize: 16 }}>♥</div>
            <div style={{ fontSize: 13, color: '#6B7280', fontWeight: 600 }}>Resting HR</div>
            <div style={{ fontSize: 26, color: '#004D2C', fontWeight: 800 }}>58<span style={{ fontSize: 15 }}>bpm</span></div>
          </div>
        </div>

      </div>

      {/* Floating Data Packets falling into the App */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 15 }}>
        {/* Packet 1 */}
        <div className="data-packet packet-1" style={{ position: 'absolute', top: -40, right: '25%', background: '#2D924C', color: '#fff', fontSize: 13, fontWeight: 700, padding: '8px 16px', borderRadius: 999, boxShadow: '0 8px 20px rgba(45,146,76,0.25)', whiteSpace: 'nowrap' }}>
          HRV: 62ms
        </div>
        {/* Packet 2 */}
        <div className="data-packet packet-2" style={{ position: 'absolute', top: -40, right: '45%', background: '#fff', color: '#2D924C', border: '1px solid rgba(45,146,76,0.2)', fontSize: 13, fontWeight: 700, padding: '8px 16px', borderRadius: 999, boxShadow: '0 8px 20px rgba(0,0,0,0.08)', whiteSpace: 'nowrap' }}>
          Steps: 8,400
        </div>
        {/* Packet 3 */}
        <div className="data-packet packet-3" style={{ position: 'absolute', top: -40, right: '15%', background: '#00D154', color: '#004D2C', fontSize: 13, fontWeight: 800, padding: '8px 16px', borderRadius: 999, boxShadow: '0 8px 20px rgba(0,209,84,0.3)', whiteSpace: 'nowrap' }}>
          {`<xml> export`}
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  const navigate = useNavigate()

  return (
    <>
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .hero-animate { animation: fadeSlideUp 0.55s ease both; }
        .cta-btn:hover { transform: translateY(-2px); box-shadow: 0 10px 30px rgba(45,146,76,0.3); }
        .cta-btn { transition: transform 0.2s, box-shadow 0.2s; }
        
        /* Bubble Animation */
        @keyframes popIn {
          0% { transform: scale(0.8) translateY(15px) rotate(-15deg); opacity: 0; }
          60% { transform: scale(1.05) translateY(-5px) rotate(4deg); opacity: 1; }
          100% { transform: scale(1) translateY(0) rotate(0deg); opacity: 1; }
        }
        @keyframes gentleFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .bubble-anim {
          animation: popIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards, gentleFloat 3s ease-in-out 0.6s infinite;
          transform-origin: bottom left;
          opacity: 0;
        }

        /* Option B 3D App Float */
        @keyframes appFloat {
          0%, 100% { transform: perspective(1200px) rotateX(4deg) rotateY(-5deg) translateY(-8px); }
          50%      { transform: perspective(1200px) rotateX(1deg) rotateY(-3deg) translateY(8px); }
        }
        .app-preview-card {
          animation: appFloat 7s ease-in-out infinite;
        }

        /* Option B Chart Drawing */
        @keyframes drawBar {
          0%, 15% { transform: scaleY(0.1); opacity: 0.8; }
          40%, 80% { transform: scaleY(1); opacity: 1; }
          100% { transform: scaleY(0.1); opacity: 0.8; }
        }
        .chart-bar { animation: drawBar 4s cubic-bezier(0.2, 0.8, 0.2, 1) infinite; }
        .bar-0 { animation-delay: 0.1s; }
        .bar-1 { animation-delay: 0.2s; }
        .bar-2 { animation-delay: 0.3s; }
        .bar-3 { animation-delay: 0.4s; }
        .bar-4 { animation-delay: 0.5s; }
        .bar-5 { animation-delay: 0.6s; }
        .bar-6 { animation-delay: 0.7s; }

        /* Option B Data Packets Flying */
        @keyframes packetFly {
          0% { transform: translateY(0) scale(0.8); opacity: 0; }
          15% { opacity: 1; transform: translateY(60px) scale(1.05); }
          60% { opacity: 1; transform: translateY(280px) scale(1); }
          80% { opacity: 0; transform: translateY(350px) scale(0.8); }
          100% { opacity: 0; }
        }
        .data-packet { animation: packetFly 5s ease-in-out infinite; }
        .packet-1 { animation-delay: 0s; right: 25%; }
        .packet-2 { animation-delay: 1.6s; right: 45%; }
        .packet-3 { animation-delay: 3.2s; right: 15%; }
      `}</style>

      {/* ── Page root — green background ──────────────────────────────────── */}
      <div style={{ background: '#2D924C', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px', fontFamily: "'DM Sans', sans-serif" }}>

        {/* ── White card ──────────────────────────────────────────────────── */}
        <div style={{ width: '100%', maxWidth: 1600, height: 'calc(100vh - 64px)', background: '#fff', borderRadius: 24, overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', display: 'flex' }}>

          {/* ════════════════════════════════════════════════════════════════
              SECTION 1 — HERO
          ═══════════════════════════════════════════════════════════════ */}
          <div style={{ display: 'flex', width: '100%', height: '100%' }}>

            {/* Left col */}
            <div style={{ width: 484, background: '#fff', position: 'relative', flexShrink: 0, overflow: 'hidden' }}>

              {/* Logo */}
              <div style={{ position: 'absolute', top: 48, left: 48, display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 55, height: 55, borderRadius: 15, overflow: 'hidden', background: '#ccffe5' }}>
                  <img src={IMG_MASCOT_LOGO} alt="Vita" style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'rotate(180deg) scaleY(-1)' }} />
                </div>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 800, fontSize: 26, color: '#2D924C', letterSpacing: '-0.9px', lineHeight: '28px' }}>
                  VitalCast
                </span>
              </div>

              {/* Headline + description */}
              <div style={{ position: 'absolute', top: 124, left: 48, width: 388 }} className="hero-animate">
                <h1 style={{ fontWeight: 800, fontSize: 48, lineHeight: '52px', color: '#004D2C', letterSpacing: '-1px', margin: '0 0 20px 0' }}>
                  Your health data,{' '}
                  <span style={{ color: '#00D154' }}>finally</span>
                  {' '}speaking clearly.
                </h1>
                <p style={{ fontWeight: 400, fontSize: 18, lineHeight: '28px', color: '#4A4A4A', margin: 0, letterSpacing: '-0.44px' }}>
                  VitalCast runs your Garmin or Apple Health export through three validated clinical models and predicts where your health is heading.
                </p>
              </div>

              {/* CTA button — centered, matching Figma y=507 */}
              <div style={{ position: 'absolute', top: 430, left: '50%', transform: 'translateX(-50%)', width: 388 }}>
                <button
                  className="cta-btn"
                  onClick={() => navigate('/onboarding')}
                  style={{
                    width: '100%', height: 56, background: '#2D924C', border: 'none',
                    borderRadius: 999, cursor: 'pointer', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', gap: 8, color: '#fff',
                    fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 16,
                    letterSpacing: '-0.3px',
                  }}
                >
                  Get my health prediction
                  <img src={IMG_ARROW} alt="" style={{ width: 18, height: 18 }} />
                </button>
              </div>

              {/* Mascot Waving */}
              <div style={{ position: 'absolute', bottom: -5, left: -20, width: 350, height: 380, overflow: 'hidden' }}>
                <img src={mascotWaving} alt="Vita mascot waving" style={{ width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'bottom center' }} />
              </div>

              {/* Speech bubble — Pure CSS recreation facing Mascot */}
              <div className="bubble-anim" style={{ position: 'absolute', left: 250, top: 550, zIndex: 20 }}>
                <div style={{
                  background: '#E9F5E3',
                  border: '2px solid #82C485',
                  borderRadius: '32px 32px 32px 6px',
                  padding: '18px 32px',
                  color: '#004D2C',
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 26,
                  fontWeight: 800,
                  lineHeight: 1.2,
                  textAlign: 'center',
                  boxShadow: '0 8px 24px rgba(45,146,76,0.12)',
                  whiteSpace: 'nowrap'
                }}>
                  Hi.<br />I'm Vita!
                </div>
              </div>
            </div>

            {/* Right col — Option B Live App Preview */}
            <RightPanelAnimation />
          </div>

        </div>
      </div>
    </>
  )
}


