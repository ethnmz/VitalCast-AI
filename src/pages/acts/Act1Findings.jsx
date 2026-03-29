import React, { useMemo } from 'react'
import { useHealth } from '../../App'
import { computeMetrics, getRiskFactors } from '../../lib/models'

const GREEN = '#2D924C'
const OFF_WHITE = '#F8FAF8'

const LEVEL_COLORS = {
  high: { bg: '#FFF1F1', border: '#FCA5A5', text: '#DC2626', label: 'High Risk' },
  moderate: { bg: '#FFFBEB', border: '#FCD34D', text: '#D97706', label: 'Moderate' },
  low: { bg: '#F0FFF8', border: '#6EE7B7', text: '#059669', label: 'Good' }
}

export default function Act1Findings({ onNext }) {
  const { metrics, healthData, SAMPLE_DATA } = useHealth()
  const m = metrics || computeMetrics(healthData || SAMPLE_DATA)
  const factors = useMemo(() => getRiskFactors(m), [m])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ flex: 1, overflowY: 'auto', padding: '48px 60px' }}>
        <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 800, fontSize: 34, color: GREEN, letterSpacing: '-0.5px', margin: '0 0 8px 0' }}>
          Here's what Vita found.
        </h2>
        <p style={{ color: '#6B7280', fontSize: 16, margin: '0 0 40px 0' }}>
          Three areas ranked by clinical priority.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 40 }}>
          {factors.map((factor, i) => {
            const isTop = i === 0
            const colors = LEVEL_COLORS[factor.level]

            return (
              <div key={factor.id} style={{
                background: '#fff', borderRadius: 16, border: '1px solid #E5E7EB',
                padding: '24px 28px', display: 'flex', alignItems: 'flex-start', gap: 24,
                boxShadow: isTop ? '0 10px 25px -5px rgba(0,0,0,0.05)' : 'none'
              }}>
                {/* Rank number */}
                <div style={{
                  width: 32, height: 32, borderRadius: 16, flexShrink: 0,
                  background: isTop ? GREEN : '#F3F4F6', color: isTop ? '#fff' : '#9CA3AF',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 800, fontSize: 16
                }}>
                  {i + 1}
                </div>

                {/* Middle content */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                    <div style={{ fontWeight: 800, fontSize: 18, color: '#111827' }}>{factor.label}</div>
                    <div style={{
                      background: colors.bg, border: `1px solid ${colors.border}`, color: colors.text,
                      padding: '2px 10px', borderRadius: 99, fontSize: 12, fontWeight: 700, textTransform: 'uppercase'
                    }}>
                      {colors.label}
                    </div>
                  </div>
                  <div style={{ color: '#4B5563', fontSize: 15, marginBottom: 12, lineHeight: 1.4 }}>
                    {factor.description}
                  </div>
                  <div style={{
                    display: 'inline-block', background: '#F0FDF4', color: '#166534',
                    padding: '6px 14px', borderRadius: 8, fontSize: 13, fontWeight: 600
                  }}>
                    {factor.tip}
                  </div>
                </div>

                {/* Right value */}
                <div style={{ textAlign: 'right', minWidth: 100 }}>
                  <div style={{ fontWeight: 800, fontSize: 32, color: '#111827', lineHeight: 1 }}>
                    {typeof factor.value === 'number' ? factor.value.toFixed(1) : factor.value}
                  </div>
                  <div style={{ color: '#6B7280', fontSize: 13, fontWeight: 600, marginTop: 4 }}>
                    {factor.unit}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: 32 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
            <span style={{ fontWeight: 800, fontSize: 48, color: '#111827', letterSpacing: '-1px' }}>
              {m.percentile}th
            </span>
            <span style={{ color: '#4B5563', fontSize: 16 }}>
              percentile for cardiovascular health in your age group.
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Nav */}
      <div style={{ padding: '24px 60px', display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid #E5E7EB', background: OFF_WHITE }}>
        <button
          onClick={onNext}
          style={{
            background: '#8CE39A', border: 'none', borderRadius: 999, height: 52, width: 217,
            color: '#004D2C', fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 16,
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            boxShadow: '0 4px 10px rgba(140,227,154,0.3)', transition: 'transform 0.2s'
          }}
        >
          Next →
        </button>
      </div>
    </div>
  )
}
