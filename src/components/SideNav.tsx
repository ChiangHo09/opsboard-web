// 侧边栏：固定宽 88px，按钮 72×72；点击高亮 & 路由跳转
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    Box, Drawer, List, ListItem, ListItemButton, Typography,
    Avatar, Tooltip, Menu, MenuItem, Divider, ListItemIcon,
} from '@mui/material'

import SearchIcon from '@mui/icons-material/Search'
import DashboardIcon from '@mui/icons-material/Dashboard'
import DnsIcon from '@mui/icons-material/Dns'
import UpdateIcon from '@mui/icons-material/Update'
import AssignmentIcon from '@mui/icons-material/Assignment'
import BarChartIcon from '@mui/icons-material/BarChart'
import ScienceIcon from '@mui/icons-material/Science'
import SettingsIcon from '@mui/icons-material/Settings'
import LogoutIcon from '@mui/icons-material/Logout'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'

interface NavItem { label: string; path: string; icon: React.ReactNode }

const navItems: NavItem[] = [
    { label: '搜索',   path: '/search',    icon: <SearchIcon /> },
    { label: '概览',   path: '/dashboard', icon: <DashboardIcon /> },
    { label: '服务器', path: '/servers',   icon: <DnsIcon /> },
    { label: '更新日志', path: '/changelog', icon: <UpdateIcon /> },
    { label: '工单',   path: '/tickets',   icon: <AssignmentIcon /> },
    { label: '统计信息', path: '/stats',   icon: <BarChartIcon /> },
    { label: '实验性\n功能', path: '/labs', icon: <ScienceIcon /> },
    { label: '设置',   path: '/settings',  icon: <SettingsIcon /> },
]

const BASE = 88
const BTN = 72
const btnStyle = {
    width: BTN, height: BTN, minWidth: BTN, minHeight: BTN,
    mx: 1, my: 0.5, p: 0, borderRadius: 2,
    display: 'flex', flexDirection: 'column' as const,
    justifyContent: 'center', alignItems: 'center',
    color: '#fff',
}

const SideNav: React.FC = () => {
    const [selected, setSelected] = useState('/dashboard')
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
    const nav = useNavigate()

    const handleClick = (it: NavItem) => { setSelected(it.path); nav(it.path) }
    const logout = () => { setAnchorEl(null); alert('退出登录') }

    return (
        <Drawer variant="permanent" sx={{
            width: BASE, flexShrink: 0,
            '& .MuiDrawer-paper': {
                width: BASE, bgcolor: '#1976d2', borderRight: 'none',
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
            },
        }}>
            {/* 菜单列表 */}
            <Box sx={{ mt: 1 }}>
                <List disablePadding>
                    {navItems.map(it => (
                        <ListItem key={it.path} disablePadding sx={{ justifyContent: 'center' }}>
                            <ListItemButton
                                onClick={() => handleClick(it)}
                                sx={{
                                    ...btnStyle,
                                    bgcolor: selected === it.path ? '#64b5f6' : 'transparent',
                                    transition: 'background-color .3s',
                                    '&:hover': { bgcolor: '#64b5f6' },
                                }}
                            >
                                {it.icon}
                                <Typography sx={{ fontSize: 12, textAlign: 'center', whiteSpace: 'pre-line', mt: .5 }}>
                                    {it.label}
                                </Typography>
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Box>

            {/* 头像 & 菜单 */}
            <Box sx={{ textAlign: 'center', pb: 2 }}>
                <Tooltip title="账户菜单" placement="right">
                    <Avatar
                        sx={{ mx: 'auto', mb: 1, bgcolor: '#64b5f6', width: 40, height: 40, cursor: 'pointer' }}
                        onClick={e => setAnchorEl(e.currentTarget)}
                    >
                        <AccountCircleIcon sx={{ color: '#1976d2', fontSize: 17 }} />
                    </Avatar>
                </Tooltip>
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={() => setAnchorEl(null)}
                    anchorOrigin={{ vertical: 'center', horizontal: 'right' }}
                    transformOrigin={{ vertical: 'center', horizontal: 'left' }}
                >
                    <MenuItem disabled><Typography variant="body2">用户信息</Typography></MenuItem>
                    <Divider />
                    <MenuItem onClick={logout}>
                        <ListItemIcon><LogoutIcon fontSize="small" /></ListItemIcon>
                        退出登录
                    </MenuItem>
                </Menu>
            </Box>
        </Drawer>
    )
}

export default SideNav
