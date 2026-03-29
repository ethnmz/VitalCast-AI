# VitalCast AI

**Know where your health is heading before it’s too late.**

VitalCast is a clinical health forecasting companion that turns years of passive wearable data (Apple Health, Garmin) into a predictive "windshield" for your future. Unlike standard trackers that show you where you've been, VitalCast uses validated clinical models to show you where you're going—and how to change it.



---

## Key Features

- **Clinical Health Forecasting**: Predicts 10-year Cardiovascular (CVD) risk, sleep quality (PSQI), and autonomic stress (HRV).
- **Interactive "What-If" Simulator**: Live-adjust smoking status, activity levels, and sleep debt to see real-world impact on your "Active Life Gained."
- **Guided Analysis Journey**: A structured, experience-driven walkthrough that translates dense medical data into actionable insights through a 3-Act narrative.
- **High-Performance Parsing**: Custom Regex-based engine capable of processing 800MB+ Apple Health exports in under 30ms directly in the browser.
- **Privacy-First Architecture**: 100% client-side execution. Your health data never leaves your device and is never uploaded to a server.

## The Science

VitalCast is built on deterministic clinical logic. We utilize:
- **Framingham CVD Risk Score**: The gold-standard equation for predicting cardiovascular events over a 10-year horizon.
- **Pittsburgh Sleep Quality Index (PSQI)**: A validated tool for quantifying sleep fragmentation and debt.
- **HRV Stress Index**: Autonomic nervous system analysis based on normalized HRV metrics.

## Tech Stack

- **Frontend**: React (Vite)
- **State Management**: React Context
- **Heavy Processing**: Web Workers (offloading large file parsing from the main thread)
- **Clinical Logic**: Custom-built deterministic mathematical engine
- **PDF Generation**: jsPDF for clinical session reports
- **Styling**: Vanilla CSS with a focus on high-performance rendering and clinical trust

---

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/VitalCast-AI.git
   cd VitalCast-AI
Install dependencies:

bash
npm install
Start the development server:

bash
npm run dev
Open http://localhost:5173 in your browser.
