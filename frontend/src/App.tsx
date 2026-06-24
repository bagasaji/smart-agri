import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Box } from '@mui/material'
import Navbar from './components/Navbar'
import Landing from './pages/Landing'
import Analysis from './pages/Analysis'
import Results from './pages/Results'
import History from './pages/History'
import Research from './pages/Research'
import Architecture from './pages/Architecture'

export default function App() {
  return (
    <Box sx={{ minHeight: '100vh' }}>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/analisis" element={<Analysis />} />
        <Route path="/hasil" element={<Results />} />
        <Route path="/riwayat" element={<History />} />
        <Route path="/penelitian" element={<Research />} />
        <Route path="/arsitektur" element={<Architecture />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Box>
  )
}
