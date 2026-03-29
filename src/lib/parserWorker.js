import { parseAppleHealth } from './parseAppleHealth'
import { parseGarmin } from './parseGarmin'

self.onmessage = async (e) => {
  const { fileName, fileContent } = e.data
  
  try {
    let parsed = null;
    if (fileName.endsWith('.xml')) {
      parsed = parseAppleHealth(fileContent)
    } else if (fileName.endsWith('.csv')) {
      parsed = parseGarmin(fileContent)
    }
    
    self.postMessage({ success: true, data: parsed })
  } catch (err) {
    self.postMessage({ success: false, error: err.message })
  }
}
