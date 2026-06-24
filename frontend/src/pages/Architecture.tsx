import React, { useCallback, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ReactFlow, {
  Background, Controls, MiniMap, useNodesState, useEdgesState,
  Handle, Position, NodeProps,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { Box, Container, Typography, Paper, Chip, Button, Divider } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'

// ─── Node Definitions ────────────────────────────────────────────────────────
const NODE_INFO: Record<string, {
  title: string; emoji: string; color: string; tag: string;
  description: string; details: string[];
}> = {
  input_image: {
    title: 'Input Gambar Daun',
    emoji: '📸', color: '#2D6A4F', tag: 'Input',
    description: 'Pengguna mengunggah foto daun padi menggunakan HP atau kamera digital.',
    details: ['Format: JPG, PNG, WEBP', 'Resolusi: bebas (auto-resize)', 'Sumber: HP petani / drone'],
  },
  input_soil: {
    title: 'Sensor Tanah 7-in-1',
    emoji: '🧪', color: '#6B4423', tag: 'Input',
    description: 'Sensor tanah mengukur 7 parameter: Nitrogen, Fosfor, Kalium, pH, EC, Kelembaban, dan Suhu.',
    details: ['N, P, K (mg/kg)', 'pH (4-9)', 'EC (mS/cm)', 'Moisture (%)', 'Temperature (°C)'],
  },
  yolo: {
    title: 'YOLOv8-OBB',
    emoji: '🎯', color: '#0077B6', tag: 'AI Model',
    description: 'Model deteksi objek berbasis Oriented Bounding Box untuk mendeteksi area ROI daun padi secara akurat.',
    details: [
      'Task: OBB Detection',
      '4 kelas: Healthy, N-def, P-def, K-def',
      'Output: bbox + confidence + class',
      'Model size: 6.4MB',
    ],
  },
  roi_crop: {
    title: 'ROI Crop',
    emoji: '✂️', color: '#0096C7', tag: 'Processing',
    description: 'Area daun yang terdeteksi dipotong dari gambar asli untuk analisis lebih lanjut.',
    details: ['Input: OBB coordinates', 'Output: cropped leaf region', 'Digunakan untuk visualisasi'],
  },
  svr: {
    title: 'SVR (Multi-Output)',
    emoji: '🧮', color: '#D4A017', tag: 'AI Model',
    description: 'Support Vector Regression multi-output menganalisis 9 fitur tanah untuk memprediksi dosis pupuk awal.',
    details: [
      'Input: 9 fitur (7 sensor + 2 turunan)',
      'Preprocessing: StandardScaler',
      'Output: 3 prediksi awal (Urea, NPK, KCl)',
      'Kernel: RBF',
    ],
  },
  visual_feat: {
    title: 'Visual Features',
    emoji: '👁️', color: '#0077B6', tag: 'Feature',
    description: 'Fitur visual dari model YOLOv8: class index dan confidence score defisiensi.',
    details: ['YOLO class index (0-3)', 'Detection confidence (0-1)', 'Dimensi: 2D'],
  },
  soil_feat: {
    title: 'Soil Features',
    emoji: '🌱', color: '#D4A017', tag: 'Feature',
    description: 'Hasil prediksi SVR sebagai representasi fitur kondisi tanah.',
    details: ['SVR Urea prediction', 'SVR NPK prediction', 'SVR KCl prediction', 'Dimensi: 3D'],
  },
  fusion: {
    title: 'Feature Fusion',
    emoji: '⚗️', color: '#9B59B6', tag: 'Fusion',
    description: 'Penggabungan fitur visual dan tanah menjadi vektor 5 dimensi untuk input model LightGBM.',
    details: [
      'Visual: [class_idx, confidence] = 2D',
      'Soil: [svr_urea, svr_npk, svr_kcl] = 3D',
      'Total: 5-Dimensional Vector',
      'Strategi: Decision-Level Late Fusion',
    ],
  },
  lgbm: {
    title: 'LightGBM',
    emoji: '🌲', color: '#E74C3C', tag: 'AI Model',
    description: 'Model gradient boosting terbaik untuk regresi dosis pupuk. Dilatih dengan 5-Fold GroupKFold CV.',
    details: [
      'Input: 5-dim fusion vector',
      'Output: 3 dosis pupuk (kg/ha)',
      'R² Score: 0.989',
      'RMSE: 3.41 kg/ha',
      '3 model terpisah: Urea, NPK, KCl',
    ],
  },
  output: {
    title: 'Hasil & Rekomendasi',
    emoji: '🏆', color: '#52B788', tag: 'Output',
    description: 'Sistem menghasilkan diagnosis kekurangan nutrisi dan rekomendasi dosis pupuk yang spesifik.',
    details: [
      'Diagnosis: kelas nutrisi + confidence',
      'Urea: X kg/ha',
      'NPK: Y kg/ha',
      'KCl: Z kg/ha',
      'Saran petani dalam bahasa sederhana',
    ],
  },
}

// ─── Custom Node ─────────────────────────────────────────────────────────────
function AgriNode({ data, selected }: NodeProps) {
  const info = NODE_INFO[data.id] ?? {}
  return (
    <Box
      onClick={() => data.onClick(data.id)}
      sx={{
        minWidth: 140, maxWidth: 180,
        border: `2px solid ${selected ? info.color : info.color + '55'}`,
        borderRadius: '14px',
        background: selected ? `${info.color}18` : '#fff',
        p: '10px 14px',
        cursor: 'pointer',
        transition: 'all 0.2s',
        boxShadow: selected
          ? `0 0 0 3px ${info.color}40, 0 8px 24px ${info.color}30`
          : '0 2px 12px rgba(0,0,0,0.08)',
        '&:hover': {
          boxShadow: `0 0 0 2px ${info.color}60, 0 8px 24px ${info.color}25`,
          transform: 'scale(1.03)',
        },
      }}
    >
      <Handle type="target" position={Position.Top} style={{ background: info.color, width: 8, height: 8 }} />
      <Box sx={{ textAlign: 'center' }}>
        <Box sx={{ fontSize: '1.4rem', mb: 0.4 }}>{info.emoji}</Box>
        <Chip
          label={info.tag}
          size="small"
          sx={{
            background: `${info.color}20`, color: info.color,
            fontWeight: 700, fontSize: '0.58rem', mb: 0.75, height: 18,
          }}
        />
        <Typography sx={{ fontWeight: 700, fontSize: '0.75rem', color: '#1B4332', lineHeight: 1.3 }}>
          {info.title}
        </Typography>
      </Box>
      <Handle type="source" position={Position.Bottom} style={{ background: info.color, width: 8, height: 8 }} />
    </Box>
  )
}

const nodeTypes = { agriNode: AgriNode }

// ─── Nodes & Edges ───────────────────────────────────────────────────────────
const makeNodes = (onClickNode: (id: string) => void) => [
  { id: 'input_image', type: 'agriNode', position: { x: 80, y: 20 }, data: { id: 'input_image', onClick: onClickNode } },
  { id: 'input_soil', type: 'agriNode', position: { x: 340, y: 20 }, data: { id: 'input_soil', onClick: onClickNode } },
  { id: 'yolo', type: 'agriNode', position: { x: 80, y: 160 }, data: { id: 'yolo', onClick: onClickNode } },
  { id: 'roi_crop', type: 'agriNode', position: { x: 80, y: 300 }, data: { id: 'roi_crop', onClick: onClickNode } },
  { id: 'svr', type: 'agriNode', position: { x: 340, y: 160 }, data: { id: 'svr', onClick: onClickNode } },
  { id: 'visual_feat', type: 'agriNode', position: { x: 80, y: 440 }, data: { id: 'visual_feat', onClick: onClickNode } },
  { id: 'soil_feat', type: 'agriNode', position: { x: 340, y: 300 }, data: { id: 'soil_feat', onClick: onClickNode } },
  { id: 'fusion', type: 'agriNode', position: { x: 210, y: 570 }, data: { id: 'fusion', onClick: onClickNode } },
  { id: 'lgbm', type: 'agriNode', position: { x: 210, y: 710 }, data: { id: 'lgbm', onClick: onClickNode } },
  { id: 'output', type: 'agriNode', position: { x: 210, y: 850 }, data: { id: 'output', onClick: onClickNode } },
]

const EDGES = [
  { id: 'e1', source: 'input_image', target: 'yolo', animated: true, style: { stroke: '#0077B6', strokeWidth: 2 } },
  { id: 'e2', source: 'input_soil', target: 'svr', animated: true, style: { stroke: '#D4A017', strokeWidth: 2 } },
  { id: 'e3', source: 'yolo', target: 'roi_crop', style: { stroke: '#0096C7', strokeWidth: 1.5 } },
  { id: 'e4', source: 'yolo', target: 'visual_feat', animated: true, style: { stroke: '#0077B6', strokeWidth: 2 } },
  { id: 'e5', source: 'svr', target: 'soil_feat', animated: true, style: { stroke: '#D4A017', strokeWidth: 2 } },
  { id: 'e6', source: 'visual_feat', target: 'fusion', animated: true, style: { stroke: '#9B59B6', strokeWidth: 2.5 } },
  { id: 'e7', source: 'soil_feat', target: 'fusion', animated: true, style: { stroke: '#9B59B6', strokeWidth: 2.5 } },
  { id: 'e8', source: 'fusion', target: 'lgbm', animated: true, style: { stroke: '#E74C3C', strokeWidth: 2.5 } },
  { id: 'e9', source: 'lgbm', target: 'output', animated: true, style: { stroke: '#52B788', strokeWidth: 2.5 } },
]

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function Architecture() {
  const [selectedId, setSelectedId] = useState<string | null>('lgbm')

  const handleClickNode = useCallback((id: string) => {
    setSelectedId((prev) => (prev === id ? null : id))
  }, [])

  const [nodes, , onNodesChange] = useNodesState(makeNodes(handleClickNode))
  const [edges, , onEdgesChange] = useEdgesState(EDGES)

  const selected = selectedId ? NODE_INFO[selectedId] : null

  return (
    <Box sx={{ pt: { xs: 10, md: 12 }, pb: 8, minHeight: '100vh', background: '#F0F7F4' }}>
      <Container maxWidth="lg">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h4" sx={{ color: '#1B4332', fontWeight: 900, mb: 0.75 }}>
              🔬 Cara Kerja AI
            </Typography>
            <Typography sx={{ color: '#666' }}>
              Klik node untuk melihat penjelasan masing-masing komponen model
            </Typography>
          </Box>
        </motion.div>

        <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' }, alignItems: 'flex-start' }}>
          {/* Flow canvas */}
          <Paper
            elevation={0}
            sx={{
              flex: 1, borderRadius: 4,
              border: '1px solid rgba(82,183,136,0.2)',
              overflow: 'hidden', height: { xs: 500, md: 700 },
            }}
          >
            <ReactFlow
              nodes={nodes.map((n) => ({
                ...n,
                selected: n.id === selectedId,
                data: { ...n.data, onClick: handleClickNode },
              }))}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              nodeTypes={nodeTypes}
              fitView
              fitViewOptions={{ padding: 0.2 }}
              proOptions={{ hideAttribution: true }}
            >
              <Background color="#E8F5EE" gap={20} />
              <Controls style={{ border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', borderRadius: 8 }} />
              <MiniMap
                nodeColor={(n) => NODE_INFO[n.id]?.color ?? '#52B788'}
                maskColor="rgba(240,247,244,0.8)"
                style={{ borderRadius: 8, border: '1px solid rgba(82,183,136,0.2)' }}
              />
            </ReactFlow>
          </Paper>

          {/* Info panel */}
          <Box sx={{ width: { xs: '100%', md: 320 }, flexShrink: 0 }}>
            <AnimatePresence mode="wait">
              {selected ? (
                <motion.div
                  key={selectedId}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                >
                  <Paper elevation={0} sx={{
                    p: 3, borderRadius: 4,
                    border: `2px solid ${selected.color}33`,
                    background: '#fff',
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box sx={{ fontSize: '2rem' }}>{selected.emoji}</Box>
                        <Box>
                          <Chip
                            label={selected.tag}
                            size="small"
                            sx={{
                              background: `${selected.color}20`, color: selected.color,
                              fontWeight: 700, fontSize: '0.65rem',
                            }}
                          />
                        </Box>
                      </Box>
                      <Box
                        onClick={() => setSelectedId(null)}
                        sx={{
                          width: 28, height: 28, borderRadius: '50%',
                          background: '#F0F7F4', cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          '&:hover': { background: '#E8F5EE' },
                        }}
                      >
                        <CloseIcon sx={{ fontSize: 16, color: '#888' }} />
                      </Box>
                    </Box>

                    <Typography variant="h6" sx={{ fontWeight: 800, color: '#1B4332', mb: 1.5, lineHeight: 1.3 }}>
                      {selected.title}
                    </Typography>
                    <Typography sx={{ color: '#555', fontSize: '0.875rem', lineHeight: 1.75, mb: 2.5 }}>
                      {selected.description}
                    </Typography>

                    <Divider sx={{ mb: 2 }} />
                    <Typography sx={{ fontWeight: 700, color: '#1B4332', mb: 1.5, fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      Detail Teknis
                    </Typography>
                    {selected.details.map((d, i) => (
                      <Box key={i} sx={{ display: 'flex', gap: 1.25, mb: 1, alignItems: 'flex-start' }}>
                        <Box sx={{
                          width: 20, height: 20, borderRadius: '50%', flexShrink: 0, mt: 0.1,
                          background: `${selected.color}20`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          <Box sx={{ width: 6, height: 6, borderRadius: '50%', background: selected.color }} />
                        </Box>
                        <Typography sx={{ color: '#444', fontSize: '0.82rem', lineHeight: 1.55 }}>{d}</Typography>
                      </Box>
                    ))}
                  </Paper>
                </motion.div>
              ) : (
                <motion.div
                  key="hint"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Paper elevation={0} sx={{
                    p: 3.5, borderRadius: 4, textAlign: 'center',
                    border: '1.5px dashed rgba(82,183,136,0.3)',
                    background: 'rgba(82,183,136,0.04)',
                  }}>
                    <Box sx={{ fontSize: '2.5rem', mb: 2 }}>👆</Box>
                    <Typography sx={{ fontWeight: 700, color: '#1B4332', mb: 1 }}>
                      Klik Node untuk Detail
                    </Typography>
                    <Typography sx={{ color: '#888', fontSize: '0.85rem', lineHeight: 1.65 }}>
                      Pilih salah satu komponen AI pada diagram untuk melihat penjelasan teknis.
                    </Typography>
                  </Paper>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Legend */}
            <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3, mt: 2.5, border: '1px solid rgba(82,183,136,0.15)' }}>
              <Typography sx={{ fontWeight: 700, color: '#1B4332', mb: 1.5, fontSize: '0.8rem' }}>
                Legenda
              </Typography>
              {[
                { color: '#2D6A4F', label: 'Input Data' },
                { color: '#0077B6', label: 'Computer Vision' },
                { color: '#D4A017', label: 'Soil Analysis' },
                { color: '#9B59B6', label: 'Feature Fusion' },
                { color: '#E74C3C', label: 'LightGBM' },
                { color: '#52B788', label: 'Output' },
              ].map((l) => (
                <Box key={l.label} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.75 }}>
                  <Box sx={{ width: 12, height: 12, borderRadius: '50%', background: l.color, flexShrink: 0 }} />
                  <Typography sx={{ fontSize: '0.78rem', color: '#555' }}>{l.label}</Typography>
                </Box>
              ))}
            </Paper>
          </Box>
        </Box>

        {/* Pipeline summary */}
        <Paper elevation={0} sx={{
          mt: 3, p: 3.5, borderRadius: 4,
          background: 'linear-gradient(135deg, #E8F5EE 0%, #F0F7F4 100%)',
          border: '1.5px solid rgba(82,183,136,0.25)',
        }}>
          <Typography variant="h6" sx={{ fontWeight: 800, color: '#1B4332', mb: 2.5 }}>
            📐 Ringkasan Arsitektur: Late Fusion Framework
          </Typography>
          <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', alignItems: 'center' }}>
            {[
              '📸 Gambar Daun', '→', '🎯 YOLOv8-OBB', '→', '👁️ Visual (2D)',
              '+',
              '🧪 Sensor Tanah', '→', '🧮 SVR', '→', '🌱 Soil (3D)',
              '→',
              '⚗️ Fusion (5D)', '→', '🌲 LightGBM', '→', '💊 Pupuk (3 target)',
            ].map((item, i) => (
              item === '→' || item === '+' ? (
                <Typography key={i} sx={{ color: '#888', fontWeight: 700, fontSize: '1rem' }}>{item}</Typography>
              ) : (
                <Chip
                  key={i}
                  label={item}
                  size="small"
                  sx={{
                    background: '#fff', fontWeight: 600,
                    border: '1px solid rgba(82,183,136,0.3)',
                    fontSize: '0.78rem',
                  }}
                />
              )
            ))}
          </Box>
        </Paper>
      </Container>
    </Box>
  )
}
