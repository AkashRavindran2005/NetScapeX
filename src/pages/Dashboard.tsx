import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Clock, 
  Package, 
  Activity, 
  AlertTriangle, 
  Download,
  ChevronRight,
  Shield,
  TrendingUp,
  Server
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAnalysis } from '@/contexts/AnalysisContext';
import { generateMockAnalysis } from '@/data/mockAnalysis';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

const SEVERITY_COLORS = {
  low: '#22c55e',
  medium: '#eab308',
  high: '#f97316',
  critical: '#ef4444',
};

const PROTOCOL_COLORS = ['#06b6d4', '#8b5cf6', '#ec4899', '#f97316', '#22c55e', '#eab308', '#3b82f6', '#10b981', '#f43f5e'];

const Dashboard = () => {
  const navigate = useNavigate();
  const { analysisResult, setAnalysisResult } = useAnalysis();

  // Load demo data if no analysis result
  useEffect(() => {
    if (!analysisResult) {
      setAnalysisResult(generateMockAnalysis('demo-capture.pcap'));
    }
  }, [analysisResult, setAnalysisResult]);

  if (!analysisResult) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 animate-spin text-primary">
            <Activity className="h-8 w-8" />
          </div>
          <p className="text-muted-foreground">Loading analysis...</p>
        </div>
      </div>
    );
  }

  const { metadata, riskSummary, protocolDistribution, topSourceIps, topDestinationIps } = analysisResult;

  const severityData = [
    { name: 'Low', value: riskSummary.severityCounts.low, color: SEVERITY_COLORS.low },
    { name: 'Medium', value: riskSummary.severityCounts.medium, color: SEVERITY_COLORS.medium },
    { name: 'High', value: riskSummary.severityCounts.high, color: SEVERITY_COLORS.high },
    { name: 'Critical', value: riskSummary.severityCounts.critical, color: SEVERITY_COLORS.critical },
  ];

  const getRiskColor = (score: number) => {
    if (score >= 80) return 'text-red-500';
    if (score >= 60) return 'text-orange-500';
    if (score >= 40) return 'text-yellow-500';
    return 'text-green-500';
  };

  const getRiskLabel = (score: number) => {
    if (score >= 80) return 'Critical';
    if (score >= 60) return 'High';
    if (score >= 40) return 'Medium';
    return 'Low';
  };

  const formatBytes = (bytes: number) => {
    if (bytes >= 1e9) return `${(bytes / 1e9).toFixed(2)} GB`;
    if (bytes >= 1e6) return `${(bytes / 1e6).toFixed(2)} MB`;
    if (bytes >= 1e3) return `${(bytes / 1e3).toFixed(2)} KB`;
    return `${bytes} B`;
  };

  const handleDownloadReport = () => {
    const reportData = JSON.stringify(analysisResult, null, 2);
    const blob = new Blob([reportData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `netscapex-report-${metadata.filename}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <h1 className="font-mono text-3xl font-bold">
              Analysis <span className="text-gradient">Dashboard</span>
            </h1>
            <p className="text-muted-foreground">Overview of network traffic analysis</p>
          </div>
          <div className="flex gap-3">
            <Link to="/results">
              <Button variant="heroOutline" className="gap-2">
                <FileText className="h-4 w-4" />
                View Flows
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
            <Button variant="hero" className="gap-2" onClick={handleDownloadReport}>
              <Download className="h-4 w-4" />
              Export JSON
            </Button>
          </div>
        </motion.div>

        {/* Metadata Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="mb-2 flex items-center gap-2 text-muted-foreground">
              <FileText className="h-4 w-4" />
              <span className="text-sm">Filename</span>
            </div>
            <p className="truncate font-mono font-semibold">{metadata.filename}</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="mb-2 flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span className="text-sm">Analysis Time</span>
            </div>
            <p className="font-mono font-semibold">
              {new Date(metadata.timestamp).toLocaleString()}
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="mb-2 flex items-center gap-2 text-muted-foreground">
              <Package className="h-4 w-4" />
              <span className="text-sm">Total Packets</span>
            </div>
            <p className="font-mono text-2xl font-bold text-primary">
              {metadata.totalPackets.toLocaleString()}
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="mb-2 flex items-center gap-2 text-muted-foreground">
              <Activity className="h-4 w-4" />
              <span className="text-sm">Total Flows</span>
            </div>
            <p className="font-mono text-2xl font-bold text-primary">
              {metadata.totalFlows.toLocaleString()}
            </p>
          </div>
        </motion.div>

        {/* Risk Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8 grid gap-6 lg:grid-cols-3"
        >
          {/* Risk Score Gauge */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="mb-4 flex items-center gap-2 font-mono font-semibold">
              <Shield className="h-5 w-5 text-primary" />
              Overall Risk Score
            </h3>
            <div className="flex flex-col items-center">
              <div className="relative mb-4">
                <svg className="h-40 w-40 -rotate-90 transform">
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="none"
                    className="text-muted"
                  />
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray={`${(riskSummary.overallScore / 100) * 440} 440`}
                    className={getRiskColor(riskSummary.overallScore)}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className={`font-mono text-4xl font-bold ${getRiskColor(riskSummary.overallScore)}`}>
                    {riskSummary.overallScore}
                  </span>
                  <span className="text-sm text-muted-foreground">/ 100</span>
                </div>
              </div>
              <span className={`font-mono font-semibold ${getRiskColor(riskSummary.overallScore)}`}>
                {getRiskLabel(riskSummary.overallScore)} Risk
              </span>
            </div>
          </div>

          {/* Severity Distribution */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="mb-4 flex items-center gap-2 font-mono font-semibold">
              <AlertTriangle className="h-5 w-5 text-primary" />
              Severity Distribution
            </h3>
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={severityData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {severityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {severityData.map((item) => (
                <div key={item.name} className="flex items-center gap-2 text-sm">
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-muted-foreground">{item.name}:</span>
                  <span className="font-mono font-semibold">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* High Risk Summary */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="mb-4 flex items-center gap-2 font-mono font-semibold">
              <TrendingUp className="h-5 w-5 text-primary" />
              Risk Summary
            </h3>
            <div className="space-y-4">
              <div className="rounded-lg bg-red-500/10 p-4">
                <div className="mb-1 text-sm text-muted-foreground">High-Risk Flows</div>
                <div className="font-mono text-3xl font-bold text-red-500">
                  {riskSummary.highRiskFlowCount}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-muted p-3">
                  <div className="text-xs text-muted-foreground">Critical</div>
                  <div className="font-mono text-xl font-bold text-red-500">
                    {riskSummary.severityCounts.critical}
                  </div>
                </div>
                <div className="rounded-lg bg-muted p-3">
                  <div className="text-xs text-muted-foreground">High</div>
                  <div className="font-mono text-xl font-bold text-orange-500">
                    {riskSummary.severityCounts.high}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Protocol Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8 rounded-xl border border-border bg-card p-6"
        >
          <h3 className="mb-4 flex items-center gap-2 font-mono font-semibold">
            <Server className="h-5 w-5 text-primary" />
            Protocol Distribution
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={protocolDistribution.slice(0, 8)}>
              <XAxis 
                dataKey="protocol" 
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                axisLine={{ stroke: 'hsl(var(--border))' }}
              />
              <YAxis 
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                axisLine={{ stroke: 'hsl(var(--border))' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {protocolDistribution.slice(0, 8).map((_, index) => (
                  <Cell key={`cell-${index}`} fill={PROTOCOL_COLORS[index % PROTOCOL_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Top Talkers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid gap-6 lg:grid-cols-2"
        >
          {/* Top Source IPs */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="mb-4 font-mono font-semibold">Top Source IPs</h3>
            <div className="space-y-3">
              {topSourceIps.slice(0, 5).map((talker, index) => (
                <div key={talker.ip} className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 font-mono text-xs font-bold text-primary">
                    {index + 1}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-sm">{talker.ip}</span>
                      <span className="text-sm text-muted-foreground">{formatBytes(talker.traffic)}</span>
                    </div>
                    <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full bg-primary"
                        style={{ width: `${(talker.traffic / topSourceIps[0].traffic) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Destination IPs */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="mb-4 font-mono font-semibold">Top Destination IPs</h3>
            <div className="space-y-3">
              {topDestinationIps.slice(0, 5).map((talker, index) => (
                <div key={talker.ip} className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 font-mono text-xs font-bold text-primary">
                    {index + 1}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-sm">{talker.ip}</span>
                      <span className="text-sm text-muted-foreground">{formatBytes(talker.traffic)}</span>
                    </div>
                    <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full bg-cyan-500"
                        style={{ width: `${(talker.traffic / topDestinationIps[0].traffic) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
