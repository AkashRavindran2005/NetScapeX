import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Search, Filter, AlertTriangle, ArrowLeft } from 'lucide-react'
import FlowTable from '../components/FlowTable'

export default function Results({ analysisData }) {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRisk, setFilterRisk] = useState('all')
  const [sortBy, setSortBy] = useState('risk_score')

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

  let filteredFlows = analysisData.flows || []

  if (searchTerm) {
    filteredFlows = filteredFlows.filter(flow =>
      flow.src_ip.includes(searchTerm) ||
      flow.dst_ip.includes(searchTerm) ||
      flow.flow_id.includes(searchTerm)
    )
  }

  if (filterRisk !== 'all') {
    filteredFlows = filteredFlows.filter(
      flow => flow.risk_assessment.risk_level.toLowerCase() === filterRisk
    )
  }

  filteredFlows = [...filteredFlows].sort((a, b) => {
    if (sortBy === 'risk_score') {
      return b.risk_assessment.risk_score - a.risk_assessment.risk_score
    } else if (sortBy === 'packet_count') {
      return b.packet_count - a.packet_count
    } else if (sortBy === 'bytes') {
      return b.total_bytes - a.total_bytes
    }
    return 0
  })

  return (
    <div className="min-h-screen px-4 py-20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-gray-400 hover:text-cyan-400 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </button>

          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            Flow Analysis Results
          </h1>
          <p className="text-gray-400">
            Detailed view of all detected network flows
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6 mb-6"
        >
          <div className="grid md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="search"
                placeholder="Search by IP or Flow ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-cyan-400 outline-none transition-colors"
              />
            </div>

            <div className="relative">
              <Filter className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={filterRisk}
                onChange={(e) => setFilterRisk(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-cyan-400 outline-none transition-colors appearance-none cursor-pointer"
              >
                <option value="all">All Risk Levels</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-cyan-400 outline-none transition-colors appearance-none cursor-pointer"
            >
              <option value="risk_score">Sort by Risk Score</option>
              <option value="packet_count">Sort by Packet Count</option>
              <option value="bytes">Sort by Total Bytes</option>
            </select>
          </div>

          <div className="mt-4 text-sm text-gray-400">
            Showing {filteredFlows.length} of {analysisData.flows?.length || 0} flows
          </div>
        </motion.div>

        {/* Flow Table */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <FlowTable flows={filteredFlows} />
        </motion.div>
      </div>
    </div>
  )
}
