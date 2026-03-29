import { useState, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import Vita from '../components/Vita'
import { useHealth } from '../App'
import { parseAppleHealth } from '../lib/parseAppleHealth'
import { parseGarmin } from '../lib/parseGarmin'

const BG_ICONS = [
  { icon: '⌬', x: '8%', y: '12%', size: 28, op: 0.06, rot: 15 },
  { icon: '◈', x: '88%', y: '8%', size: 22, op: 0.05, rot: -10 },
  { icon: '⊕', x: '15%', y: '75%', size: 32, op: 0.055, rot: 0 },
  { icon: '⌀', x: '82%', y: '72%', size: 26, op: 0.05, rot: 20 },
  { icon: '◉', x: '50%', y: '5%', size: 18, op: 0.04, rot: 0 },
  { icon: '⊗', x: '92%', y: '45%', size: 20, op: 0.04, rot: -5 },
  { icon: '⌭', x: '5%', y: '45%', size: 24, op: 0.05, rot: 8 },
]

function HeartbeatLine() {
  return (
    <svg width="120" height="32" viewBox="0 0 120 32" fill="none" className="absolute bottom-3 right-4 opacity-5">
      <path
        d="M0 16 L20 16 L26 4 L32 28 L38 4 L44 28 L50 16 L120 16"
        stroke="#00D154"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  )
}

export default function Upload() {
  const navigate = useNavigate()
  const { setHealthData } = useHealth()
  const [dragging, setDragging] = useState(false)
  const [fileName, setFileName] = useState(null)
  const [error, setError] = useState(null)
  const [processing, setProcessing] = useState(false)
  const fileRef = useRef(null)

  const handleFile = useCallback(async (file) => {
    if (!file) return
    setFileName(file.name)
    setError(null)
    setProcessing(true)

    try {
      const text = await file.text()
      let parsed = null

      if (file.name.endsWith('.xml')) {
        parsed = parseAppleHealth(text)
      } else if (file.name.endsWith('.csv')) {
        parsed = parseGarmin(text)
      }

      setHealthData(parsed || { dataSource: 'sample' })
    } catch (e) {
      console.error(e)
      setHealthData({ dataSource: 'sample' })
    }

    setProcessing(false)
    navigate('/analysis')
  }, [navigate, setHealthData])

  const onDrop = useCallback((e) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }, [handleFile])

  const onDragOver = (e) => { e.preventDefault(); setDragging(true) }
  const onDragLeave = () => setDragging(false)

  const handleUseSample = () => {
    setHealthData({ dataSource: 'sample' })
    navigate('/analysis')
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden px-4"
      style={{ background: '#004D2C' }}
    >
      {/* Medical grid */}
      <div className="absolute inset-0 medical-grid opacity-40" />

      {/* Background decoration icons */}
      {BG_ICONS.map((b, i) => (
        <div
          key={i}
          className="absolute select-none pointer-events-none font-mono"
          style={{
            left: b.x,
            top: b.y,
            fontSize: b.size,
            opacity: b.op,
            color: '#00D154',
            transform: `rotate(${b.rot}deg)`,
          }}
        >
          {b.icon}
        </div>
      ))}

      {/* Radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(0,209,84,0.08) 0%, transparent 70%)',
        }}
      />

      {/* DNA strand decorations */}
      <svg className="absolute left-0 top-0 h-full opacity-[0.035]" width="80" viewBox="0 0 80 600" fill="none">
        {Array.from({ length: 12 }).map((_, i) => (
          <g key={i}>
            <circle cx="20" cy={40 + i * 48} r="6" fill="#00D154" />
            <circle cx="60" cy={64 + i * 48} r="6" fill="#00D154" />
            <line x1="20" y1={40 + i * 48} x2="60" y2={64 + i * 48} stroke="#00D154" strokeWidth="1.5" />
          </g>
        ))}
      </svg>

      {/* Main card */}
      <div
        className="relative w-full max-w-[520px] rounded-2xl p-8 page-enter"
        style={{
          background: 'rgba(255,255,255,0.97)',
          boxShadow: '0 24px 80px rgba(0,0,0,0.3), 0 0 0 1px rgba(0,209,84,0.1)',
        }}
      >
        <HeartbeatLine />

        {/* Vita mascot */}
        <div className="flex justify-center mb-5">
          <Vita size="lg" animated />
        </div>

        {/* Headline */}
        <div className="text-center mb-6">
          <h1
            className="font-bold text-secondary mb-2"
            style={{ fontSize: '1.75rem', lineHeight: 1.2, fontFamily: "'DM Sans', sans-serif" }}
          >
            Drop in your health data
          </h1>
          <p className="text-gray-500 text-sm leading-relaxed max-w-sm mx-auto">
            VitalCast runs your Garmin or Apple Health export through clinical AI models
            to predict your health trajectory.
          </p>
        </div>

        {/* Drop zone */}
        <div
          className={`drop-zone rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer mb-4 text-center relative transition-all duration-200 ${
            dragging ? 'drag-over scale-[1.01]' : ''
          }`}
          style={{ minHeight: 180 }}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onClick={() => fileRef.current?.click()}
        >
          <input
            ref={fileRef}
            type="file"
            accept=".xml,.csv"
            className="hidden"
            onChange={e => e.target.files[0] && handleFile(e.target.files[0])}
          />

          {processing ? (
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <span className="text-sm text-secondary font-medium">Reading file...</span>
            </div>
          ) : fileName ? (
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M4 10l4.5 4.5L16 6" stroke="#00D154" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="font-mono text-sm text-secondary font-semibold">{fileName}</span>
              <span className="text-xs text-gray-400">Click to choose a different file</span>
            </div>
          ) : (
            <>
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
                style={{ background: 'rgba(0,209,84,0.08)' }}
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" stroke="#004D2C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  <polyline points="17 8 12 3 7 8" stroke="#00D154" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  <line x1="12" y1="3" x2="12" y2="15" stroke="#00D154" strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
              </div>
              <p className="text-secondary font-semibold text-sm mb-1">
                Drop your export file here
              </p>
              <p className="text-gray-400 text-xs">
                Apple Health <span className="font-mono">.xml</span> or Garmin <span className="font-mono">.csv</span>
              </p>
              <p className="text-gray-300 text-xs mt-2">or click to browse</p>
            </>
          )}
        </div>

        {error && (
          <p className="text-tertiary text-xs text-center mb-3 font-medium">{error}</p>
        )}

        {/* CTA */}
        <button className="btn-primary w-full text-center mb-4" onClick={() => fileRef.current?.click()}>
          Choose file
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-px bg-gray-100" />
          <span className="text-xs text-gray-300 font-medium">or</span>
          <div className="flex-1 h-px bg-gray-100" />
        </div>

        <button
          className="w-full text-center text-sm text-gray-400 hover:text-secondary transition-colors font-medium py-2"
          onClick={handleUseSample}
        >
          Use sample data to explore the dashboard →
        </button>

        {/* Privacy note */}
        <div className="mt-5 pt-4 border-t border-gray-50 flex items-center justify-center gap-2">
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <path d="M6.5 1L2 3v4c0 2.5 2 4.5 4.5 5.5C9 11.5 11 9.5 11 7V3L6.5 1z" stroke="#00D154" strokeWidth="1.2" fill="none"/>
            <path d="M4.5 6.5l1.5 1.5 2.5-2.5" stroke="#00D154" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="text-[11px] text-gray-400">
            Privacy secured — processed entirely in your browser
          </span>
        </div>
      </div>

      {/* Bottom label */}
      <div className="absolute bottom-6 left-0 right-0 text-center">
        <span className="text-xs font-mono" style={{ color: 'rgba(0,209,84,0.3)', letterSpacing: '0.12em' }}>
          VITALCAST · CLINICAL AI · v1.0
        </span>
      </div>
    </div>
  )
}
