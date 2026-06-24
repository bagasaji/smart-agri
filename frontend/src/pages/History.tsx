import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Box, Container, Typography, Paper, Grid, Chip, Button,
  CircularProgress, Alert, Stack, IconButton, Tooltip,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import RefreshIcon from '@mui/icons-material/Refresh'
import { getHistory, deleteHistory } from '../utils/api'
import type { HistoryItem } from '../types'

const diagnosisColor: Record<string, string> = {
  Sehat: '#52B788',
  'Kekurangan Kalium (K)': '#E07B39',
  'Kekurangan Nitrogen (N)': '#E74C3C',
  'Kekurangan Fosfor (P)': '#9B59B6',
}

const diagnosisIcon: Record<string, string> = {
  Sehat: '✅',
  'Kekurangan Kalium (K)': '🟠',
  'Kekurangan Nitrogen (N)': '🔴',
  'Kekurangan Fosfor (P)': '🟣',
}

export default function History() {
  const [items, setItems] = useState<HistoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getHistory()
      setItems(data)
    } catch {
      setError('Gagal memuat riwayat. Pastikan backend berjalan.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  const handleDelete = async (id: string) => {
    try {
      await deleteHistory(id)
      setItems((prev) => prev.filter((i) => i.id !== id))
    } catch {
      alert('Gagal menghapus riwayat.')
    }
  }

  return (
    <Box sx={{ pt: { xs: 10, md: 12 }, pb: 8, minHeight: '100vh', background: '#F0F7F4' }}>
      <Container maxWidth="lg">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4, flexWrap: 'wrap', gap: 2 }}>
            <Box>
              <Typography variant="h4" sx={{ color: '#1B4332', fontWeight: 900 }}>
                📋 Riwayat Analisis
              </Typography>
              <Typography sx={{ color: '#888', mt: 0.5 }}>
                {items.length} hasil analisis tersimpan
              </Typography>
            </Box>
            <Button
              startIcon={<RefreshIcon />}
              onClick={fetchData}
              variant="outlined"
              sx={{ borderColor: '#1B4332', color: '#1B4332', borderRadius: 2.5 }}
            >
              Perbarui
            </Button>
          </Box>
        </motion.div>

        {loading && (
          <Box sx={{ textAlign: 'center', py: 10 }}>
            <CircularProgress sx={{ color: '#52B788', mb: 2 }} />
            <Typography sx={{ color: '#888' }}>Memuat riwayat...</Typography>
          </Box>
        )}

        {error && (
          <Alert severity="warning" sx={{ borderRadius: 3, mb: 3 }}>{error}</Alert>
        )}

        {!loading && !error && items.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 10 }}>
            <Box sx={{ fontSize: '4rem', mb: 2 }}>📭</Box>
            <Typography variant="h6" sx={{ color: '#888' }}>Belum ada riwayat analisis.</Typography>
            <Typography sx={{ color: '#aaa', mb: 3 }}>Mulai analisis pertama Anda!</Typography>
            <Button variant="contained" href="/analisis">🌾 Mulai Analisis</Button>
          </Box>
        )}

        <Grid container spacing={2.5}>
          {items.map((item, i) => {
            const c = diagnosisColor[item.diagnosis] ?? '#888'
            const icon = diagnosisIcon[item.diagnosis] ?? '🌾'
            return (
              <Grid item xs={12} sm={6} md={4} key={item.id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.06 }}
                >
                  <Paper elevation={0} sx={{
                    borderRadius: 4, overflow: 'hidden',
                    border: `1.5px solid ${c}2A`,
                    background: '#fff',
                    transition: 'all 0.25s',
                    '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 12px 40px rgba(27,67,50,0.1)' },
                  }}>
                    {/* Image */}
                    <Box sx={{ height: 160, background: '#F0F7F4', overflow: 'hidden', position: 'relative' }}>
                      {item.image_b64 && !item.image_b64.endsWith('...') ? (
                        <img
                          src={`data:image/jpeg;base64,${item.image_b64}`}
                          alt="leaf"
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      ) : (
                        <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>
                          🌾
                        </Box>
                      )}
                      {/* Overlay chip */}
                      <Chip
                        label={`${icon} ${item.confidence?.toFixed(1)}%`}
                        size="small"
                        sx={{
                          position: 'absolute', top: 8, right: 8,
                          background: 'rgba(0,0,0,0.65)', color: '#fff',
                          fontWeight: 700, fontSize: '0.72rem',
                          backdropFilter: 'blur(4px)',
                        }}
                      />
                    </Box>

                    {/* Content */}
                    <Box sx={{ p: 2.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                        <Chip
                          label={item.diagnosis}
                          size="small"
                          sx={{
                            background: `${c}18`, color: c,
                            fontWeight: 700, fontSize: '0.7rem', maxWidth: 180,
                          }}
                        />
                        <Tooltip title="Hapus riwayat ini">
                          <IconButton
                            size="small"
                            onClick={() => handleDelete(item.id)}
                            sx={{ color: '#ccc', '&:hover': { color: '#E74C3C' } }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>

                      <Typography sx={{ color: '#888', fontSize: '0.75rem', mb: 2 }}>
                        🕐 {new Date(item.timestamp).toLocaleString('id-ID')}
                      </Typography>

                      <Stack direction="row" spacing={1} flexWrap="wrap" gap={0.75}>
                        {[
                          { label: 'Urea', val: item.urea_rec },
                          { label: 'NPK', val: item.npk_rec },
                          { label: 'KCl', val: item.kcl_rec },
                        ].map((r) => (
                          <Box
                            key={r.label}
                            sx={{
                              px: 1.25, py: 0.4, borderRadius: 2,
                              background: '#F0F7F4',
                              fontSize: '0.72rem', fontWeight: 700, color: '#1B4332',
                            }}
                          >
                            {r.label}: {r.val?.toFixed(0)} kg/ha
                          </Box>
                        ))}
                      </Stack>
                    </Box>
                  </Paper>
                </motion.div>
              </Grid>
            )
          })}
        </Grid>
      </Container>
    </Box>
  )
}
