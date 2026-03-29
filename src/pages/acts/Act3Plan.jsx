import React, { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useHealth } from '../../App'
import { computeMetrics, getRiskFactors, generateWeeklyPlan } from '../../lib/models'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import mascotPdf from '../../assets/mascot_pdf.png'

const GREEN = '#2D924C'
const OFF_WHITE = '#F8FAF8'

export default function Act3Plan({ onBack }) {
  const navigate = useNavigate()
  const { metrics, healthData, SAMPLE_DATA } = useHealth()
  const m = metrics || computeMetrics(healthData || SAMPLE_DATA)
  
  const factors = useMemo(() => getRiskFactors(m), [m])
  const plan = useMemo(() => generateWeeklyPlan(factors), [factors])
  const topFactorId = factors[0]?.id

  const handleDownloadPDF = () => {
    try {
      const doc = new jsPDF()
      const primaryColor = [45, 146, 76] // #2D924C
      
      const safeText = (txt) => {
        if (!txt) return ""
        return String(txt).replace(/→/g, '->').replace(/±/g, '+/-').replace(/💡/g, '')
      }

      // Add Mascot to Top Right
      const imgElem = document.getElementById("pdf-mascot")
      if (imgElem) {
        doc.addImage(imgElem, "PNG", 160, 8, 36, 36)
      }

      // Header
      doc.setFont("helvetica", "bold")
      doc.setFontSize(24)
      doc.setTextColor(...primaryColor)
      doc.text("VitalCast Session Report", 14, 22)
      
      doc.setFontSize(12)
      doc.setTextColor(100, 100, 100)
      const today = new Date().toLocaleDateString()
      doc.text(`Generated on ${today}`, 14, 30)

      // Section 1: Action Plan
      doc.setFontSize(16)
      doc.setTextColor(20, 20, 20)
      doc.text("1. Your Action Plan", 14, 45)
      
      doc.setFont("helvetica", "normal")
      doc.setFontSize(12)
      doc.text(safeText(`Primary Focus: ${plan.badge}`), 14, 55)
      
      doc.setFont("helvetica", "bold")
      doc.setTextColor(...primaryColor)
      doc.text(safeText(`Goal: ${plan.goal}`), 14, 65)

      doc.setFont("helvetica", "normal")
      doc.setTextColor(60, 60, 60)
      doc.text(safeText(`Why it works: ${plan.why}`), 14, 75, { maxWidth: 180 })

      // Section 2: Clinical Findings
      doc.setFont("helvetica", "bold")
      doc.setFontSize(16)
      doc.setTextColor(20, 20, 20)
      doc.text("2. Clinical Findings & Risk Factors", 14, 95)

      const tableData = factors.map(f => [
        safeText(f.label), 
        safeText(f.level).toUpperCase(), 
        safeText(`${typeof f.value === 'number' ? f.value.toFixed(1) : f.value} ${f.unit}`),
        safeText(f.description),
        safeText(f.tip)
      ])

      autoTable(doc, {
        startY: 102,
        head: [['Factor', 'Risk Level', 'Measured Value', 'Description', 'Actionable Tip']],
        body: tableData,
        theme: 'grid',
        headStyles: { fillColor: primaryColor, textColor: 255 },
        styles: { fontSize: 10, cellPadding: 5 },
        columnStyles: {
          0: { fontStyle: 'bold' },
          1: { fontStyle: 'bold' }, 
          3: { cellWidth: 50 },
          4: { cellWidth: 40 }
        },
        didParseCell: function(data) {
          if (data.section === 'body' && data.column.index === 1) {
            if (data.cell.raw === 'HIGH') data.cell.styles.textColor = [220, 38, 38]
            if (data.cell.raw === 'MODERATE') data.cell.styles.textColor = [217, 119, 6]
            if (data.cell.raw === 'LOW') data.cell.styles.textColor = [5, 150, 105]
          }
        }
      })

      const finalY = doc.lastAutoTable?.finalY || 108

      // Section 3: Raw Biometrics
      doc.setFont("helvetica", "bold")
      doc.setFontSize(16)
      doc.setTextColor(20, 20, 20)
      doc.text("3. Raw Biometrics", 14, finalY + 15)

      const metricsData = [
        ['Resting Heart Rate', `${m.restingHR} bpm`],
        ['Heart Rate Variability (HRV)', `${m.hrvScore} / 100`],
        ['Daily Steps (Avg)', `${m.avgSteps}`],
        ['Sleep (Avg)', `${m.avgSleepHours} hrs`],
        ['Age-Group Percentile', `${m.percentile}th`]
      ]

      autoTable(doc, {
        startY: finalY + 22,
        head: [['Metric', 'Value']],
        body: metricsData,
        theme: 'striped',
        headStyles: { fillColor: [243, 244, 246], textColor: [50, 50, 50] },
        styles: { fontSize: 11, cellPadding: 5 },
        tableWidth: 100
      })

      // Footer
      doc.setFont("helvetica", "normal")
      doc.setFontSize(10)
      doc.setTextColor(150, 150, 150)
      doc.text("All models run locally. Not intended as medical diagnosis.", 14, 280)

      doc.save("VitalCast_Report.pdf")
    } catch (err) {
      console.error("PDF Generation failed:", err)
      alert("Oops! PDF generation failed. Check the console for details.")
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', fontFamily: "'DM Sans', sans-serif" }}>
      <img id="pdf-mascot" src={mascotPdf} style={{ display: 'none' }} alt="PDF Loader Image" />
      <div style={{ flex: 1, padding: '48px 60px', overflowY: 'auto' }}>
        <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 800, fontSize: 34, color: GREEN, letterSpacing: '-0.5px', margin: '0 0 8px 0' }}>
          Your plan for this week
        </h2>
        <p style={{ color: '#6B7280', fontSize: 16, margin: '0 0 40px 0' }}>
          One focused goal. Vita picked this based on your highest-priority risk.
        </p>

        {/* Big Goal Card */}
        <div style={{
          background: '#fff', border: '2px solid #8CE39A', borderRadius: 20, padding: '36px 40px',
          boxShadow: '0 10px 30px -5px rgba(45,146,76,0.1)', marginBottom: 32
        }}>
          <div style={{ marginBottom: 24 }}>
            <div style={{ color: '#6B7280', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>
              This week's goal
            </div>
            <div style={{ color: '#111827', fontSize: 28, fontWeight: 800 }}>
              {plan.goal}
            </div>
          </div>
          
          <div style={{ background: '#F8FAF8', borderRadius: 12, padding: '16px 20px', border: '1px solid #E5E7EB' }}>
            <div style={{ color: '#6B7280', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', marginBottom: 4 }}>Why it works</div>
            <div style={{ color: '#374151', fontSize: 15, fontWeight: 500 }}>{plan.why}</div>
          </div>
        </div>

        {/* Badges Row */}
        <div style={{ display: 'flex', gap: 16 }}>
          {[
            { id: 'cvd', n: 'Heart Starter', d: 'Cardio endurance' },
            { id: 'stress', n: 'Calm Seeker', d: 'Stress resilience' },
            { id: 'sleep', n: 'Sleep Builder', d: 'Recovery & rest' }
          ].map((b, i) => {
            const isActive = b.id === topFactorId
            return (
              <div key={b.id} style={{
                flex: 1, background: '#fff', borderRadius: 16, border: '1px solid #E5E7EB', padding: 24,
                opacity: isActive ? 1 : 0.4, position: 'relative'
              }}>
                <div style={{ fontWeight: 800, color: '#111827', fontSize: 18, marginBottom: 6 }}>{b.n}</div>
                <div style={{ color: '#6B7280', fontSize: 14 }}>{b.d}</div>
                
                {isActive ? (
                  <div style={{ position: 'absolute', top: 16, right: 16, background: '#FFE898', color: '#B45309', padding: '4px 8px', borderRadius: 6, fontSize: 11, fontWeight: 800, textTransform: 'uppercase' }}>
                    Active
                  </div>
                ) : (
                  <div style={{ position: 'absolute', top: 16, right: 16, color: '#9CA3AF', fontSize: 12, fontWeight: 700 }}>
                    🔒 Locked
                  </div>
                )}
              </div>
            )
          })}
        </div>

      </div>

      {/* Bottom Nav */}
      <div style={{ padding: '24px 60px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #E5E7EB', background: OFF_WHITE }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', color: '#6B7280', fontWeight: 600, fontSize: 16, cursor: 'pointer' }}>
          ← Back
        </button>
        <div style={{ display: 'flex', gap: 12 }}>
          <button
            onClick={handleDownloadPDF}
            style={{
              background: '#fff', border: `2px solid ${GREEN}`, borderRadius: 999, height: 52, padding: '0 32px',
              color: GREEN, fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 16,
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              transition: 'transform 0.2s'
            }}
          >
            Download PDF
          </button>
          <button
            onClick={() => navigate('/main-dashboard')}
            style={{
              background: GREEN, border: 'none', borderRadius: 999, height: 52, padding: '0 32px',
              color: '#fff', fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 16,
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              boxShadow: '0 4px 10px rgba(45,146,76,0.3)', transition: 'transform 0.2s'
            }}
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  )
}
