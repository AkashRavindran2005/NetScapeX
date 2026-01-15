import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, AlertTriangle, Shield, Activity, Clock } from 'lucide-react'
import { formatBytes, formatDuration } from '../utils/formatters'

export default function FlowDetail({ analysisData }) {
  const { flowId } = useParams()
  const navigate = useNavigate()

  if (!analysisData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">No Analysis Data</h2>
          <button onClick={() => navigate('/upload')} className="btn-primary">
            Upload PCAP
          </button>
        </div>
      </div>
    )
  }

  const flow = analysisData.flows?.find(f => f.flow_id === flowId)

  if (!flow) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Flow Not Found</h2>
          <button onClick={() => navigate('/results')} className="btn-primary">
            Back to Results
          </button>
        </div>
      </div>
    )
  }

  const getRiskClass = (level) => {
    const classes = {
      'Critical': 'risk-critical',
      'High': 'risk-high',
      'Medium': 'risk-medium',
      'Low': 'risk-low'
    }
    return classes[level] || 'risk-low'
  }

  return (
    <div className="min-h-screen px-4 py-20">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <button
            onClick={() => navigate('/results')}
            className="flex items-center gap-2 text-gray-400 hover:text-cyan-400 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Results
          </button>

          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2 text-white">
                Flow Details
              </h1>
              <p className="text-gray-400 font-mono">{flow.flow_id}</p>
            </div>
            <span className={getRiskClass(flow.risk_assessment.risk_level)}>
              {flow.risk_assessment.risk_level} Risk
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-4 gap-6 mb-8"
        >
          <div className="glass-card p-6">
            <Shield className="w-8 h-8 text-cyan-400 mb-3" />
            <p className="text-gray-400 text-sm mb-1">Risk Score</p>
            <p className="text-2xl font-bold text-white">
              {flow.risk_assessment.risk_score.toFixed(1)}
            </p>
          </div>

          <div className="glass-card p-6">
            <Activity className="w-8 h-8 text-purple-400 mb-3" />
            <p className="text-gray-400 text-sm mb-1">Packets</p>
            <p className="text-2xl font-bold text-white">
              {flow.packet_count.toLocaleString()}
            </p>
          </div>

          <div className="glass-card p-6">
            <Clock className="w-8 h-8 text-green-400 mb-3" />
            <p className="text-gray-400 text-sm mb-1">Duration</p>
            <p className="text-2xl font-bold text-white">
              {formatDuration(flow.duration)}
            </p>
          </div>

          <div className="glass-card p-6">
            <AlertTriangle className="w-8 h-8 text-orange-400 mb-3" />
            <p className="text-gray-400 text-sm mb-1">Confidence</p>
            <p className="text-2xl font-bold text-white">
              {flow.risk_assessment.confidence}
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-6 mb-6"
        >
          <h2 className="text-xl font-semibold mb-6 text-cyan-400">Connection Information</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-gray-400 text-sm mb-2">Source</p>
              <p className="font-mono text-white text-lg">
                {flow.src_ip}
                {flow.src_port && `:${flow.src_port}`}
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-2">Destination</p>
              <p className="font-mono text-white text-lg">
                {flow.dst_ip}
                {flow.dst_port && `:${flow.dst_port}`}
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-2">Protocol</p>
              <p className="text-white">{flow.protocol}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-2">Total Bytes</p>
              <p className="text-white">{formatBytes(flow.total_bytes)}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-6 mb-6"
        >
          <h2 className="text-xl font-semibold mb-6 text-cyan-400">Threat Detection</h2>
          <div className="space-y-3">
            {flow.risk_assessment.threats.map((threat, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10"
              >
                <AlertTriangle className="w-5 h-5 text-orange-400 flex-shrink-0" />
                <span className="text-white">{threat}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="glass-card p-6"
        >
          <h2 className="text-xl font-semibold mb-6 text-cyan-400">Statistical Features</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {Object.entries(flow.features).map(([key, value]) => {
              if (typeof value === 'number') {
                return (
                  <div key={key} className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <p className="text-gray-400 text-sm mb-1 capitalize">
                      {key.replace(/_/g, ' ')}
                    </p>
                    <p className="text-white font-mono">
                      {typeof value === 'number' ? value.toFixed(3) : value}
                    </p>
                  </div>
                )
              }
              return null
            })}
          </div>
        </motion.div>

        {flow.risk_assessment.detections && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="glass-card p-6 mt-6"
          >
            <h2 className="text-xl font-semibold mb-6 text-cyan-400">Detection Details</h2>
            <div className="space-y-4">
              {/* ML Classification */}
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <h3 className="font-semibold text-white mb-2">ML Classification</h3>
                <p className="text-gray-400 text-sm mb-2">
                  {flow.risk_assessment.detections.ml_classification}
                </p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-white/10 rounded-full h-2">
                    <div
                      className="cyber-gradient h-2 rounded-full"
                      style={{
                        width: `${(flow.risk_assessment.detections.ml_probability * 100).toFixed(0)}%`
                      }}
                    />
                  </div>
                  <span className="text-sm text-gray-400">
                    {(flow.risk_assessment.detections.ml_probability * 100).toFixed(1)}%
                  </span>
                </div>
              </div>

              {flow.risk_assessment.detections.beaconing_detected && (
                <div className="bg-white/5 rounded-lg p-4 border border-orange-500/30">
                  <h3 className="font-semibold text-white mb-2">Beaconing Detected</h3>
                  <p className="text-gray-400 text-sm">
                    {flow.risk_assessment.detections.beaconing_description}
                  </p>
                </div>
              )}

              {flow.risk_assessment.detections.dns_tunnel_detected && (
                <div className="bg-white/5 rounded-lg p-4 border border-red-500/30">
                  <h3 className="font-semibold text-white mb-2">DNS Tunneling Detected</h3>
                  <p className="text-gray-400 text-sm">
                    {flow.risk_assessment.detections.dns_tunnel_description}
                  </p>
                </div>
              )}

              {flow.risk_assessment.detections.protocol_anomalies?.length > 0 && (
                <div className="bg-white/5 rounded-lg p-4 border border-yellow-500/30">
                  <h3 className="font-semibold text-white mb-2">Protocol Anomalies</h3>
                  <ul className="space-y-1">
                    {flow.risk_assessment.detections.protocol_anomalies.map((anomaly, idx) => (
                      <li key={idx} className="text-gray-400 text-sm">• {anomaly}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
