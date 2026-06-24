import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Box, Button, Container, Grid, Typography, Paper, Chip, Stack,
  Tab, Tabs, Divider, Alert,
} from '@mui/material'
import RefreshIcon from '@mui/icons-material/Refresh'
import DownloadIcon from '@mui/icons-material/Download'
import ScienceIcon from '@mui/icons-material/Science'
import {
  RadialBarChart, RadialBar, ResponsiveContainer,
  Tooltip, Legend, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis,
} from 'recharts'
import { useStore } from '../hooks/useStore'

// ─── Gauge Component ───────────────────────────────────────────────────────
function GaugeChart({ value, min, max, label, unit, color, status }: {
  value: number; min: number; max: number; label: string;
  unit: string; color: string; status: string;
}) {
  const pct = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100))
  const angle = -135 + (pct / 100) * 270
  const statusColors: Record<string, string> = { Rendah: '#E07B39', Normal: '#52B788', Tinggi: '#E74C3C' }

  return (
    <Paper elevation={0} sx={{
      p: 2.5, borderRadius: 3, textAlign: 'center',
      border: `1.5px solid ${statusColors[status]}33`,
      background: '#fff',
    }}>
      <Box sx={{ position: 'relative', height: 100, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', mb: 1 }}>
        {/* Arc background */}
        <svg width="120" height="70" viewBox="0 0 120 70" style={{ position: 'absolute', bottom: 0 }}>
          <path d="M 10 65 A 50 50 0 0 1 110 65" fill="none" stroke="#E8F5EE" strokeWidth="10" strokeLinecap="round" />
          <path
            d="M 10 65 A 50 50 0 0 1 110 65"
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={`${(pct / 100) * 157} 157`}
            opacity={0.85}
          />
          {/* Needle */}
          <line
            x1="60" y1="65"
            x2={60 + 38 * Math.cos((angle * Math.PI) / 180)}
            y2={65 + 38 * Math.sin((angle * Math.PI) / 180)}
            stroke={color} strokeWidth="2.5" strokeLinecap="round"
          />
          <circle cx="60" cy="65" r="5" fill={color} />
        </svg>
        <Box sx={{ position: 'absolute', bottom: -4 }}>
          <Typography sx={{ fontWeight: 800, fontSize: '1.2rem', color, lineHeight: 1 }}>
            {typeof value === 'number' ? value.toFixed(value % 1 === 0 ? 0 : 1) : value}
          </Typography>
          <Typography sx={{ fontSize: '0.65rem', color: '#888' }}>{unit}</Typography>
        </Box>
      </Box>
      <Typography sx={{ fontWeight: 700, fontSize: '0.8rem', color: '#1B4332', mt: 1 }}>{label}</Typography>
      <Chip
        label={status}
        size="small"
        sx={{
          mt: 0.5, background: `${statusColors[status]}20`,
          color: statusColors[status], fontWeight: 700, fontSize: '0.65rem',
        }}
      />
    </Paper>
  )
}

// ─── Fertilizer Card ──────────────────────────────────────────────────────
function FertCard({ name, amount, formula, n_content, icon, color, desc }: {
  name: string; amount: number; formula: string; n_content: string;
  icon: string; color: string; desc?: string;
}) {
  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
      <Paper elevation={0} sx={{
        p: 3, borderRadius: 4,
        border: `2px solid ${color}33`,
        background: `linear-gradient(135deg, #fff 0%, ${color}08 100%)`,
        height: '100%',
      }}>
        <Box sx={{ fontSize: '2.5rem', mb: 1.5 }}>{icon}</Box>
        <Typography variant="h5" sx={{ fontWeight: 900, color, mb: 0.25 }}>
          {amount.toFixed(0)} <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>kg/ha</span>
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: 800, color: '#1B4332', mb: 0.5 }}>{name}</Typography>
        <Typography sx={{ color: '#888', fontSize: '0.75rem', mb: 1 }}>{formula} · {n_content}</Typography>
        {desc && (
          <Typography sx={{ color: '#555', fontSize: '0.8rem', lineHeight: 1.6 }}>{desc}</Typography>
        )}
      </Paper>
    </motion.div>
  )
}

