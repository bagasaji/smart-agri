import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  AppBar, Toolbar, Box, Button, IconButton,
  Drawer, List, ListItem, ListItemText, useMediaQuery
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import GrassIcon from '@mui/icons-material/Grass'
import ScienceIcon from '@mui/icons-material/Science'
import HistoryIcon from '@mui/icons-material/History'
import BarChartIcon from '@mui/icons-material/BarChart'
import HomeIcon from '@mui/icons-material/Home'
import { useTheme } from '@mui/material/styles'

const NAV_ITEMS = [
  { label: 'Beranda', path: '/', icon: <HomeIcon fontSize="small" /> },
  { label: 'Analisis', path: '/analisis', icon: <GrassIcon fontSize="small" /> },
  { label: 'Riwayat', path: '/riwayat', icon: <HistoryIcon fontSize="small" /> },
  { label: 'Penelitian', path: '/penelitian', icon: <BarChartIcon fontSize="small" /> },
  { label: 'Cara Kerja AI', path: '/arsitektur', icon: <ScienceIcon fontSize="small" /> },
]

export default function Navbar() {
  const loc = useLocation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        background: 'rgba(27,67,50,0.95)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(82,183,136,0.2)',
      }}
    >
      <Toolbar sx={{ maxWidth: 1200, mx: 'auto', width: '100%', px: { xs: 2, md: 4 } }}>
        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Box
            sx={{
              width: 38, height: 38, borderRadius: '10px',
              background: 'linear-gradient(135deg, #52B788 0%, #74C69D 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.3rem',
            }}
          >🌾</Box>
          <Box>
            <Box sx={{ color: '#fff', fontFamily: 'Nunito', fontWeight: 900, fontSize: '1.15rem', lineHeight: 1 }}>
              TaniCerdas
            </Box>
            <Box sx={{ color: '#74C69D', fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              AI Agriculture
            </Box>
          </Box>
        </Link>

        <Box flex={1} />

        {isMobile ? (
          <>
            <IconButton sx={{ color: '#fff' }} onClick={() => setDrawerOpen(true)}>
              <MenuIcon />
            </IconButton>
            <Drawer
              anchor="right"
              open={drawerOpen}
              onClose={() => setDrawerOpen(false)}
              PaperProps={{
                sx: { background: '#1B4332', color: '#fff', width: 240 }
              }}
            >
              <Box sx={{ p: 3, borderBottom: '1px solid rgba(82,183,136,0.3)' }}>
                <Box sx={{ fontFamily: 'Nunito', fontWeight: 900, fontSize: '1.2rem', color: '#52B788' }}>
                  🌾 TaniCerdas AI
                </Box>
              </Box>
              <List>
                {NAV_ITEMS.map((item) => (
                  <ListItem
                    key={item.path}
                    component={Link}
                    to={item.path}
                    onClick={() => setDrawerOpen(false)}
                    sx={{
                      color: loc.pathname === item.path ? '#52B788' : '#B7E4C7',
                      '&:hover': { background: 'rgba(82,183,136,0.1)' },
                      gap: 1.5,
                    }}
                  >
                    {item.icon}
                    <ListItemText primary={item.label} primaryTypographyProps={{ fontWeight: 600 }} />
                  </ListItem>
                ))}
              </List>
            </Drawer>
          </>
        ) : (
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            {NAV_ITEMS.map((item) => (
              <Button
                key={item.path}
                component={Link}
                to={item.path}
                startIcon={item.icon}
                sx={{
                  color: loc.pathname === item.path ? '#52B788' : 'rgba(255,255,255,0.8)',
                  fontSize: '0.875rem',
                  fontWeight: loc.pathname === item.path ? 700 : 500,
                  px: 1.5,
                  '&:hover': { color: '#fff', background: 'rgba(82,183,136,0.12)' },
                  borderBottom: loc.pathname === item.path
                    ? '2px solid #52B788' : '2px solid transparent',
                  borderRadius: '8px 8px 0 0',
                }}
              >
                {item.label}
              </Button>
            ))}
            <Button
              component={Link}
              to="/analisis"
              variant="contained"
              sx={{
                ml: 1,
                background: 'linear-gradient(135deg, #52B788 0%, #40916C 100%)',
                color: '#fff',
                fontSize: '0.875rem',
                px: 2.5,
                py: 1,
                borderRadius: 3,
                boxShadow: '0 4px 14px rgba(82,183,136,0.4)',
                '&:hover': { boxShadow: '0 6px 20px rgba(82,183,136,0.5)' },
              }}
            >
              🔍 Mulai Analisis
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  )
}
