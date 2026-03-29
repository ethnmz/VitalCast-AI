import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useHealth } from '../App'
import { computeMetrics, sleepLabel, stressLabel, getRiskFactors, generateWeeklyPlan } from '../lib/models'

const F = "'DM Sans', sans-serif"
const GREEN = '#2D924C'
const LT_GREEN = '#8CE39A'
const YELLOW = '#FFE898'
const OFF_WHITE = '#F8FAF8'
const GRAY_BDR = '#E5E7EB'
const GRAY_TXT = '#6B7280'
const GRAY_LIGHT = '#9CA3AF'

const IMG_MASCOT_LARGE = 'https://www.figma.com/api/mcp/asset/6074198e-386c-443d-9063-a874261364ae'
const IMG_LOGO = 'https://www.figma.com/api/mcp/asset/cc3327ec-bba8-4ef3-834b-ff7b6d6fd926'
const ICON_HOME = 'https://www.figma.com/api/mcp/asset/5cf5b137-6f42-486e-9f04-e0573e742c23'
const ICON_INSIGHTS = 'https://www.figma.com/api/mcp/asset/74fa9305-c372-46d9-afd0-b59a849652cf'
const ICON_ACTION = 'https://www.figma.com/api/mcp/asset/3597291b-2a6b-4a86-952a-541fd980aa5a'
const ICON_UPLOAD = 'https://www.figma.com/api/mcp/asset/741a6df7-869c-4c7f-aa4b-cd7e806c0ee6'
const ICON_MODELS = 'https://www.figma.com/api/mcp/asset/f4b7c6fc-b4fc-40d2-a18d-b8624be4797e'
const ICON_SETTINGS = 'https://www.figma.com/api/mcp/asset/8b53c8de-eee1-4261-9b10-c6677b846027'
const ICON_BELL = 'https://www.figma.com/api/mcp/asset/41908eeb-be90-4b0c-9587-f9ff63a2c6cb'
const ICON_CVD_DOT = 'https://www.figma.com/api/mcp/asset/40ca214d-3e83-4e53-a845-c8a7034e6814'
const ICON_HRV_DOT = 'https://www.figma.com/api/mcp/asset/3ef333a6-3562-4d76-a757-f5fca110bb06'
const ICON_CHECK_FILLED = 'https://www.figma.com/api/mcp/asset/86ec3aa0-fc8f-4bd3-a0a1-7ec2b9bd6056'
const ICON_HEART = 'https://www.figma.com/api/mcp/asset/6bb99a7e-bd51-4bb1-8bf0-f66fa6c1f247'
const ICON_SHIELD = 'https://www.figma.com/api/mcp/asset/4f5e82d8-b0bf-4ddb-86f4-03fd32b6a69e'
const ICON_BOLT = 'https://www.figma.com/api/mcp/asset/b8af5921-2e44-45fd-881c-0b4beeee936e'
const ICON_BRAIN = 'https://www.figma.com/api/mcp/asset/4ff10f46-4239-499b-b15a-41928b53a887'

function DonutChart({ metrics }) {
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  return (
    <div style={{ position: 'relative', width: 240, height: 240, margin: '24px auto' }}>
      <svg width={240} height={240} viewBox="0 0 240 240" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={120} cy={120} r={radius} fill="none" stroke="#FDE68A" strokeWidth={32} strokeDasharray={`${circumference * 0.25} ${circumference}`} strokeDashoffset={0} style={{ transition: 'stroke-dashoffset 1s ease' }} />
        <circle cx={120} cy={120} r={radius} fill="none" stroke="#8CE39A" strokeWidth={32} strokeDasharray={`${circumference * 0.35} ${circumference}`} strokeDashoffset={-circumference * 0.25} style={{ transition: 'stroke-dashoffset 1s ease' }} />
        <circle cx={120} cy={120} r={radius} fill="none" stroke="#2D924C" strokeWidth={32} strokeDasharray={`${circumference * 0.20} ${circumference}`} strokeDashoffset={-circumference * 0.60} style={{ transition: 'stroke-dashoffset 1s ease' }} />
        <circle cx={120} cy={120} r={radius} fill="none" stroke="#FCA5A5" strokeWidth={32} strokeDasharray={`${circumference * 0.20} ${circumference}`} strokeDashoffset={-circumference * 0.80} style={{ transition: 'stroke-dashoffset 1s ease' }} />
      </svg>
    </div>
  )
}

