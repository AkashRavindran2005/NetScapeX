import math
from typing import Dict, Tuple, List
import logging

logger = logging.getLogger(__name__)


class DNSTunnelDetector:
    
    def __init__(self):
        self.entropy_threshold = 3.5
        self.length_threshold = 30
        
    def detect(self, flow: Dict) -> Tuple[float, bool, str]:
        try:
            if not flow['is_dns']:
                return 0.0, False, "Not a DNS flow"
            
            dns_queries = flow['dns_queries']
            
            if not dns_queries:
                return 0.0, False, "No DNS queries found"
            
            suspicious_count = 0
            total_entropy = 0
            max_entropy = 0
            long_domains = []
            
            for query in dns_queries:
                subdomain = self._extract_subdomain(query)
                
                entropy = self._shannon_entropy(subdomain)
                total_entropy += entropy
                max_entropy = max(max_entropy, entropy)
                
                if len(subdomain) > self.length_threshold:
                    long_domains.append(subdomain[:40])
                
                if entropy > self.entropy_threshold or len(subdomain) > self.length_threshold:
                    suspicious_count += 1
            
            avg_entropy = total_entropy / len(dns_queries)
            
            score = 0.0
            reasons = []
            
            if avg_entropy > self.entropy_threshold:
                score += 0.5
                reasons.append(f"High entropy (avg={avg_entropy:.2f})")
            
            if long_domains:
                score += 0.3
                reasons.append(f"{len(long_domains)} long domains")
            
            if suspicious_count > len(dns_queries) * 0.5:
                score += 0.2
                reasons.append(f"{suspicious_count}/{len(dns_queries)} suspicious queries")
            
            is_tunnel = score >= 0.6
            description = "; ".join(reasons) if reasons else "Normal DNS traffic"
            
            return min(score, 1.0), is_tunnel, description
            
        except Exception as e:
            logger.error(f"DNS tunnel detection error: {str(e)}")
            return 0.0, False, "Analysis error"
    
    def _extract_subdomain(self, domain: str) -> str:
        parts = domain.split('.')
        if len(parts) > 2:
            return '.'.join(parts[:-2])
        return domain
    
    def _shannon_entropy(self, data: str) -> float:
        if not data:
            return 0.0
            
        entropy = 0
        for x in range(256):
            p_x = float(data.count(chr(x))) / len(data)
            if p_x > 0:
                entropy += - p_x * math.log2(p_x)
        return entropy
