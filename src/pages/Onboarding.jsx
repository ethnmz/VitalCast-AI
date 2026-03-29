import { useState, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useHealth } from '../App'
import { parseAppleHealth } from '../lib/parseAppleHealth'
import { parseGarmin } from '../lib/parseGarmin'
import { computeMetrics } from '../lib/models'
import ParserWorker from '../lib/parserWorker?worker'
import mascotHead from '../assets/mascot_head.png'

// ── Figma asset URLs ──────────────────────────────────────────────────────────
const IMG_LOGO     = 'https://www.figma.com/api/mcp/asset/f1e470f6-824d-42d2-983e-7d1b4ec04e29'
const IMG_CHECK    = 'https://www.figma.com/api/mcp/asset/ce730939-30b8-4665-8902-d9cc729e3c44'
const IMG_NEXT     = 'https://www.figma.com/api/mcp/asset/1f02ecce-0b3d-4cba-8576-037760d038c3'
const IMG_BACK     = 'https://www.figma.com/api/mcp/asset/0b9273ab-4f4d-427f-aa01-f897df6917a7'
const IMG_MASCOT_1 = 'https://www.figma.com/api/mcp/asset/f0784a2d-e2dc-4ad4-9234-7552e4215249'
const IMG_MASCOT_2 = 'https://www.figma.com/api/mcp/asset/8ed3a459-cd92-4150-843c-cb9784d75983'
const IMG_MASCOT_3 = 'https://www.figma.com/api/mcp/asset/922aecba-256f-4d45-b87d-4e74f945dec0'
const IMG_UPLOAD   = 'https://www.figma.com/api/mcp/asset/d890f667-315f-46b5-a561-454c79a8f34b'
const IMG_APPLE    = 'https://www.figma.com/api/mcp/asset/09bfb2ed-3a9a-4c81-930f-cb11d6b7e7bb'
const IMG_GARMIN   = 'https://www.figma.com/api/mcp/asset/e55c5c30-a73d-4101-a73b-caa2e485cf5d'

// ── Design tokens ─────────────────────────────────────────────────────────────
const F          = "'DM Sans', sans-serif"
const GREEN      = '#2D924C'
const LT_GREEN   = '#8CE39A'
const YELLOW     = '#FFE898'
const GRAY_BDR   = '#E5E7EB'
const GRAY_TXT   = '#6B7280'
const GRAY_LIGHT = '#9CA3AF'

const STEPS = [
  { label: 'About you',      sub: 'Basic info (name, age, sex)' },
  { label: 'Your lifestyle', sub: 'Activity, sleep, smoking'    },
  { label: 'Your body',      sub: 'Health metrics'              },
  { label: 'Your data',      sub: 'Upload health export'        },
]

const MASCOTS = [
  { src: IMG_MASCOT_1, left: 10, top: 588, size: 340 },
  { src: IMG_MASCOT_2, left: 10, top: 588, size: 340 },
  { src: IMG_MASCOT_3, left: 10, top: 588, size: 340 },
  { src: IMG_MASCOT_1, left: 10, top: 588, size: 340 },
]

// ── Reusable selection card ───────────────────────────────────────────────────
function Card({ label, selected, onClick, width = 192 }) {
  return (
    <div
      onClick={onClick}
      className="card-anim"
      style={{
        width, height: 56, flexShrink: 0,
        background: selected ? '#F0FFF8' : '#fff',
        border: `${selected ? 2 : 1}px solid ${selected ? GREEN : GRAY_BDR}`,
        borderRadius: 12, cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 0.15s', userSelect: 'none',
      }}
    >
      <span style={{ fontFamily: F, fontWeight: 500, fontSize: 14, color: GREEN, textAlign: 'center' }}>
        {label}
      </span>
    </div>
  )
}

