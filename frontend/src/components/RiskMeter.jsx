import { motion } from 'framer-motion'
import { Shield, AlertTriangle, AlertOctagon } from 'lucide-react'

export default function RiskMeter({ score }) {
  const getRiskLevel = (score) => {
    if (score >= 75) return { level: 'Critical', color: 'text-red-400', icon: AlertOctagon }
    if (score >= 50) return { level: 'High', color: 'text-orange-400', icon: AlertTriangle }
    if (score >= 25) return { level: 'Medium', color: 'text-yellow-400', icon: AlertTriangle }
    return { level: 'Low', color: 'text-green-400', icon: Shield }
  }

  const risk = getRiskLevel(score)
  const Icon = risk.icon
  const percentage = Math.min(score, 100)

  return (
    <div className="glass-card p-8">
      <h3 className="text-xl font-semibold mb-8 text-cyan-400">Overall Risk Score</h3>
      
      <div className="relative">
        {/* Circular Progress */}
        <div className="relative w-48 h-48 mx-auto mb-6">
          <svg className="transform -rotate-90 w-48 h-48">
            <circle
              cx="96"
              cy="96"
              r="88"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="12"
              fill="none"
            />
            <motion.circle
              cx="96"
              cy="96"
              r="88"
              stroke="url(#gradient)"
              strokeWidth="12"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 88}`}
              initial={{ strokeDashoffset: 2 * Math.PI * 88 }}
              animate={{ strokeDashoffset: 2 * Math.PI * 88 * (1 - percentage / 100) }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00d4ff" />
                <stop offset="100%" stopColor="#a855f7" />
              </linearGradient>
            </defs>
          </svg>
          
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <Icon className={`w-12 h-12 ${risk.color} mb-2`} />
            <span className="text-4xl font-bold text-white">{score.toFixed(1)}</span>
            <span className="text-gray-400 text-sm">/ 100</span>
          </div>
        </div>

        <div className="text-center">
          <p className="text-gray-400 text-sm mb-2">Risk Level</p>
          <p className={`text-2xl font-bold ${risk.color}`}>{risk.level}</p>
        </div>
      </div>
    </div>
  )
}
