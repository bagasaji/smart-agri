# 🌾 TaniCerdas AI – Smart Agriculture System

> **Sistem Deteksi Nutrisi Daun Padi Berbasis AI**  
> Late Fusion Framework: YOLOv8-OBB + SVR + LightGBM  
> Penelitian Tesis Magister Teknik Elektro – Bidang Artificial Intelligence

---

## 📋 Daftar Isi

1. [Gambaran Sistem](#gambaran-sistem)
2. [Arsitektur AI](#arsitektur-ai)
3. [Prasyarat](#prasyarat)
4. [Instalasi Cepat (Docker)](#instalasi-cepat-docker)
5. [Instalasi Manual](#instalasi-manual)
6. [Penggunaan API](#penggunaan-api)
7. [Struktur Proyek](#struktur-proyek)
8. [Model AI](#model-ai)

---

## 🌱 Gambaran Sistem

TaniCerdas AI adalah sistem web berbasis kecerdasan buatan yang dapat:

- 🎯 Mendeteksi **kekurangan nutrisi daun padi** (N, P, K, Sehat) dari foto
- 🧪 Menganalisis **kondisi tanah** dari 7 parameter sensor
- 💊 Memberikan **rekomendasi dosis pupuk** (Urea, NPK, KCl) secara otomatis
- 📊 Menampilkan **dashboard penelitian** dengan metrik model AI

---

## 🔬 Arsitektur AI

```
Gambar Daun                    Data Sensor Tanah (7)
     │                                │
     ▼                                ▼
YOLOv8-OBB                       Preprocessing
(Deteksi ROI)                   (StandardScaler)
     │                                │
     ▼                                ▼
YOLO Features (2D)           SVR Multi-Output (3D)
[class_idx, conf]         [svr_urea, svr_npk, svr_kcl]
     │                                │
     └──────────── Fusion ────────────┘
                      │
               5-Dim Vector
                      │
                      ▼
              LightGBM (×3)
       (lgbm_urea, lgbm_npk, lgbm_kcl)
                      │
                      ▼
         Rekomendasi Pupuk (kg/ha)
```

### Model yang Digunakan

| Model | File | Input | Output |
|-------|------|-------|--------|
| YOLOv8-OBB | `best.pt` | RGB Image | class, confidence, OBB |
| StandardScaler | `scaler.pkl` | 9 fitur | scaled features |
| SVR Multi-Output | `svr.pkl` | 9 scaled features | [urea, npk, kcl] intermediate |
| LightGBM Urea | `lgbm_urea.pkl` | 5-dim vector | urea kg/ha |
| LightGBM NPK | `lgbm_npk.pkl` | 5-dim vector | npk kg/ha |
| LightGBM KCl | `lgbm_kcl.pkl` | 5-dim vector | kcl kg/ha |

---

## ⚙️ Prasyarat

### Docker (Rekomendasi)
- Docker Desktop ≥ 24.0
- Docker Compose ≥ 2.0
- RAM: min 4GB
- Disk: min 5GB

### Manual
- Python 3.11+
- Node.js 20+
- pip, npm

---

## 🚀 Instalasi Cepat (Docker)

```bash
# 1. Clone / ekstrak proyek
cd smart-agri

# 2. Pastikan model AI tersedia
ls backend/models/
# Harus ada: best.pt, svr.pkl, lgbm_urea.pkl, lgbm_npk.pkl, lgbm_kcl.pkl, scaler.pkl

# 3. Jalankan dengan Docker Compose
docker-compose up --build

# 4. Buka browser
# Frontend : http://localhost:3000
# API Docs : http://localhost:8000/docs
```

---

## 🔧 Instalasi Manual

### Backend (FastAPI)

```bash
cd backend

# Buat virtual environment
python -m venv venv
source venv/bin/activate       # Linux/Mac
venv\Scripts\activate          # Windows

# Install dependencies
pip install -r requirements.txt

# Jalankan server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend (React + Vite)

```bash
cd frontend

# Install dependencies
npm install

# Development mode
npm run dev
# → Buka http://localhost:3000

# Production build
npm run build
npm run preview
```

---

## 📡 Penggunaan API

### Analisis Gambar + Tanah

```bash
curl -X POST http://localhost:8000/api/analyze \
  -F "image=@/path/to/leaf.jpg" \
  -F 'soil_data={"nitrogen":45,"phosphorus":25,"potassium":28,"ph":6.2,"ec":1.0,"moisture":60,"temperature":28}'
```

**Response:**
```json
{
  "id": "abc12345",
  "diagnosis": {
    "class_name_id": "Kekurangan Nitrogen (N)",
    "confidence": 87.3,
    "severity": "Moderate"
  },
  "recommendations": {
    "urea":  {"amount": 125.5, "unit": "kg/ha"},
    "npk":   {"amount": 48.2,  "unit": "kg/ha"},
    "kcl":   {"amount": 32.1,  "unit": "kg/ha"}
  },
  "farmer_advice": ["..."],
  "timing": {"total_ms": 1240}
}
```

### Endpoint Lain

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/api/health` | Status sistem |
| GET | `/api/history` | Riwayat analisis |
| DELETE | `/api/history/{id}` | Hapus riwayat |
| GET | `/api/stats` | Statistik & metrik model |

---

## 📁 Struktur Proyek

```
smart-agri/
├── backend/
│   ├── main.py              # FastAPI aplikasi utama
│   ├── models/              # Model AI (*.pt, *.pkl)
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── App.tsx          # Router utama
│   │   ├── pages/
│   │   │   ├── Landing.tsx      # Halaman beranda
│   │   │   ├── Analysis.tsx     # Wizard analisis (3 langkah)
│   │   │   ├── Results.tsx      # Dashboard hasil
│   │   │   ├── History.tsx      # Riwayat analisis
│   │   │   ├── Research.tsx     # Dashboard penelitian
│   │   │   └── Architecture.tsx # Visualisasi React Flow
│   │   ├── components/
│   │   │   └── Navbar.tsx
│   │   ├── hooks/
│   │   │   └── useStore.ts      # Zustand state management
│   │   ├── utils/
│   │   │   └── api.ts           # API service
│   │   └── types/
│   │       └── index.ts
│   ├── package.json
│   ├── vite.config.ts
│   ├── nginx.conf
│   └── Dockerfile
├── docker-compose.yml
└── README.md
```

---

## 🤖 Model AI

### Kelas Deteksi (YOLOv8-OBB)

| ID | Kelas | Deskripsi |
|----|-------|-----------|
| 0 | Healthy | Tanaman sehat |
| 1 | K_deficiency | Kekurangan Kalium |
| 2 | N_deficiency | Kekurangan Nitrogen |
| 3 | P_deficiency | Kekurangan Fosfor |

### Performa Model

| Metrik | Nilai |
|--------|-------|
| R² Score | 0.989 |
| RMSE | 3.41 kg/ha |
| MAPE | 16.0% |
| Accuracy | 97.2% |
| F1-Score | 96.1% |

---

## 📜 Referensi

- **Regulasi**: Permentan No. 40/2007 (Rekomendasi Pupuk Berimbang)
- **Dataset**: Roboflow Rice Leaf Dataset (2,591 gambar)
- **Hardware deployment**: Raspberry Pi 5
- **Jurnal target**: IEEE Access

---

*TaniCerdas AI – Penelitian Tesis 2025*