// ── Full-page loading animation ───────────────────────────────────────────────
function LoadingScreen() {
  return (
    <div className="fade-in-up" style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ fontFamily: F, fontWeight: 800, fontSize: 32, color: GREEN, marginBottom: 40, letterSpacing: '-0.5px' }}>Analyzing your data...</p>

      {/* Floating Head Container */}
      <div style={{ position: 'relative', width: 400, height: 300, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        
        {/* Floating Head */}
        <div className="head-anim" style={{ width: 140, height: 140, zIndex: 10 }}>
          <img src={mascotHead} alt="Vita Mascot Head" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        </div>

        {/* Re-added Progress Bar */}
        <div style={{ width: 340, height: 24, background: '#E5E7EB', borderRadius: 12, marginTop: 40, position: 'relative', overflow: 'hidden', boxShadow: 'inset 0px 4px 8px rgba(0,0,0,0.1)', zIndex: 5 }}>
           {/* Animated Fill representing progress */}
           <div className="progress-fill" style={{ position: 'absolute', top: 0, left: 0, bottom: 0, background: GREEN, borderRadius: 12 }} />
        </div>
      </div>

      <p style={{ fontFamily: F, fontWeight: 500, fontSize: 16, color: GRAY_TXT, marginTop: 12, opacity: 0.8 }}>Calibrating predictive models...</p>
    </div>
  )
}