// ─── Fusion Vector Viz ───────────────────────────────────────────────────
function FusionViz({ vector, svr }: { vector: number[]; svr: { urea: number; npk: number; kcl: number } }) {
  const groups = [
    { label: 'SVR Urea', val: vector[0] ?? svr.urea, color: '#52B788', group: 'SVR Output' },
    { label: 'SVR NPK', val: vector[1] ?? svr.npk, color: '#52B788', group: 'SVR Output' },
    { label: 'SVR KCl', val: vector[2] ?? svr.kcl, color: '#52B788', group: 'SVR Output' },
    { label: 'YOLO Class', val: ((vector[3] ?? 0) * 100).toFixed(0), color: '#D4A017', group: 'Visual' },
    { label: 'YOLO Conf', val: ((vector[4] ?? 0.85) * 100).toFixed(0) + '%', color: '#D4A017', group: 'Visual' },
  ]

  return (
    <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: '1.5px solid rgba(82,183,136,0.15)', background: '#fff' }}>
      <Typography variant="h6" sx={{ fontWeight: 800, color: '#1B4332', mb: 3 }}>
        ⚗️ Feature Fusion Vector (5-Dim)
      </Typography>
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
        {['SVR Output (3D)', 'Visual YOLO (2D)'].map((g, gi) => (
          <Chip
            key={g}
            label={g}
            size="small"
            sx={{
              background: gi === 0 ? 'rgba(82,183,136,0.15)' : 'rgba(212,160,23,0.15)',
              color: gi === 0 ? '#1B4332' : '#8B6914',
              fontWeight: 600, fontSize: '0.72rem',
            }}
          />
        ))}
      </Box>
      <Grid container spacing={1.5}>
        {groups.map((g, i) => (
          <Grid item xs={12} sm={6} md={4} key={i}>
            <Box sx={{
              p: 1.5, borderRadius: 2.5,
              background: `${g.color}12`,
              border: `1px solid ${g.color}33`,
            }}>
              <Typography sx={{ color: '#888', fontSize: '0.68rem', mb: 0.25 }}>Feature [{i}]</Typography>
              <Typography sx={{ fontWeight: 800, color: g.color, fontSize: '1.05rem' }}>
                {typeof g.val === 'number' ? g.val.toFixed(2) : g.val}
              </Typography>
              <Typography sx={{ color: '#555', fontSize: '0.72rem', fontWeight: 600 }}>{g.label}</Typography>
              <Chip
                label={g.group}
                size="small"
                sx={{ mt: 0.5, height: 16, fontSize: '0.6rem', background: `${g.color}20`, color: g.color }}
              />
            </Box>
          </Grid>
        ))}
      </Grid>
    </Paper>
  )
}

