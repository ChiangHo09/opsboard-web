/*****************************************************************
 *  src/components/SideNav.tsx
 *  --------------------------------------------------------------
 *  • 侧栏宽度：84 px  =  按钮 72 px  +  左右边距 6 px × 2
 *  • 每个按钮：72 × 72 px 正方形，圆角 1 px
 *  • 四周可见空隙：6 px；相邻按钮垂直间距同样 6 px
 *  • 使用 ListItemButton → 自带 Material TouchRipple 特效
 *****************************************************************/

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { ReactNode } from 'react'

import Drawer         from '@mui/material/Drawer'
import Box            from '@mui/material/Box'
import List           from '@mui/material/List'
import ListItem       from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import Typography     from '@mui/material/Typography'
import Avatar         from '@mui/material/Avatar'
import Tooltip        from '@mui/material/Tooltip'
import Menu           from '@mui/material/Menu'
import MenuItem       from '@mui/material/MenuItem'
import Divider        from '@mui/material/Divider'

import SearchIcon        from '@mui/icons-material/Search'
import DashboardIcon     from '@mui/icons-material/Dashboard'
import DnsIcon           from '@mui/icons-material/Dns'
import UpdateIcon        from '@mui/icons-material/Update'
import AssignmentIcon    from '@mui/icons-material/Assignment'
import BarChartIcon      from '@mui/icons-material/BarChart'
import ScienceIcon       from '@mui/icons-material/Science'
import SettingsIcon      from '@mui/icons-material/Settings'
import LogoutIcon        from '@mui/icons-material/Logout'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'

interface NavItem { label: string; path: string; icon: ReactNode }

const navItems: NavItem[] = [
    { label: '搜索',          path: '/search',    icon: <SearchIcon /> },
    { label: '概览',          path: '/dashboard', icon: <DashboardIcon /> },
    { label: '服务器',        path: '/servers',   icon: <DnsIcon /> },
    { label: '更新日志',      path: '/changelog', icon: <UpdateIcon /> },
    { label: '工单',          path: '/tickets',   icon: <AssignmentIcon /> },
    { label: '统计信息',      path: '/stats',     icon: <BarChartIcon /> },
    { label: '实验性\n功能',   path: '/labs',      icon: <ScienceIcon /> },
    { label: '设置',          path: '/settings',  icon: <SettingsIcon /> },
]

/* ---------- 尺寸常量 ---------- */
const BTN      = 72   // 按钮边长
const GAP      = 6    // 目标可见间隙
const HALF_GAP = GAP / 2
const DRAWER_W = BTN + GAP * 2 // 72 + 6×2 = 84

const SideNav = () => {
    const [selected, setSelected] = useState('/dashboard')
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
    const nav = useNavigate()

    const handleJump = (it: NavItem) => {
        setSelected(it.path)
        nav(it.path)
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
                },
            }}
        >
            {/* ---------- 按钮区 ---------- */}
            <List
                disablePadding
                sx={{ pt: `${HALF_GAP}px`, pb: `${HALF_GAP}px` }}   /* 顶 / 底 3px */
            >
                {navItems.map(it => (
                    <ListItem key={it.path} disablePadding sx={{ justifyContent: 'center' }}>
                        <ListItemButton
                            onClick={() => handleJump(it)}
                            sx={{
                                width: BTN,
                                height: BTN,
                                my: `${HALF_GAP}px`,      /* 上下 3px  →  相邻按钮间隔 6px  */
                                mx: `${GAP}px`,           /* 左右 6px  */
                                p: 0,
                                borderRadius: 1,
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                bgcolor:
                                    selected === it.path
                                        ? 'rgba(255,255,255,0.24)'
                                        : 'transparent',
                                '&:hover': { bgcolor: 'rgba(255,255,255,0.16)' },
                                transition: 'background-color .3s',
                            }}
                        >
                            {it.icon}
                            <Typography
                                sx={{
                                    fontSize: 11,
                                    mt: 0.5,
                                    lineHeight: 1.15,
                                    textAlign: 'center',
                                    whiteSpace: 'pre-line',
                                }}
                            >
                                {it.label}
                            </Typography>
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>

            {/* ---------- 头像区 ---------- */}
            <Box sx={{ mb: 6, display: 'flex', justifyContent: 'center' }}>
                <Tooltip title="账户设置">
                    <Avatar
                        sx={{
                            width: 56,
                            height: 56,
                            bgcolor: 'rgba(255,255,255,0.25)',
                            cursor: 'pointer',
                        }}
                        onClick={e => setAnchorEl(e.currentTarget)}
                    >
                        <Avatar sx={{ width: 36, height: 36, bgcolor: '#1976d2' }}>
                            <AccountCircleIcon sx={{ fontSize: 20 }} />
                        </Avatar>
                    </Avatar>
                </Tooltip>

                {/* 头像下拉菜单 */}
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={() => setAnchorEl(null)}
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                    transformOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                >
                    <MenuItem disabled>用户信息</MenuItem>
                    <Divider />
                    <MenuItem onClick={() => nav('/login')}>
                        <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
                        退出登录
                    </MenuItem>
                </Menu>
            </Box>
        </Drawer>
    )
}

export default SideNav
