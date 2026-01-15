import { Link, useLocation } from 'react-router-dom'
import { Home, Upload, LayoutDashboard, List } from 'lucide-react'

export default function Navigation() {
  const location = useLocation()

  const links = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/upload', icon: Upload, label: 'Upload' },
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/results', icon: List, label: 'Results' }
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-lg cyber-gradient flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="text-white font-bold text-xl">N</span>
            </div>
            <div>
              <p className="font-bold text-white">NetScapeX</p>
              <p className="text-xs text-gray-400">CYBROSKIS</p>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            {links.map(link => {
              const Icon = link.icon
              const isActive = location.pathname === link.to
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    isActive
                      ? 'bg-cyan-400/20 text-cyan-400 border border-cyan-400/30'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden md:inline">{link.label}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}
