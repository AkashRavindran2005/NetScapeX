import json
from datetime import datetime
from typing import Dict, List
import logging

logger = logging.getLogger(__name__)


class ReportGenerator:
    
    def __init__(self, pcap_filename: str):
        self.pcap_filename = pcap_filename
        self.timestamp = datetime.now().isoformat()
        
    def generate_json_report(self, analysis_results: Dict) -> Dict:
        report = {
            'metadata': {
                'pcap_file': self.pcap_filename,
                'analysis_timestamp': self.timestamp,
                'tool': 'NetScapeX v1.0',
                'engine': 'CYBROSKIS'
            },
            'summary': {
                'total_packets': analysis_results.get('total_packets', 0),
                'total_flows': analysis_results.get('total_flows', 0),
                'protocol_distribution': analysis_results.get('protocol_distribution', {}),
                'high_risk_flows': len([f for f in analysis_results.get('flows', []) 
                                       if f['risk_assessment']['risk_level'] in ['High', 'Critical']]),
                'critical_threats': self._count_threats(analysis_results.get('flows', []))
            },
            'flows': analysis_results.get('flows', []),
            'top_talkers': analysis_results.get('top_talkers', []),
            'timeline': analysis_results.get('timeline', [])
        }
        
        return report
    
    def _count_threats(self, flows: List[Dict]) -> Dict[str, int]:
        threat_counts = {}
        for flow in flows:
            threats = flow['risk_assessment']['threats']
            for threat in threats:
                threat_counts[threat] = threat_counts.get(threat, 0) + 1
        return threat_counts
    
    def save_json(self, report: Dict, output_path: str):
        try:
            with open(output_path, 'w') as f:
                json.dump(report, f, indent=2)
            logger.info(f"JSON report saved to {output_path}")
        except Exception as e:
            logger.error(f"Error saving JSON report: {str(e)}")
            raise
