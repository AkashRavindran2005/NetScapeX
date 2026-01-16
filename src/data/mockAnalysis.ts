import { AnalysisResult, Flow, SeverityLevel } from '@/types/analysis';

const generateRandomIp = (): string => {
  return `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
};

const protocols = ['TCP', 'UDP', 'DNS', 'HTTP', 'HTTPS', 'SSH', 'FTP', 'SMTP', 'ICMP'];
const commonPorts = [80, 443, 22, 21, 25, 53, 8080, 3389, 445, 3306];

const getSeverity = (riskScore: number): SeverityLevel => {
  if (riskScore >= 80) return 'critical';
  if (riskScore >= 60) return 'high';
  if (riskScore >= 40) return 'medium';
  return 'low';
};

const generateFlow = (index: number): Flow => {
  const riskScore = Math.floor(Math.random() * 100);
  const protocol = protocols[Math.floor(Math.random() * protocols.length)];
  const duration = Math.random() * 3600;
  const packetCount = Math.floor(Math.random() * 10000) + 10;
  const byteCount = packetCount * (Math.floor(Math.random() * 1000) + 64);
  
  return {
    id: `flow-${String(index).padStart(6, '0')}`,
    sourceIp: generateRandomIp(),
    destinationIp: generateRandomIp(),
    sourcePort: Math.floor(Math.random() * 65535),
    destinationPort: commonPorts[Math.floor(Math.random() * commonPorts.length)],
    protocol,
    statistics: {
      duration,
      packetCount,
      byteCount,
      packetsPerSecond: packetCount / Math.max(duration, 1),
      bytesPerSecond: byteCount / Math.max(duration, 1),
      interArrivalTime: {
        mean: Math.random() * 0.5,
        variance: Math.random() * 0.1,
      },
      packetSize: {
        mean: byteCount / packetCount,
        variance: Math.random() * 500,
      },
      burstCount: Math.floor(Math.random() * 20),
    },
    detections: {
      encryptedAnonymized: {
        detected: Math.random() > 0.7,
        probability: Math.random(),
      },
      beaconing: {
        detected: Math.random() > 0.85,
        interval: Math.random() * 60,
        confidence: Math.random(),
      },
      dnsTunneling: {
        detected: protocol === 'DNS' && Math.random() > 0.9,
        domainLength: Math.floor(Math.random() * 50) + 10,
        shannonEntropy: Math.random() * 4 + 1,
      },
      protocolAnomaly: {
        detected: Math.random() > 0.8,
        flags: Math.random() > 0.5 
          ? ['HTTPS on non-standard port'] 
          : Math.random() > 0.5 
            ? ['DNS on non-53'] 
            : [],
      },
    },
    riskScore,
    severity: getSeverity(riskScore),
    confidenceScore: Math.random() * 0.4 + 0.6,
  };
};

export const generateMockFlows = (count: number = 150): Flow[] => {
  return Array.from({ length: count }, (_, i) => generateFlow(i));
};

export const generateMockAnalysis = (filename: string = 'capture.pcap'): AnalysisResult => {
  const flows = generateMockFlows(150);
  
  const severityCounts = {
    low: flows.filter(f => f.severity === 'low').length,
    medium: flows.filter(f => f.severity === 'medium').length,
    high: flows.filter(f => f.severity === 'high').length,
    critical: flows.filter(f => f.severity === 'critical').length,
  };

  const protocolCounts = protocols.reduce((acc, protocol) => {
    acc[protocol] = flows.filter(f => f.protocol === protocol).length;
    return acc;
  }, {} as Record<string, number>);

  const protocolDistribution = Object.entries(protocolCounts)
    .filter(([_, count]) => count > 0)
    .map(([protocol, count]) => ({
      protocol,
      count,
      percentage: (count / flows.length) * 100,
    }))
    .sort((a, b) => b.count - a.count);

  const sourceIpTraffic = flows.reduce((acc, flow) => {
    acc[flow.sourceIp] = (acc[flow.sourceIp] || 0) + flow.statistics.byteCount;
    return acc;
  }, {} as Record<string, number>);

  const destIpTraffic = flows.reduce((acc, flow) => {
    acc[flow.destinationIp] = (acc[flow.destinationIp] || 0) + flow.statistics.byteCount;
    return acc;
  }, {} as Record<string, number>);

  const topSourceIps = Object.entries(sourceIpTraffic)
    .map(([ip, traffic]) => ({
      ip,
      traffic,
      flowCount: flows.filter(f => f.sourceIp === ip).length,
    }))
    .sort((a, b) => b.traffic - a.traffic)
    .slice(0, 10);

  const topDestinationIps = Object.entries(destIpTraffic)
    .map(([ip, traffic]) => ({
      ip,
      traffic,
      flowCount: flows.filter(f => f.destinationIp === ip).length,
    }))
    .sort((a, b) => b.traffic - a.traffic)
    .slice(0, 10);

  const totalPackets = flows.reduce((sum, f) => sum + f.statistics.packetCount, 0);
  const avgRisk = flows.reduce((sum, f) => sum + f.riskScore, 0) / flows.length;

  return {
    metadata: {
      filename,
      timestamp: new Date().toISOString(),
      totalPackets,
      totalFlows: flows.length,
    },
    riskSummary: {
      overallScore: Math.round(avgRisk),
      severityCounts,
      highRiskFlowCount: severityCounts.high + severityCounts.critical,
    },
    protocolDistribution,
    topSourceIps,
    topDestinationIps,
    flows,
  };
};
