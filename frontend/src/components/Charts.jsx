import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

export default function Charts({ analysisData }) {
  const protocolData = Object.entries(analysisData.protocol_distribution || {}).map(([name, value]) => ({
    name,
    value
  }))

  const riskLevels = { Critical: 0, High: 0, Medium: 0, Low: 0 }
  analysisData.flows?.forEach(flow => {
    const level = flow.risk_assessment.risk_level
    if (riskLevels.hasOwnProperty(level)) {
      riskLevels[level]++
    }
  })

  const riskData = Object.entries(riskLevels).map(([name, value]) => ({
    name,
    value
  }))

  const COLORS = {
    TCP: '#00d4ff',
    UDP: '#a855f7',
    ICMP: '#ec4899',
    DNS: '#10b981',
    Critical: '#ef4444',
    High: '#f97316',
    Medium: '#eab308',
    Low: '#22c55e'
  }

  return (
    <div className="glass-card p-6">
      <h3 className="text-xl font-semibold mb-6 text-cyan-400">Traffic Analysis</h3>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <p className="text-gray-400 text-sm mb-4 text-center">Protocol Distribution</p>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={protocolData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {protocolData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[entry.name] || '#6b7280'} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  background: 'rgba(10, 14, 39, 0.95)', 
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  color: 'white'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap justify-center gap-3 mt-4">
            {protocolData.map((entry, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ background: COLORS[entry.name] || '#6b7280' }} />
                <span className="text-xs text-gray-400">{entry.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="text-gray-400 text-sm mb-4 text-center">Risk Level Distribution</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={riskData}>
              <XAxis dataKey="name" stroke="#6b7280" style={{ fontSize: '12px' }} />
              <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
              <Tooltip 
                contentStyle={{ 
                  background: 'rgba(10, 14, 39, 0.95)', 
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  color: 'white'
                }}
              />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {riskData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[entry.name]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
