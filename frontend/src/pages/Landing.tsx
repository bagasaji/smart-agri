import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Box, Button, Container, Grid, Typography, Paper, Chip, Stack
} from '@mui/material'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import ScienceIcon from '@mui/icons-material/Science'
import SpeedIcon from '@mui/icons-material/Speed'
import AgricultureIcon from '@mui/icons-material/Agriculture'
import VerifiedIcon from '@mui/icons-material/Verified'
import CameraAltIcon from '@mui/icons-material/CameraAlt'
import SensorsIcon from '@mui/icons-material/Sensors'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, delay: i * 0.12, ease: 'easeOut' }
  }),
}

const STEPS = [
  {
    icon: <CameraAltIcon sx={{ fontSize: 36, color: '#52B788' }} />,
    step: '01',
    title: 'Foto Daun Padi',
    desc: 'Ambil foto daun padi menggunakan HP Anda. Sistem akan otomatis mendeteksi area daun.',
  },
  {
    icon: <SensorsIcon sx={{ fontSize: 36, color: '#D4A017' }} />,
    step: '02',
    title: 'Data Sensor Tanah',
    desc: 'Masukkan 7 data sensor tanah: Nitrogen, Fosfor, Kalium, pH, EC, Kelembaban, Suhu.',
  },
  {
    icon: <AutoAwesomeIcon sx={{ fontSize: 36, color: '#E74C3C' }} />,
    step: '03',
    title: 'Analisis AI Otomatis',
    desc: 'AI mendeteksi kekurangan nutrisi dan menghasilkan rekomendasi dosis pupuk secara akurat.',
  },
]

const FEATURES = [
  {
    icon: '🎯',
    title: 'Akurasi Tinggi',
    value: 'R² = 0.989',
    desc: 'Model LightGBM dengan performa terbaik pada dataset uji.',
    color: '#1B4332',
  },
  {
    icon: '⚡',
    title: 'Sangat Cepat',
    value: '< 2 Detik',
    desc: 'Analisis lengkap dari deteksi hingga rekomendasi dalam hitungan detik.',
    color: '#D4A017',
  },
  {
    icon: '🌿',
    title: 'Multi-Nutrisi',
    value: 'N, P, K',
    desc: 'Mendeteksi 3 jenis kekurangan nutrisi dan memberikan rekomendasi 3 pupuk.',
    color: '#40916C',
  },
  {
    icon: '📱',
    title: 'Mobile Friendly',
    value: 'iOS & Android',
    desc: 'Dapat digunakan di HP petani tanpa instalasi aplikasi apapun.',
    color: '#6B4423',
  },
]

const MODEL_LABELS = [
  { name: 'YOLOv8-OBB', color: '#52B788', desc: 'Deteksi ROI Daun' },
  { name: 'SVR', color: '#D4A017', desc: 'Analisis Tanah' },
  { name: 'LightGBM', color: '#E74C3C', desc: 'Fusion & Rekomendasi' },
]

