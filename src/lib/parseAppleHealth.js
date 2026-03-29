/**
 * Apple Health XML parser — regex-based line scanner
 * Handles very large (800MB+) export files without DOMParser
 * Uses indexOf-based line iteration to avoid split() memory overhead
 */

function attr(line, name) {
  const idx = line.indexOf(name + '="')
  if (idx === -1) return null
  const start = idx + name.length + 2
  const end = line.indexOf('"', start)
  return end === -1 ? null : line.slice(start, end)
}

export function parseAppleHealth(xmlText) {
  try {
    const cutoff = new Date()
    cutoff.setDate(cutoff.getDate() - 30)
    const cutoffStr = cutoff.toISOString().slice(0, 10)

    // --- Extract profile from <Me> element (in first ~10KB) ---
    let dob = null
    let bioSex = null
    const meIdx = xmlText.indexOf('<Me ')
    if (meIdx !== -1) {
      const meEnd = xmlText.indexOf('>', meIdx)
      const meLine = xmlText.slice(meIdx, meEnd + 1)
      dob = attr(meLine, 'HKCharacteristicTypeIdentifierDateOfBirth')
      const sexRaw = attr(meLine, 'HKCharacteristicTypeIdentifierBiologicalSex')
      if (sexRaw === 'HKBiologicalSexMale') bioSex = 'Male'
      else if (sexRaw === 'HKBiologicalSexFemale') bioSex = 'Female'
    }

    let age = null
    if (dob) {
      const born = new Date(dob)
      const now = new Date()
      age = now.getFullYear() - born.getFullYear()
      if (now.getMonth() < born.getMonth() || (now.getMonth() === born.getMonth() && now.getDate() < born.getDate())) {
        age--
      }
    }

    // --- Scan records line by line using indexOf ---
    const hrByDay = {}
    const hrvValues = []
    const sleepByDay = {}
    const stepsByDay = {}
    const calsByDay = {}

    let pos = 0
    const len = xmlText.length

    while (pos < len) {
      const nextNewline = xmlText.indexOf('\n', pos)
      const lineEnd = nextNewline === -1 ? len : nextNewline

      // Quick check: does this line contain <Record?
      const recordIdx = xmlText.indexOf('<Record ', pos)
      if (recordIdx === -1 || recordIdx >= lineEnd) {
        pos = lineEnd + 1
        continue
      }

      const line = xmlText.slice(pos, lineEnd)
      pos = lineEnd + 1

      const type = attr(line, 'type')
      if (!type) continue

      const startDate = attr(line, 'startDate')
      if (!startDate) continue
      const dateKey = startDate.slice(0, 10)

      if (dateKey < cutoffStr) continue

      switch (type) {
        case 'HKQuantityTypeIdentifierHeartRate': {
          const val = parseFloat(attr(line, 'value'))
          if (!isNaN(val)) {
            if (!hrByDay[dateKey] || val < hrByDay[dateKey]) hrByDay[dateKey] = val
          }
          break
        }
        case 'HKQuantityTypeIdentifierHeartRateVariabilitySDNN': {
          const val = parseFloat(attr(line, 'value'))
          if (!isNaN(val)) hrvValues.push(val)
          break
        }
        case 'HKCategoryTypeIdentifierSleepAnalysis': {
          const value = attr(line, 'value')
          // Only count actual sleep stages, not InBed or Awake
          const isAsleep = value === 'HKCategoryValueSleepAnalysisAsleepCore'
            || value === 'HKCategoryValueSleepAnalysisAsleepDeep'
            || value === 'HKCategoryValueSleepAnalysisAsleepREM'
            || value === 'HKCategoryValueSleepAnalysisAsleep'
          if (isAsleep) {
            const endDate = attr(line, 'endDate')
            if (endDate) {
              const start = new Date(startDate)
              const end = new Date(endDate)
              const hours = (end - start) / (1000 * 60 * 60)
              if (hours > 0 && hours < 16) {
                // Attribute sleep to the morning date — if started after noon, belongs to next calendar day
                const sleepKey = start.getHours() >= 12
                  ? new Date(start.getTime() + 86400000).toISOString().slice(0, 10)
                  : dateKey
                sleepByDay[sleepKey] = (sleepByDay[sleepKey] || 0) + hours
              }
            }
          }
          break
        }
        case 'HKQuantityTypeIdentifierStepCount': {
          const val = parseFloat(attr(line, 'value'))
          if (!isNaN(val)) stepsByDay[dateKey] = (stepsByDay[dateKey] || 0) + val
          break
        }
        case 'HKQuantityTypeIdentifierActiveEnergyBurned': {
          const val = parseFloat(attr(line, 'value'))
          if (!isNaN(val)) calsByDay[dateKey] = (calsByDay[dateKey] || 0) + val
          break
        }
      }
    }

    // --- Compute averages ---
    const hrValues = Object.values(hrByDay)
    const restingHR = hrValues.length
      ? Math.round(hrValues.reduce((a, b) => a + b, 0) / hrValues.length)
      : null

    const hrv = hrvValues.length
      ? Math.round(hrvValues.reduce((a, b) => a + b, 0) / hrvValues.length)
      : null

    const sleepValues = Object.values(sleepByDay)
    const avgSleepHours = sleepValues.length
      ? parseFloat((sleepValues.reduce((a, b) => a + b, 0) / sleepValues.length).toFixed(1))
      : null

    const stepValues = Object.values(stepsByDay)
    const avgSteps = stepValues.length
      ? Math.round(stepValues.reduce((a, b) => a + b, 0) / stepValues.length)
      : null

    const calValues = Object.values(calsByDay)
    const avgCalories = calValues.length
      ? Math.round(calValues.reduce((a, b) => a + b, 0) / calValues.length)
      : null

    const parsedDays = Math.max(
      hrValues.length, hrvValues.length, sleepValues.length, stepValues.length
    )

    return {
      restingHR,
      hrv,
      avgSleepHours,
      avgSteps,
      avgCalories,
      activityLevel: avgSteps ? Math.min(avgSteps / 10000, 1) : null,
      age,
      sex: bioSex,
      isSmoker: false,
      dataSource: 'apple',
      parsedDays,
    }
  } catch (err) {
    console.error('Apple Health parse error:', err)
    return null
  }
}
