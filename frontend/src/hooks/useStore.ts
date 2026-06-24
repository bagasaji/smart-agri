import { create } from 'zustand'
import type { AnalysisResult, SoilData } from '../types'

interface AppStore {
  currentStep: number
  imageFile: File | null
  imagePreview: string | null
  soilData: SoilData
  result: AnalysisResult | null
  isAnalyzing: boolean
  analyzeProgress: number
  analyzeStage: string

  setStep: (s: number) => void
  setImage: (file: File, preview: string) => void
  setSoilField: (k: keyof SoilData, v: number) => void
  setSoilData: (d: SoilData) => void
  setResult: (r: AnalysisResult | null) => void
  setAnalyzing: (v: boolean) => void
  setProgress: (pct: number, stage: string) => void
  reset: () => void
}

const defaultSoil: SoilData = {
  nitrogen: 45,
  phosphorus: 25,
  potassium: 28,
  ph: 6.2,
  ec: 1.0,
  moisture: 60,
  temperature: 28,
}

export const useStore = create<AppStore>((set) => ({
  currentStep: 0,
  imageFile: null,
  imagePreview: null,
  soilData: { ...defaultSoil },
  result: null,
  isAnalyzing: false,
  analyzeProgress: 0,
  analyzeStage: '',

  setStep: (s) => set({ currentStep: s }),
  setImage: (file, preview) => set({ imageFile: file, imagePreview: preview }),
  setSoilField: (k, v) =>
    set((state) => ({ soilData: { ...state.soilData, [k]: v } })),
  setSoilData: (d) => set({ soilData: d }),
  setResult: (r) => set({ result: r }),
  setAnalyzing: (v) => set({ isAnalyzing: v }),
  setProgress: (pct, stage) => set({ analyzeProgress: pct, analyzeStage: stage }),
  reset: () =>
    set({
      currentStep: 0,
      imageFile: null,
      imagePreview: null,
      soilData: { ...defaultSoil },
      result: null,
      isAnalyzing: false,
      analyzeProgress: 0,
      analyzeStage: '',
    }),
}))
