/*****************************************************************
 *  src/components/SideNav.tsx
 *  --------------------------------------------------------------
 *  • 侧边栏按钮根据 location.pathname.startsWith() 高亮
 *  • 无需额外 state，支持 /app/servers/123 等深层路径
 *****************************************************************/

import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import type { ReactNode } from 'react'
import {
    Drawer, Box, List, ListItem, ListItemButton, Typography,
    Avatar, Tooltip, Menu, MenuItem, Divider,
} from '@mui/material'
import {
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

interface SideNavProps { onFakeLogout: () => void }
interface NavItem { label: string; path: string; icon: ReactNode }

const navItems: NavItem[] = [
    { label: '搜索',         path: '/app/search',    icon: <SearchIcon /> },
    { label: '概览',         path: '/app/dashboard', icon: <DashboardIcon /> },
    { label: '服务器',       path: '/app/servers',   icon: <DnsIcon /> },
    { label: '更新日志',     path: '/app/changelog', icon: <UpdateIcon /> },
    { label: '工单',         path: '/app/tickets',   icon: <AssignmentIcon /> },
    { label: '统计信息',     path: '/app/stats',     icon: <BarChartIcon /> },
    { label: '实验性\n功能', path: '/app/labs',      icon: <ScienceIcon /> },
    { label: '设置',         path: '/app/settings',  icon: <SettingsIcon /> },
]

const BTN  = 72
const GAP  = 8

export default function SideNav({ onFakeLogout }: SideNavProps) {
    const location = useLocation()
    const nav = useNavigate()
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)

    return (
        <Drawer
            variant="permanent"
            sx={{
                width: { xs: 56, sm: BTN + GAP * 2 },
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: { xs: 56, sm: BTN + GAP * 2 },
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
            <List
                disablePadding
                sx={{
                    pt: GAP,
                    pb: GAP,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: `${GAP}px`,
                }}
            >
                {navItems.map(it => {
                    const isSelected = location.pathname.startsWith(it.path)
                    return (
                        <ListItem key={it.path} disablePadding sx={{ justifyContent: 'center' }}>
                            <ListItemButton
                                onClick={() => nav(it.path)}
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
                                    bgcolor: isSelected
                                        ? 'rgba(255,255,255,0.24)'
                                        : 'transparent',
                                    '&:hover': { bgcolor: 'rgba(255,255,255,0.16)' },
                                }}
                            >
                                {it.icon}
                                <Typography
                                    sx={{
                                        fontSize: 11,
                                        mt: 0.5,
                                        textAlign: 'center',
                                        whiteSpace: 'pre-line',
                                        lineHeight: 1.15,
                                    }}
                                >
                                    {it.label}
                                </Typography>
                            </ListItemButton>
                        </ListItem>
                    )
                })}
            </List>

            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
                <Tooltip title="账户信息">
                    <Avatar
                        sx={{
                            width: 56,
                            height: 56,
                            bgcolor: 'rgba(255,255,255,0.25)',
                            cursor: 'pointer',
                        }}
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
                        <Typography variant="body2">用户姓名</Typography>
                        <Typography variant="caption" color="text.secondary">
                            user@example.com
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
