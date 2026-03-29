import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useHealth } from '../App'
import Act0Explained from './acts/Act0Explained'
import Act1Findings from './acts/Act1Findings'
import Act2Simulator from './acts/Act2Simulator'
import Act3Plan from './acts/Act3Plan'
import mascotClipboard from '../assets/mascot_clipboard.png'
import mascotPointing from '../assets/mascot_pointing.png'
import mascotStarry from '../assets/mascot_starry.png'
import mascotWaving from '../assets/mascot_waving.png'

const GREEN      = '#2D924C'
const OFF_WHITE  = '#F8FAF8'

const IMG_LOGO = 'https://www.figma.com/api/mcp/asset/f1e470f6-824d-42d2-983e-7d1b4ec04e29'
const ICON_HOME    = 'https://www.figma.com/api/mcp/asset/bc3eab3b-7c01-4387-aa11-262da582d804'
const ICON_INSIGHT = 'https://www.figma.com/api/mcp/asset/ae3b0c8e-d2e1-48ac-98d2-11b572107dcf'
const ICON_PLAN    = 'https://www.figma.com/api/mcp/asset/05119e6f-e679-4bce-9269-9c68a420176a'

const ACT_BUBBLES = {
  0: "Let me explain what I calculated\nbefore we look at your results.",
  1: "Here's what I found!\nLet's go through it together.",
  2: "Try changing things\n— watch your risk live!",
  3: "This is your goal\nfor this week.\nYou've got this!"
}

export default function Dashboard() {
  const [act, setAct] = useState(0)
  const navigate = useNavigate()
  const { healthData } = useHealth()
  const userName = healthData?.userName || ''
  const initials = userName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || 'U'

  const CurrentActComponent = act === 0 ? Act0Explained : act === 1 ? Act1Findings : act === 2 ? Act2Simulator : Act3Plan
  const currentMascot = act === 0 ? mascotWaving : act === 1 ? mascotClipboard : act === 2 ? mascotPointing : mascotStarry

  return (
    <>
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .act-enter { animation: fadeSlideUp 0.4s ease both; }
      `}</style>
      
      <div style={{ background: GREEN, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px', fontFamily: "'DM Sans', sans-serif" }}>
        
        {/* Main Card */}
        <div style={{ width: '100%', maxWidth: 1600, height: 'calc(100vh - 64px)', borderRadius: 24, overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', display: 'flex', flexDirection: 'column', background: '#fff' }}>
          
          {/* 1. Top Horizontal Nav Bar */}
          <div style={{ height: 72, borderBottom: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px', flexShrink: 0 }}>
            {/* Logo row */}
            <div 
              onClick={() => navigate('/')} 
              style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}
            >
              <div style={{ width: 36, height: 36, borderRadius: 10, background: '#CCFFE5', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                <img src={IMG_LOGO} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'rotate(180deg) scaleY(-1)' }} />
              </div>
              <span style={{ fontWeight: 800, fontSize: 20, color: GREEN, letterSpacing: '-0.5px' }}>VitalCast</span>
            </div>
            
            {/* Subtle Horizontal Nav Items + User Avatar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {[
                { id: 0, label: 'Explained', icon: ICON_HOME },
                { id: 1, label: 'Analysis', icon: ICON_HOME },
                { id: 2, label: 'Simulator', icon: ICON_INSIGHT },
                { id: 3, label: 'Action Plan', icon: ICON_PLAN },
              ].map(item => {
                const isActive = act === item.id
                return (
                  <button
                    key={item.id}
                    onClick={() => setAct(item.id)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 8, padding: '8px 20px', borderRadius: 99, border: 'none', cursor: 'pointer',
                      background: isActive ? '#E8F8ED' : 'transparent',
                      color: isActive ? GREEN : '#6B7280',
                      fontWeight: isActive ? 800 : 600, fontSize: 15, fontFamily: "'DM Sans', sans-serif",
                      transition: 'background 0.2s', outline: 'none'
                    }}
                  >
                    <img src={item.icon} alt="" style={{ width: 18, height: 18, opacity: isActive ? 1 : 0.5 }} />
                    {item.label}
                  </button>
                )
              })}
              <div style={{ width: 1, height: 28, background: '#E5E7EB', margin: '0 8px' }} />
              <div style={{
                width: 36, height: 36, borderRadius: '50%', background: '#E8F8ED',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: GREEN, fontWeight: 700, fontSize: 14, fontFamily: "'DM Sans', sans-serif",
                cursor: 'default'
              }}>
                {initials}
              </div>
            </div>
          </div>

          {/* 2. Main Two-Column Content Area */}
          <div style={{ flex: 1, background: OFF_WHITE, display: 'flex', position: 'relative', overflow: 'hidden' }}>
            
            {/* Left Vita Panel */}
            <div style={{ width: 340, background: '#fff', borderRight: '1px solid #E5E7EB', display: 'flex', flexDirection: 'column', position: 'relative', flexShrink: 0 }}>
              
              {/* Speech bubble — Pure CSS recreation facing Mascot */}
              <div key={`bubble-${act}`} className="act-enter" style={{ position: 'absolute', bottom: 330, left: 32, right: 32, zIndex: 10 }}>
                <div style={{
                  background: '#E9F5E3',
                  border: '2px solid #82C485',
                  borderRadius: '24px',
                  padding: '18px 24px',
                  color: '#004D2C',
                  fontSize: 18,
                  fontWeight: 800,
                  lineHeight: 1.35,
                  textAlign: 'center',
                  boxShadow: '0 8px 24px rgba(45,146,76,0.12)',
                  whiteSpace: 'pre-line',
                  position: 'relative'
                }}>
                  {ACT_BUBBLES[act]}
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

              {/* Vita mascot image (bottom anchored) */}
              <div key={`mascot-${act}`} className="act-enter" style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: 300, display: 'flex', justifyContent: 'center', overflow: 'hidden' }}>
                <img src={currentMascot} alt="Vita Mascot" style={{ height: '100%', objectFit: 'contain', objectPosition: 'bottom center' }} />
              </div>
            </div>

            {/* 3. Main Act Content */}
            <div key={`act-${act}`} className="act-enter" style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
              <CurrentActComponent 
                onNext={() => setAct(a => Math.min(3, a + 1))} 
                onBack={() => setAct(a => Math.max(0, a - 1))} 
              />
            </div>

          </div>
        </div>
      </div>
    </>
  )
}
