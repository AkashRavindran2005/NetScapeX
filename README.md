# NetScapeX

**Beyond Packet Inspection**

## Overview

NetScapeX is a full-stack, ML-augmented network traffic analysis platform that ingests PCAP files, reconstructs flows, extracts features, detects suspicious behavior, and presents results in a modern cyber-themed dashboard.   

**Tech stack:**  
- Frontend: React + Vite + Tailwind (new Vite plugin) + Recharts + Framer Motion  
- Backend: FastAPI, Scapy, scikit-learn, NumPy, Pandas  
***

## Features

- PCAP upload with drag & drop, validation, and progress UI   
- Packet parsing (metadata-only: timestamp, src_ip, dst_ip, protocol, packet_size, ports, DNS query) via Scapy, no payload inspection.   
- Flow reconstruction using `(src_ip, dst_ip, protocol, src_port, dst_port)` with unique Flow IDs and stats.   
- Feature extraction per flow: inter-arrival times, mean/variance of size, burst count, duration, pps, bps.   
- Threat modules:  
  - RandomForest ML classifier for “encrypted/anonymized traffic” probability (demo model).   
  - Beaconing detector (periodic outbound small-packet traffic).   
  - DNS tunneling detector using domain length and Shannon entropy.   
  - Protocol anomaly detector (HTTPS on non-standard ports, DNS on non-53, P2P patterns).   
- Risk engine combining all module scores to a 0–100 risk score with Low/Medium/High/Critical labels and confidence.   
- UI views: Landing, Upload, Dashboard, Results table, Flow detail modal/page.   
- Visuals: protocol distribution pie, risk distribution bar, risk gauge, top talkers.   
- Export: JSON report per analysis (downloadable from backend).   

***

## Project Structure

```text
NetScapeX/
├── backend/
│   ├── api.py
│   ├── parser.py
│   ├── flow.py
│   ├── features.py
│   ├── scorer.py
│   ├── report.py
│   ├── detectors/
│   │   ├── ml_classifier.py
│   │   ├── beaconing.py
│   │   ├── dns_tunnel.py
│   │   └── protocol_anomaly.py
│   └── uploads/           # PCAPs + JSON reports
└── frontend/
    ├── index.html
    ├── vite.config.js
    ├── package.json
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── index.css
        ├── pages/
        │   ├── Landing.jsx
        │   ├── Upload.jsx
        │   ├── Dashboard.jsx
        │   ├── Results.jsx
        │   └── FlowDetail.jsx
        ├── components/
        │   ├── Navigation.jsx
        │   ├── UploadCard.jsx
        │   ├── FlowTable.jsx
        │   ├── RiskMeter.jsx
        │   ├── Charts.jsx
        │   ├── FlowModal.jsx
        │   ├── LoadingSpinner.jsx
        │   └── StatsCard.jsx
        └── utils/
            ├── api.js
            └── formatters.js
```
  

***

## Backend Setup

### 1. Prerequisites

- Python 3.10+ (you’re currently on 3.13, which is fine but bleeding-edge).   
- Recommended: virtual environment.   

### 2. Install Dependencies

From the `backend/` root where `requirements.txt` lives:   

```bash
python -m venv venv
source venv/bin/activate          # Windows: venv\Scripts\activate

pip install -r requirements.txt
```

`requirements.txt` includes FastAPI, Uvicorn, Scapy, scikit-learn, NumPy, Pandas, aiofiles, etc.   

### 3. Run Backend

From `backend/` (where `api.py` is):   

```bash
uvicorn api:app --reload --host 0.0.0.0 --port 8000
```

- API base: `http://localhost:8000`  
- Docs (Swagger UI): `http://localhost:8000/docs`   

Key endpoints:  
- `GET /` – health check.   
- `POST /api/upload` – upload PCAP (`multipart/form-data`).   
- `POST /api/analyze` – body `{ "filename": "sample.pcap" }`, runs full pipeline.   
- `GET /api/download/{filename}` – download JSON report.   

***

## Frontend Setup

### 1. Prerequisites

- Node.js 18+ and npm.   

### 2. Install & Configure

From `frontend/`:   

```bash
npm install
npm install react-router-dom axios recharts framer-motion lucide-react react-dropzone
npm install -D tailwindcss @tailwindcss/vite
```

Tailwind is integrated via the new Vite plugin in `vite.config.js`, and `index.css` uses `@import "tailwindcss";`.   

### 3. Run Frontend

```bash
npm run dev
```

- Frontend dev URL: `http://localhost:3000` (proxying `/api` to `http://localhost:8000`).   

***

## Usage Flow

1. Open `http://localhost:3000`.   
2. Landing page → click “Upload PCAP & Start Analysis”.   
3. Drag & drop or browse to select `.pcap`/`.pcapng`.   
4. Click “Start Upload & Analysis” – upload to backend and trigger `/api/analyze`.   
5. After analysis completes, you’re auto-redirected to Dashboard:
   - Total packets, total flows, high-risk count, average risk score.   
   - Risk meter, protocol pie chart, risk bar chart, top talkers.   
6. Go to Results → interactive flows table:
   - Filter by risk, search by IP/Flow ID, sort by risk/packets/bytes.   
7. Click a flow to view Flow Detail:
   - Connection info, features, detections, risk breakdown, ML probability visualization.   
8. Download JSON report from backend using the export button or direct `/api/download/...`.   

***