function BarChart({ highlightedIndex }) {
  const days = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
  const heights = [40, 60, 50, 100, 70, 40, 50];
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, height: 120, borderBottom: '1px solid #E5E7EB', paddingBottom: 8, marginTop: 16 }}>
      {days.map((day, i) => (
        <div key={day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, cursor: 'pointer', transition: 'transform 0.2s' }} onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'} onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
          <div style={{
            width: '100%',
            height: heights[i],
            background: i === 3 ? GREEN : '#D1FAE5',
            borderRadius: '4px 4px 0 0',
            transition: 'background 0.3s'
          }} />
          <div style={{ color: GRAY_LIGHT, fontSize: 11, fontWeight: 500 }}>{day}</div>
        </div>
      ))}
    </div>
  )
}

function ButtonItem({ onClick, children }) {
  const [hover, setHover] = useState(false)
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        cursor: 'pointer',
        transform: hover ? 'scale(1.02)' : 'scale(1)',
        transition: 'transform 0.1s ease',
        display: 'inline-block'
      }}>
      {children}
    </div>
  )
}

export default function MainDashboard() {
  const navigate = useNavigate()
  const { metrics: rawMetrics, healthData, SAMPLE_DATA } = useHealth()
  const metrics = rawMetrics || computeMetrics(healthData || SAMPLE_DATA)

  const [hoveredNav, setHoveredNav] = useState(null)

  const factors = getRiskFactors(metrics)
  const plan = generateWeeklyPlan(factors)

  const cvdBadge = metrics.cvdRisk >= 15 ? { bg: '#FEE2E2', color: '#DC2626', l: 'Elevated' } : metrics.cvdRisk >= 10 ? { bg: '#FEF3C7', color: '#D97706', l: 'Moderate' } : { bg: '#D1FAE5', color: '#059669', l: 'Low' }
  const hrvBadge = metrics.hrvScore >= 60 ? { bg: '#D1FAE5', color: '#059669', l: 'Good' } : { bg: '#FEF3C7', color: '#D97706', l: 'Fair' }
  const psqBadge = sleepLabel(metrics.psqi)
  const sleepBadge = psqBadge === 'Good' ? { bg: '#D1FAE5', color: '#059669', l: 'Good' } : psqBadge === 'Poor' ? { bg: '#FEE2E2', color: '#DC2626', l: 'Poor' } : { bg: '#FEF3C7', color: '#D97706', l: 'Fair' }
  const confBadge = metrics.confidence >= 85 ? { bg: '#D1FAE5', color: '#059669', l: 'High' } : { bg: '#FEF3C7', color: '#D97706', l: 'Moderate' }

  const deepSleep = Math.round(metrics.avgSleepHours * 0.3 * 10) / 10
  const lightSleep = (metrics.avgSleepHours - deepSleep).toFixed(1)

  const navItems = [
    { label: 'Home', icon: ICON_HOME, route: '/main-dashboard' },
    { label: 'Insights', icon: ICON_INSIGHTS, alert: 'Insights feature coming soon!' },
    { label: 'Action Plan', icon: ICON_ACTION, route: '/dashboard' },
    { label: 'Upload Data', icon: ICON_UPLOAD, route: '/upload' },
    { label: 'Models', icon: ICON_MODELS, alert: 'Models portal coming soon!' },
    { label: 'Settings', icon: ICON_SETTINGS, alert: 'Settings portal coming soon!' },
  ]

  const handleNavClick = (n) => {
    if (n.route) navigate(n.route)
    else if (n.alert) alert(n.alert)
  }

  return (
    <>
      <style>{`
        @keyframes floatUpDown {
          0%   { transform: translateY(0px); }
          50%  { transform: translateY(-12px); }
          100% { transform: translateY(0px); }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-float {
          animation: floatUpDown 5s ease-in-out infinite;
        }
        .card-hover {
          transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .card-hover:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1);
        }
        .hover-bg {
          transition: background 0.25s ease;
        }
        .hover-bg:hover {
          background: #F9FAFB !important;
        }
      `}</style>

      <div style={{ background: GREEN, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px', fontFamily: F }}>
        <div style={{ width: '100%', maxWidth: 1600, height: 'calc(100vh - 64px)', borderRadius: 24, overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', display: 'flex', background: '#fff' }}>

          {/* SIDEBAR */}
          <div style={{ width: 260, flexShrink: 0, borderRight: `1px solid ${GRAY_BDR}`, position: 'relative', display: 'flex', flexDirection: 'column' }}>
            {/* Logo */}
            <ButtonItem onClick={() => navigate('/dashboard')}>
              <div style={{ height: 72, borderBottom: `1px solid ${GRAY_BDR}`, display: 'flex', alignItems: 'center', padding: '0 24px', gap: 12 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: '#CCFFE5', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', transition: 'transform 0.2s' }}>
                  <img src={IMG_LOGO} alt="VitalCast" style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'rotate(180deg) scaleY(-1)' }} />
                </div>
                <div style={{ fontWeight: 800, fontSize: 16, color: GREEN, letterSpacing: '-0.5px' }}>VitalCast</div>
              </div>
            </ButtonItem>

            {/* Nav */}
            <div style={{ paddingTop: 20 }}>
              {navItems.map((n, i) => {
                const isActive = n.label === 'Home'
                const isHovered = hoveredNav === n.label
                return (
                  <div
                    key={i}
                    onClick={() => handleNavClick(n)}
                    onMouseEnter={() => setHoveredNav(n.label)}
                    onMouseLeave={() => setHoveredNav(null)}
                    style={{
                      height: 53, paddingLeft: 20, display: 'flex', alignItems: 'center', gap: 12,
                      background: isActive ? '#E8F8ED' : (isHovered ? '#F3F4F6' : 'transparent'),
                      cursor: 'pointer', transition: 'background 0.2s'
                    }}
                  >
                    <div style={{ width: 18, height: 18, borderRadius: '50%', background: isActive ? LT_GREEN : (isHovered ? '#E5E7EB' : '#E8F8ED'), display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }}>
                      <img src={n.icon} alt="" style={{ width: 12, height: 12 }} />
                    </div>
                    <div style={{ fontWeight: 500, fontSize: 14, color: isActive ? GREEN : '#1A1A1A' }}>{n.label}</div>
                  </div>
                )
              })}
            </div>

            {/* Mascot & Bubble */}
            <div className="animate-float" style={{ position: 'absolute', bottom: 110, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }} onClick={() => navigate('/dashboard')}>

              {/* Bubble */}
              <div style={{ animation: 'fadeSlideUp 0.6s ease both', width: '85%', zIndex: 10 }}>
                <div style={{
                  background: '#E9F5E3',
                  border: '2px solid #82C485',
                  borderRadius: '24px',
                  padding: '16px 20px',
                  color: '#004D2C',
                  fontSize: 16,
                  fontWeight: 800,
                  lineHeight: 1.35,
                  textAlign: 'center',
                  boxShadow: '0 8px 24px rgba(45,146,76,0.12)',
                  whiteSpace: 'pre-line',
                  position: 'relative',
                  marginBottom: -8
                }}>
                  Welcome Back!
                  {/* The tail pointing straight down */}
                  <div style={{
                    position: 'absolute',
                    bottom: -10,
                    left: '50%',
                    marginLeft: -8,
                    width: 16,
                    height: 16,
                    background: '#E9F5E3',
                    borderBottom: '2px solid #82C485',
                    borderRight: '2px solid #82C485',
                    transform: 'rotate(45deg)'
                  }} />
                </div>
              </div>

              <div style={{ width: 280, height: 280, marginLeft: -20, pointerEvents: 'auto', transition: 'transform 0.2s' }} onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'} onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
                <img src={IMG_MASCOT_LARGE} alt="Mascot" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </div>
            </div>

            {/* User Profile */}
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '24px 20px', background: '#fff', borderTop: `1px solid ${GRAY_BDR}` }}>
              <ButtonItem onClick={() => alert('Profile settings functionality coming soon!')}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%' }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#E8F8ED', display: 'flex', alignItems: 'center', justifyContent: 'center', color: GREEN, fontWeight: 700, fontSize: 14 }}>
                    {(healthData?.userName || 'User').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 14, color: '#1A1A1A' }}>{healthData?.userName || 'User'}</div>
                    <div style={{ fontWeight: 400, fontSize: 12, color: GRAY_LIGHT }}>Last upload: Today</div>
                  </div>
                  <div style={{ color: GRAY_LIGHT }}>⋮</div>
                </div>
              </ButtonItem>

              <div style={{ marginTop: 16 }}>
                <div style={{ fontSize: 11, color: GRAY_LIGHT, fontWeight: 500 }}>Next check-in</div>
                <ButtonItem onClick={() => navigate('/upload')}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600, fontSize: 13, color: GREEN, marginTop: 4 }}>
                    Re-upload in 14 days
                    <div style={{ width: 16, height: 16, borderRadius: '50%', background: GREEN, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10 }}>→</div>
                  </div>
                </ButtonItem>
              </div>
            </div>
          </div>

          {/* MAIN CONTENT */}
          <div style={{ flex: 1, background: OFF_WHITE, display: 'flex', flexDirection: 'column', height: '100%' }}>

            {/* TopBar */}
            <div style={{ height: 72, background: '#fff', borderBottom: `1px solid ${GRAY_BDR}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px' }}>
              <div style={{ fontWeight: 800, fontSize: 24, color: '#1A1A1A' }}>Dashboard</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <ButtonItem onClick={() => alert('Profile quick menu coming soon!')}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#E8F8ED', display: 'flex', alignItems: 'center', justifyContent: 'center', color: GREEN, fontWeight: 700, fontSize: 14, fontFamily: F }}>
                    {(healthData?.userName || 'U').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
                  </div>
                </ButtonItem>
              </div>
            </div>

            {/* Grid */}
            <div style={{ padding: 16, flex: 1, overflowY: 'auto' }}>

              {/* MISSION BRIEFING */}
              <div style={{ 
                background: '#fff', border: `2px solid ${GREEN}`, borderRadius: 16, padding: '24px 32px', 
                marginBottom: 24, boxShadow: '0 10px 30px -5px rgba(45,146,76,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between'
              }}>
                <div>
                  <div style={{ color: GRAY_TXT, fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>
                    Your Current Mission: {plan.badge}
                  </div>
                  <div style={{ color: '#1A1A1A', fontSize: 24, fontWeight: 800, marginBottom: 8 }}>
                    {plan.goal}
                  </div>
                  <div style={{ color: GRAY_TXT, fontSize: 14, fontWeight: 500 }}>
                    {plan.why}
                  </div>
                </div>
                <button onClick={() => navigate('/dashboard')} style={{
                  background: GREEN, color: '#fff', border: 'none', borderRadius: 999, padding: '12px 24px',
                  fontWeight: 700, fontSize: 14, cursor: 'pointer', boxShadow: '0 4px 10px rgba(45,146,76,0.3)',
                  transition: 'transform 0.2s'
                }} onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'} onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
                  View Details →
                </button>
              </div>

              {/* ROW 1 */}
              <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
                <div className="card-hover" style={{ width: 480, height: 519, background: '#fff', borderRadius: 16, border: `1px solid ${GRAY_BDR}`, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                  <div style={{ fontWeight: 700, fontSize: 18, color: '#1A1A1A' }}>Health Snapshot</div>
                  <div style={{ display: 'flex', gap: 24, marginTop: 4, fontSize: 13, color: GRAY_TXT }}>
                    <div>Biological Age <strong style={{ color: '#1A1A1A' }}>{metrics.age}</strong></div>
                    <div>Last Update <strong style={{ color: '#1A1A1A' }}>Today</strong></div>
                  </div>

                  <DonutChart metrics={metrics} />

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px 16px' }}>
                    {[
                      { dotColor: '#EF4444', label: 'CVD Risk', val: `${metrics.cvdRisk}% 10-yr`, badge: cvdBadge },
                      { dotColor: GREEN, label: 'HRV Score', val: `${metrics.hrvScore} ms`, badge: hrvBadge },
                      { dotColor: '#F59E0B', label: 'Sleep', val: `PSQI ${metrics.psqi}`, badge: sleepBadge },
                      { dotColor: GREEN, label: 'Confidence', val: `${metrics.confidence}%`, badge: confBadge },
                    ].map((m, i) => (
                      <div key={i} className="hover-bg" style={{ padding: 8, borderRadius: 12, cursor: 'pointer' }} onClick={() => navigate('/dashboard')}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: GRAY_TXT, fontWeight: 500 }}>
                          <div style={{ width: 8, height: 8, borderRadius: '50%', background: m.dotColor }} />
                          {m.label}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                          <div style={{ fontWeight: 800, fontSize: 18, color: '#1A1A1A' }}>{m.val.split(' ')[0]}<span style={{ fontSize: 13, fontWeight: 500, marginLeft: 2 }}>{m.val.split(' ')[1] || ''}</span></div>
                          <div style={{ background: m.badge.bg, color: m.badge.color, borderRadius: 999, padding: '2px 8px', fontSize: 11, fontWeight: 600 }}>{m.badge.l}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="card-hover" style={{ width: 309, height: 519, background: '#fff', borderRadius: 16, border: `1px solid ${GRAY_BDR}`, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <div style={{ fontWeight: 700, fontSize: 18, color: '#1A1A1A' }}>Recent Readings</div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 12, color: GRAY_TXT }}>Daily Steps</div>
                      <div style={{ fontWeight: 800, fontSize: 14, color: '#1A1A1A' }}>{metrics.avgSteps.toLocaleString()} Steps</div>
                    </div>
                  </div>

                  <BarChart highlightedIndex={3} />

                  <div className="hover-bg" style={{ marginTop: 24, cursor: 'pointer', padding: 8, borderRadius: 8 }} onClick={() => alert('Opening detailed HRV graph...')}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 8 }}>
                      <span style={{ color: GRAY_TXT, fontWeight: 500 }}>HRV Trend</span>
                      <span style={{ fontWeight: 800, color: '#1A1A1A' }}>{metrics.hrvScore} ms</span>
                    </div>
                    <div style={{ display: 'flex', height: 8, borderRadius: 4, overflow: 'hidden' }}>
                      <div style={{ width: '65%', background: GREEN }} />
                      <div style={{ width: '35%', background: '#E5E7EB' }} />
                    </div>
                    <div style={{ display: 'flex', gap: 12, marginTop: 8, fontSize: 10, color: GRAY_TXT }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><div style={{ width: 6, height: 6, borderRadius: '50%', background: GREEN }} />Above Average</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><div style={{ width: 6, height: 6, borderRadius: '50%', background: '#E5E7EB' }} />Below Average</div>
                    </div>
                  </div>

                  <div className="hover-bg" style={{ marginTop: 16, cursor: 'pointer', padding: 8, borderRadius: 8 }} onClick={() => alert('Opening detailed Sleep breakdown...')}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 8 }}>
                      <span style={{ color: GRAY_TXT, fontWeight: 500 }}>Sleep Last Night</span>
                      <span style={{ fontWeight: 800, color: '#1A1A1A' }}>{metrics.avgSleepHours} hrs</span>
                    </div>
                    <div style={{ display: 'flex', height: 8, borderRadius: 4, overflow: 'hidden' }}>
                      <div style={{ width: `${(deepSleep / metrics.avgSleepHours) * 100}%`, background: GREEN }} />
                      <div style={{ width: `${(lightSleep / metrics.avgSleepHours) * 100}%`, background: '#111827' }} />
                    </div>
                    <div style={{ display: 'flex', gap: 12, marginTop: 8, fontSize: 10, color: GRAY_TXT }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><div style={{ width: 6, height: 6, borderRadius: '50%', background: GREEN }} />Deep Sleep: {deepSleep} hrs</div>
                    </div>
                    <div style={{ display: 'flex', gap: 12, marginTop: 4, fontSize: 10, color: GRAY_TXT }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><div style={{ width: 6, height: 6, borderRadius: '50%', background: '#111827' }} />Light Sleep: {lightSleep} hrs</div>
                    </div>
                  </div>

                </div>

                <div className="card-hover" style={{ width: 309, height: 519, background: '#fff', borderRadius: 16, border: `1px solid ${GRAY_BDR}`, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ fontWeight: 700, fontSize: 18, color: '#1A1A1A', marginBottom: 20 }}>Action Plan</div>

                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {[
                      { t: 'Sleep 7 hrs for 5 nights', s: 'Reduces your CVD risk by 2.1pp', c: true },
                      { t: '30 min walk daily', s: 'Improves HRV and longevity', c: true },
                      { t: 'No screens 1hr before bed', s: 'Targets your PSQI sleep debt', c: false },
                    ].map((a, i) => (
                      <div key={i} className="hover-bg" style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: 8, borderRadius: 8, cursor: 'pointer' }} onClick={() => navigate('/dashboard')}>
                        {a.c ? (
                          <div style={{ width: 24, height: 24, borderRadius: '50%', background: GREEN, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}>✓</div>
                        ) : (
                          <div style={{ width: 24, height: 24, borderRadius: '50%', border: `2px solid ${GRAY_BDR}`, flexShrink: 0 }} />
                        )}
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 14, color: '#1A1A1A', lineHeight: 1.2 }}>{a.t}</div>
                          <div style={{ fontSize: 12, color: GRAY_TXT, marginTop: 4 }}>{a.s}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div style={{ marginTop: 'auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: GRAY_TXT, marginBottom: 8 }}>
                      <span>Progress</span>
                      <span style={{ fontWeight: 700, color: GREEN }}>2/3 Actions</span>
                    </div>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {Array.from({ length: 10 }).map((_, i) => (
                        <div key={i} style={{ flex: 1, height: 8, borderRadius: 4, background: i < 7 ? LT_GREEN : '#E5E7EB', transition: 'background 0.3s' }} />
                      ))}
                    </div>
                    <div style={{ textAlign: 'center', marginTop: 16 }}>
                      <span onClick={() => navigate('/dashboard')} style={{ fontWeight: 600, fontSize: 13, color: GREEN, cursor: 'pointer', display: 'inline-block', padding: '8px 16px', borderRadius: 999, transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = '#E8F8ED'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                        View Full Plan →
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ROW 2 */}
              <div style={{ display: 'flex', gap: 16 }}>
                <div className="card-hover" style={{ width: 340, height: 369, background: '#fff', borderRadius: 16, border: `1px solid ${GRAY_BDR}`, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                  <div style={{ fontWeight: 700, fontSize: 18, color: '#1A1A1A', marginBottom: 20 }}>Model Outputs</div>
                  {[
                    { n: 1, t: 'Framingham CVD Model', s: 'Completed · Apr 28 2025', b: 'Completed' },
                    { n: 2, t: 'PSQI Sleep Scorer', s: 'Flags sleep debt + fragmentation', b: 'Completed' },
                    { n: 3, t: 'HRV Stress Index', s: 'Autonomic nervous system analysis', b: 'Running' },
                  ].map((m, i) => (
                    <div key={i} className="hover-bg" style={{ display: 'flex', gap: 16, marginBottom: 12, padding: 8, borderRadius: 12, cursor: 'pointer' }} onClick={() => navigate('/dashboard')}>
                      <div style={{ width: 28, height: 28, borderRadius: '50%', border: `1px solid ${GRAY_BDR}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 600, flexShrink: 0 }}>{m.n}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: 14, color: '#1A1A1A' }}>{m.t}</div>
                        <div style={{ fontSize: 12, color: GRAY_TXT, marginTop: 2, marginBottom: 8, lineHeight: 1.3 }}>{m.s}</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{ border: `1px solid ${GRAY_BDR}`, borderRadius: 6, padding: '2px 10px', fontSize: 12, fontWeight: 500, transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = '#E5E7EB'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>View</div>
                          <div style={{ background: m.b === 'Completed' ? '#D1FAE5' : '#FEF3C7', color: m.b === 'Completed' ? '#059669' : '#D97706', borderRadius: 999, padding: '2px 8px', fontSize: 11, fontWeight: 600 }}>{m.b}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="card-hover" style={{ width: 379, height: 369, background: '#fff', borderRadius: 16, border: `1px solid ${GRAY_BDR}`, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                  <div style={{ fontWeight: 700, fontSize: 18, color: '#1A1A1A', marginBottom: 16 }}>Cardiovascular</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: 16, height: 'calc(100% - 44px)' }}>
                    {[
                      { ic: ICON_HEART, v: `${metrics.cvdRisk}%`, u: '/ 30%', l: 'CVD Risk' },
                      { ic: ICON_SHIELD, v: `${metrics.confidence}%`, u: '', l: 'Model Confidence' },
                      { ic: ICON_BOLT, v: `${metrics.hrvScore}`, u: 'ms', l: 'HRV Average' },
                      { ic: ICON_BRAIN, v: `${metrics.restingHR}`, u: 'BPM', l: 'Resting Heart Rate' },
                    ].map((c, i) => (
                      <div key={i} style={{ border: `1px solid ${GRAY_BDR}`, borderRadius: 12, padding: 16, position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'center', transition: 'border-color 0.2s, transform 0.2s, background 0.2s', cursor: 'pointer' }} onMouseEnter={e => { e.currentTarget.style.borderColor = GREEN; e.currentTarget.style.transform = 'scale(1.02)'; e.currentTarget.style.background = '#F9FAFB' }} onMouseLeave={e => { e.currentTarget.style.borderColor = GRAY_BDR; e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.background = 'transparent' }} onClick={() => navigate('/dashboard')}>
                        <img src={c.ic} alt="" style={{ width: 20, height: 20, marginBottom: 8 }} />
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                          <div style={{ fontWeight: 800, fontSize: 24, color: '#1A1A1A' }}>{c.v}</div>
                          {c.u && <div style={{ fontSize: 14, color: GRAY_LIGHT }}>{c.u}</div>}
                        </div>
                        <div style={{ fontSize: 12, color: GRAY_TXT, marginTop: 4 }}>{c.l}</div>
                        <div style={{ position: 'absolute', top: 16, right: 16, color: GRAY_LIGHT }}>⋮</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="card-hover" style={{ width: 379, height: 369, background: '#fff', borderRadius: 16, border: `1px solid ${GRAY_BDR}`, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                  <div style={{ fontWeight: 700, fontSize: 18, color: '#1A1A1A' }}>Percentile Analysis</div>
                  <div style={{ fontSize: 13, color: GRAY_TXT, marginBottom: 24 }}>Your Age Group: 20–30</div>

                  <div className="hover-bg" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, padding: 12, borderRadius: 12, cursor: 'pointer' }} onClick={() => navigate('/dashboard')}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 10, height: 10, borderRadius: '50%', background: GREEN }} />
                        <div style={{ fontWeight: 600, fontSize: 14, color: '#1A1A1A' }}>HRV Score</div>
                      </div>
                      <div style={{ fontSize: 12, color: GRAY_TXT, marginLeft: 18 }}>Your Age Group: 20–30</div>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginTop: 8, marginLeft: 18 }}>
                        <div style={{ fontWeight: 800, fontSize: 28, color: '#1A1A1A' }}>{metrics.hrvScore}</div>
                        <div style={{ fontSize: 14, color: GRAY_LIGHT }}>/ms</div>
                      </div>
                      <div style={{ background: '#D1FAE5', color: '#059669', borderRadius: 999, padding: '4px 10px', fontSize: 12, fontWeight: 600, display: 'inline-block', marginTop: 8, marginLeft: 18 }}>
                        Top {100 - metrics.percentile}% for your age
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 40 }}>
                      {[15, 20, 15, 30, 25, 40].map((h, i) => (
                        <div key={i} style={{ width: 6, height: h, background: i === 5 ? GREEN : '#E5E7EB', borderRadius: 3, transition: 'height 0.3s ease' }} />
                      ))}
                    </div>
                  </div>

                  <div className="hover-bg" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 12, borderRadius: 12, cursor: 'pointer' }} onClick={() => navigate('/dashboard')}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#F59E0B' }} />
                        <div style={{ fontWeight: 600, fontSize: 14, color: '#1A1A1A' }}>Sleep Quality</div>
                      </div>
                      <div style={{ fontSize: 12, color: GRAY_TXT, marginLeft: 18 }}>PSQI Score</div>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginTop: 8, marginLeft: 18 }}>
                        <div style={{ fontWeight: 800, fontSize: 28, color: '#1A1A1A' }}>{metrics.psqi}</div>
                        <div style={{ fontSize: 14, color: GRAY_LIGHT }}>/21</div>
                      </div>
                      <div style={{ fontSize: 13, color: GRAY_TXT, marginTop: 8, marginLeft: 18 }}>
                        Bottom {metrics.psqi <= 5 ? 75 : metrics.psqi <= 8 ? 50 : 35}% for your age
                      </div>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </>
  )
}
