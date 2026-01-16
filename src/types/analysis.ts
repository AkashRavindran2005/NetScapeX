export type SeverityLevel = 'low' | 'medium' | 'high' | 'critical';

export interface FlowDetections {
  encryptedAnonymized: {
    detected: boolean;
    probability: number;
  };
  beaconing: {
    detected: boolean;
    interval?: number;
    confidence: number;
  };
  dnsTunneling: {
    detected: boolean;
    domainLength?: number;
    shannonEntropy?: number;
  };
  protocolAnomaly: {
    detected: boolean;
    flags: string[];
  };
}

export interface FlowStatistics {
  duration: number;
  packetCount: number;
  byteCount: number;
  packetsPerSecond: number;
  bytesPerSecond: number;
  interArrivalTime: {
    mean: number;
    variance: number;
  };
  packetSize: {
    mean: number;
    variance: number;
  };
  burstCount: number;
}

export interface Flow {
  id: string;
  sourceIp: string;
  destinationIp: string;
  sourcePort: number;
  destinationPort: number;
  protocol: string;
  statistics: FlowStatistics;
  detections: FlowDetections;
  riskScore: number;
  severity: SeverityLevel;
  confidenceScore: number;
}

export interface AnalysisMetadata {
  filename: string;
  timestamp: string;
  totalPackets: number;
  totalFlows: number;
}

export interface RiskSummary {
  overallScore: number;
  severityCounts: {
    low: number;
    medium: number;
    high: number;
    critical: number;
  };
  highRiskFlowCount: number;
}

export interface ProtocolDistribution {
  protocol: string;
  count: number;
  percentage: number;
}

export interface TopTalker {
  ip: string;
  traffic: number;
  flowCount: number;
}

export interface AnalysisResult {
  metadata: AnalysisMetadata;
  riskSummary: RiskSummary;
  protocolDistribution: ProtocolDistribution[];
  topSourceIps: TopTalker[];
  topDestinationIps: TopTalker[];
  flows: Flow[];
}

export type UploadState = 'idle' | 'uploading' | 'parsing' | 'reconstructing' | 'extracting' | 'detecting' | 'scoring' | 'complete' | 'error';

export interface UploadProgress {
  state: UploadState;
  progress: number;
  message: string;
}