export default function Landing() {
  return (
    <Box>
      {/* ── HERO ── */}
      <Box
        className="bg-agri-hero"
        sx={{ pt: { xs: 14, md: 16 }, pb: { xs: 10, md: 14 }, position: 'relative', overflow: 'hidden' }}
      >
        {/* Background decoration */}
        <Box sx={{
          position: 'absolute', top: -80, right: -80, width: 400, height: 400,
          borderRadius: '50%', background: 'rgba(82,183,136,0.08)',
          pointerEvents: 'none',
        }} />
        <Box sx={{
          position: 'absolute', bottom: -60, left: -60, width: 300, height: 300,
          borderRadius: '50%', background: 'rgba(212,160,23,0.06)',
          pointerEvents: 'none',
        }} />

        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <motion.div initial="hidden" animate="visible" variants={fadeUp}>
                <Chip
                  label="🔬 Sistem AI Penelitian Tesis"
                  sx={{
                    mb: 3, background: 'rgba(82,183,136,0.2)', color: '#B7E4C7',
                    border: '1px solid rgba(82,183,136,0.4)', fontSize: '0.8rem', fontWeight: 600,
                  }}
                />
              </motion.div>

              <motion.div custom={1} initial="hidden" animate="visible" variants={fadeUp}>
                <Typography
                  variant="h2"
                  sx={{ color: '#fff', lineHeight: 1.15, mb: 3,
                    fontSize: { xs: '2rem', md: '2.8rem' } }}
                >
                  Sistem Deteksi Nutrisi
                  <Box component="span" sx={{ color: '#74C69D' }}> Daun Padi </Box>
                  Berbasis AI
                </Typography>
              </motion.div>

              <motion.div custom={2} initial="hidden" animate="visible" variants={fadeUp}>
                <Typography
                  sx={{ color: 'rgba(255,255,255,0.8)', fontSize: { xs: '1rem', md: '1.15rem' },
                    mb: 5, lineHeight: 1.75 }}
                >
                  Unggah foto daun dan masukkan data sensor tanah untuk mendapatkan 
                  diagnosis kekurangan nutrisi serta rekomendasi dosis pupuk{' '}
                  <strong style={{ color: '#74C69D' }}>secara otomatis dan akurat.</strong>
                </Typography>
              </motion.div>

              <motion.div custom={3} initial="hidden" animate="visible" variants={fadeUp}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <Button
                    component={Link}
                    to="/analisis"
                    variant="contained"
                    size="large"
                    endIcon={<ArrowForwardIcon />}
                    sx={{
                      background: 'linear-gradient(135deg, #52B788 0%, #40916C 100%)',
                      color: '#fff', px: 4, py: 1.75, fontSize: '1rem', fontWeight: 700,
                      borderRadius: 3, boxShadow: '0 6px 24px rgba(82,183,136,0.4)',
                      '&:hover': { boxShadow: '0 8px 30px rgba(82,183,136,0.55)' },
                    }}
                  >
                    🌾 Mulai Analisis
                  </Button>
                  <Button
                    component={Link}
                    to="/arsitektur"
                    variant="outlined"
                    size="large"
                    startIcon={<ScienceIcon />}
                    sx={{
                      borderColor: 'rgba(255,255,255,0.4)', color: '#fff',
                      px: 3.5, py: 1.75, fontSize: '1rem', borderRadius: 3,
                      '&:hover': { borderColor: '#fff', background: 'rgba(255,255,255,0.08)' },
                    }}
                  >
                    Pelajari Cara Kerja AI
                  </Button>
                </Stack>
              </motion.div>

              {/* AI Model badges */}
              <motion.div custom={4} initial="hidden" animate="visible" variants={fadeUp}>
                <Stack direction="row" spacing={1.5} sx={{ mt: 5, flexWrap: 'wrap', gap: 1 }}>
                  {MODEL_LABELS.map((m) => (
                    <Chip
                      key={m.name}
                      label={`${m.name} · ${m.desc}`}
                      size="small"
                      sx={{
                        background: `${m.color}22`, color: '#fff',
                        border: `1px solid ${m.color}66`, fontSize: '0.75rem', fontWeight: 600,
                      }}
                    />
                  ))}
                </Stack>
              </motion.div>
            </Grid>

            {/* Hero illustration */}
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <Box
                  className="glass-card-dark"
                  sx={{ p: 4, textAlign: 'center', mx: { xs: 0, md: 2 } }}
                >
                  <Box sx={{ fontSize: '5rem', mb: 2 }} className="float">🌾</Box>
                  <Typography variant="h5" sx={{ color: '#74C69D', mb: 1, fontWeight: 800 }}>
                    AI Pipeline
                  </Typography>
                  {/* Mini pipeline viz */}
                  {[
                    { icon: '📸', label: 'Foto Daun Padi', model: 'YOLOv8-OBB' },
                    { icon: '🔬', label: 'Deteksi Nutrisi', model: 'ResNet50 / OBB' },
                    { icon: '🧪', label: 'Analisis Tanah', model: 'SVR' },
                    { icon: '⚗️', label: 'Feature Fusion', model: '14-Dim Vector' },
                    { icon: '💊', label: 'Rekomendasi Pupuk', model: 'LightGBM' },
                  ].map((row, i) => (
                    <React.Fragment key={i}>
                      <Box
                        sx={{
                          display: 'flex', alignItems: 'center', gap: 2,
                          p: 1.5, borderRadius: 2,
                          background: 'rgba(255,255,255,0.06)',
                          mb: 0.5,
                        }}
                      >
                        <Box sx={{ fontSize: '1.4rem', width: 36 }}>{row.icon}</Box>
                        <Box sx={{ flex: 1, textAlign: 'left' }}>
                          <Box sx={{ color: '#fff', fontSize: '0.85rem', fontWeight: 600 }}>
                            {row.label}
                          </Box>
                          <Box sx={{ color: '#52B788', fontSize: '0.7rem' }}>{row.model}</Box>
                        </Box>
                      </Box>
                      {i < 4 && (
                        <Box sx={{ color: '#52B788', fontSize: '0.8rem', textAlign: 'center', my: 0.2 }}>
                          ↓
                        </Box>
                      )}
                    </React.Fragment>
                  ))}

                  {/* Metrics */}
                  <Grid container spacing={1.5} sx={{ mt: 2 }}>
                    {[
                      { label: 'R² Score', val: '0.989' },
                      { label: 'RMSE', val: '3.41 kg/ha' },
                      { label: 'MAPE', val: '16.0%' },
                    ].map((m) => (
                      <Grid item xs={4} key={m.label}>
                        <Box
                          sx={{
                            background: 'rgba(82,183,136,0.15)', borderRadius: 2, p: 1,
                            border: '1px solid rgba(82,183,136,0.25)',
                          }}
                        >
                          <Box sx={{ color: '#52B788', fontWeight: 800, fontSize: '0.9rem' }}>
                            {m.val}
                          </Box>
                          <Box sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.6rem' }}>
                            {m.label}
                          </Box>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ── FEATURES ── */}
      <Box sx={{ py: { xs: 8, md: 10 }, background: '#F0F7F4' }}>
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Typography variant="h3" textAlign="center" sx={{ mb: 1.5, color: '#1B4332' }}>
              Keunggulan Sistem
            </Typography>
            <Typography textAlign="center" sx={{ color: '#555', mb: 6, fontSize: '1.05rem' }}>
              Teknologi AI terdepan untuk membantu petani meningkatkan hasil panen
            </Typography>
          </motion.div>

          <Grid container spacing={3}>
            {FEATURES.map((f, i) => (
              <Grid item xs={12} sm={6} md={3} key={f.title}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3, height: '100%', borderRadius: 4,
                      border: '1px solid rgba(82,183,136,0.15)',
                      background: '#fff',
                      transition: 'all 0.3s',
                      '&:hover': {
                        transform: 'translateY(-6px)',
                        boxShadow: '0 12px 40px rgba(27,67,50,0.12)',
                        borderColor: '#52B788',
                      },
                    }}
                  >
                    <Box sx={{ fontSize: '2.5rem', mb: 2 }}>{f.icon}</Box>
                    <Typography variant="h5" sx={{ color: f.color, mb: 0.5, fontWeight: 800 }}>
                      {f.value}
                    </Typography>
                    <Typography variant="h6" sx={{ color: '#1B4332', mb: 1, fontWeight: 700, fontSize: '1rem' }}>
                      {f.title}
                    </Typography>
                    <Typography sx={{ color: '#666', fontSize: '0.875rem', lineHeight: 1.65 }}>
                      {f.desc}
                    </Typography>
                  </Paper>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ── HOW IT WORKS ── */}
      <Box sx={{ py: { xs: 8, md: 10 }, background: 'linear-gradient(180deg, #F0F7F4 0%, #E8F5EE 100%)' }}>
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Typography variant="h3" textAlign="center" sx={{ mb: 1.5, color: '#1B4332' }}>
              Cara Penggunaan
            </Typography>
            <Typography textAlign="center" sx={{ color: '#555', mb: 7, fontSize: '1.05rem' }}>
              Mudah digunakan, hanya 3 langkah sederhana
            </Typography>
          </motion.div>

          <Grid container spacing={4} alignItems="stretch">
            {STEPS.map((s, i) => (
              <Grid item xs={12} md={4} key={s.step}>
                <motion.div
                  initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.15 }}
                  style={{ height: '100%' }}
                >
                  <Paper
                    elevation={0}
                    sx={{
                      p: 4, height: '100%', borderRadius: 4,
                      border: '1.5px solid rgba(82,183,136,0.2)',
                      background: '#fff', textAlign: 'center',
                      position: 'relative', overflow: 'hidden',
                    }}
                  >
                    <Box
                      sx={{
                        position: 'absolute', top: -20, right: -20,
                        fontSize: '5rem', opacity: 0.05, fontWeight: 900,
                        fontFamily: 'Nunito', color: '#1B4332',
                      }}
                    >
                      {s.step}
                    </Box>
                    <Box
                      sx={{
                        width: 70, height: 70, borderRadius: '50%',
                        background: 'linear-gradient(135deg, #E8F5EE 0%, #B7E4C7 100%)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        mx: 'auto', mb: 2.5,
                      }}
                    >
                      {s.icon}
                    </Box>
                    <Chip
                      label={`Langkah ${s.step}`}
                      size="small"
                      sx={{
                        background: '#1B4332', color: '#fff',
                        fontWeight: 700, mb: 2, fontSize: '0.75rem',
                      }}
                    />
                    <Typography variant="h6" sx={{ color: '#1B4332', mb: 1.5, fontWeight: 800 }}>
                      {s.title}
                    </Typography>
                    <Typography sx={{ color: '#666', lineHeight: 1.7, fontSize: '0.9rem' }}>
                      {s.desc}
                    </Typography>
                  </Paper>
                </motion.div>
              </Grid>
            ))}
          </Grid>

          <Box textAlign="center" sx={{ mt: 6 }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Button
                component={Link}
                to="/analisis"
                variant="contained"
                size="large"
                endIcon={<ArrowForwardIcon />}
                sx={{
                  px: 6, py: 2, fontSize: '1.1rem', fontWeight: 700,
                  borderRadius: 4,
                  background: 'linear-gradient(135deg, #1B4332 0%, #2D6A4F 100%)',
                  boxShadow: '0 8px 30px rgba(27,67,50,0.25)',
                  '&:hover': { boxShadow: '0 12px 40px rgba(27,67,50,0.35)' },
                }}
              >
                🌾 Coba Sekarang – Gratis
              </Button>
              <Typography sx={{ mt: 2, color: '#888', fontSize: '0.85rem' }}>
                <VerifiedIcon sx={{ fontSize: 14, mr: 0.5, verticalAlign: 'middle', color: '#52B788' }} />
                Tidak perlu membuat akun • Hasil instan
              </Typography>
            </motion.div>
          </Box>
        </Container>
      </Box>

      {/* ── FOOTER ── */}
      <Box sx={{ background: '#0D2B1F', py: 5 }}>
        <Container maxWidth="lg">
          <Grid container justifyContent="space-between" alignItems="center">
            <Grid item>
              <Typography sx={{ color: '#52B788', fontFamily: 'Nunito', fontWeight: 900, fontSize: '1.2rem' }}>
                🌾 TaniCerdas AI
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.8rem', mt: 0.5 }}>
                Sistem Rekomendasi Pupuk Padi Berbasis AI – Penelitian Tesis Magister
              </Typography>
            </Grid>
            <Grid item>
              <Stack direction="row" spacing={2}>
                {['Beranda', 'Analisis', 'Penelitian', 'Arsitektur AI'].map((l) => (
                  <Typography key={l} sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem',
                    cursor: 'pointer', '&:hover': { color: '#52B788' } }}>
                    {l}
                  </Typography>
                ))}
              </Stack>
            </Grid>
          </Grid>
          <Box sx={{ borderTop: '1px solid rgba(255,255,255,0.08)', mt: 3, pt: 3 }}>
            <Typography textAlign="center" sx={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem' }}>
              © 2025 TaniCerdas AI · YOLOv8-OBB + SVR + LightGBM Fusion · Late Fusion Framework v2
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  )
}
