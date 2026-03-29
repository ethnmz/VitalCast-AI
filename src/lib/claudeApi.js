/**
 * Claude API integration — generates Vita's health narrative
 */

export async function generateNarrative(metrics) {
  const {
    cvdRisk, hrvScore, restingHR, psqi, stressIndex,
    avgSteps, forecast, dataSource
  } = metrics

  const trajectory = forecast && forecast.length
    ? (forecast[29].value > forecast[0].value ? 'slightly increasing over 30 days' : 'stable to improving over 30 days')
    : 'stable'

  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY

  if (!apiKey) {
    return getFallbackNarrative(metrics)
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages: [{
          role: 'user',
          content: `You are Vita, a friendly clinical AI health assistant inside VitalCast.

A user has uploaded their wearable health data. Here are their computed metrics:
- 10-year CVD risk: ${cvdRisk}%
- HRV score: ${hrvScore}/100
- Resting HR: ${restingHR} bpm
- Sleep quality (PSQI): ${psqi}/21
- Autonomic stress index: ${stressIndex}/100
- Average daily steps: ${avgSteps?.toLocaleString() ?? 'N/A'}
- 30-day risk trajectory: ${trajectory}
- Data source: ${dataSource === 'apple' ? 'Apple Health' : dataSource === 'garmin' ? 'Garmin' : 'sample dataset'}

Write a warm, clear, 3-sentence health narrative that:
1. Acknowledges what is going well in their data
2. Flags the most important area to watch
3. Gives one specific, actionable recommendation

Do NOT say you are Claude. Speak as Vita. Do not use bullet points. Plain paragraph only. Do not give medical diagnoses.`
        }]
      })
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      console.error('Claude API error:', error)
      return getFallbackNarrative(metrics)
    }

    const data = await response.json()
    return data.content?.[0]?.text || getFallbackNarrative(metrics)
  } catch (err) {
    console.error('Claude API fetch error:', err)
    return getFallbackNarrative(metrics)
  }
}

function getFallbackNarrative(metrics) {
  const { cvdRisk, hrvScore, restingHR, psqi, avgSteps } = metrics

  const hrvStatus = hrvScore >= 60 ? 'solid HRV readings' : 'HRV metrics worth monitoring'
  const sleepStatus = psqi <= 5 ? 'restful sleep patterns' : psqi <= 10 ? 'moderate sleep quality' : 'sleep quality that could use attention'
  const stepsStatus = avgSteps >= 8000 ? 'an active lifestyle' : 'daily movement'

  let watchArea = ''
  let recommendation = ''

  if (cvdRisk > 15) {
    watchArea = `Your 10-year cardiovascular risk score of ${cvdRisk}% is the area I'd watch most closely.`
    recommendation = 'Incorporating 30 minutes of moderate cardio 4 days per week could meaningfully shift this trajectory over the next quarter.'
  } else if (psqi > 7) {
    watchArea = 'Your sleep quality score suggests you may not be getting the deep recovery your body needs.'
    recommendation = 'Try keeping a consistent sleep schedule — even on weekends — and aim for 7–8 hours to let your HRV recover overnight.'
  } else if (hrvScore < 40) {
    watchArea = 'Your autonomic nervous system is showing signs of elevated stress, reflected in your HRV score.'
    recommendation = 'A short 5-minute breathing exercise before bed — like 4-7-8 breathing — can measurably improve HRV within two weeks.'
  } else {
    watchArea = 'Your metrics are tracking well across the board.'
    recommendation = `Sustaining ${avgSteps?.toLocaleString() ?? '8,000+'} daily steps and your current sleep schedule will keep these numbers moving in the right direction.`
  }

  return `Your data shows ${hrvStatus} and ${sleepStatus}, which speaks well of your recovery and ${stepsStatus}. ${watchArea} ${recommendation}`
}
