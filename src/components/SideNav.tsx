/*****************************************************************
 *  src/components/SideNav.tsx —— 侧边导航栏（Material Design 3 风格）
 *  --------------------------------------------------------------
 *  核心功能：
 *    1. 固定侧栏（桌面端）：72x72px 图标 + 88px 宽度
 *    2. 路由高亮同步：自动匹配路径并更新按钮状态
 *    3. 用户账户菜单：头像悬浮显示信息与登出功能
 *    4. 响应式设计：适配移动端（需启用 SideNav-2.tsx）
 *
 *  关键实现：
 *    • 使用 useLocation 同步路由状态
 *    • 自定义 Drawer 宽度计算（88px = 72px 按钮 + 8px×2 边距）
 *    • 按钮悬停效果（透明度渐变）
 *    • 头像菜单使用真实用户数据（当前为硬编码）
 *
 *  路由关联：
 *    支持的路径：/app/search /dashboard /servers /changelog /tickets /stats /labs /settings
 *    菜单高亮状态自动匹配 location.pathname
 *
 *  注意事项：
 *    1. 需要配合 MainLayout 使用（通过 onFakeLogout 传递登出逻辑）
 *    2. 用户数据建议从 context 或 API 获取（当前为硬编码）
 *    3. 移动端适配需切换为 SideNav-2.tsx 实现
 *****************************************************************/

import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
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

interface SideNavProps {
    onFakeLogout: () => void
}

interface NavItem {
    label: string
    path: string
    icon: ReactNode
}

const navItems: NavItem[] = [
    { label: '搜索', path: '/app/search', icon: <SearchIcon /> },
    { label: '概览', path: '/app/dashboard', icon: <DashboardIcon /> },
    { label: '服务器', path: '/app/servers', icon: <DnsIcon /> },
    { label: '更新日志', path: '/app/changelog', icon: <UpdateIcon /> },
    { label: '工单', path: '/app/tickets', icon: <AssignmentIcon /> },
    { label: '统计信息', path: '/app/stats', icon: <BarChartIcon /> },
    { label: '实验性\n功能', path: '/app/labs', icon: <ScienceIcon /> },
    { label: '设置', path: '/app/settings', icon: <SettingsIcon /> },
]

const BTN = 72
const GAP = 8
const DRAWER_W = BTN + GAP * 2 // 88 px

const USER = { name: 'Chiangho', email: 'chiangho@example.com' }

export default function SideNav({ onFakeLogout }: SideNavProps) {
    const location = useLocation()
    const navigate = useNavigate()

    // ✅ 初始化 selected 为当前路径
    const [selected, setSelected] = useState(location.pathname)

    // ✅ 路径变化时更新 selected
    useEffect(() => {
        setSelected(location.pathname)
    }, [location.pathname])

    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)

    const handleJump = (it: NavItem) => {
        setSelected(it.path)
        navigate(it.path)
    }

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
                    pt: GAP / 2,
                    pb: GAP,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: `${GAP}px`,
                }}
            >
                {navItems.map(it => (
                    <ListItem key={it.path} disablePadding sx={{ justifyContent: 'center' }}>
                        <ListItemButton
                            onClick={() => handleJump(it)}
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
