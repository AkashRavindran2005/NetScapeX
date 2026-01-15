from typing import Dict, Tuple, List
import logging

logger = logging.getLogger(__name__)


class ProtocolAnomalyDetector:
    
    def __init__(self):
        self.standard_ports = {
            'HTTP': [80, 8080, 8000],
            'HTTPS': [443, 8443],
            'DNS': [53],
            'SSH': [22],
            'FTP': [20, 21],
            'SMTP': [25, 587],
            'TELNET': [23]
        }
        
    def detect(self, flow: Dict) -> Tuple[float, List[str]]:
        try:
            anomalies = []
            score = 0.0
            
            dst_port = flow.get('dst_port', 0)
            protocol = flow['protocol']
            
            if not dst_port:
                return 0.0, []
            
            if dst_port not in self.standard_ports['HTTPS'] and dst_port > 1024:
                if protocol == 'TCP' and self._is_likely_encrypted(flow):
                    anomalies.append(f"Possible HTTPS on non-standard port {dst_port}")
                    score += 0.4
            
            if dst_port not in self.standard_ports['HTTP'] and dst_port > 8000:
                if protocol == 'TCP':
                    anomalies.append(f"HTTP-like traffic on port {dst_port}")
                    score += 0.3
            
            if flow['is_dns'] and dst_port != 53:
                anomalies.append(f"DNS traffic on non-standard port {dst_port}")
                score += 0.5
            
            src_port = flow.get('src_port', 0)
            if src_port > 1024 and dst_port > 1024:
                anomalies.append("Peer-to-peer communication pattern")
                score += 0.2
            
            return min(score, 1.0), anomalies
            
        except Exception as e:
            logger.error(f"Protocol anomaly detection error: {str(e)}")
            return 0.0, []
    
    def _is_likely_encrypted(self, flow: Dict) -> bool:
        sizes = flow['packet_sizes']
        mean_size = sum(sizes) / len(sizes) if sizes else 0
        return 100 < mean_size < 1500 and len(set(sizes)) > len(sizes) * 0.5
