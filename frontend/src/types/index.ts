export interface SoilData {
  nitrogen: number
  phosphorus: number
  potassium: number
  ph: number
  ec: number
  moisture: number
  temperature: number
}

export interface FertilizerRec {
  amount: number
  unit: string
  name: string
  formula: string
  n_content: string
  icon: string
}

export interface SoilStatus {
  value: number
  unit: string
  label: string
  status: 'Rendah' | 'Normal' | 'Tinggi'
  color: string
  low_threshold: number
  high_threshold: number
}

export interface AnalysisResult {
  id: string
  timestamp: string
  diagnosis: {
    class_name: string
    class_name_id: string
    confidence: number
    severity: string
    description: string
    nutrient: string | null
  }
  images: {
    original: string
    annotated: string
    roi: string | null
  }
  soil_analysis: Record<string, SoilStatus>
  svr_predictions: { urea: number; npk: number; kcl: number }
  fusion_vector: number[]
  recommendations: {
    urea: FertilizerRec
    npk: FertilizerRec
    kcl: FertilizerRec
  }
  farmer_advice: string[]
  timing: { yolo_ms: number; svr_ms: number; lgbm_ms: number; total_ms: number }
}

export interface HistoryItem {
  id: string
  timestamp: string
  image_b64: string
  diagnosis: string
  confidence: number
  severity: string
  urea_rec: number
  npk_rec: number
  kcl_rec: number
}
