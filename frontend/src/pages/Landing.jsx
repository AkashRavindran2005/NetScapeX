import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Shield, Cpu, Network, TrendingUp, Activity, Lock, Zap, Eye } from 'lucide-react'

export default function Landing() {
  const navigate = useNavigate()

  const features = [
    { 
      icon: Network, 
      title: 'Flow Reconstruction', 
      desc: 'Intelligently reconstruct network flows from PCAP files with bidirectional tracking',
      color: 'text-cyan-400'
    },
    { 
      icon: Cpu, 
      title: 'ML Classification', 
      desc: 'Random Forest classifier detects encrypted and anonymized traffic patterns',
      color: 'text-purple-400'
    },
    { 
      icon: Shield, 
      title: 'Risk Scoring', 
      desc: 'Multi-factor risk assessment engine with confidence levels',
      color: 'text-blue-400'
    },
    { 
      icon: TrendingUp, 
      title: 'Visual Analytics', 
      desc: 'Interactive dashboards with real-time charts and heatmaps',
      color: 'text-pink-400'
    },
    { 
      icon: Activity, 
      title: 'Beaconing Detection', 
      desc: 'Identify C2 communication through periodic traffic analysis',
      color: 'text-green-400'
    },
    { 
      icon: Lock, 
      title: 'DNS Tunneling', 
      desc: 'Detect data exfiltration via Shannon entropy and domain analysis',
      color: 'text-orange-400'
    },
    { 
      icon: Zap, 
      title: 'Protocol Anomaly', 
      desc: 'Flag non-standard port usage and protocol mismatches',
      color: 'text-yellow-400'
    },
    { 
      icon: Eye, 
      title: 'Deep Inspection', 
      desc: 'Metadata-only analysis ensuring privacy compliance',
      color: 'text-red-400'
    }
  ]

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20">
      <div className="max-w-7xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <motion.div
            animate={{ 
              opacity: [0.5, 1, 0.5]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-block mb-6"
          >
            <span className="text-cyan-400 text-sm font-mono tracking-[0.3em] uppercase">
              CYBROSKIS
            </span>
          </motion.div>
          
          <h1 className="text-7xl md:text-8xl font-bold mb-6">
            <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              NetScapeX
            </span>
          </h1>
          
          <motion.p 
            className="text-2xl md:text-3xl text-gray-400 font-light mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Beyond Packet Inspection
          </motion.p>
          
          <motion.p 
            className="text-gray-500 max-w-3xl mx-auto text-lg leading-relaxed mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Intelligent packet sniffing and traffic analysis platform powered by machine learning. 
            Detect threats, analyze patterns, and secure your network with cutting-edge cybersecurity technology.
          </motion.p>
          
          <motion.button
            onClick={() => navigate('/upload')}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-primary text-lg inline-flex items-center gap-2"
          >
            Upload PCAP & Start Analysis
            <span>→</span>
          </motion.button>
          
          <motion.div 
            className="flex justify-center gap-3 mt-8 flex-wrap"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            {['React', 'FastAPI', 'Scapy', 'Scikit-learn', 'Real-time'].map((tech, idx) => (
              <span 
                key={idx}
                className="px-4 py-2 rounded-full text-sm bg-white/5 border border-white/10 text-gray-400 hover:border-cyan-400/50 transition-colors"
              >
                {tech}
              </span>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20"
        >
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 + idx * 0.1 }}
              whileHover={{ y: -5 }}
              className="glass-card p-6 hover:border-cyan-400/50 transition-all duration-300 group cursor-pointer"
            >
              <feature.icon className={`w-10 h-10 ${feature.color} mb-4 group-hover:scale-110 transition-transform`} />
              <h3 className="font-semibold text-lg mb-2 text-white">{feature.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
          className="grid md:grid-cols-4 gap-8"
        >
          {[
            { value: '4+', label: 'Detection Modules' },
            { value: 'ML', label: 'Powered Classification' },
            { value: '100%', label: 'Privacy Compliant' },
            { value: '∞', label: 'PCAP Files' }
          ].map((stat, idx) => (
            <div key={idx} className="text-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-2">
                {stat.value}
              </div>
              <div className="text-gray-500 text-sm uppercase tracking-wider">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
