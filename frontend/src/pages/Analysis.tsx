import React, { useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDropzone } from 'react-dropzone'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Box, Button, Container, Grid, Typography, Paper, Slider, TextField,
  Stepper, Step, StepLabel, LinearProgress, Alert, Chip, Stack,
} from '@mui/material'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import CameraAltIcon from '@mui/icons-material/CameraAlt'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { useStore } from '../hooks/useStore'
import { analyzeImage } from '../utils/api'
import type { SoilData } from '../types'

const STEPS = ['Upload Foto Daun', 'Data Sensor Tanah', 'Analisis AI']

const SOIL_FIELDS: {
  key: keyof SoilData
  label: string
  unit: string
  min: number
  max: number
  step: number
  color: string
  icon: string
  desc: string
}[] = [
  { key: 'nitrogen', label: 'Nitrogen (N)', unit: 'mg/kg', min: 0, max: 150, step: 1, color: '#2D6A4F', icon: '🌿', desc: 'Kandungan Nitrogen tanah' },
  { key: 'phosphorus', label: 'Fosfor (P)', unit: 'mg/kg', min: 0, max: 80, step: 0.5, color: '#D4A017', icon: '⚗️', desc: 'Kandungan Fosfor tanah' },
  { key: 'potassium', label: 'Kalium (K)', unit: 'mg/kg', min: 0, max: 100, step: 0.5, color: '#E07B39', icon: '🪨', desc: 'Kandungan Kalium tanah' },
  { key: 'ph', label: 'pH Tanah', unit: '', min: 4.0, max: 9.0, step: 0.1, color: '#1B4332', icon: '🧪', desc: 'Tingkat keasaman tanah' },
  { key: 'ec', label: 'EC (Konduktivitas)', unit: 'mS/cm', min: 0.1, max: 4.0, step: 0.05, color: '#6B4423', icon: '⚡', desc: 'Electrical Conductivity' },
  { key: 'moisture', label: 'Kelembaban', unit: '%', min: 10, max: 100, step: 1, color: '#0077B6', icon: '💧', desc: 'Kadar air tanah' },
  { key: 'temperature', label: 'Suhu Udara', unit: '°C', min: 15, max: 45, step: 0.5, color: '#E74C3C', icon: '🌡️', desc: 'Suhu lingkungan' },
]

const ANALYZE_STAGES = [
  { label: 'Mengunggah gambar...', pct: 10 },
  { label: 'Mendeteksi area daun (YOLOv8-OBB)...', pct: 30 },
  { label: 'Menganalisis gejala nutrisi...', pct: 50 },
  { label: 'Menganalisis kondisi tanah (SVR)...', pct: 65 },
  { label: 'Melakukan Feature Fusion (14-dim)...', pct: 80 },
  { label: 'Menghasilkan rekomendasi pupuk (LightGBM)...', pct: 95 },
  { label: 'Selesai! ✅', pct: 100 },
]

