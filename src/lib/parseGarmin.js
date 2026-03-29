/**
 * Garmin CSV parser
 * Targets Activities.csv, Health Snapshot.csv, or similar exports
 */

function parseCSV(text) {
  const lines = text.trim().split('\n')
  if (lines.length < 2) return []
  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, '').toLowerCase())
  return lines.slice(1).map(line => {
    const values = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''))
    const obj = {}
    headers.forEach((h, i) => { obj[h] = values[i] || '' })
    return obj
  })
}

function findColumn(row, candidates) {
  for (const key of Object.keys(row)) {
    for (const c of candidates) {
      if (key.toLowerCase().includes(c.toLowerCase())) return key
    }
  }
  return null
}

export function parseGarmin(csvText) {
  try {
    const rows = parseCSV(csvText)
    if (!rows.length) return null

    const sample = rows[0]

    // Detect column names dynamically
    const dateKey = findColumn(sample, ['date', 'day', 'time'])
    const avgHrKey = findColumn(sample, ['avg hr', 'avg heart', 'resting hr', 'min hr'])
    const hrvKey = findColumn(sample, ['hrv', 'heart rate variability'])
    const stepsKey = findColumn(sample, ['steps', 'step count'])
    const sleepKey = findColumn(sample, ['sleep', 'hours of sleep'])

    const cutoff = new Date()
    cutoff.setDate(cutoff.getDate() - 30)

    const hrValues = []
    const hrvValues = []
    const sleepValues = []
    const stepValues = []

    rows.forEach(row => {
      const rawDate = dateKey ? row[dateKey] : null
      const date = rawDate ? new Date(rawDate) : null
      if (date && isNaN(date.getTime())) return
      if (date && date < cutoff) return

      const hr = avgHrKey ? parseFloat(row[avgHrKey]) : NaN
      if (!isNaN(hr) && hr > 30 && hr < 200) hrValues.push(hr)

      const hrv = hrvKey ? parseFloat(row[hrvKey]) : NaN
      if (!isNaN(hrv) && hrv > 0) hrvValues.push(hrv)

      const sleep = sleepKey ? parseFloat(row[sleepKey]) : NaN
      if (!isNaN(sleep) && sleep > 0 && sleep < 24) sleepValues.push(sleep)

      const steps = stepsKey ? parseFloat(row[stepsKey].replace(/,/g, '')) : NaN
      if (!isNaN(steps) && steps >= 0) stepValues.push(steps)
    })

    const avg = arr => arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : null

    const restingHR = hrValues.length ? Math.round(avg(hrValues)) : null
    const hrv = hrvValues.length ? Math.round(avg(hrvValues)) : null
    const avgSleepHours = sleepValues.length ? parseFloat(avg(sleepValues).toFixed(1)) : null
    const avgSteps = stepValues.length ? Math.round(avg(stepValues)) : null

    return {
      restingHR,
      hrv,
      avgSleepHours,
      avgSteps,
      avgCalories: null,
      activityLevel: avgSteps ? Math.min(avgSteps / 10000, 1) : null,
      age: null,
      isSmoker: false,
      dataSource: 'garmin',
      parsedDays: Math.max(hrValues.length, sleepValues.length, stepValues.length),
    }
  } catch (err) {
    console.error('Garmin parse error:', err)
    return null
  }
}
