from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
import aiofiles
import os
import logging
from datetime import datetime

from parser import PCAPParser
from flow import FlowReconstructor
from features import FeatureExtractor
from detectors.ml_classifier import MLTrafficClassifier
from detectors.beaconing import BeaconingDetector
from detectors.dns_tunnel import DNSTunnelDetector
from detectors.protocol_anomaly import ProtocolAnomalyDetector
from scorer import RiskScorer
from report import ReportGenerator

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="NetScapeX API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

ml_classifier = MLTrafficClassifier()
beaconing_detector = BeaconingDetector()
dns_detector = DNSTunnelDetector()
protocol_detector = ProtocolAnomalyDetector()
risk_scorer = RiskScorer()


@app.get("/")
async def root():
    return {
        "status": "online",
        "service": "NetScapeX API",
        "version": "1.0.0",
        "timestamp": datetime.now().isoformat()
    }


@app.post("/api/upload")
async def upload_pcap(file: UploadFile = File(...)):
    try:
        if not file.filename.endswith(('.pcap', '.pcapng')):
            raise HTTPException(status_code=400, detail="Invalid file format. Only .pcap or .pcapng allowed")
        
        file_path = os.path.join(UPLOAD_DIR, file.filename)
        
        async with aiofiles.open(file_path, 'wb') as f:
            content = await file.read()
            await f.write(content)
        
        logger.info(f"File uploaded: {file.filename} ({len(content)} bytes)")
        
        return {
            "success": True,
            "filename": file.filename,
            "size": len(content),
            "path": file_path
        }
        
    except Exception as e:
        logger.error(f"Upload error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/analyze")
async def analyze_pcap(data: dict):
    try:
        filename = data.get('filename')
        if not filename:
            raise HTTPException(status_code=400, detail="Filename required")
        
        file_path = os.path.join(UPLOAD_DIR, filename)
        
        if not os.path.exists(file_path):
            raise HTTPException(status_code=404, detail="File not found")
        
        logger.info(f"Starting analysis of {filename}")
        
        parser = PCAPParser(file_path)
        packets = parser.parse()
        
        flow_reconstructor = FlowReconstructor(packets)
        flows = flow_reconstructor.reconstruct()
        
        feature_extractor = FeatureExtractor(flows)
        flow_features = feature_extractor.extract_all()
        
        analyzed_flows = []
        
        for flow_id, flow in flows.items():
            features = flow_features[flow_id]
            
            ml_prob, ml_class = ml_classifier.predict(features)
            
            beacon_score, beacon_detected, beacon_desc = beaconing_detector.detect(flow, features)
            
            dns_score, dns_detected, dns_desc = dns_detector.detect(flow)
            
            proto_score, proto_anomalies = protocol_detector.detect(flow)
            
            detections = {
                'ml_probability': ml_prob,
                'ml_classification': ml_class,
                'beaconing_score': beacon_score,
                'beaconing_detected': beacon_detected,
                'beaconing_description': beacon_desc,
                'dns_tunnel_score': dns_score,
                'dns_tunnel_detected': dns_detected,
                'dns_tunnel_description': dns_desc,
                'protocol_anomaly_score': proto_score,
                'protocol_anomalies': proto_anomalies
            }
            
            risk_assessment = risk_scorer.calculate_risk(detections)
            
            analyzed_flows.append({
                'flow_id': flow['flow_id'],
                'src_ip': flow['src_ip'],
                'dst_ip': flow['dst_ip'],
                'protocol': flow['protocol'],
                'src_port': flow['src_port'],
                'dst_port': flow['dst_port'],
                'packet_count': flow['packet_count'],
                'total_bytes': flow['total_bytes'],
                'duration': round(flow['duration'], 3),
                'features': features,
                'risk_assessment': risk_assessment
            })
        
        analyzed_flows.sort(key=lambda x: x['risk_assessment']['risk_score'], reverse=True)
        
        protocol_dist = parser.get_protocol_distribution()
        top_talkers = flow_reconstructor.get_top_talkers(10)
        
        analysis_result = {
            'success': True,
            'total_packets': len(packets),
            'total_flows': len(flows),
            'protocol_distribution': protocol_dist,
            'top_talkers': [{'ip': ip, 'packet_count': count} for ip, count in top_talkers],
            'flows': analyzed_flows[:100],  # Limit to top 100 for performance
            'analysis_timestamp': datetime.now().isoformat()
        }
        
        report_gen = ReportGenerator(filename)
        json_report = report_gen.generate_json_report(analysis_result)
        
        report_path = os.path.join(UPLOAD_DIR, f"{filename}_report.json")
        report_gen.save_json(json_report, report_path)
        
        logger.info(f"Analysis complete: {len(flows)} flows analyzed")
        
        return analysis_result
        
    except Exception as e:
        logger.error(f"Analysis error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/download/{filename}")
async def download_report(filename: str):
    try:
        file_path = os.path.join(UPLOAD_DIR, filename)
        
        if not os.path.exists(file_path):
            raise HTTPException(status_code=404, detail="Report not found")
        
        return FileResponse(
            file_path,
            media_type='application/json',
            filename=filename
        )
        
    except Exception as e:
        logger.error(f"Download error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
