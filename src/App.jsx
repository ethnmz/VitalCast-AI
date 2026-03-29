import { Routes, Route } from 'react-router-dom'
import { useState, createContext, useContext } from 'react'
import Home from './pages/Home'
import Onboarding from './pages/Onboarding'
import Upload from './pages/Upload'
import Analysis from './pages/Analysis'
import Dashboard from './pages/Dashboard'
import MainDashboard from './pages/MainDashboard'

export const HealthContext = createContext(null)

export function useHealth() {
  return useContext(HealthContext)
}

const SAMPLE_DATA = {
  restingHR: 85,
  hrv: 32,
  avgSleepHours: 5.2,
  avgSteps: 2800,
  age: 52,
  activityLevel: 0.2,
  isSmoker: true,
  dataSource: 'sample',
  parsedDays: 14,
}

export default function App() {
  const [healthData, setHealthData] = useState(null)
  const [metrics, setMetrics] = useState(null)

  return (
    <HealthContext.Provider value={{ healthData, setHealthData, metrics, setMetrics, SAMPLE_DATA }}>
      <div className="min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/analysis" element={<Analysis />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/main-dashboard" element={<MainDashboard />} />
        </Routes>
      </div>
    </HealthContext.Provider>
  )
}
