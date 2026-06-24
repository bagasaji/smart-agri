import axios from 'axios'
import type { AnalysisResult, HistoryItem } from '../types'

const BASE_URL = "";

const api = axios.create({ baseURL: BASE_URL, timeout: 120000 })

export async function analyzeImage(
  imageFile: File,
  soilData: Record<string, number>
): Promise<AnalysisResult> {
  const form = new FormData()
  form.append('image', imageFile)
  form.append('soil_data', JSON.stringify(soilData))
  const { data } = await api.post<AnalysisResult>('/api/analyze', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

export async function getHistory(): Promise<HistoryItem[]> {
  const { data } = await api.get<HistoryItem[]>('/api/history')
  return data
}

export async function deleteHistory(id: string): Promise<void> {
  await api.delete(`/api/history/${id}`)
}

export async function getStats(): Promise<any> {
  const { data } = await api.get('/api/stats')
  return data
}

export async function healthCheck(): Promise<boolean> {
  try {
    await api.get('/api/health')
    return true
  } catch {
    return false
  }
}
