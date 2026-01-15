import numpy as np
from typing import Dict, Tuple
import logging

logger = logging.getLogger(__name__)


class BeaconingDetector:
    
    def __init__(self):
        self.iat_variance_threshold = 0.2
        self.periodicity_threshold = 0.7
        
    def detect(self, flow: Dict, features: Dict) -> Tuple[float, bool, str]:
        try:
            timestamps = flow['timestamps']
            
            if len(timestamps) < 5:
                return 0.0, False, "Insufficient packets for beaconing analysis"
            
            iat = np.diff(timestamps)
            
            mean_iat = np.mean(iat)
            std_iat = np.std(iat)
            cv = std_iat / mean_iat if mean_iat > 0 else float('inf')
            
            is_periodic = cv < self.iat_variance_threshold
            
            sizes = flow['packet_sizes']
            mean_size = np.mean(sizes)
            is_small_packets = mean_size < 200
            
            is_outbound = self._is_outbound_dominant(flow)
            
            score = 0.0
            reasons = []
            
            if is_periodic:
                score += 0.4
                reasons.append(f"Regular intervals (CV={cv:.3f})")
            
            if is_small_packets:
                score += 0.3
                reasons.append(f"Small packets (avg={mean_size:.0f} bytes)")
                
            if is_outbound:
                score += 0.3
                reasons.append("Outbound dominant")
            
            is_beaconing = score >= 0.7
            description = "; ".join(reasons) if reasons else "No beaconing detected"
            
            return score, is_beaconing, description
            
        except Exception as e:
            logger.error(f"Beaconing detection error: {str(e)}")
            return 0.0, False, "Analysis error"
    
    def _is_outbound_dominant(self, flow: Dict) -> bool:
        src_port = flow.get('src_port', 0)
        dst_port = flow.get('dst_port', 0)
        return src_port > 1024 and dst_port < 1024
