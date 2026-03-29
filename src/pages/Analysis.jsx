import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useHealth } from '../App'
import { computeMetrics } from '../lib/models'

export default function Analysis() {
  const navigate = useNavigate()
  const { healthData, setMetrics, SAMPLE_DATA } = useHealth()

  useEffect(() => {
    // Compute metrics seamlessly and instantly route to the Dashboard
    // since the new Onboarding LoadingScreen handles the UX delay now.
    const data = healthData || SAMPLE_DATA
    const computed = computeMetrics(data)
    setMetrics(computed)
    
    navigate('/dashboard')
  }, [healthData, SAMPLE_DATA, setMetrics, navigate])

  return null
}
