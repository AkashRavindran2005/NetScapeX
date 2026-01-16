import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, Activity, AlertTriangle, Clock, Package, Zap, Wifi, Database } from 'lucide-react';
import { Flow } from '@/types/analysis';
import { Button } from '@/components/ui/button';

interface FlowDetailModalProps {
  flow: Flow | null;
  onClose: () => void;
}

const FlowDetailModal = ({ flow, onClose }: FlowDetailModalProps) => {
  if (!flow) return null;

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'text-red-500 bg-red-500/20 border-red-500/50';
      case 'high':
        return 'text-orange-500 bg-orange-500/20 border-orange-500/50';
      case 'medium':
        return 'text-yellow-500 bg-yellow-500/20 border-yellow-500/50';
      case 'low':
        return 'text-green-500 bg-green-500/20 border-green-500/50';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  const getRiskColor = (score: number) => {
    if (score >= 80) return 'text-red-500';
    if (score >= 60) return 'text-orange-500';
    if (score >= 40) return 'text-yellow-500';
    return 'text-green-500';
  };

  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds.toFixed(2)} seconds`;
    if (seconds < 3600) return `${(seconds / 60).toFixed(2)} minutes`;
    return `${(seconds / 3600).toFixed(2)} hours`;
  };

  const formatBytes = (bytes: number) => {
    if (bytes >= 1e9) return `${(bytes / 1e9).toFixed(2)} GB`;
    if (bytes >= 1e6) return `${(bytes / 1e6).toFixed(2)} MB`;
    if (bytes >= 1e3) return `${(bytes / 1e3).toFixed(2)} KB`;
    return `${bytes} B`;
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-border bg-card shadow-2xl"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-card/95 px-6 py-4 backdrop-blur-sm">
            <div>
              <h2 className="font-mono text-xl font-bold">Flow Details</h2>
              <p className="font-mono text-sm text-muted-foreground">{flow.id}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="space-y-6 p-6">
            {/* Flow Identity */}
            <section>
              <h3 className="mb-4 flex items-center gap-2 font-mono font-semibold">
                <Wifi className="h-5 w-5 text-primary" />
                Flow Identity (5-Tuple)
              </h3>
              <div className="grid gap-4 rounded-xl border border-border bg-muted/30 p-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs text-muted-foreground">Source</p>
                  <p className="font-mono">
                    {flow.sourceIp}:<span className="text-primary">{flow.sourcePort}</span>
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Destination</p>
                  <p className="font-mono">
                    {flow.destinationIp}:<span className="text-primary">{flow.destinationPort}</span>
                  </p>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-xs text-muted-foreground">Protocol</p>
                  <span className="inline-block rounded-full bg-primary/20 px-3 py-1 font-mono text-sm text-primary">
                    {flow.protocol}
                  </span>
                </div>
              </div>
            </section>

            {/* Flow Statistics */}
            <section>
              <h3 className="mb-4 flex items-center gap-2 font-mono font-semibold">
                <Activity className="h-5 w-5 text-primary" />
                Flow Statistics
              </h3>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-lg border border-border bg-muted/30 p-4">
                  <div className="mb-1 flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span className="text-xs">Duration</span>
                  </div>
                  <p className="font-mono font-semibold">{formatDuration(flow.statistics.duration)}</p>
                </div>
                <div className="rounded-lg border border-border bg-muted/30 p-4">
                  <div className="mb-1 flex items-center gap-2 text-muted-foreground">
                    <Package className="h-4 w-4" />
                    <span className="text-xs">Total Packets</span>
                  </div>
                  <p className="font-mono font-semibold">{flow.statistics.packetCount.toLocaleString()}</p>
                </div>
                <div className="rounded-lg border border-border bg-muted/30 p-4">
                  <div className="mb-1 flex items-center gap-2 text-muted-foreground">
                    <Database className="h-4 w-4" />
                    <span className="text-xs">Total Bytes</span>
                  </div>
                  <p className="font-mono font-semibold">{formatBytes(flow.statistics.byteCount)}</p>
                </div>
                <div className="rounded-lg border border-border bg-muted/30 p-4">
                  <div className="mb-1 flex items-center gap-2 text-muted-foreground">
                    <Zap className="h-4 w-4" />
                    <span className="text-xs">Packets/sec</span>
                  </div>
                  <p className="font-mono font-semibold">{flow.statistics.packetsPerSecond.toFixed(2)}</p>
                </div>
                <div className="rounded-lg border border-border bg-muted/30 p-4">
                  <div className="mb-1 flex items-center gap-2 text-muted-foreground">
                    <Zap className="h-4 w-4" />
                    <span className="text-xs">Bytes/sec</span>
                  </div>
                  <p className="font-mono font-semibold">{formatBytes(flow.statistics.bytesPerSecond)}/s</p>
                </div>
                <div className="rounded-lg border border-border bg-muted/30 p-4">
                  <div className="mb-1 text-xs text-muted-foreground">Burst Count</div>
                  <p className="font-mono font-semibold">{flow.statistics.burstCount}</p>
                </div>
              </div>

              {/* Additional Stats */}
              <div className="mt-4 grid gap-4 rounded-xl border border-border bg-muted/30 p-4 sm:grid-cols-2">
                <div>
                  <p className="mb-2 text-xs font-semibold text-muted-foreground">Inter-Arrival Time</p>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-xs text-muted-foreground">Mean</p>
                      <p className="font-mono text-sm">{flow.statistics.interArrivalTime.mean.toFixed(4)}s</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Variance</p>
                      <p className="font-mono text-sm">{flow.statistics.interArrivalTime.variance.toFixed(6)}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="mb-2 text-xs font-semibold text-muted-foreground">Packet Size</p>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-xs text-muted-foreground">Mean</p>
                      <p className="font-mono text-sm">{flow.statistics.packetSize.mean.toFixed(1)} B</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Variance</p>
                      <p className="font-mono text-sm">{flow.statistics.packetSize.variance.toFixed(1)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Detection Results */}
            <section>
              <h3 className="mb-4 flex items-center gap-2 font-mono font-semibold">
                <AlertTriangle className="h-5 w-5 text-primary" />
                Detection Results
              </h3>
              <div className="space-y-3">
                {/* Encrypted/Anonymized */}
                <div className={`rounded-lg border p-4 ${flow.detections.encryptedAnonymized.detected ? 'border-red-500/30 bg-red-500/10' : 'border-border bg-muted/30'}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-mono font-semibold">Encrypted/Anonymized Traffic</p>
                      <p className="text-sm text-muted-foreground">ML-based encrypted traffic detection</p>
                    </div>
                    <div className="text-right">
                      <p className={`font-mono text-lg font-bold ${flow.detections.encryptedAnonymized.detected ? 'text-red-500' : 'text-green-500'}`}>
                        {(flow.detections.encryptedAnonymized.probability * 100).toFixed(1)}%
                      </p>
                      <p className="text-xs text-muted-foreground">probability</p>
                    </div>
                  </div>
                </div>

                {/* Beaconing */}
                <div className={`rounded-lg border p-4 ${flow.detections.beaconing.detected ? 'border-orange-500/30 bg-orange-500/10' : 'border-border bg-muted/30'}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-mono font-semibold">Beaconing Detection</p>
                      <p className="text-sm text-muted-foreground">
                        {flow.detections.beaconing.detected
                          ? `Interval: ~${flow.detections.beaconing.interval?.toFixed(1)}s`
                          : 'No regular beaconing pattern detected'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`font-mono text-lg font-bold ${flow.detections.beaconing.detected ? 'text-orange-500' : 'text-green-500'}`}>
                        {flow.detections.beaconing.detected ? 'Detected' : 'Clear'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {(flow.detections.beaconing.confidence * 100).toFixed(0)}% confidence
                      </p>
                    </div>
                  </div>
                </div>

                {/* DNS Tunneling */}
                <div className={`rounded-lg border p-4 ${flow.detections.dnsTunneling.detected ? 'border-red-500/30 bg-red-500/10' : 'border-border bg-muted/30'}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-mono font-semibold">DNS Tunneling</p>
                      <p className="text-sm text-muted-foreground">
                        Domain length: {flow.detections.dnsTunneling.domainLength} chars
                        {flow.detections.dnsTunneling.shannonEntropy && (
                          <> | Entropy: {flow.detections.dnsTunneling.shannonEntropy.toFixed(2)}</>
                        )}
                      </p>
                    </div>
                    <p className={`font-mono text-lg font-bold ${flow.detections.dnsTunneling.detected ? 'text-red-500' : 'text-green-500'}`}>
                      {flow.detections.dnsTunneling.detected ? 'Suspected' : 'Clear'}
                    </p>
                  </div>
                </div>

                {/* Protocol Anomaly */}
                <div className={`rounded-lg border p-4 ${flow.detections.protocolAnomaly.detected ? 'border-yellow-500/30 bg-yellow-500/10' : 'border-border bg-muted/30'}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-mono font-semibold">Protocol Anomaly</p>
                      {flow.detections.protocolAnomaly.flags.length > 0 ? (
                        <div className="mt-1 flex flex-wrap gap-1">
                          {flow.detections.protocolAnomaly.flags.map(flag => (
                            <span key={flag} className="rounded bg-yellow-500/20 px-2 py-0.5 text-xs text-yellow-500">
                              {flag}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">No anomalies detected</p>
                      )}
                    </div>
                    <p className={`font-mono text-lg font-bold ${flow.detections.protocolAnomaly.detected ? 'text-yellow-500' : 'text-green-500'}`}>
                      {flow.detections.protocolAnomaly.detected ? 'Flagged' : 'Normal'}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Risk Breakdown */}
            <section>
              <h3 className="mb-4 flex items-center gap-2 font-mono font-semibold">
                <Shield className="h-5 w-5 text-primary" />
                Risk Breakdown
              </h3>
              <div className="rounded-xl border border-border bg-muted/30 p-6">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Final Risk Score</p>
                    <p className={`font-mono text-4xl font-bold ${getRiskColor(flow.riskScore)}`}>
                      {flow.riskScore}
                      <span className="text-lg text-muted-foreground">/100</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Severity</p>
                    <span className={`inline-block rounded-full border px-4 py-1 font-mono text-lg font-bold capitalize ${getSeverityColor(flow.severity)}`}>
                      {flow.severity}
                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="text-muted-foreground">Risk Level</span>
                    <span className="font-mono">{flow.riskScore}%</span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-muted">
                    <div
                      className={`h-full transition-all ${
                        flow.riskScore >= 80
                          ? 'bg-red-500'
                          : flow.riskScore >= 60
                          ? 'bg-orange-500'
                          : flow.riskScore >= 40
                          ? 'bg-yellow-500'
                          : 'bg-green-500'
                      }`}
                      style={{ width: `${flow.riskScore}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Confidence Score</span>
                  <span className="font-mono font-semibold text-primary">
                    {(flow.confidenceScore * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </section>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default FlowDetailModal;
