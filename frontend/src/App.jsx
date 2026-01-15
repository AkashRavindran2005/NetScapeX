import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useState } from 'react'
import Landing from './pages/Landing'
import Upload from './pages/Upload'
import Dashboard from './pages/Dashboard'
import Results from './pages/Results'
import FlowDetail from './pages/FlowDetail'
import Navigation from './components/Navigation'

function App() {
  const [analysisData, setAnalysisData] = useState(null)

  return (
    <Router>
      <div className="min-h-screen">
        <Navigation />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/upload" element={<Upload setAnalysisData={setAnalysisData} />} />
          <Route path="/dashboard" element={<Dashboard analysisData={analysisData} />} />
          <Route path="/results" element={<Results analysisData={analysisData} />} />
          <Route path="/flow/:flowId" element={<FlowDetail analysisData={analysisData} />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