// ─── Main Results Page ────────────────────────────────────────────────────
export default function Results() {
  const { result, reset } = useStore()
  const nav = useNavigate()
  const [imgTab, setImgTab] = useState(0)

  if (!result) {
    return (
      <Box sx={{ pt: 16, textAlign: 'center', minHeight: '100vh', background: '#F0F7F4' }}>
        <Typography variant="h5" sx={{ color: '#888', mb: 3 }}>Tidak ada hasil analisis.</Typography>
        <Button variant="contained" onClick={() => nav('/analisis')}>Mulai Analisis</Button>
      </Box>
    )
  }

  const { diagnosis, images, soil_analysis, recommendations, farmer_advice, svr_predictions, fusion_vector, timing } = result

  const severityColor: Record<string, string> = {
    Normal: '#52B788', Moderate: '#D4A017', Severe: '#E74C3C',
  }
  const dColor = severityColor[diagnosis.severity] ?? '#D4A017'

  const classColor: Record<string, string> = {
    Healthy: '#52B788', K_deficiency: '#E07B39',
    N_deficiency: '#E74C3C', P_deficiency: '#9B59B6',
  }
  const imgList = [
    { label: 'Foto Asli', src: images.original },
    { label: 'Hasil YOLOv8-OBB', src: images.annotated },
    images.roi ? { label: 'ROI Crop', src: images.roi } : null,
  ].filter(Boolean) as { label: string; src: string }[]

  // Radar data for soil
  const soilKeys = ['nitrogen', 'phosphorus', 'potassium', 'ph', 'moisture']
  const radarData = soilKeys.map((k) => {
    const s = soil_analysis[k]
    if (!s) return null
    const pct = Math.min(100, ((s.value - s.low_threshold) / (s.high_threshold - s.low_threshold)) * 100 + 50)
    return { subject: k.slice(0, 3).toUpperCase(), A: Math.max(0, Math.min(100, pct)), fullMark: 100 }
  }).filter(Boolean) as { subject: string; A: number; fullMark: number }[]

  const handleReset = () => { reset(); nav('/analisis') }

  return (
    <Box sx={{ pt: { xs: 10, md: 12 }, pb: 8, minHeight: '100vh', background: '#F0F7F4' }}>
      <Container maxWidth="lg">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4, flexWrap: 'wrap', gap: 2 }}>
            <Box>
              <Typography variant="h4" sx={{ color: '#1B4332', fontWeight: 900 }}>
                📊 Hasil Analisis
              </Typography>
              <Typography sx={{ color: '#888', mt: 0.5 }}>
                ID: {result.id} · {new Date(result.timestamp).toLocaleString('id-ID')} · {timing.total_ms}ms
              </Typography>
            </Box>
            <Stack direction="row" spacing={1.5}>
              <Button startIcon={<RefreshIcon />} onClick={handleReset} variant="outlined"
                sx={{ borderColor: '#1B4332', color: '#1B4332', borderRadius: 2.5 }}>
                Analisis Baru
              </Button>
              <Button startIcon={<ScienceIcon />} onClick={() => nav('/penelitian')} variant="outlined"
                sx={{ borderColor: '#52B788', color: '#1B4332', borderRadius: 2.5 }}>
                Dashboard Penelitian
              </Button>
            </Stack>
          </Box>
        </motion.div>

        <Grid container spacing={3}>
          {/* ── Diagnosis Card ── */}
          <Grid item xs={12} md={5}>
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
              <Paper elevation={0} sx={{
                p: 3.5, borderRadius: 4, height: '100%',
                border: `2px solid ${classColor[diagnosis.class_name]}33`,
                background: `linear-gradient(135deg, #fff 0%, ${classColor[diagnosis.class_name]}06 100%)`,
              }}>
                <Typography sx={{ color: '#888', fontSize: '0.8rem', fontWeight: 600, mb: 2, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  Hasil Diagnosis
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 3 }}>
                  <Box sx={{
                    width: 56, height: 56, borderRadius: '16px', flexShrink: 0,
                    background: `${classColor[diagnosis.class_name]}18`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem',
                  }}>
                    {diagnosis.class_name === 'Healthy' ? '✅' : '⚠️'}
                  </Box>
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 900, color: classColor[diagnosis.class_name], lineHeight: 1.2 }}>
                      {diagnosis.class_name_id}
                    </Typography>
                    <Chip
                      label={diagnosis.severity}
                      size="small"
                      sx={{
                        mt: 0.75, background: `${dColor}20`, color: dColor,
                        fontWeight: 700, fontSize: '0.72rem',
                      }}
                    />
                  </Box>
                </Box>

                {/* Confidence bar */}
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.75 }}>
                    <Typography sx={{ fontSize: '0.82rem', color: '#555', fontWeight: 600 }}>Confidence Model</Typography>
                    <Typography sx={{ fontSize: '0.9rem', fontWeight: 800, color: classColor[diagnosis.class_name] }}>
                      {diagnosis.confidence}%
                    </Typography>
                  </Box>
                  <Box sx={{ height: 10, borderRadius: 5, background: 'rgba(0,0,0,0.06)', overflow: 'hidden' }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${diagnosis.confidence}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                      style={{
                        height: '100%',
                        background: `linear-gradient(90deg, ${classColor[diagnosis.class_name]}99, ${classColor[diagnosis.class_name]})`,
                        borderRadius: 5,
                      }}
                    />
                  </Box>
                </Box>

                <Typography sx={{ color: '#555', fontSize: '0.88rem', lineHeight: 1.75, mb: 3 }}>
                  {diagnosis.description}
                </Typography>

                <Divider sx={{ mb: 2 }} />
                {/* Timing */}
                <Grid container spacing={1.5}>
                  {[
                    { label: 'YOLO', val: `${timing.yolo_ms}ms` },
                    { label: 'SVR', val: `${timing.svr_ms}ms` },
                    { label: 'LightGBM', val: `${timing.lgbm_ms}ms` },
                    { label: 'Total', val: `${timing.total_ms}ms` },
                  ].map((t) => (
                    <Grid item xs={3} key={t.label}>
                      <Box sx={{ textAlign: 'center', p: 1, borderRadius: 2, background: '#F0F7F4' }}>
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 800, color: '#1B4332' }}>{t.val}</Typography>
                        <Typography sx={{ fontSize: '0.6rem', color: '#888' }}>{t.label}</Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            </motion.div>
          </Grid>

          {/* ── Image Carousel ── */}
          <Grid item xs={12} md={7}>
            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
              <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: '1px solid rgba(82,183,136,0.15)', height: '100%' }}>
                <Typography sx={{ color: '#888', fontSize: '0.8rem', fontWeight: 600, mb: 2, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  Visualisasi Deteksi
                </Typography>
                <Tabs
                  value={imgTab}
                  onChange={(_, v) => setImgTab(v)}
                  sx={{
                    mb: 2,
                    '& .MuiTab-root': { minHeight: 36, fontSize: '0.8rem', fontWeight: 600, textTransform: 'none' },
                    '& .Mui-selected': { color: '#1B4332' },
                    '& .MuiTabs-indicator': { background: '#1B4332' },
                  }}
                >
                  {imgList.map((img) => <Tab key={img.label} label={img.label} />)}
                </Tabs>
                <Box sx={{
                  borderRadius: 3, overflow: 'hidden', background: '#000',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  minHeight: 280,
                }}>
                  <motion.img
                    key={imgTab}
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    src={`data:image/jpeg;base64,${imgList[imgTab]?.src}`}
                    alt={imgList[imgTab]?.label}
                    style={{ maxWidth: '100%', maxHeight: 320, objectFit: 'contain' }}
                  />
                </Box>
                <Typography sx={{ color: '#888', fontSize: '0.78rem', mt: 1.5, textAlign: 'center' }}>
                  {imgTab === 0 && '📸 Gambar asli yang diunggah'}
                  {imgTab === 1 && '🎯 Hasil deteksi YOLOv8-OBB dengan bounding box'}
                  {imgTab === 2 && '✂️ Area ROI yang dipotong untuk analisis nutrisi'}
                </Typography>
              </Paper>
            </motion.div>
          </Grid>

          {/* ── Fertilizer Recommendations ── */}
          <Grid item xs={12}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#1B4332', mb: 2 }}>
                💊 Rekomendasi Pupuk
              </Typography>
              <Grid container spacing={2.5}>
                {[
                  { ...recommendations.urea, color: '#2D6A4F', desc: 'Sumber Nitrogen utama. Larutkan dalam air sebelum disemprotkan.' },
                  { ...recommendations.npk, color: '#D4A017', desc: 'Kombinasi Nitrogen, Fosfor, Kalium. Taburkan merata di sekitar tanaman.' },
                  { ...recommendations.kcl, color: '#E07B39', desc: 'Sumber Kalium. Tingkatkan ketahanan tanaman dan kualitas gabah.' },
                ].map((f) => (
                  <Grid item xs={12} sm={4} key={f.name}>
                    <FertCard {...f} />
                  </Grid>
                ))}
              </Grid>
            </motion.div>
          </Grid>

          {/* ── Soil Gauges ── */}
          <Grid item xs={12} md={7}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
              <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: '1px solid rgba(82,183,136,0.15)', height: '100%' }}>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#1B4332', mb: 3 }}>
                  🌱 Analisis Kondisi Tanah
                </Typography>
                <Grid container spacing={2}>
                  {Object.entries(soil_analysis).map(([k, s]) => (
                    <Grid item xs={6} sm={4} key={k}>
                      <GaugeChart
                        value={s.value}
                        min={s.low_threshold}
                        max={s.high_threshold}
                        label={s.label}
                        unit={s.unit}
                        color={s.color}
                        status={s.status}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            </motion.div>
          </Grid>

          {/* ── Soil Radar ── */}
          <Grid item xs={12} md={5}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.45 }}>
              <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: '1px solid rgba(82,183,136,0.15)', height: '100%' }}>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#1B4332', mb: 2 }}>
                  📡 Profil Nutrisi Tanah
                </Typography>
                <ResponsiveContainer width="100%" height={240}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="#E8F5EE" />
                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12, fontWeight: 600, fill: '#1B4332' }} />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar name="Nutrisi" dataKey="A" stroke="#52B788" fill="#52B788" fillOpacity={0.25} strokeWidth={2.5} />
                  </RadarChart>
                </ResponsiveContainer>
              </Paper>
            </motion.div>
          </Grid>

          {/* ── Fusion Vector ── */}
          <Grid item xs={12} md={6}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 }}>
              <FusionViz vector={fusion_vector} svr={svr_predictions} />
            </motion.div>
          </Grid>

          {/* ── SVR Predictions ── */}
          <Grid item xs={12} md={6}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.55 }}>
              <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: '1px solid rgba(82,183,136,0.15)', height: '100%' }}>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#1B4332', mb: 3 }}>
                  🧮 Prediksi SVR (Intermediate)
                </Typography>
                {[
                  { label: 'Urea', val: svr_predictions.urea, color: '#2D6A4F', final: recommendations.urea.amount },
                  { label: 'NPK', val: svr_predictions.npk, color: '#D4A017', final: recommendations.npk.amount },
                  { label: 'KCl', val: svr_predictions.kcl, color: '#E07B39', final: recommendations.kcl.amount },
                ].map((r) => (
                  <Box key={r.label} sx={{ mb: 2.5 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.75 }}>
                      <Typography sx={{ fontWeight: 700, color: '#1B4332', fontSize: '0.9rem' }}>{r.label}</Typography>
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography sx={{ fontSize: '0.75rem', color: '#888' }}>SVR: {r.val.toFixed(1)}</Typography>
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: r.color }}>→ Final: {r.final.toFixed(1)} kg/ha</Typography>
                      </Box>
                    </Box>
                    <Box sx={{ height: 8, borderRadius: 4, background: '#F0F7F4', overflow: 'hidden' }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(100, (r.val / 200) * 100)}%` }}
                        transition={{ duration: 1, delay: 0.7 }}
                        style={{ height: '100%', background: r.color, borderRadius: 4, opacity: 0.7 }}
                      />
                    </Box>
                    <Box sx={{ height: 8, borderRadius: 4, background: '#F0F7F4', overflow: 'hidden', mt: 0.5 }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(100, (r.final / 200) * 100)}%` }}
                        transition={{ duration: 1, delay: 0.9 }}
                        style={{ height: '100%', background: r.color, borderRadius: 4 }}
                      />
                    </Box>
                  </Box>
                ))}
                <Typography sx={{ color: '#888', fontSize: '0.75rem', mt: 2, fontStyle: 'italic' }}>
                  * SVR menghasilkan prediksi awal, LightGBM menyempurnakan dengan informasi visual YOLO
                </Typography>
              </Paper>
            </motion.div>
          </Grid>

          {/* ── Farmer Advice ── */}
          <Grid item xs={12}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.6 }}>
              <Paper elevation={0} sx={{
                p: 3.5, borderRadius: 4,
                background: 'linear-gradient(135deg, #E8F5EE 0%, #F0F7F4 100%)',
                border: '1.5px solid rgba(82,183,136,0.25)',
              }}>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#1B4332', mb: 2.5 }}>
                  👨‍🌾 Saran untuk Petani
                </Typography>
                <Grid container spacing={2}>
                  {farmer_advice.map((advice, i) => (
                    <Grid item xs={12} sm={6} key={i}>
                      <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                        <Box sx={{
                          width: 28, height: 28, borderRadius: '50%', flexShrink: 0, mt: 0.25,
                          background: '#1B4332',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '0.7rem', fontWeight: 800, color: '#fff',
                        }}>
                          {i + 1}
                        </Box>
                        <Typography sx={{ color: '#333', fontSize: '0.9rem', lineHeight: 1.7 }}>
                          {advice}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}
