from typing import List, Dict, Tuple, Optional  # Add Optional here
from collections import defaultdict
import hashlib
import logging

logger = logging.getLogger(__name__)


class FlowReconstructor:    
    def __init__(self, packets: List[Dict]):
        self.packets = packets
        self.flows = {}
        
    def reconstruct(self) -> Dict[str, Dict]:
        flow_dict = defaultdict(list)
        
        for pkt in self.packets:
            if not pkt['src_ip'] or not pkt['dst_ip']:
                continue
                
            flow_key = self._create_flow_key(
                pkt['src_ip'], 
                pkt['dst_ip'],
                pkt['protocol'],
                pkt.get('src_port'),
                pkt.get('dst_port')
            )
            
            flow_dict[flow_key].append(pkt)
        
        for flow_id, (flow_key, packets) in enumerate(flow_dict.items()):
            self.flows[flow_id] = self._create_flow_object(flow_id, flow_key, packets)
        
        logger.info(f"Reconstructed {len(self.flows)} flows from {len(self.packets)} packets")
        return self.flows
    
    def _create_flow_key(self, src_ip: str, dst_ip: str, protocol: str, 
                         src_port: Optional[int], dst_port: Optional[int]) -> str:
 
        if src_ip < dst_ip:
            ip_tuple = (src_ip, dst_ip, src_port or 0, dst_port or 0)
        else:
            ip_tuple = (dst_ip, src_ip, dst_port or 0, src_port or 0)
            
        key_string = f"{ip_tuple[0]}:{ip_tuple[1]}:{protocol}:{ip_tuple[2]}:{ip_tuple[3]}"
        return hashlib.md5(key_string.encode()).hexdigest()[:16]
    
    def _create_flow_object(self, flow_id: int, flow_key: str, packets: List[Dict]) -> Dict:
        packets_sorted = sorted(packets, key=lambda x: x['timestamp'])
        
        first_pkt = packets_sorted[0]
        last_pkt = packets_sorted[-1]
        
        timestamps = [p['timestamp'] for p in packets_sorted]
        sizes = [p['packet_size'] for p in packets_sorted]
        
        return {
            'flow_id': f"FLOW-{flow_id:05d}",
            'flow_key': flow_key,
            'src_ip': first_pkt['src_ip'],
            'dst_ip': first_pkt['dst_ip'],
            'protocol': first_pkt['protocol'],
            'src_port': first_pkt.get('src_port'),
            'dst_port': first_pkt.get('dst_port'),
            'packet_count': len(packets),
            'total_bytes': sum(sizes),
            'start_time': timestamps[0],
            'end_time': timestamps[-1],
            'duration': timestamps[-1] - timestamps[0],
            'timestamps': timestamps,
            'packet_sizes': sizes,
            'packets': packets_sorted,
            'is_dns': any(p['is_dns'] for p in packets_sorted),
            'dns_queries': [p['dns_query'] for p in packets_sorted if p.get('dns_query')]
        }
    
    def get_flow_count(self) -> int:
        return len(self.flows)
    
    def get_top_talkers(self, n: int = 10) -> List[Tuple[str, int]]:
        talkers = defaultdict(int)
        for flow in self.flows.values():
            talkers[flow['src_ip']] += flow['packet_count']
        return sorted(talkers.items(), key=lambda x: x[1], reverse=True)[:n]
