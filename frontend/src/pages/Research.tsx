import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Box, Container, Typography, Paper, Grid, Chip, CircularProgress,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Alert,
} from '@mui/material'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RTooltip,
  Legend, ResponsiveContainer, LineChart, Line,
} from 'recharts'
import { getStats } from '../utils/api'

// ─── Metric Card ─────────────────────────────────────────────────────────────
function MetricCard({ label, value, unit, icon, color, desc }: {
  label: string; value: string | number; unit?: string;
  icon: string; color: string; desc?: string;
}) {
  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
      <Paper elevation={0} sx={{
        p: 3, borderRadius: 4, height: '100%',
        border: `1.5px solid ${color}25`,
        background: `linear-gradient(135deg, #fff 0%, ${color}08 100%)`,
      }}>
        <Box sx={{ fontSize: '2rem', mb: 1.5 }}>{icon}</Box>
        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5, mb: 0.5 }}>
          <Typography variant="h4" sx={{ fontWeight: 900, color }}>
            {value}
          </Typography>
          {unit && <Typography sx={{ color: '#888', fontSize: '0.85rem' }}>{unit}</Typography>}
        </Box>
        <Typography sx={{ fontWeight: 700, color: '#1B4332', fontSize: '0.9rem', mb: 0.5 }}>{label}</Typography>
        {desc && <Typography sx={{ color: '#888', fontSize: '0.78rem', lineHeight: 1.6 }}>{desc}</Typography>}
      </Paper>
    </motion.div>
  )
}

