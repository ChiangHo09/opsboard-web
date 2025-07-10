// 需要执行npm install framer-motion @mui/material @mui/icons-material

import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import type { ReactNode } from 'react'
import {
    Drawer, Box, List, ListItem, Typography,
    Avatar, Tooltip, Menu, MenuItem,
    ButtonBase, Divider
} from '@mui/material'
import {
  Menu as MenuFoldIcon,
  Search as SearchIcon,
  Dashboard as DashboardIcon,
  Dns as DnsIcon,
  Update as UpdateIcon,
  Assignment as AssignmentIcon,
  BarChart as BarChartIcon,
  Science as ScienceIcon,
  Settings as SettingsIcon,
  AccountCircle as AccountIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material'
import { motion, AnimatePresence } from 'framer-motion'

/* ---------- Props ---------- */
interface SideNavProps {
  open: boolean
  onToggle: () => void
  onFakeLogout: () => void
  openWidth: number
  closedWidth: number
}

/* ---------- 导航配置 ---------- */
interface NavItem {
  label: string
  path: string
  icon: ReactNode
  id: string
}

const navItems: NavItem[] = [
  { label: '搜索', path: '/app/search', icon: <SearchIcon />, id: 'search' },
  { label: '概览', path: '/app/dashboard', icon: <DashboardIcon />, id: 'dashboard' },
  { label: '服务器', path: '/app/servers', icon: <DnsIcon />, id: 'servers' },
  { label: '更新日志', path: '/app/changelog', icon: <UpdateIcon />, id: 'changelog' },
  { label: '工单', path: '/app/tickets', icon: <AssignmentIcon />, id: 'tickets' },
  { label: '统计信息', path: '/app/stats', icon: <BarChartIcon />, id: 'stats' },
  { label: '实验性功能', path: '/app/labs', icon: <ScienceIcon />, id: 'labs' },
  { label: '设置', path: '/app/settings', icon: <SettingsIcon />, id: 'settings' },
]

/* ---------- UI 常量 ---------- */
const GAP = 8
const BTN_SIZE = 40
const ICON_SIZE = 20
const GRAY = '#424242'
const TRANSITION = 'all 0.28s cubic-bezier(0.4,0,0.2,1)'

export default function SideNav({
  open, onToggle, onFakeLogout, openWidth, closedWidth,
}: SideNavProps) {
  const { pathname } = useLocation()
  const nav = useNavigate()
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const [mounted, setMounted] = useState(false)

  // 确保首次渲染时不触发动画
  useEffect(() => {
    setMounted(true)
  }, [])

  const paperW = open ? openWidth : closedWidth

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: paperW,
        flexShrink: 0,
        transition: TRANSITION,
        '& .MuiDrawer-paper': {
          width: paperW,
          transition: TRANSITION,
          bgcolor: '#f7f9fd',
          borderRight: 'none',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          overflow: 'hidden',
          pt: 1,
          pb: 1,
        },
      }}
    >
      {/* 主导航区域 */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: GAP }}>
        {/* 汉堡菜单按钮 */}
        <ListItem disablePadding sx={{ px: 1 }}>
          <ButtonBase
            onClick={onToggle}
            sx={{
              width: BTN_SIZE,
              height: BTN_SIZE,
              borderRadius: '50%',
              bgcolor: 'transparent',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              color: GRAY,
              '&:hover': {
                bgcolor: 'rgba(0,0,0,0.04)'
              }
            }}
          >
            <motion.div
              animate={{ rotate: open ? 90 : 0 }}
              transition={{ duration: 0.28, ease: 'easeInOut' }}
            >
              <MenuFoldIcon sx={{ fontSize: ICON_SIZE }} />
            </motion.div>
          </ButtonBase>
        </ListItem>

        {/* 导航项列表 */}
        <List disablePadding sx={{ display: 'flex', flexDirection: 'column', gap: GAP, px: 0.5 }}>
          {navItems.map(({ label, path, icon, id }) => {
            const selected = pathname.startsWith(path)

            return (
              <ListItem key={id} disablePadding>
                <motion.div
                  layout
                  initial={false}
                  animate={{
                    width: open ? '100%' : BTN_SIZE,
                    borderRadius: open ? 9999 : '50%',
                    transition: {
                      duration: 0.28,
                      ease: 'easeInOut'
                    }
                  }}
                >
                  <ButtonBase
                    onClick={() => nav(path)}
                    sx={{
                      width: '100%',
                      height: BTN_SIZE,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: open ? 9999 : '50%',
                      bgcolor: selected ? 'rgba(0,0,0,0.12)' : 'transparent',
                      color: GRAY,
                      position: 'relative',
                      overflow: 'hidden',
                      '&:hover': {
                        bgcolor: selected ? 'rgba(0,0,0,0.12)' : 'rgba(0,0,0,0.04)'
                      }
                    }}
                  >
                    {/* 图标容器 */}
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: BTN_SIZE,
                        height: BTN_SIZE
                      }}
                    >
                      {icon}
                    </Box>

                    {/* 文字容器 */}
                    <AnimatePresence>
                      {open && (
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          transition={{ duration: 0.2, delay: mounted ? 0.05 : 0 }}
                          style={{
                            position: 'absolute',
                            left: BTN_SIZE,
                            whiteSpace: 'nowrap'
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: 14,
                              color: 'inherit',
                              ml: 1,
                              userSelect: 'none'
                            }}
                          >
                            {label}
                          </Typography>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </ButtonBase>
                </motion.div>
              </ListItem>
            )
          })}
        </List>
      </Box>

      {/* 用户信息区域 */}
      <Box sx={{ display: 'flex', justifyContent: 'center', px: 1 }}>
        <Tooltip title="账户信息">
          <ButtonBase
            onClick={(e) => setAnchorEl(e.currentTarget)}
            sx={{
              width: BTN_SIZE,
              height: BTN_SIZE,
              borderRadius: '50%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              color: GRAY,
              '&:hover': {
                bgcolor: 'rgba(0,0,0,0.04)'
              }
            }}
          >
            <Avatar
              sx={{
                width: 32,
                height: 32,
                bgcolor: 'rgba(0,0,0,0.05)',
                color: 'transparent'
              }}
            >
              <AccountIcon sx={{ fontSize: ICON_SIZE }} />
            </Avatar>
          </ButtonBase>
        </Tooltip>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          transformOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          PaperProps={{
            sx: {
              mt: 1,
              boxShadow: 3,
              borderRadius: 2,
              minWidth: 200
            }
          }}
        >
          <Box sx={{ p: 2 }}>
            <Typography variant="body2" fontWeight="bold">用户姓名</Typography>
            <Typography variant="caption" color="text.secondary">
              user@example.com
            </Typography>
          </Box>
          <Divider />
          <MenuItem
            onClick={() => {
              setAnchorEl(null)
              onFakeLogout()
            }}
            sx={{
              color: 'error.main'
            }}
          >
            <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
            退出登录
          </MenuItem>
        </Menu>
      </Box>
    </Drawer>
  )
}
