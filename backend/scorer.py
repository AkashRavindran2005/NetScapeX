from typing import Dict, Tuple
import logging

logger = logging.getLogger(__name__)


class RiskScorer:
    
    def __init__(self):
        self.weights = {
            'ml_probability': 0.30,
            'beaconing_score': 0.30,
            'dns_tunnel_score': 0.25,
            'protocol_anomaly_score': 0.15
        }
        
    def calculate_risk(self, detections: Dict) -> Dict:
        try:
            ml_prob = detections.get('ml_probability', 0)
            beacon_score = detections.get('beaconing_score', 0)
            dns_score = detections.get('dns_tunnel_score', 0)
            proto_score = detections.get('protocol_anomaly_score', 0)
            
            risk_score = (
                ml_prob * self.weights['ml_probability'] +
                beacon_score * self.weights['beaconing_score'] +
                dns_score * self.weights['dns_tunnel_score'] +
                proto_score * self.weights['protocol_anomaly_score']
            ) * 100
            
            confidence = self._calculate_confidence(detections)
            
            risk_level = self._classify_risk(risk_score)
            
            threats = self._identify_threats(detections)
            
            return {
                'risk_score': round(risk_score, 2),
                'risk_level': risk_level,
                'confidence': confidence,
                'threats': threats,
                'detections': detections
            }
            
        except Exception as e:
            logger.error(f"Risk calculation error: {str(e)}")
            return {
                'risk_score': 0,
                'risk_level': 'Unknown',
                'confidence': 'Low',
                'threats': [],
                'detections': {}
            }
    
    def _calculate_confidence(self, detections: Dict) -> str:
        signal_count = sum([
            detections.get('ml_probability', 0) > 0.5,
            detections.get('beaconing_detected', False),
            detections.get('dns_tunnel_detected', False),
            len(detections.get('protocol_anomalies', [])) > 0
        ])
        
        if signal_count >= 3:
            return "High"
        elif signal_count == 2:
            return "Medium"
        else:
            return "Low"
    
    def _classify_risk(self, score: float) -> str:
        if score >= 75:
            return "Critical"
        elif score >= 50:
            return "High"
        elif score >= 25:
            return "Medium"
        else:
            return "Low"
    
    def _identify_threats(self, detections: Dict) -> list:
        threats = []
        
        if detections.get('ml_classification') == "High Risk Encrypted Traffic":
            threats.append("Encrypted/Anonymized Traffic")
        
        if detections.get('beaconing_detected'):
            threats.append("C2 Beaconing")
        
        if detections.get('dns_tunnel_detected'):
            threats.append("DNS Tunneling")
        
        if detections.get('protocol_anomalies'):
            threats.append("Protocol Anomaly")
        
        if not threats:
            threats.append("None Detected")
        
        return threats
