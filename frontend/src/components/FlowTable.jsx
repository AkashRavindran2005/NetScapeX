import { useNavigate } from 'react-router-dom'
import { ExternalLink } from 'lucide-react'
import { formatBytes } from '../utils/formatters'

export default function FlowTable({ flows }) {
  const navigate = useNavigate()

  const getRiskClass = (level) => {
    const classes = {
      'Critical': 'risk-critical',
      'High': 'risk-high',
      'Medium': 'risk-medium',
      'Low': 'risk-low'
    }
    return classes[level] || 'risk-low'
  }

  if (!flows || flows.length === 0) {
    return (
      <div className="glass-card p-12 text-center">
        <p className="text-gray-400">No flows to display</p>
      </div>
    )
  }

  return (
    <div className="glass-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-cyan-400/30">
              <th className="text-left p-4 text-cyan-400">Flow ID</th>
              <th className="text-left p-4 text-cyan-400">Source</th>
              <th className="text-left p-4 text-cyan-400">Destination</th>
              <th className="text-left p-4 text-cyan-400">Protocol</th>
              <th className="text-left p-4 text-cyan-400">Packets</th>
              <th className="text-left p-4 text-cyan-400">Bytes</th>
              <th className="text-left p-4 text-cyan-400">Threats</th>
              <th className="text-left p-4 text-cyan-400">Risk</th>
              <th className="text-left p-4 text-cyan-400">Score</th>
              <th className="text-left p-4 text-cyan-400"></th>
            </tr>
          </thead>
          <tbody>
            {flows.map((flow) => (
              <tr
                key={flow.flow_id}
                className="border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer"
                onClick={() => navigate(`/flow/${flow.flow_id}`)}
              >
                <td className="p-4 font-mono text-sm text-gray-300">{flow.flow_id}</td>
                <td className="p-4 font-mono text-sm text-white">
                  {flow.src_ip}
                  {flow.src_port && <span className="text-gray-500">:{flow.src_port}</span>}
                </td>
                <td className="p-4 font-mono text-sm text-white">
                  {flow.dst_ip}
                  {flow.dst_port && <span className="text-gray-500">:{flow.dst_port}</span>}
                </td>
                <td className="p-4">
                  <span className="px-2 py-1 rounded bg-purple-400/20 text-purple-400 text-xs">
                    {flow.protocol}
                  </span>
                </td>
                <td className="p-4 text-gray-300">{flow.packet_count.toLocaleString()}</td>
                <td className="p-4 text-gray-300">{formatBytes(flow.total_bytes)}</td>
                <td className="p-4 text-sm">
                  {flow.risk_assessment.threats.slice(0, 2).map((threat, idx) => (
                    <div key={idx} className="text-orange-400 truncate">
                      {threat}
                    </div>
                  ))}
                </td>
                <td className="p-4">
                  <span className={getRiskClass(flow.risk_assessment.risk_level)}>
                    {flow.risk_assessment.risk_level}
                  </span>
                </td>
                <td className="p-4 font-semibold text-white">
                  {flow.risk_assessment.risk_score.toFixed(1)}
                </td>
                <td className="p-4">
                  <ExternalLink className="w-4 h-4 text-cyan-400" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
