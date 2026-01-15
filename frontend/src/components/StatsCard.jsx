import { motion } from 'framer-motion'

export default function StatsCard({ icon: Icon, label, value, color }) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="glass-card p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <Icon className={`w-8 h-8 ${color}`} />
      </div>
      <p className="text-gray-400 text-sm mb-2">{label}</p>
      <p className="text-3xl font-bold text-white">{value}</p>
    </motion.div>
  )
}
