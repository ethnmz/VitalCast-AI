import React, { useState, useMemo } from 'react'
import { useHealth } from '../../App'
import { computeMetrics, simulateChange, calculateLifeGained } from '../../lib/models'

const GREEN = '#2D924C'
const OFF_WHITE = '#F8FAF8'

export default function Act2Simulator({ onNext, onBack }) {
  const { metrics, healthData, SAMPLE_DATA } = useHealth()
  const baseM = metrics || computeMetrics(healthData || SAMPLE_DATA)

  const [overrides, setOverrides] = useState({
    isSmoker: baseM.isSmoker,
    activityLevel: baseM.activityLevel,
    avgSleepHours: baseM.avgSleepHours
  })

  const simM = useMemo(() => simulateChange(baseM, overrides), [baseM, overrides])

  const riskChange = simM.cvdRisk - baseM.cvdRisk
  const isImproved = riskChange < 0
  const isWorse = riskChange > 0
  const lifeGained = calculateLifeGained(riskChange)

  const [showLogic, setShowLogic] = useState(false)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ flex: 1, padding: '48px 60px', overflowY: 'auto' }}>
        <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 800, fontSize: 34, color: GREEN, letterSpacing: '-0.5px', margin: '0 0 8px 0' }}>
          What if you changed one thing?
        </h2>
        <p style={{ color: '#6B7280', fontSize: 16, margin: '0 0 40px 0' }}>
          Move the controls and watch your CVD risk update live.
        </p>

        <div style={{ display: 'flex', gap: 40, alignItems: 'flex-start' }}>
          {/* Left Column - Controls */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
            
            {/* Control 1: Smoking */}
            <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E5E7EB', padding: 24 }}>
              <div style={{ fontWeight: 800, color: '#111827', fontSize: 16, marginBottom: 16 }}>Smoking Status</div>
              <div style={{ display: 'flex', gap: 12 }}>
                <button
                  onClick={() => setOverrides(o => ({ ...o, isSmoker: false }))}
                  style={{
                    flex: 1, height: 48, borderRadius: 12, fontWeight: 700, fontSize: 15, cursor: 'pointer',
                    background: !overrides.isSmoker ? '#E8F8ED' : '#F3F4F6',
                    color: !overrides.isSmoker ? GREEN : '#6B7280',
                    border: !overrides.isSmoker ? `2px solid ${GREEN}` : '2px solid transparent'
                  }}
                >
                  Non-Smoker
                </button>
                <button
                  onClick={() => setOverrides(o => ({ ...o, isSmoker: true }))}
                  style={{
                    flex: 1, height: 48, borderRadius: 12, fontWeight: 700, fontSize: 15, cursor: 'pointer',
                    background: overrides.isSmoker ? '#FFF1F1' : '#F3F4F6',
                    color: overrides.isSmoker ? '#DC2626' : '#6B7280',
                    border: overrides.isSmoker ? `2px solid #FCA5A5` : '2px solid transparent'
                  }}
                >
                  Smoker
                </button>
              </div>
            </div>

            {/* Control 2: Activity Level */}
            <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E5E7EB', padding: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <div style={{ fontWeight: 800, color: '#111827', fontSize: 16 }}>Activity Level</div>
                <div style={{ fontWeight: 700, color: GREEN, fontSize: 14 }}>
                  {overrides.activityLevel < 0.3 ? 'Sedentary' : overrides.activityLevel < 0.6 ? 'Light' : overrides.activityLevel < 0.85 ? 'Moderate' : 'Very Active'}
                </div>
              </div>
              <input 
                type="range" min="0.1" max="1.0" step="0.05"
                value={overrides.activityLevel}
                onChange={e => setOverrides(o => ({...o, activityLevel: parseFloat(e.target.value)}))}
                style={{ width: '100%', accentColor: GREEN, cursor: 'pointer' }}
              />
            </div>

            {/* Control 3: Sleep */}
            <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E5E7EB', padding: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <div style={{ fontWeight: 800, color: '#111827', fontSize: 16 }}>Average Sleep</div>
                <div style={{ fontWeight: 700, color: GREEN, fontSize: 14 }}>
                  {overrides.avgSleepHours.toFixed(1)} hrs/night
                </div>
              </div>
              <input 
                type="range" min="4" max="10" step="0.5"
                value={overrides.avgSleepHours}
                onChange={e => setOverrides(o => ({...o, avgSleepHours: parseFloat(e.target.value)}))}
                style={{ width: '100%', accentColor: GREEN, cursor: 'pointer' }}
              />
            </div>

          </div>

          {/* Right Column - Result Card */}
          <div style={{ width: 260, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{
              background: '#fff', borderRadius: 20, border: '1px solid #E5E7EB', padding: '32px 24px',
              textAlign: 'center', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)'
            }}>
              <div style={{ color: '#6B7280', fontSize: 13, fontWeight: 700, textTransform: 'uppercase', marginBottom: 24, letterSpacing: '0.5px' }}>
                CVD Risk Change
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 24 }}>
                <div style={{ color: '#9CA3AF', fontSize: 24, fontWeight: 700, textDecoration: 'line-through' }}>
                  {baseM.cvdRisk.toFixed(1)}%
                </div>
                <div style={{ color: '#D1D5DB' }}>→</div>
                <div style={{ color: '#111827', fontSize: 36, fontWeight: 800 }}>
                  {simM.cvdRisk.toFixed(1)}%
                </div>
              </div>

              <div style={{
                background: isImproved ? '#F0FDF4' : isWorse ? '#FFF1F1' : '#F3F4F6',
                color: isImproved ? '#166534' : isWorse ? '#991B1B' : '#4B5563',
                padding: '8px 16px', borderRadius: 99, display: 'inline-block', fontWeight: 700, fontSize: 14,
                marginBottom: 32
              }}>
                {riskChange === 0 ? 'No change' : `${riskChange > 0 ? '+' : ''}${riskChange.toFixed(1)}% Risk`}
              </div>

              {isImproved && (
                <div style={{ 
                  background: '#E8F8ED', color: GREEN, padding: '12px', borderRadius: 12, 
                  fontWeight: 800, fontSize: 15, marginBottom: 24, animation: 'fadeSlideUp 0.3s ease'
                }}>
                  +{lifeGained} Days Active Life
                </div>
              )}

              <div style={{ color: '#9CA3AF', fontSize: 12, lineHeight: 1.4, marginBottom: 16 }}>
                Based on Framingham risk model.<br/>Updates reflect 10-year projection.
              </div>

              <button onClick={() => setShowLogic(!showLogic)} style={{ background: 'none', border: 'none', color: GREEN, fontSize: 12, fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}>
                {showLogic ? 'Hide Equation' : 'View Clinical Logic'}
              </button>
            </div>

             {/* Logic Overlay */}
             {showLogic && (
                <div style={{ background: '#111827', borderRadius: 16, padding: 20, color: '#D1D5DB', fontFamily: 'monospace', fontSize: 12, animation: 'fadeSlideUp 0.3s ease' }}>
                   <div style={{ color: '#9CA3AF', marginBottom: 8, fontSize: 10, textTransform: 'uppercase', letterSpacing: '1px', fontFamily: "'DM Sans', sans-serif" }}>Framingham Equation</div>
                   <div style={{ marginBottom: 6 }}><span style={{ color: '#FCD34D' }}>Age:</span> {((baseM.age || 35) - 30).toFixed(1)} * 0.4</div>
                   <div style={{ marginBottom: 6 }}><span style={{ color: '#60A5FA' }}>Rest HR:</span> {((overrides.restingHR || baseM.restingHR || 65) - 60).toFixed(1)} * 0.1</div>
                   <div style={{ marginBottom: 6 }}><span style={{ color: '#34D399' }}>Activity:</span> {(1 - overrides.activityLevel).toFixed(2)} * 5</div>
                   <div style={{ marginBottom: 6 }}><span style={{ color: '#A78BFA' }}>Sleep Debt:</span> {Math.max(0, 7 - overrides.avgSleepHours).toFixed(1)} * 1.5</div>
                   <div style={{ marginBottom: 8 }}><span style={{ color: '#F87171' }}>Smoking:</span> {overrides.isSmoker ? '+ 8.0' : '+ 0.0'}</div>
                   <div style={{ borderTop: '1px dashed #4B5563', paddingTop: 8, color: '#F9FAFB', fontWeight: 'bold' }}>
                     = {simM.cvdRisk.toFixed(1)}% Risk
                   </div>
                </div>
             )}
          </div>
        </div>
      </div>

      {/* Bottom Nav */}
      <div style={{ padding: '24px 60px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #E5E7EB', background: OFF_WHITE }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', color: '#6B7280', fontWeight: 600, fontSize: 16, cursor: 'pointer' }}>
          ← Back
        </button>
        <button
          onClick={onNext}
          style={{
            background: '#8CE39A', border: 'none', borderRadius: 999, height: 52, width: 217,
            color: '#004D2C', fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 16,
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            boxShadow: '0 4px 10px rgba(140,227,154,0.3)', transition: 'transform 0.2s'
          }}
        >
          Build my plan →
        </button>
      </div>
    </div>
  )
}