export default function Analysis() {
  const nav = useNavigate()
  const cameraRef = useRef<HTMLInputElement>(null)
  const {
    currentStep, setStep,
    imageFile, imagePreview, setImage,
    soilData, setSoilField,
    isAnalyzing, setAnalyzing,
    analyzeProgress, analyzeStage, setProgress,
    setResult,
  } = useStore()

  const onDrop = useCallback((files: File[]) => {
    if (!files.length) return
    const f = files[0]
    const reader = new FileReader()
    reader.onload = (e) => {
      setImage(f, e.target?.result as string)
    }
    reader.readAsDataURL(f)
  }, [setImage])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] },
    maxFiles: 1,
  })

  const handleCameraCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    const reader = new FileReader()
    reader.onload = (ev) => setImage(f, ev.target?.result as string)
    reader.readAsDataURL(f)
  }

  const runAnalysis = async () => {
    if (!imageFile) return
    setAnalyzing(true)
    setResult(null)

    // Simulate staged progress
    let stageIdx = 0
    const interval = setInterval(() => {
      if (stageIdx < ANALYZE_STAGES.length - 1) {
        const s = ANALYZE_STAGES[stageIdx]
        setProgress(s.pct, s.label)
        stageIdx++
      }
    }, 400)

    try {
      const result = await analyzeImage(imageFile, soilData as unknown as Record<string, number>)
      clearInterval(interval)
      setProgress(100, 'Selesai! ✅')
      setResult(result)
      await new Promise((r) => setTimeout(r, 700))
      nav('/hasil')
    } catch (err: any) {
      clearInterval(interval)
      setAnalyzing(false)
      setProgress(0, '')
      alert(`Gagal menganalisis: ${err?.response?.data?.detail || err.message}`)
    }
  }

  const canProceed = currentStep === 0 ? !!imageFile : true

  return (
    <Box sx={{ pt: { xs: 10, md: 12 }, pb: 8, minHeight: '100vh', background: '#F0F7F4' }}>
      <Container maxWidth="md">
        {/* Step indicator */}
        <Paper elevation={0} sx={{ p: { xs: 2, md: 3 }, mb: 4, borderRadius: 4, border: '1px solid rgba(82,183,136,0.15)' }}>
          <Stepper activeStep={currentStep} alternativeLabel>
            {STEPS.map((label, i) => (
              <Step key={label} completed={i < currentStep}>
                <StepLabel
                  StepIconProps={{
                    sx: {
                      '&.Mui-completed': { color: '#52B788' },
                      '&.Mui-active': { color: '#1B4332' },
                    },
                  }}
                >
                  <Typography sx={{ fontSize: { xs: '0.7rem', md: '0.875rem' }, fontWeight: 600 }}>
                    {label}
                  </Typography>
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Paper>

        <AnimatePresence mode="wait">
          {/* ─── STEP 1: Upload ─── */}
          {currentStep === 0 && (
            <motion.div
              key="step0"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.35 }}
            >
              <Paper elevation={0} sx={{ p: { xs: 3, md: 5 }, borderRadius: 4, border: '1px solid rgba(82,183,136,0.15)' }}>
                <Typography variant="h4" sx={{ mb: 1, color: '#1B4332' }}>
                  📸 Upload Foto Daun Padi
                </Typography>
                <Typography sx={{ color: '#666', mb: 4 }}>
                  Ambil foto daun padi yang ingin didiagnosis. Pastikan daun terlihat jelas.
                </Typography>

                {/* Dropzone */}
                <Box
                  {...getRootProps()}
                  sx={{
                    border: `2.5px dashed ${isDragActive ? '#52B788' : imagePreview ? '#52B788' : '#C8E6D4'}`,
                    borderRadius: 4,
                    p: { xs: 4, md: 6 },
                    textAlign: 'center',
                    cursor: 'pointer',
                    background: isDragActive ? 'rgba(82,183,136,0.08)' : imagePreview ? 'rgba(82,183,136,0.04)' : '#fff',
                    transition: 'all 0.25s',
                    '&:hover': { borderColor: '#52B788', background: 'rgba(82,183,136,0.06)' },
                  }}
                >
                  <input {...getInputProps()} />
                  {imagePreview ? (
                    <Box>
                      <img
                        src={imagePreview}
                        alt="Preview daun"
                        style={{ maxHeight: 300, maxWidth: '100%', borderRadius: 12, objectFit: 'contain' }}
                      />
                      <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                        <CheckCircleIcon sx={{ color: '#52B788' }} />
                        <Typography sx={{ color: '#52B788', fontWeight: 700 }}>
                          Foto berhasil diunggah!
                        </Typography>
                      </Box>
                      <Typography sx={{ color: '#888', fontSize: '0.85rem', mt: 0.5 }}>
                        Klik atau seret untuk mengganti foto
                      </Typography>
                    </Box>
                  ) : (
                    <Box>
                      <CloudUploadIcon sx={{ fontSize: 64, color: '#B7E4C7', mb: 2 }} />
                      <Typography variant="h6" sx={{ color: '#1B4332', mb: 1, fontWeight: 700 }}>
                        Seret foto ke sini, atau klik untuk memilih
                      </Typography>
                      <Typography sx={{ color: '#888', fontSize: '0.9rem' }}>
                        Format: JPG, PNG, WEBP · Maks 10MB
                      </Typography>
                    </Box>
                  )}
                </Box>

                {/* Camera capture */}
                <Box sx={{ mt: 3, textAlign: 'center' }}>
                  <Typography sx={{ color: '#888', mb: 1.5, fontSize: '0.9rem' }}>atau</Typography>
                  <input
                    ref={cameraRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    style={{ display: 'none' }}
                    onChange={handleCameraCapture}
                  />
                  <Button
                    onClick={() => cameraRef.current?.click()}
                    variant="outlined"
                    startIcon={<CameraAltIcon />}
                    sx={{
                      borderColor: '#1B4332', color: '#1B4332', px: 3, py: 1.25,
                      borderRadius: 3, fontWeight: 600,
                      '&:hover': { background: 'rgba(27,67,50,0.06)' },
                    }}
                  >
                    Ambil Foto dengan Kamera HP
                  </Button>
                </Box>

                {/* Tips */}
                <Alert
                  severity="info"
                  sx={{ mt: 3, background: 'rgba(82,183,136,0.1)', border: '1px solid rgba(82,183,136,0.3)', borderRadius: 2 }}
                >
                  <Typography sx={{ fontWeight: 600, mb: 0.5, color: '#1B4332' }}>💡 Tips Foto yang Baik:</Typography>
                  <Typography sx={{ fontSize: '0.85rem', color: '#333' }}>
                    • Foto di tempat yang cukup cahaya<br />
                    • Pastikan daun tidak buram/berbayang<br />
                    • Foto dari jarak 20-30 cm dari daun
                  </Typography>
                </Alert>
              </Paper>
            </motion.div>
          )}

          {/* ─── STEP 2: Soil Data ─── */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.35 }}
            >
              <Paper elevation={0} sx={{ p: { xs: 3, md: 5 }, borderRadius: 4, border: '1px solid rgba(82,183,136,0.15)' }}>
                <Typography variant="h4" sx={{ mb: 1, color: '#1B4332' }}>
                  🧪 Data Sensor Tanah
                </Typography>
                <Typography sx={{ color: '#666', mb: 4 }}>
                  Masukkan nilai dari sensor tanah 7-in-1. Geser slider atau ketik nilai secara langsung.
                </Typography>

                <Grid container spacing={3}>
                  {SOIL_FIELDS.map((f) => {
                    const val = soilData[f.key]
                    return (
                      <Grid item xs={12} sm={6} key={f.key}>
                        <Paper
                          elevation={0}
                          sx={{
                            p: 2.5, borderRadius: 3,
                            border: '1.5px solid rgba(82,183,136,0.15)',
                            background: '#fff',
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <Box sx={{ fontSize: '1.3rem' }}>{f.icon}</Box>
                            <Box>
                              <Typography sx={{ fontWeight: 700, color: '#1B4332', fontSize: '0.9rem' }}>
                                {f.label}
                              </Typography>
                              <Typography sx={{ color: '#888', fontSize: '0.75rem' }}>{f.desc}</Typography>
                            </Box>
                            <Box flex={1} />
                            <TextField
                              size="small"
                              type="number"
                              value={val}
                              onChange={(e) => setSoilField(f.key, parseFloat(e.target.value) || 0)}
                              inputProps={{ min: f.min, max: f.max, step: f.step }}
                              sx={{
                                width: 90,
                                '& .MuiOutlinedInput-root': { borderRadius: 2 },
                              }}
                              InputProps={{
                                endAdornment: (
                                  <Typography sx={{ ml: 0.5, color: '#888', fontSize: '0.7rem', whiteSpace: 'nowrap' }}>
                                    {f.unit}
                                  </Typography>
                                ),
                              }}
                            />
                          </Box>
                          <Slider
                            value={val}
                            min={f.min}
                            max={f.max}
                            step={f.step}
                            onChange={(_, v) => setSoilField(f.key, v as number)}
                            sx={{
                              color: f.color,
                              '& .MuiSlider-thumb': { width: 18, height: 18 },
                            }}
                          />
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                            <Typography sx={{ color: '#bbb', fontSize: '0.7rem' }}>{f.min} {f.unit}</Typography>
                            <Typography sx={{ color: '#bbb', fontSize: '0.7rem' }}>{f.max} {f.unit}</Typography>
                          </Box>
                        </Paper>
                      </Grid>
                    )
                  })}
                </Grid>

                {/* Summary */}
                <Box
                  sx={{
                    mt: 3, p: 2.5, borderRadius: 3,
                    background: 'linear-gradient(135deg, #E8F5EE 0%, #F0F7F4 100%)',
                    border: '1px solid rgba(82,183,136,0.2)',
                  }}
                >
                  <Typography sx={{ fontWeight: 700, color: '#1B4332', mb: 1.5, fontSize: '0.9rem' }}>
                    📊 Ringkasan Data Sensor
                  </Typography>
                  <Stack direction="row" flexWrap="wrap" gap={1}>
                    {SOIL_FIELDS.map((f) => (
                      <Chip
                        key={f.key}
                        label={`${f.icon} ${f.label.split(' ')[0]}: ${soilData[f.key]} ${f.unit}`}
                        size="small"
                        sx={{ background: '#fff', border: '1px solid rgba(82,183,136,0.3)', fontSize: '0.75rem' }}
                      />
                    ))}
                  </Stack>
                </Box>
              </Paper>
            </motion.div>
          )}

          {/* ─── STEP 3: Analyzing ─── */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.35 }}
            >
              <Paper elevation={0} sx={{ p: { xs: 3, md: 5 }, borderRadius: 4, border: '1px solid rgba(82,183,136,0.15)', textAlign: 'center' }}>
                <Typography variant="h4" sx={{ mb: 1, color: '#1B4332' }}>
                  🤖 Analisis AI
                </Typography>
                <Typography sx={{ color: '#666', mb: 5 }}>
                  Sistem AI akan menganalisis gambar dan data tanah Anda secara otomatis.
                </Typography>

                {!isAnalyzing ? (
                  <>
                    {/* Summary before analyze */}
                    <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', mb: 5, flexWrap: 'wrap' }}>
                      <Paper elevation={0} sx={{ p: 2, borderRadius: 3, border: '1px solid rgba(82,183,136,0.2)', minWidth: 160 }}>
                        {imagePreview && (
                          <img src={imagePreview} alt="leaf" style={{ width: '100%', height: 100, objectFit: 'cover', borderRadius: 8 }} />
                        )}
                        <Typography sx={{ mt: 1, fontWeight: 600, color: '#1B4332', fontSize: '0.85rem' }}>
                          ✅ Foto Daun Siap
                        </Typography>
                      </Paper>
                      <Paper elevation={0} sx={{ p: 2, borderRadius: 3, border: '1px solid rgba(82,183,136,0.2)', minWidth: 160 }}>
                        <Box sx={{ fontSize: '2.5rem', mb: 1 }}>🧪</Box>
                        <Typography sx={{ fontWeight: 600, color: '#1B4332', fontSize: '0.85rem' }}>
                          ✅ 7 Data Sensor Siap
                        </Typography>
                        <Typography sx={{ color: '#888', fontSize: '0.75rem', mt: 0.5 }}>
                          N={soilData.nitrogen} · P={soilData.phosphorus} · K={soilData.potassium}
                        </Typography>
                      </Paper>
                    </Box>

                    {/* Pipeline preview */}
                    <Box sx={{ mb: 5, textAlign: 'left', maxWidth: 480, mx: 'auto' }}>
                      {[
                        { icon: '🎯', label: 'Deteksi ROI dengan YOLOv8-OBB' },
                        { icon: '🔬', label: 'Klasifikasi kekurangan nutrisi' },
                        { icon: '🧪', label: 'Analisis kondisi tanah (SVR)' },
                        { icon: '⚗️', label: 'Feature Fusion 14-dimensi' },
                        { icon: '💊', label: 'Rekomendasi pupuk (LightGBM)' },
                      ].map((item, i) => (
                        <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1.5 }}>
                          <Box sx={{
                            width: 36, height: 36, borderRadius: '50%',
                            background: 'rgba(82,183,136,0.1)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '1.1rem', flexShrink: 0,
                          }}>{item.icon}</Box>
                          <Typography sx={{ color: '#444', fontSize: '0.9rem' }}>{item.label}</Typography>
                        </Box>
                      ))}
                    </Box>

                    <Button
                      onClick={runAnalysis}
                      variant="contained"
                      size="large"
                      endIcon={<ArrowForwardIcon />}
                      sx={{
                        px: 6, py: 2, fontSize: '1.05rem', fontWeight: 700, borderRadius: 4,
                        background: 'linear-gradient(135deg, #1B4332 0%, #2D6A4F 100%)',
                        boxShadow: '0 8px 30px rgba(27,67,50,0.3)',
                        '&:hover': { boxShadow: '0 12px 40px rgba(27,67,50,0.4)' },
                      }}
                    >
                      🚀 Mulai Analisis AI
                    </Button>
                  </>
                ) : (
                  /* Progress */
                  <Box sx={{ maxWidth: 480, mx: 'auto' }}>
                    <Box sx={{ fontSize: '4rem', mb: 3 }} className="float">🤖</Box>
                    <Typography variant="h5" sx={{ color: '#1B4332', mb: 1, fontWeight: 700 }}>
                      Sedang Menganalisis...
                    </Typography>
                    <Typography sx={{ color: '#666', mb: 4 }}>{analyzeStage}</Typography>
                    <LinearProgress
                      variant="determinate"
                      value={analyzeProgress}
                      sx={{
                        height: 12, borderRadius: 6, mb: 1.5,
                        background: 'rgba(82,183,136,0.15)',
                        '& .MuiLinearProgress-bar': {
                          background: 'linear-gradient(90deg, #1B4332 0%, #52B788 100%)',
                          borderRadius: 6,
                        },
                      }}
                    />
                    <Typography sx={{ color: '#52B788', fontWeight: 700, fontSize: '1.1rem' }}>
                      {analyzeProgress}%
                    </Typography>

                    {/* Stage indicators */}
                    <Box sx={{ mt: 4, textAlign: 'left' }}>
                      {ANALYZE_STAGES.slice(0, -1).map((s, i) => (
                        <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                          <Box sx={{
                            width: 24, height: 24, borderRadius: '50%', flexShrink: 0,
                            background: analyzeProgress >= s.pct ? '#52B788' : 'rgba(82,183,136,0.15)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            transition: 'all 0.3s',
                          }}>
                            {analyzeProgress >= s.pct && (
                              <CheckCircleIcon sx={{ fontSize: 14, color: '#fff' }} />
                            )}
                          </Box>
                          <Typography sx={{
                            color: analyzeProgress >= s.pct ? '#1B4332' : '#aaa',
                            fontSize: '0.8rem',
                            fontWeight: analyzeProgress >= s.pct ? 600 : 400,
                            transition: 'all 0.3s',
                          }}>
                            {s.label}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                )}
              </Paper>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation buttons */}
        {!isAnalyzing && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Button
              onClick={() => setStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              startIcon={<ArrowBackIcon />}
              variant="outlined"
              sx={{ borderColor: '#1B4332', color: '#1B4332', px: 3, py: 1.25, borderRadius: 3 }}
            >
              Kembali
            </Button>
            {currentStep < STEPS.length - 1 && (
              <Button
                onClick={() => setStep(currentStep + 1)}
                disabled={!canProceed}
                endIcon={<ArrowForwardIcon />}
                variant="contained"
                sx={{ px: 4, py: 1.25, borderRadius: 3, fontWeight: 700 }}
              >
                Lanjut
              </Button>
            )}
          </Box>
        )}
      </Container>
    </Box>
  )
}