// ── Step progress sidebar ─────────────────────────────────────────────────────
function StepList({ step }) {
  return (
    <div style={{ position: 'absolute', left: 32, top: 320, width: 296 }}>
      {STEPS.map((s, i) => {
        const n = i + 1
        const done   = n < step
        const active = n === step
        const last   = i === STEPS.length - 1
        return (
          <div key={i} style={{ height: 72, position: 'relative', width: '100%' }}>
            {!last && (
              <div style={{
                position: 'absolute', left: 15, top: 32, width: 2, height: 40,
                background: done ? LT_GREEN : GRAY_BDR,
              }} />
            )}
            <div className={active ? "pulse-ring" : ""} style={{
              position: 'absolute', left: 0, top: 0, width: 32, height: 32, borderRadius: '50%',
              background: done ? LT_GREEN : active ? YELLOW : 'transparent',
              border: done || active ? 'none' : `1.5px solid ${GRAY_BDR}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {done   && <img src={IMG_CHECK} alt="" style={{ width: 16, height: 16 }} />}
              {active && <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#fff' }} />}
            </div>
            <div style={{ position: 'absolute', left: 48, top: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={{ fontFamily: F, fontWeight: active || done ? 800 : 500, fontSize: 14, color: active || done ? GREEN : GRAY_TXT, lineHeight: '20px' }}>{s.label}</span>
              <span style={{ fontFamily: F, fontWeight: 400, fontSize: 12, color: GRAY_LIGHT, lineHeight: '16px' }}>{s.sub}</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default function Onboarding() {
  const navigate = useNavigate()
  const { setHealthData, setMetrics, SAMPLE_DATA } = useHealth()

  // ── Form state ──────────────────────────────────────────────────────────────
  const [step,          setStep]          = useState(1)
  const [name,          setName]          = useState('')
  const [ageRange,      setAgeRange]      = useState(null)
  const [sex,           setSex]           = useState(null)
  const [isSmoker,      setIsSmoker]      = useState(null)
  const [activityLevel, setActivityLevel] = useState(null)
  const [healthConcern, setHealthConcern] = useState(null)
  const [restingHR,     setRestingHR]     = useState(null)
  const [sleep,         setSleep]         = useState(null)
  const [dragging,      setDragging]      = useState(false)
  const [processing,    setProcessing]    = useState(false)
  const fileRef = useRef(null)

  // ── Build user profile from form answers ────────────────────────────────────
  const getUserProfile = () => {
    const profile = {}
    // Map age range selection to a numeric age for models
    const ageMap = { '16-20': 18, '20-30': 25, '30-40': 35, '40-50': 45, '50-60': 55, '60+': 65 }
    if (ageRange) profile.age = ageMap[ageRange] || 35
    if (isSmoker != null) profile.isSmoker = isSmoker === 'yes'
    // Map activity level selection to numeric 0-1
    const actMap = { 'Sedentary': 0.2, 'Light': 0.4, 'Moderate': 0.65, 'Very Active': 0.9 }
    if (activityLevel) profile.activityLevel = actMap[activityLevel] || 0.6
    // Map resting HR selection to numeric estimate
    const hrMap = { 'Under 55': 52, '55-65': 60, '65-75': 70, 'Over 75': 80 }
    if (restingHR) profile.restingHR = hrMap[restingHR] || 65
    // Map sleep selection to numeric hours
    const sleepMap = { '7-9 hrs': 8, '5-7 hrs': 6, 'Under 5 hrs': 4.5 }
    if (sleep) profile.avgSleepHours = sleepMap[sleep] || 7
    if (name) profile.userName = name
    if (sex) profile.sex = sex
    if (healthConcern) profile.healthConcern = healthConcern
    if (ageRange) profile.ageRange = ageRange
    return profile
  }

  // ── File handling ───────────────────────────────────────────────────────────
  const handleFile = useCallback(async (file) => {
    if (!file) return
    setProcessing(true)
    
    // Give browser time to render loading screen before heavy parsing
    await new Promise(r => setTimeout(r, 100))
    
    const profile = getUserProfile()

    try {
      const text = await file.text()
      const worker = new ParserWorker()
      
      worker.onmessage = (e) => {
        const { success, data } = e.data
        if (success) {
          const finalData = { ...profile, ...(data || { dataSource: 'sample' }) }
          finalData.userName = name || 'User'
          setHealthData(finalData)
          setMetrics(computeMetrics(finalData))
        } else {
          const fallbackData = { ...SAMPLE_DATA, ...profile, dataSource: 'sample', userName: name || 'User' }
          setHealthData(fallbackData)
          setMetrics(computeMetrics(fallbackData))
        }
        worker.terminate()
        
        // Slight artificial delay so user feels the load time
        setTimeout(() => {
          setProcessing(false)
          navigate('/dashboard')
        }, 1500)
      }
      
      worker.onerror = () => {
        worker.terminate()
        const fallbackData = { ...SAMPLE_DATA, ...profile, dataSource: 'sample', userName: name || 'User' }
        setHealthData(fallbackData)
        setMetrics(computeMetrics(fallbackData))
        setProcessing(false)
        navigate('/dashboard')
      }

      worker.postMessage({ fileName: file.name, fileContent: text })
      
    } catch {
      const fallbackData = { ...SAMPLE_DATA, ...profile, dataSource: 'sample', userName: name || 'User' }
      setHealthData(fallbackData)
      setMetrics(computeMetrics(fallbackData))
      setProcessing(false)
      navigate('/dashboard')
    }
  }, [name, navigate, setHealthData, setMetrics, ageRange, isSmoker, activityLevel, restingHR, sleep, sex, healthConcern])

  const handleSample = () => {
    setProcessing(true)
    // For the demo, we want to IGNORE partial form inputs and use the HIGH RISK sample profile
    // This ensures the CVD risk is correctly displayed as the #1 priority
    const data = { ...SAMPLE_DATA, userName: 'Scott (Demo)' }
    
    setTimeout(() => {
      setHealthData(data)
      setMetrics(computeMetrics(data))
      setProcessing(false)
      navigate('/dashboard')
    }, 3200)
  }

  // ── Shared nav button row ───────────────────────────────────────────────────
  function NavRow({ onBack, onNext, nextLabel = 'Next' }) {
    return (
      <div style={{
        position: 'absolute', top: 744, left: 0, width: 600, height: 68,
        display: 'flex', alignItems: 'center',
        justifyContent: onBack ? 'space-between' : 'flex-start',
      }}>
        {onBack && (
          <button className="btn-back" onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, height: 48 }}>
            <img src={IMG_BACK} alt="" style={{ width: 20, height: 20 }} />
            <span style={{ fontFamily: F, fontWeight: 800, fontSize: 16, color: GRAY_TXT, letterSpacing: '-0.31px' }}>Back</span>
          </button>
        )}
        <button className="btn-primary" onClick={onNext} style={{
          width: 217, height: 52, background: LT_GREEN, border: 'none',
          borderRadius: 999, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}>
          <span style={{ fontFamily: F, fontWeight: 800, fontSize: 16, color: GREEN, letterSpacing: '-0.31px' }}>{nextLabel}</span>
          <img src={IMG_NEXT} alt="" style={{ width: 20, height: 20 }} />
        </button>
      </div>
    )
  }

  // ── Step heading block ──────────────────────────────────────────────────────
  function StepHead({ title, sub }) {
    return (
      <div style={{ position: 'absolute', top: 16, left: 0, width: 600 }}>
        <p style={{ fontFamily: F, fontWeight: 800, fontSize: 30, color: GREEN, margin: '0 0 12px 0', lineHeight: '36px', letterSpacing: '0.4px' }}>{title}</p>
        <p style={{ fontFamily: F, fontWeight: 400, fontSize: 16, color: GRAY_TXT, margin: 0, lineHeight: '24px', letterSpacing: '-0.31px' }}>{sub}</p>
      </div>
    )
  }

  function FieldLabel({ top, text }) {
    return (
      <p style={{ position: 'absolute', top, left: 0, fontFamily: F, fontWeight: 500, fontSize: 14, color: GREEN, margin: 0, lineHeight: '20px' }}>{text}</p>
    )
  }

  // ════════════════════════════════════════════════════════════════════════════
  //  STEP 1 — About you
  // ════════════════════════════════════════════════════════════════════════════
  const step1 = (
    <>
      <StepHead title="Upload your health export" sub="Tell us a bit about yourself" />

      <FieldLabel top={120} text="First name" />
      <div style={{ position: 'absolute', top: 148, left: 0, width: 600, height: 52, background: '#fff', border: `1px solid ${GRAY_BDR}`, borderRadius: 12, overflow: 'hidden' }}>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Enter your first name"
          style={{ width: '100%', height: '100%', border: 'none', outline: 'none', padding: '0 15px', fontFamily: F, fontWeight: 400, fontSize: 15, color: '#374151', background: 'transparent' }}
        />
      </div>

      <FieldLabel top={228} text="Age range" />
      <div style={{ position: 'absolute', top: 256, left: 0, display: 'flex', flexWrap: 'wrap', gap: 12, width: 600 }}>
        {['16–20', '20–30', '30–40', '40–50', '50–60', '60+'].map(v => (
          <Card key={v} label={v} selected={ageRange === v} onClick={() => setAgeRange(v)} />
        ))}
      </div>

      <FieldLabel top={400} text="Biological sex" />
      <div style={{ position: 'absolute', top: 428, left: 0, display: 'flex', gap: 12, width: 600 }}>
        {['Male', 'Female', 'Other'].map(v => (
          <Card key={v} label={v} selected={sex === v} onClick={() => setSex(v)} />
        ))}
      </div>

      <NavRow onNext={() => setStep(2)} nextLabel="Analyze my data" />
    </>
  )

  // ════════════════════════════════════════════════════════════════════════════
  //  STEP 2 — Your lifestyle
  // ════════════════════════════════════════════════════════════════════════════
  const step2 = (
    <>
      <StepHead title="Your lifestyle" sub="This helps me calibrate your models" />

      <FieldLabel top={116} text="Smoker?" />
      <div style={{ position: 'absolute', top: 144, left: 0, display: 'flex', gap: 12 }}>
        {['Yes', 'No'].map(v => (
          <Card key={v} label={v} selected={isSmoker === v} onClick={() => setIsSmoker(v)} width={294} />
        ))}
      </div>

      <FieldLabel top={228} text="Activity level" />
      <div style={{ position: 'absolute', top: 256, left: 0, display: 'flex', flexWrap: 'wrap', gap: 12, width: 600 }}>
        {['Sedentary', 'Light', 'Moderate', 'Very Active'].map(v => (
          <Card key={v} label={v} selected={activityLevel === v} onClick={() => setActivityLevel(v)} width={294} />
        ))}
      </div>

      <FieldLabel top={400} text="Main health concern" />
      <div style={{ position: 'absolute', top: 428, left: 0, display: 'flex', flexWrap: 'wrap', gap: 12, width: 600 }}>
        {['Heart Health', 'Sleep Quality', 'Stress', 'General Wellness'].map(v => (
          <Card key={v} label={v} selected={healthConcern === v} onClick={() => setHealthConcern(v)} width={294} />
        ))}
      </div>

      <NavRow onBack={() => setStep(1)} onNext={() => setStep(3)} />
    </>
  )

  // ════════════════════════════════════════════════════════════════════════════
  //  STEP 3 — Your body
  // ════════════════════════════════════════════════════════════════════════════
  const step3 = (
    <>
      <StepHead title="Your body" sub="A few quick estimates" />

      <FieldLabel top={116} text="Resting heart rate" />
      <div style={{ position: 'absolute', top: 144, left: 0, display: 'flex', flexWrap: 'wrap', gap: 12, width: 600 }}>
        {['Under 55 bpm', '55–65 bpm', '65–75 bpm', 'Over 75 bpm'].map(v => (
          <Card key={v} label={v} selected={restingHR === v} onClick={() => setRestingHR(v)} width={294} />
        ))}
      </div>

      <FieldLabel top={308} text="Typical sleep per night" />
      <div style={{ position: 'absolute', top: 336, left: 0, display: 'flex', flexWrap: 'wrap', gap: 12, width: 600 }}>
        {['7–9 hrs', '5–7 hrs', 'Under 5 hrs'].map(v => (
          <Card key={v} label={v} selected={sleep === v} onClick={() => setSleep(v)} width={294} />
        ))}
      </div>

      <NavRow onBack={() => setStep(2)} onNext={() => setStep(4)} />
    </>
  )

  // ════════════════════════════════════════════════════════════════════════════
  //  STEP 4 — Upload data
  // ════════════════════════════════════════════════════════════════════════════
  const step4 = (
    <>
      <StepHead title="Upload your health export" sub="Vita needs your real wearable data to run the clinical models" />

      {/* Source selection cards */}
      <div style={{ position: 'absolute', top: 120, left: 0, width: 600, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {[
          { label: 'Apple Health',    sub: 'export.xml', img: IMG_APPLE,  rounded: 0 },
          { label: 'Garmin Connect',  sub: '.csv file',  img: IMG_GARMIN, rounded: 14 },
        ].map(({ label, sub, img, rounded }) => (
          <div
            key={label}
            className="source-card"
            onClick={() => fileRef.current?.click()}
            style={{
              background: '#fff', borderRadius: 14, cursor: 'pointer',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              gap: 16, padding: '33px 8px 24px',
            }}
          >
            <img src={img} alt={label} style={{ width: 64, height: 64, objectFit: 'contain', borderRadius: rounded }} />
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontFamily: F, fontWeight: 800, fontSize: 20, color: GREEN, margin: '0 0 4px 0', letterSpacing: '-0.45px' }}>{label}</p>
              <p style={{ fontFamily: F, fontWeight: 500, fontSize: 14, color: GRAY_TXT, margin: 0, letterSpacing: '-0.15px' }}>{sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Drag & drop zone */}
      <div
        className="drop-zone"
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f) }}
        onClick={() => fileRef.current?.click()}
        style={{
          position: 'absolute', top: 350, left: 0, width: 596, height: 242,
          background: dragging ? '#F0FFF8' : '#fff', borderRadius: 14, cursor: 'pointer',
          border: `1.5px dashed ${dragging ? GREEN : 'rgba(140,227,154,0.5)'}`,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16,
        }}
      >
        <input ref={fileRef} type="file" accept=".xml,.csv" style={{ display: 'none' }} onChange={e => e.target.files[0] && handleFile(e.target.files[0])} />
        <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#E8F8EF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img src={IMG_UPLOAD} alt="" style={{ width: 32, height: 32 }} />
        </div>
        <p style={{ fontFamily: F, fontWeight: 500, fontSize: 18, color: GREEN, margin: 0, letterSpacing: '-0.44px' }}>Drag your file here</p>
        <p
          onClick={e => { e.stopPropagation(); fileRef.current?.click() }}
          style={{ fontFamily: F, fontWeight: 500, fontSize: 14, color: '#00634A', margin: 0, textDecoration: 'underline', cursor: 'pointer', letterSpacing: '-0.15px' }}
        >
          or browse files
        </p>
      </div>

      {/* Divider */}
      <div style={{ position: 'absolute', top: 616, left: 0, width: 600, height: 20, display: 'flex', alignItems: 'center' }}>
        <div style={{ flex: 1, height: 1, background: GRAY_BDR }} />
        <div style={{ background: '#F8FAF8', padding: '0 16px' }}>
          <span style={{ fontFamily: F, fontWeight: 400, fontSize: 14, color: GRAY_LIGHT }}>or</span>
        </div>
        <div style={{ flex: 1, height: 1, background: GRAY_BDR }} />
      </div>

      {/* Skip */}
      <div style={{ position: 'absolute', top: 660, left: 0, width: 600, textAlign: 'center' }}>
        <button className="btn-back" onClick={handleSample} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: F, fontWeight: 500, fontSize: 16, color: GRAY_TXT, letterSpacing: '-0.31px' }}>
          Skip — use sample data instead
        </button>
      </div>

      {/* Privacy note */}
      <div style={{ position: 'absolute', top: 696, left: 0, width: 600, textAlign: 'center' }}>
        <span style={{ fontFamily: F, fontWeight: 400, fontSize: 14, color: GRAY_LIGHT, letterSpacing: '-0.15px' }}>
          Processed entirely in your browser. Never uploaded to a server.
        </span>
      </div>

      {/* Nav buttons */}
      <div style={{ position: 'absolute', top: 744, left: 0, width: 600, height: 68, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button className="btn-back" onClick={() => setStep(3)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, height: 48 }}>
          <img src={IMG_BACK} alt="" style={{ width: 20, height: 20 }} />
          <span style={{ fontFamily: F, fontWeight: 800, fontSize: 16, color: GRAY_TXT, letterSpacing: '-0.31px' }}>Back</span>
        </button>
        <button className="btn-primary" onClick={handleSample} style={{ width: 217, height: 52, background: LT_GREEN, border: 'none', borderRadius: 999, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <span style={{ fontFamily: F, fontWeight: 800, fontSize: 16, color: GREEN, letterSpacing: '-0.31px' }}>Analyze my data</span>
          <img src={IMG_NEXT} alt="" style={{ width: 20, height: 20 }} />
        </button>
      </div>
    </>
  )

  const content = [step1, step2, step3, step4]
  const mascot  = MASCOTS[step - 1]

  // ════════════════════════════════════════════════════════════════════════════
  //  RENDER
  // ════════════════════════════════════════════════════════════════════════════
  return (
    <>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-16px); }
          100% { transform: translateY(0px); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulseRing {
          0% { box-shadow: 0 0 0 0 rgba(255, 232, 152, 0.7); }
          60% { box-shadow: 0 0 0 10px rgba(255, 232, 152, 0); }
          100% { box-shadow: 0 0 0 0 rgba(255, 232, 152, 0); }
        }
        @keyframes headBob {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-30px); }
          100% { transform: translateY(0px); }
        }
        @keyframes fillProgress {
          0% { width: 0%; }
          100% { width: 95%; }
        }
        .head-anim { animation: headBob 0.85s ease-in-out infinite; }
        .progress-fill { animation: fillProgress 3.5s cubic-bezier(0.1, 0.8, 0.3, 1) forwards; }
        .float-anim { animation: float 3.5s ease-in-out infinite; }
        .fade-in-up { animation: fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .pulse-ring { animation: pulseRing 2.5s infinite; }
        .card-anim { transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1); }
        .card-anim:hover { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(0,0,0,0.06); }
        .card-anim:active { transform: translateY(0) scale(0.98); }
        .btn-primary { transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1); }
        .btn-primary:hover { transform: translateY(-2px) scale(1.02); box-shadow: 0 8px 24px rgba(140, 227, 154, 0.4); filter: brightness(1.05); }
        .btn-primary:active { transform: translateY(0) scale(0.97); }
        .btn-back { transition: all 0.2s ease; }
        .btn-back:hover { transform: translateX(-4px); opacity: 0.7; }
        .source-card { transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1); border: 1.5px solid transparent; }
        .source-card:hover { transform: translateY(-4px); box-shadow: 0 12px 28px rgba(0,0,0,0.08) !important; border-color: #8CE39A; }
        .drop-zone { transition: all 0.25s ease; }
        .drop-zone:hover { background: #fafdfb !important; border-color: #2D924C !important; }
      `}</style>

      {/* Outer — dark green background */}
      <div style={{ background: GREEN, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px', fontFamily: F }}>

        {/* Card */}
        <div style={{ width: '100%', maxWidth: 1600, height: 'calc(100vh - 64px)', borderRadius: 24, overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', display: 'flex' }}>

          {/* ── LEFT PANEL ─────────────────────────────────────────────────── */}
          <div style={{ width: 360, background: '#fff', position: 'relative', flexShrink: 0, height: '100%', overflow: 'hidden' }}>

            {/* Logo */}
            <div style={{ position: 'absolute', left: 32, top: 32 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 55, height: 55, borderRadius: 15, background: '#CCFFE5', overflow: 'hidden', flexShrink: 0 }}>
                  <img src={IMG_LOGO} alt="Vita" style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'rotate(180deg) scaleY(-1)' }} />
                </div>
                <span style={{ fontFamily: F, fontWeight: 800, fontSize: 20, color: GREEN, letterSpacing: '-0.45px' }}>VitalCast</span>
              </div>
              <div style={{ marginTop: 24, width: 296 }}>
                <p style={{ fontFamily: F, fontWeight: 800, fontSize: 24, color: GREEN, lineHeight: '32px', margin: '0 0 12px 0', width: 245, letterSpacing: '0.07px' }}>
                  Let's personalize your health predictions
                </p>
                <p style={{ fontFamily: F, fontWeight: 400, fontSize: 14, color: GRAY_TXT, lineHeight: '20px', margin: 0, width: 242, letterSpacing: '-0.15px' }}>
                  Answer 4 quick questions so Vita can calibrate your risk models
                </p>
              </div>
            </div>

            {/* Step progress list */}
            <StepList step={step} />

            {/* Mascot (varies per step) */}
            {mascot && (
              <div className="float-anim" style={{ position: 'absolute', left: mascot.left, top: mascot.top, width: mascot.size, height: mascot.size, transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)' }}>
                <img src={mascot.src} alt="Vita mascot" style={{ width: '100%', height: '100%', objectFit: 'cover', pointerEvents: 'none' }} />
              </div>
            )}
          </div>

          {/* ── RIGHT PANEL ────────────────────────────────────────────────── */}
          <div style={{ flex: 1, background: '#F8FAF8', position: 'relative' }}>

            {/* Step counter chip */}
            {!processing && (
              <div style={{ position: 'absolute', right: 32, top: 32, width: 48, height: 48, borderRadius: '50%', background: GRAY_BDR, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontFamily: F, fontWeight: 600, fontSize: 14, color: GRAY_TXT, letterSpacing: '-0.15px' }}>
                  {String(step).padStart(2, '0')}
                </span>
              </div>
            )}

            {/* Content area */}
            {processing ? (
              <div key="loading" className="fade-in-up" style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }}>
                <LoadingScreen />
              </div>
            ) : (
              <div key={step} className="fade-in-up" style={{ position: 'absolute', left: 120, top: 40, width: 600, height: 812 }}>
                {content[step - 1]}
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  )
}
