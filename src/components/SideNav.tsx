/*****************************************************************
 *  src/components/SideNav.tsx
 *  --------------------------------------------------------------
 *  • Drawer 88 px  |  按钮 72 × 72 px  |  四周留白一致
 *  • 顶部留白从 8 px → 4 px
 *****************************************************************/

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { ReactNode } from 'react'

import {
    Drawer, Box, List, ListItem, ListItemButton, Typography,
    Avatar, Tooltip, Menu, MenuItem, Divider,
} from '@mui/material'
import {
    Search as SearchIcon, Dashboard as DashboardIcon, Dns as DnsIcon,
    Update as UpdateIcon, Assignment as AssignmentIcon, BarChart as BarChartIcon,
    Science as ScienceIcon, Settings as SettingsIcon,
    AccountCircle as AccountIcon, Logout as LogoutIcon,
} from '@mui/icons-material'

interface SideNavProps { onFakeLogout: () => void }
interface NavItem { label: string; path: string; icon: ReactNode }

const navItems: NavItem[] = [
    { label: '搜索',        path: '/app/search',    icon: <SearchIcon /> },
    { label: '概览',        path: '/app/dashboard', icon: <DashboardIcon /> },
    { label: '服务器',      path: '/app/servers',   icon: <DnsIcon /> },
    { label: '更新日志',    path: '/app/changelog', icon: <UpdateIcon /> },
    { label: '工单',        path: '/app/tickets',   icon: <AssignmentIcon /> },
    { label: '统计信息',    path: '/app/stats',     icon: <BarChartIcon /> },
    { label: '实验性\n功能', path: '/app/labs',      icon: <ScienceIcon /> },
    { label: '设置',        path: '/app/settings',  icon: <SettingsIcon /> },
]

const BTN  = 72
const GAP  = 8
const DRAWER_W = BTN + GAP * 2  // 88 px

const USER = { name: 'Chiangho', email: 'chiangho@example.com' }

export default function SideNav({ onFakeLogout }: SideNavProps) {
    const [selected, setSelected] = useState('/app/dashboard')
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
    const nav = useNavigate()

    return (
        <Drawer
            variant="permanent"
            sx={{
                width: DRAWER_W,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: DRAWER_W,
                    bgcolor: '#1976d2',
                    color: '#fff',
                    borderRight: 'none',
                    boxSizing: 'border-box',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    overflowX: 'hidden',
                },
            }}
        >
            {/* ---------- 导航按钮 ---------- */}
            <List
                disablePadding
                sx={{
                    pt: GAP / 2,      // ★ 顶部留白 4px
                    pb: GAP,          // 底部保持 8px
                    display: 'flex',
                    flexDirection: 'column',
                    gap: `${GAP}px`,  // 按钮间距 8px
                }}
            >
                {navItems.map(it => (
                    <ListItem key={it.path} disablePadding sx={{ justifyContent: 'center' }}>
                        <ListItemButton
                            onClick={() => { setSelected(it.path); nav(it.path) }}
                            sx={{
                                width: BTN,
                                height: BTN,
                                minWidth: BTN,
                                minHeight: BTN,
                                flexShrink: 0,
                                mx: GAP,
                                p: 0,
                                borderRadius: 1,
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                bgcolor: selected === it.path ? 'rgba(255,255,255,0.24)' : 'transparent',
                                '&:hover': { bgcolor: 'rgba(255,255,255,0.16)' },
                                transition: 'background-color .3s',
                            }}
                        >
                            {it.icon}
                            <Typography sx={{ fontSize: 11, mt: 0.5, whiteSpace: 'pre-line', textAlign: 'center' }}>
                                {it.label}
                            </Typography>
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>

            {/* ---------- 头像 + 浮窗 ---------- */}
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
                <Tooltip title="账户信息">
                    <Avatar
                        sx={{ width: 56, height: 56, bgcolor: 'rgba(255,255,255,0.25)', cursor: 'pointer' }}
                        onClick={e => setAnchorEl(e.currentTarget)}
                    >
                        <AccountIcon sx={{ fontSize: 28 }} />
                    </Avatar>
                </Tooltip>

                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={() => setAnchorEl(null)}
                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                    transformOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                >
                    <MenuItem disabled sx={{ display: 'block', whiteSpace: 'normal' }}>
                        <Typography variant="body2">{USER.name}</Typography>
                        <Typography variant="caption" color="text.secondary">
                            {USER.email}
                        </Typography>
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={onFakeLogout}>
                        <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
                        退出登录
                    </MenuItem>
                </Menu>
            </Box>
        </Drawer>
    )
}
