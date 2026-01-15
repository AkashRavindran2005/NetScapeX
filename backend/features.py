import numpy as np
from typing import Dict, List
import logging

logger = logging.getLogger(__name__)


class FeatureExtractor:
    
    def __init__(self, flows: Dict[str, Dict]):
        self.flows = flows
        
    def extract_all(self) -> Dict[str, Dict]:
        flow_features = {}
        
        for flow_id, flow in self.flows.items():
            features = self.extract_flow_features(flow)
            flow_features[flow_id] = features
            
        logger.info(f"Extracted features for {len(flow_features)} flows")
        return flow_features
    
    def extract_flow_features(self, flow: Dict) -> Dict:
        timestamps = flow['timestamps']
        sizes = flow['packet_sizes']
        
        iat = self._compute_iat(timestamps)
        
        size_stats = self._compute_statistics(sizes)
        
        iat_stats = self._compute_statistics(iat) if len(iat) > 0 else self._empty_stats()
        
        burst_count = self._detect_bursts(iat)
        
        duration = flow['duration']
        
        pps = flow['packet_count'] / duration if duration > 0 else 0
        
        bps = flow['total_bytes'] / duration if duration > 0 else 0
        
        return {
            'packet_count': flow['packet_count'],
            'total_bytes': flow['total_bytes'],
            'duration': duration,
            'packets_per_second': pps,
            'bytes_per_second': bps,
            
            'mean_packet_size': size_stats['mean'],
            'std_packet_size': size_stats['std'],
            'min_packet_size': size_stats['min'],
            'max_packet_size': size_stats['max'],
            
            'mean_iat': iat_stats['mean'],
            'std_iat': iat_stats['std'],
            'min_iat': iat_stats['min'],
            'max_iat': iat_stats['max'],
            
            'burst_count': burst_count,
            'is_dns': flow['is_dns'],
            'protocol': flow['protocol'],
            'src_port': flow['src_port'] or 0,
            'dst_port': flow['dst_port'] or 0
        }
    
    def _compute_iat(self, timestamps: List[float]) -> List[float]:
        if len(timestamps) < 2:
            return []
        return [timestamps[i+1] - timestamps[i] for i in range(len(timestamps)-1)]
    
    def _compute_statistics(self, values: List[float]) -> Dict:
        if len(values) == 0:
            return self._empty_stats()
            
        arr = np.array(values)
        return {
            'mean': float(np.mean(arr)),
            'std': float(np.std(arr)),
            'min': float(np.min(arr)),
            'max': float(np.max(arr)),
            'median': float(np.median(arr))
        }
    
    def _empty_stats(self) -> Dict:
        return {'mean': 0, 'std': 0, 'min': 0, 'max': 0, 'median': 0}
    
    def _detect_bursts(self, iat: List[float], threshold: float = 0.01) -> int:
        if len(iat) == 0:
            return 0
        return sum(1 for t in iat if t < threshold)
