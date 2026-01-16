import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Search, 
  ArrowUpDown, 
  Filter,
  ChevronLeft,
  AlertCircle,
  Shield,
  Clock,
  Package
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAnalysis } from '@/contexts/AnalysisContext';
import { generateMockAnalysis } from '@/data/mockAnalysis';
import { Flow, SeverityLevel } from '@/types/analysis';
import FlowDetailModal from '@/components/FlowDetailModal';

type SortField = 'riskScore' | 'duration' | 'packetCount' | 'byteCount';
type SortDirection = 'asc' | 'desc';

const Results = () => {
  const { analysisResult, setAnalysisResult } = useAnalysis();
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState<SeverityLevel | 'all'>('all');
  const [protocolFilter, setProtocolFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('riskScore');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [selectedFlow, setSelectedFlow] = useState<Flow | null>(null);

  // Load demo data if no analysis result
  useEffect(() => {
    if (!analysisResult) {
      setAnalysisResult(generateMockAnalysis('demo-capture.pcap'));
    }
  }, [analysisResult, setAnalysisResult]);

  const protocols = useMemo(() => {
    if (!analysisResult) return [];
    const uniqueProtocols = [...new Set(analysisResult.flows.map(f => f.protocol))];
    return uniqueProtocols.sort();
  }, [analysisResult]);

  const filteredAndSortedFlows = useMemo(() => {
    if (!analysisResult) return [];

    let flows = [...analysisResult.flows];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      flows = flows.filter(
        f =>
          f.id.toLowerCase().includes(query) ||
          f.sourceIp.includes(query) ||
          f.destinationIp.includes(query)
      );
    }

    // Apply severity filter
    if (severityFilter !== 'all') {
      flows = flows.filter(f => f.severity === severityFilter);
    }

    // Apply protocol filter
    if (protocolFilter !== 'all') {
      flows = flows.filter(f => f.protocol === protocolFilter);
    }

    // Apply sorting
    flows.sort((a, b) => {
      let aVal: number, bVal: number;
      
      switch (sortField) {
        case 'riskScore':
          aVal = a.riskScore;
          bVal = b.riskScore;
          break;
        case 'duration':
          aVal = a.statistics.duration;
          bVal = b.statistics.duration;
          break;
        case 'packetCount':
          aVal = a.statistics.packetCount;
          bVal = b.statistics.packetCount;
          break;
        case 'byteCount':
          aVal = a.statistics.byteCount;
          bVal = b.statistics.byteCount;
          break;
        default:
          return 0;
      }

      return sortDirection === 'desc' ? bVal - aVal : aVal - bVal;
    });

    return flows;
  }, [analysisResult, searchQuery, severityFilter, protocolFilter, sortField, sortDirection]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => (prev === 'desc' ? 'asc' : 'desc'));
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const getSeverityColor = (severity: SeverityLevel) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-500/20 text-red-500 border-red-500/50';
      case 'high':
        return 'bg-orange-500/20 text-orange-500 border-orange-500/50';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/50';
      case 'low':
        return 'bg-green-500/20 text-green-500 border-green-500/50';
    }
  };

  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds.toFixed(1)}s`;
    if (seconds < 3600) return `${(seconds / 60).toFixed(1)}m`;
    return `${(seconds / 3600).toFixed(1)}h`;
  };

  const formatBytes = (bytes: number) => {
    if (bytes >= 1e9) return `${(bytes / 1e9).toFixed(1)}GB`;
    if (bytes >= 1e6) return `${(bytes / 1e6).toFixed(1)}MB`;
    if (bytes >= 1e3) return `${(bytes / 1e3).toFixed(1)}KB`;
    return `${bytes}B`;
  };

  const getDetectionFlags = (flow: Flow) => {
    const flags: string[] = [];
    if (flow.detections.encryptedAnonymized.detected) flags.push('Encrypted');
    if (flow.detections.beaconing.detected) flags.push('Beaconing');
    if (flow.detections.dnsTunneling.detected) flags.push('DNS Tunnel');
    if (flow.detections.protocolAnomaly.detected) flags.push('Anomaly');
    return flags;
  };

  if (!analysisResult) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 animate-pulse text-primary">
            <Shield className="h-8 w-8" />
          </div>
          <p className="text-muted-foreground">Loading results...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-center gap-4">
            <Link to="/dashboard">
              <Button variant="ghost" size="icon">
                <ChevronLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="font-mono text-2xl font-bold">
                Flow <span className="text-gradient">Results</span>
              </h1>
              <p className="text-sm text-muted-foreground">
                {filteredAndSortedFlows.length} of {analysisResult.flows.length} flows
              </p>
            </div>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 flex flex-col gap-4 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by IP or Flow ID..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-3">
            <Select value={severityFilter} onValueChange={(v) => setSeverityFilter(v as SeverityLevel | 'all')}>
              <SelectTrigger className="w-[140px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severity</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>

            <Select value={protocolFilter} onValueChange={setProtocolFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Protocol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Protocols</SelectItem>
                {protocols.map(protocol => (
                  <SelectItem key={protocol} value={protocol}>
                    {protocol}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </motion.div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="overflow-hidden rounded-xl border border-border bg-card"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-border bg-muted/50">
                <tr>
                  <th className="whitespace-nowrap px-4 py-3 text-left font-mono text-xs font-semibold uppercase text-muted-foreground">
                    Flow ID
                  </th>
                  <th className="whitespace-nowrap px-4 py-3 text-left font-mono text-xs font-semibold uppercase text-muted-foreground">
                    Source
                  </th>
                  <th className="whitespace-nowrap px-4 py-3 text-left font-mono text-xs font-semibold uppercase text-muted-foreground">
                    Destination
                  </th>
                  <th className="whitespace-nowrap px-4 py-3 text-left font-mono text-xs font-semibold uppercase text-muted-foreground">
                    Protocol
                  </th>
                  <th 
                    className="cursor-pointer whitespace-nowrap px-4 py-3 text-left font-mono text-xs font-semibold uppercase text-muted-foreground hover:text-foreground"
                    onClick={() => toggleSort('duration')}
                  >
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Duration
                      <ArrowUpDown className="h-3 w-3" />
                    </span>
                  </th>
                  <th 
                    className="cursor-pointer whitespace-nowrap px-4 py-3 text-left font-mono text-xs font-semibold uppercase text-muted-foreground hover:text-foreground"
                    onClick={() => toggleSort('packetCount')}
                  >
                    <span className="flex items-center gap-1">
                      <Package className="h-3 w-3" />
                      Packets
                      <ArrowUpDown className="h-3 w-3" />
                    </span>
                  </th>
                  <th 
                    className="cursor-pointer whitespace-nowrap px-4 py-3 text-left font-mono text-xs font-semibold uppercase text-muted-foreground hover:text-foreground"
                    onClick={() => toggleSort('byteCount')}
                  >
                    <span className="flex items-center gap-1">
                      Bytes
                      <ArrowUpDown className="h-3 w-3" />
                    </span>
                  </th>
                  <th className="whitespace-nowrap px-4 py-3 text-left font-mono text-xs font-semibold uppercase text-muted-foreground">
                    Detections
                  </th>
                  <th 
                    className="cursor-pointer whitespace-nowrap px-4 py-3 text-left font-mono text-xs font-semibold uppercase text-muted-foreground hover:text-foreground"
                    onClick={() => toggleSort('riskScore')}
                  >
                    <span className="flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      Risk
                      <ArrowUpDown className="h-3 w-3" />
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredAndSortedFlows.map((flow, index) => {
                  const detectionFlags = getDetectionFlags(flow);
                  
                  return (
                    <motion.tr
                      key={flow.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.02 }}
                      onClick={() => setSelectedFlow(flow)}
                      className="cursor-pointer border-b border-border/50 transition-colors hover:bg-muted/50"
                    >
                      <td className="whitespace-nowrap px-4 py-3 font-mono text-sm">
                        {flow.id}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 font-mono text-sm">
                        <span className="text-foreground">{flow.sourceIp}</span>
                        <span className="text-muted-foreground">:{flow.sourcePort}</span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 font-mono text-sm">
                        <span className="text-foreground">{flow.destinationIp}</span>
                        <span className="text-muted-foreground">:{flow.destinationPort}</span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        <span className="rounded-full bg-primary/20 px-2 py-0.5 font-mono text-xs text-primary">
                          {flow.protocol}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 font-mono text-sm text-muted-foreground">
                        {formatDuration(flow.statistics.duration)}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 font-mono text-sm text-muted-foreground">
                        {flow.statistics.packetCount.toLocaleString()}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 font-mono text-sm text-muted-foreground">
                        {formatBytes(flow.statistics.byteCount)}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {detectionFlags.length > 0 ? (
                            detectionFlags.slice(0, 2).map(flag => (
                              <span
                                key={flag}
                                className="rounded bg-red-500/20 px-1.5 py-0.5 text-xs text-red-400"
                              >
                                {flag}
                              </span>
                            ))
                          ) : (
                            <span className="text-xs text-muted-foreground">—</span>
                          )}
                          {detectionFlags.length > 2 && (
                            <span className="text-xs text-muted-foreground">
                              +{detectionFlags.length - 2}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-semibold">{flow.riskScore}</span>
                          <span
                            className={`rounded-full border px-2 py-0.5 text-xs font-medium capitalize ${getSeverityColor(flow.severity)}`}
                          >
                            {flow.severity}
                          </span>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredAndSortedFlows.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12">
              <AlertCircle className="mb-4 h-8 w-8 text-muted-foreground" />
              <p className="text-muted-foreground">No flows match your filters</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Flow Detail Modal */}
      <FlowDetailModal
        flow={selectedFlow}
        onClose={() => setSelectedFlow(null)}
      />
    </div>
  );
};

export default Results;
