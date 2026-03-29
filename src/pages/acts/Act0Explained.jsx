import React from 'react'
import { useHealth } from '../../App'
import { computeMetrics } from '../../lib/models'

const GREEN = '#2D924C'
const OFF_WHITE = '#F8FAF8'

export default function Act0Explained({ onNext }) {
  const { metrics, healthData, SAMPLE_DATA } = useHealth()
  const m = metrics || computeMetrics(healthData || SAMPLE_DATA)

  // Card 1 — CVD Risk
  const cvdRisk = m ? m.cvdRisk : null
  const cvdColor = cvdRisk >= 20 ? '#DC2626' : cvdRisk >= 10 ? '#D97706' : '#059669'

  // Card 2 — HRV / Stress Index
  const stressIndex = m ? m.stressIndex : null
  const stressColor = stressIndex >= 70 ? '#DC2626' : stressIndex >= 45 ? '#D97706' : '#059669'

  // Card 3 — PSQI / Sleep Quality
  const psqi = m ? m.psqi : null
  const psqiColor = psqi >= 10 ? '#DC2626' : psqi >= 6 ? '#D97706' : '#059669'

  // Card 4 — Percentile
  const percentile = m ? m.percentile : null
  const percentileColor = percentile >= 60 ? '#059669' : percentile >= 40 ? '#D97706' : '#DC2626'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ flex: 1, overflowY: 'auto', padding: '48px 60px' }}>
        <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 800, fontSize: 34, color: GREEN, letterSpacing: '-0.5px', margin: '0 0 8px 0' }}>
          Here's what Vita calculated
        </h2>
        <p style={{ color: '#6B7280', fontSize: 16, margin: '0 0 40px 0' }}>
          Four models ran on your data. Here's what each one means.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 40 }}>

          {/* Card 1 */}
          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E5E7EB', padding: '24px 28px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'flex-start', gap: 24 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 800, fontSize: 16, color: '#111827', marginBottom: 4 }}>Cardiovascular Disease Risk</div>
              <div style={{ color: '#6B7280', fontSize: 14, lineHeight: 1.6 }}>
                The Framingham Risk Score estimates your chance of having a heart attack or stroke in the next 10 years. It uses your resting heart rate, activity level, age, and whether you smoke. Under 10% is low risk. 10–20% is moderate. Over 20% is high.
              </div>
            </div>
            <div style={{ textAlign: 'right', minWidth: 100 }}>
              <div style={{ fontWeight: 800, fontSize: 28, color: cvdColor, lineHeight: 1 }}>
                {cvdRisk != null ? cvdRisk.toFixed(1) : '--'}
              </div>
              <div style={{ color: '#6B7280', fontSize: 13, fontWeight: 600, marginTop: 4 }}>
                % in 10 yrs
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E5E7EB', padding: '24px 28px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'flex-start', gap: 24 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 800, fontSize: 16, color: '#111827', marginBottom: 4 }}>HRV Stress Index</div>
              <div style={{ color: '#6B7280', fontSize: 14, lineHeight: 1.6 }}>
                Heart Rate Variability (HRV) measures the tiny variation in time between your heartbeats. Higher variation = your nervous system is recovering well. Lower variation = your body is under stress. We convert it to a 0–100 stress score: lower is better. Under 30 is excellent. 30–55 is normal. Over 70 means your recovery is impaired.
              </div>
            </div>
            <div style={{ textAlign: 'right', minWidth: 100 }}>
              <div style={{ fontWeight: 800, fontSize: 28, color: stressColor, lineHeight: 1 }}>
                {stressIndex != null ? stressIndex.toFixed(0) : '--'}
              </div>
              <div style={{ color: '#6B7280', fontSize: 13, fontWeight: 600, marginTop: 4 }}>
                / 100 stress
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E5E7EB', padding: '24px 28px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'flex-start', gap: 24 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 800, fontSize: 16, color: '#111827', marginBottom: 4 }}>Sleep Quality (PSQI Score)</div>
              <div style={{ color: '#6B7280', fontSize: 14, lineHeight: 1.6 }}>
                The Pittsburgh Sleep Quality Index (PSQI) is a clinical scoring system used by doctors to assess sleep health. It looks at how many hours you sleep, how consistent your schedule is, and how rested you feel. Scored 0–21 — lower is better. Under 5 is good sleep. 5–10 is fair. Over 10 means your sleep is clinically disrupted and affecting other health markers.
              </div>
            </div>
            <div style={{ textAlign: 'right', minWidth: 100 }}>
              <div style={{ fontWeight: 800, fontSize: 28, color: psqiColor, lineHeight: 1 }}>
                {psqi != null ? psqi : '--'}
              </div>
              <div style={{ color: '#6B7280', fontSize: 13, fontWeight: 600, marginTop: 4 }}>
                PSQI score
              </div>
            </div>
          </div>

          {/* Card 4 */}
          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E5E7EB', padding: '24px 28px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'flex-start', gap: 24 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 800, fontSize: 16, color: '#111827', marginBottom: 4 }}>Your Age-Group Percentile</div>
              <div style={{ color: '#6B7280', fontSize: 14, lineHeight: 1.6 }}>
                We compare your combined CVD risk score to population data for people in your age range. Your percentile tells you where you land — 70th percentile means you have better cardiovascular health than 70% of people your age. This is not a diagnosis. It's a benchmark to track progress over time.
              </div>
            </div>
            <div style={{ textAlign: 'right', minWidth: 100 }}>
              <div style={{ fontWeight: 800, fontSize: 28, color: percentileColor, lineHeight: 1 }}>
                {percentile != null ? percentile : '--'}
              </div>
              <div style={{ color: '#6B7280', fontSize: 13, fontWeight: 600, marginTop: 4 }}>
                th percentile
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Nav */}
      <div style={{ padding: '24px 60px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #E5E7EB', background: OFF_WHITE, flexShrink: 0 }}>
        <div style={{ color: '#9CA3AF', fontSize: 12 }}>
          All models run locally in your browser. No data leaves your device.
        </div>
        <button
          onClick={onNext}
          style={{
            background: '#8CE39A', border: 'none', borderRadius: 999, height: 52, padding: '0 32px',
            color: '#004D2C', fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 16,
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 10px rgba(140,227,154,0.3)', transition: 'transform 0.2s'
          }}
        >
          Show results→
        </button>
      </div>
    </div>
  )
}
