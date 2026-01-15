from scapy.all import rdpcap, IP, TCP, UDP, DNS, ICMP, IPv6
from typing import List, Dict, Optional
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class PCAPParser:
    
    def __init__(self, pcap_path: str):
        self.pcap_path = pcap_path
        self.packets = []
        
    def parse(self) -> List[Dict]:
        try:
            logger.info(f"Loading PCAP file: {self.pcap_path}")
            packets = rdpcap(self.pcap_path)
            logger.info(f"Loaded {len(packets)} packets")
            
            for idx, pkt in enumerate(packets):
                packet_data = self._extract_metadata(pkt, idx)
                if packet_data:
                    self.packets.append(packet_data)
                    
            logger.info(f"Extracted metadata from {len(self.packets)} packets")
            return self.packets
            
        except FileNotFoundError:
            logger.error(f"PCAP file not found: {self.pcap_path}")
            raise
        except Exception as e:
            logger.error(f"Error parsing PCAP: {str(e)}")
            raise
    
    def _extract_metadata(self, pkt, idx: int) -> Optional[Dict]:
        try:
            metadata = {
                'packet_id': idx,
                'timestamp': float(pkt.time),
                'packet_size': len(pkt),
                'protocol': 'UNKNOWN',
                'src_ip': None,
                'dst_ip': None,
                'src_port': None,
                'dst_port': None,
                'flags': None,
                'ttl': None,
                'is_dns': False,
                'dns_query': None
            }
            
            if IP in pkt:
                metadata['src_ip'] = pkt[IP].src
                metadata['dst_ip'] = pkt[IP].dst
                metadata['ttl'] = pkt[IP].ttl
                metadata['protocol'] = pkt[IP].proto
                
            elif IPv6 in pkt:
                metadata['src_ip'] = pkt[IPv6].src
                metadata['dst_ip'] = pkt[IPv6].dst
                metadata['protocol'] = 'IPv6'
            
            if TCP in pkt:
                metadata['protocol'] = 'TCP'
                metadata['src_port'] = pkt[TCP].sport
                metadata['dst_port'] = pkt[TCP].dport
                metadata['flags'] = str(pkt[TCP].flags)
                
            elif UDP in pkt:
                metadata['protocol'] = 'UDP'
                metadata['src_port'] = pkt[UDP].sport
                metadata['dst_port'] = pkt[UDP].dport
                
            elif ICMP in pkt:
                metadata['protocol'] = 'ICMP'
            
            if DNS in pkt and pkt[DNS].qd:
                metadata['is_dns'] = True
                metadata['dns_query'] = pkt[DNS].qd.qname.decode('utf-8', errors='ignore').rstrip('.')
                
            return metadata
            
        except Exception as e:
            logger.warning(f"Error extracting metadata from packet {idx}: {str(e)}")
            return None
    
    def get_packet_count(self) -> int:
        return len(self.packets)
    
    def get_protocol_distribution(self) -> Dict[str, int]:
        protocols = {}
        for pkt in self.packets:
            proto = pkt['protocol']
            protocols[proto] = protocols.get(proto, 0) + 1
        return protocols
