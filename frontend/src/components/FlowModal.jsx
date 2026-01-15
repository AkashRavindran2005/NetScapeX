import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

export default function FlowModal({ flow, onClose }) {
  if (!flow) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="glass-card p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Flow Details</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-gray-400" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-gray-400 text-sm mb-1">Flow ID</p>
              <p className="font-mono text-white">{flow.flow_id}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-400 text-sm mb-1">Source IP</p>
                <p className="font-mono text-white">{flow.src_ip}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Destination IP</p>
                <p className="font-mono text-white">{flow.dst_ip}</p>
              </div>
            </div>

            <div>
              <p className="text-gray-400 text-sm mb-1">Risk Score</p>
              <p className="text-2xl font-bold text-white">
                {flow.risk_assessment.risk_score.toFixed(1)}
              </p>
            </div>

            <div>
              <p className="text-gray-400 text-sm mb-2">Detected Threats</p>
              <div className="space-y-2">
                {flow.risk_assessment.threats.map((threat, idx) => (
                  <div key={idx} className="bg-white/5 rounded-lg p-3 border border-orange-400/30">
                    <p className="text-orange-400">{threat}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