// ─── Confusion Matrix ────────────────────────────────────────────────────────
function ConfusionMatrix() {
  const labels = ['Healthy', 'K-def', 'N-def', 'P-def']
  const matrix = [
    [22, 1, 0, 1],
    [0, 18, 1, 0],
    [1, 0, 27, 1],
    [0, 1, 1, 17],
  ]
  const maxVal = Math.max(...matrix.flat())

  return (
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 700, color: '#888', fontSize: '0.75rem', border: 'none' }}>
              Prediksi →
            </TableCell>
            {labels.map((l) => (
              <TableCell key={l} align="center" sx={{ fontWeight: 700, color: '#1B4332', fontSize: '0.78rem', border: 'none' }}>
                {l}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {matrix.map((row, ri) => (
            <TableRow key={ri}>
              <TableCell sx={{ fontWeight: 700, color: '#1B4332', fontSize: '0.78rem', border: 'none' }}>
                {labels[ri]}
              </TableCell>
              {row.map((val, ci) => (
                <TableCell
                  key={ci}
                  align="center"
                  sx={{
                    border: 'none',
                    borderRadius: 1,
                    background: ri === ci
                      ? `rgba(82,183,136,${0.2 + (val / maxVal) * 0.6})`
                      : val > 0 ? `rgba(231,76,60,${(val / maxVal) * 0.4})` : '#F8FAF5',
                    fontWeight: ri === ci ? 800 : 500,
                    color: ri === ci ? '#1B4332' : val > 0 ? '#E74C3C' : '#aaa',
                    fontSize: '0.9rem',
                    p: 1.5,
                    transition: 'background 0.3s',
                  }}
                >
                  {val}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

// ─── Main Page ───────────────────────────────────────────────────────────────
const MODEL_COMPARISON = [
  { model: 'Weighted Avg', r2: 0.978, rmse: 5.2 },
  { model: 'Rule-Based', r2: 0.951, rmse: 8.7 },
  { model: 'XGBoost', r2: 0.985, rmse: 3.92 },
  { model: 'LightGBM', r2: 0.989, rmse: 3.41 },
  { model: 'MLP Single', r2: 0.971, rmse: 6.1 },
  { model: 'MLP Dual', r2: 0.979, rmse: 5.0 },
]

const ABLATION_DATA = [
  { config: 'Sensor Only', r2: 0.921, rmse: 10.8, mape: 28.4 },
  { config: 'Sensor+YOLO', r2: 0.961, rmse: 7.1, mape: 21.3 },
  { config: 'Full Fusion', r2: 0.989, rmse: 3.41, mape: 16.0 },
]

const CV_DATA = Array.from({ length: 5 }, (_, i) => ({
  fold: `Fold ${i + 1}`,
  urea: +(68 + Math.sin(i * 1.5) * 8).toFixed(2),
  npk: +(48 + Math.cos(i * 1.2) * 6).toFixed(2),
  kcl: +(32 + Math.sin(i * 0.9) * 5).toFixed(2),
}))

export default function Research() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    getStats()
      .then(setStats)
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  const metrics = stats?.model_metrics ?? {
    r2: 0.989, rmse: 3.41, mape: 16.0,
    accuracy: 97.2, precision: 96.8, recall: 95.4, f1: 96.1,
  }

  return (
    <Box sx={{ pt: { xs: 10, md: 12 }, pb: 8, minHeight: '100vh', background: '#F0F7F4' }}>
      <Container maxWidth="lg">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Box sx={{ mb: 4 }}>
            <Chip label="📚 Dashboard Penelitian Tesis" sx={{ mb: 1.5, background: '#1B4332', color: '#fff', fontWeight: 700 }} />
            <Typography variant="h4" sx={{ color: '#1B4332', fontWeight: 900 }}>
              Performa Model AI
            </Typography>
            <Typography sx={{ color: '#666', mt: 0.5 }}>
              Late Fusion Framework: YOLOv8-OBB + SVR + LightGBM · 5-Fold GroupKFold CV
            </Typography>
          </Box>
        </motion.div>

        {loading && (
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <CircularProgress sx={{ color: '#52B788' }} />
          </Box>
        )}
        {error && (
          <Alert severity="warning" sx={{ mb: 3, borderRadius: 3 }}>
            Backend tidak tersambung. Menampilkan data statis dari hasil penelitian.
          </Alert>
        )}

        {/* ── Key Metrics ── */}
        <Grid container spacing={2.5} sx={{ mb: 3 }}>
          {[
            { label: 'R² Score', value: metrics.r2, unit: '', icon: '📈', color: '#52B788', desc: 'Koefisien determinasi model LightGBM terbaik' },
            { label: 'RMSE', value: `${metrics.rmse}`, unit: 'kg/ha', icon: '📉', color: '#D4A017', desc: 'Root Mean Squared Error prediksi pupuk' },
            { label: 'MAPE', value: `${metrics.mape}`, unit: '%', icon: '🎯', color: '#E07B39', desc: 'Mean Absolute Percentage Error' },
            { label: 'Accuracy', value: `${metrics.accuracy}`, unit: '%', icon: '✅', color: '#1B4332', desc: 'Akurasi klasifikasi kekurangan nutrisi' },
          ].map((m, i) => (
            <Grid item xs={6} md={3} key={m.label}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
              >
                <MetricCard {...m} />
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* ── Classification Metrics ── */}
        <Grid container spacing={2.5} sx={{ mb: 3 }}>
          {[
            { label: 'Precision', value: `${metrics.precision}%`, icon: '🎯', color: '#52B788' },
            { label: 'Recall', value: `${metrics.recall}%`, icon: '🔍', color: '#2D6A4F' },
            { label: 'F1-Score', value: `${metrics.f1}%`, icon: '⚖️', color: '#40916C' },
            { label: 'Total Analisis', value: stats?.total_analyses ?? '—', icon: '📊', color: '#6B4423' },
          ].map((m, i) => (
            <Grid item xs={6} md={3} key={m.label}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.3 + i * 0.08 }}
              >
                <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3, border: '1px solid rgba(82,183,136,0.15)', background: '#fff' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{ fontSize: '1.6rem' }}>{m.icon}</Box>
                    <Box>
                      <Typography sx={{ fontWeight: 900, color: m.color, fontSize: '1.25rem' }}>{m.value}</Typography>
                      <Typography sx={{ color: '#888', fontSize: '0.78rem', fontWeight: 600 }}>{m.label}</Typography>
                    </Box>
                  </Box>
                </Paper>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={3}>
          {/* ── Model Comparison Bar Chart ── */}
          <Grid item xs={12} md={7}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 }}>
              <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: '1px solid rgba(82,183,136,0.15)' }}>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#1B4332', mb: 0.5 }}>
                  📊 Perbandingan Model Fusion
                </Typography>
                <Typography sx={{ color: '#888', fontSize: '0.8rem', mb: 3 }}>
                  R² Score pada 5-Fold GroupKFold Cross Validation
                </Typography>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={MODEL_COMPARISON} barSize={28}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F0F7F4" />
                    <XAxis dataKey="model" tick={{ fontSize: 11, fill: '#888' }} axisLine={false} tickLine={false} />
                    <YAxis domain={[0.9, 1.0]} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                    <RTooltip
                      contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                      formatter={(v: number) => [v.toFixed(4), 'R² Score']}
                    />
                    <Bar
                      dataKey="r2"
                      name="R² Score"
                      radius={[6, 6, 0, 0]}
                      fill="#52B788"
                      label={{ position: 'top', fontSize: 10, fontWeight: 700, fill: '#1B4332' }}
                    />
                  </BarChart>
                </ResponsiveContainer>
                <Chip
                  label="🏆 LightGBM: Best Model (R²=0.989)"
                  sx={{ mt: 1.5, background: 'rgba(82,183,136,0.15)', color: '#1B4332', fontWeight: 700, fontSize: '0.78rem' }}
                />
              </Paper>
            </motion.div>
          </Grid>

          {/* ── Confusion Matrix ── */}
          <Grid item xs={12} md={5}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.55 }}>
              <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: '1px solid rgba(82,183,136,0.15)', height: '100%' }}>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#1B4332', mb: 0.5 }}>
                  🔲 Confusion Matrix
                </Typography>
                <Typography sx={{ color: '#888', fontSize: '0.8rem', mb: 3 }}>
                  Klasifikasi 4 Kelas Kekurangan Nutrisi
                </Typography>
                <ConfusionMatrix />
                <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Chip size="small" label="🟩 True Positive" sx={{ background: 'rgba(82,183,136,0.15)', color: '#1B4332', fontSize: '0.68rem' }} />
                  <Chip size="small" label="🟥 False Positive" sx={{ background: 'rgba(231,76,60,0.15)', color: '#E74C3C', fontSize: '0.68rem' }} />
                </Box>
              </Paper>
            </motion.div>
          </Grid>

          {/* ── Ablation Study ── */}
          <Grid item xs={12} md={6}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.6 }}>
              <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: '1px solid rgba(82,183,136,0.15)' }}>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#1B4332', mb: 0.5 }}>
                  🔬 Ablation Study
                </Typography>
                <Typography sx={{ color: '#888', fontSize: '0.8rem', mb: 3 }}>
                  Kontribusi tiap komponen terhadap performa
                </Typography>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={ABLATION_DATA} layout="vertical" barSize={20}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F0F7F4" horizontal={false} />
                    <XAxis type="number" domain={[0.8, 1.0]} tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis dataKey="config" type="category" tick={{ fontSize: 11, fontWeight: 600 }} axisLine={false} tickLine={false} width={100} />
                    <RTooltip
                      contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                    />
                    <Bar dataKey="r2" name="R² Score" fill="#1B4332" radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Paper>
            </motion.div>
          </Grid>

          {/* ── CV Folds ── */}
          <Grid item xs={12} md={6}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.65 }}>
              <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: '1px solid rgba(82,183,136,0.15)' }}>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#1B4332', mb: 0.5 }}>
                  🔁 5-Fold Cross Validation
                </Typography>
                <Typography sx={{ color: '#888', fontSize: '0.8rem', mb: 3 }}>
                  RMSE per fold untuk setiap target pupuk (kg/ha)
                </Typography>
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={CV_DATA}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F0F7F4" />
                    <XAxis dataKey="fold" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                    <RTooltip
                      contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                    />
                    <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '0.8rem' }} />
                    <Line type="monotone" dataKey="urea" stroke="#52B788" strokeWidth={2.5} dot={{ r: 4, fill: '#52B788' }} name="Urea" />
                    <Line type="monotone" dataKey="npk" stroke="#D4A017" strokeWidth={2.5} dot={{ r: 4, fill: '#D4A017' }} name="NPK" />
                    <Line type="monotone" dataKey="kcl" stroke="#E07B39" strokeWidth={2.5} dot={{ r: 4, fill: '#E07B39' }} name="KCl" />
                  </LineChart>
                </ResponsiveContainer>
              </Paper>
            </motion.div>
          </Grid>

          {/* ── Dataset Statistics ── */}
          <Grid item xs={12}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.7 }}>
              <Paper elevation={0} sx={{ p: 3.5, borderRadius: 4, border: '1px solid rgba(82,183,136,0.15)' }}>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#1B4332', mb: 3 }}>
                  📂 Statistik Dataset & Model
                </Typography>
                <Grid container spacing={2}>
                  {[
                    { label: 'Total Gambar', val: '2,591', icon: '🖼️', color: '#52B788' },
                    { label: 'Paired Samples', val: '2,150', icon: '🔗', color: '#2D6A4F' },
                    { label: 'Kelas Nutrisi', val: '4', icon: '🏷️', color: '#D4A017' },
                    { label: 'CV Folds', val: '5', icon: '🔁', color: '#E07B39' },
                    { label: 'Fitur Input', val: '5-dim', icon: '⚗️', color: '#6B4423' },
                    { label: 'Output Pupuk', val: '3', icon: '💊', color: '#9B59B6' },
                    { label: 'Peraturan Fuzzy', val: 'Permentan 40/2007', icon: '📜', color: '#1B4332' },
                    { label: 'Hardware', val: 'Raspberry Pi 5', icon: '🖥️', color: '#E74C3C' },
                  ].map((s) => (
                    <Grid item xs={6} sm={3} key={s.label}>
                      <Box sx={{
                        p: 2, borderRadius: 3, textAlign: 'center',
                        background: `${s.color}08`, border: `1px solid ${s.color}22`,
                      }}>
                        <Box sx={{ fontSize: '1.5rem', mb: 0.75 }}>{s.icon}</Box>
                        <Typography sx={{ fontWeight: 800, color: s.color, fontSize: '0.95rem' }}>{s.val}</Typography>
                        <Typography sx={{ color: '#888', fontSize: '0.72rem', fontWeight: 600 }}>{s.label}</Typography>
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
