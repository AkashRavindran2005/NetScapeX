import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Package, Activity, Shield, AlertTriangle, Download, Eye } from 'lucide-react'
import StatsCard from '../components/StatsCard'
import Charts from '../components/Charts'
import RiskMeter from '../components/RiskMeter'

export default function Dashboard({ analysisData }) {
  const navigate = useNavigate()

  if (!analysisData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">No Analysis Data</h2>
          <p className="text-gray-400 mb-6">Please upload a PCAP file first</p>
          <button onClick={() => navigate('/upload')} className="btn-primary">
            Upload PCAP
          </button>
        </div>
      </div>
    )
  }

  const highRiskCount = analysisData.flows?.filter(
    f => f.risk_assessment.risk_level === 'High' || f.risk_assessment.risk_level === 'Critical'
  ).length || 0

  const avgRisk = analysisData.flows?.length > 0
    ? analysisData.flows.reduce((sum, f) => sum + f.risk_assessment.risk_score, 0) / analysisData.flows.length
    : 0

  return (
    <div className="min-h-screen px-4 py-20">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Analysis Dashboard
              </h1>
              <p className="text-gray-400">Real-time network traffic insights</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => navigate('/results')}
                className="btn-secondary flex items-center gap-2"
              >
                <Eye className="w-5 h-5" />
                View Details
              </button>
              <button className="btn-primary flex items-center gap-2">
                <Download className="w-5 h-5" />
                Export Report
              </button>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-4 gap-6 mb-8"
        >
          <StatsCard
            icon={Package}
            label="Total Packets"
            value={analysisData.total_packets?.toLocaleString() || '0'}
            color="text-cyan-400"
          />
          <StatsCard
            icon={Activity}
            label="Network Flows"
            value={analysisData.total_flows?.toLocaleString() || '0'}
            color="text-purple-400"
          />
          <StatsCard
            icon={AlertTriangle}
            label="High Risk Flows"
            value={highRiskCount}
            color="text-orange-400"
          />
          <StatsCard
            icon={Shield}
            label="Avg Risk Score"
            value={avgRisk.toFixed(1)}
            color="text-green-400"
          />
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Risk Meter */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-1"
          >
            <RiskMeter score={avgRisk} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2"
          >
            <Charts analysisData={analysisData} />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="glass-card p-6"
        >
          <h3 className="text-xl font-semibold mb-6 text-cyan-400">Protocol Distribution</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(analysisData.protocol_distribution || {}).map(([protocol, count]) => (
              <div key={protocol} className="bg-white/5 rounded-lg p-4 border border-white/10">
                <p className="text-gray-400 text-sm mb-1">{protocol}</p>
                <p className="text-2xl font-bold text-white">{count.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {analysisData.top_talkers && analysisData.top_talkers.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="glass-card p-6 mt-6"
          >
            <h3 className="text-xl font-semibold mb-6 text-cyan-400">Top Talkers</h3>
            <div className="space-y-3">
              {analysisData.top_talkers.slice(0, 5).map((talker, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-gray-500 font-mono text-sm">#{idx + 1}</span>
                    <span className="font-mono text-white">{talker.ip}</span>
                  </div>
                  <span className="text-gray-400">{talker.packet_count.toLocaleString()} packets</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
