/*****************************************************************
 *  src/components/SideNav.tsx
 *  --------------------------------------------------------------
 *  • 侧栏背景：#1976d2（Blue 500）
 *  • 按钮顺序：搜索 → 概览 → 服务器 → 更新日志 → 工单 → 实验性功能 → 设置
 *  • 按钮上下间距：8 px，圆角：1 px
 *  • 头像样式：外圈淡蓝环 + 内圈深蓝圆 + 用户图标
 *  • 头像位置：距底 48 px（mb = 6）
 *****************************************************************/

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { ReactNode } from 'react'

/* -------- MUI 组件 -------- */
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

/* -------- Icons -------- */
import SearchIcon        from '@mui/icons-material/Search'
import DashboardIcon     from '@mui/icons-material/Dashboard'
import DnsIcon           from '@mui/icons-material/Dns'
import UpdateIcon        from '@mui/icons-material/Update'
import AssignmentIcon    from '@mui/icons-material/Assignment'
import ScienceIcon       from '@mui/icons-material/Science'
import SettingsIcon      from '@mui/icons-material/Settings'
import LogoutIcon        from '@mui/icons-material/Logout'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'

interface NavItem { label: string; path: string; icon: ReactNode }

/* 菜单顺序 */
const navItems: NavItem[] = [
    { label: '搜索',          path: '/search',    icon: <SearchIcon /> },
    { label: '概览',          path: '/dashboard', icon: <DashboardIcon /> },
    { label: '服务器',        path: '/servers',   icon: <DnsIcon /> },
    { label: '更新日志',      path: '/changelog', icon: <UpdateIcon /> },
    { label: '工单',          path: '/tickets',   icon: <AssignmentIcon /> },
    { label: '实验性\n功能',   path: '/labs',      icon: <ScienceIcon /> },
    { label: '设置',          path: '/settings',  icon: <SettingsIcon /> },
]

const BASE = 88   // 抽屉宽度
const BTN  = 72   // 按钮尺寸

/* 公共按钮样式 */
const btnStyle = {
    width: BTN,
    height: BTN,
    minWidth: BTN,
    minHeight: BTN,
    mx: 1,
    my: 1,             // 8 px 上下间距
    p: 0,
    borderRadius: 1,   // 1 px 圆角
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'center',
    alignItems: 'center',
    color: '#fff',
}

const SideNav = () => {
    const [selected, setSelected] = useState('/dashboard')

    /* 头像菜单 */
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
    const openMenu  = (e: React.MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget)
    const closeMenu = () => setAnchorEl(null)

    const navigate = useNavigate()
    const handleClick = (it: NavItem) => {
        setSelected(it.path)
        navigate(it.path)
    }
    const logout = () => navigate('/login')   // TODO: 清理 token

    return (
        <Drawer
            variant="permanent"
            sx={{
                width: BASE,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: BASE,
                    boxSizing: 'border-box',
                    bgcolor: '#1976d2',          // Blue 500
                    color: '#fff',
                    borderRight: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                },
            }}
        >
            {/* ---------- 顶部按钮区 ---------- */}
            <Box>
                <List disablePadding>
                    {navItems.map(it => (
                        <ListItem key={it.path} disablePadding sx={{ justifyContent: 'center' }}>
                            <ListItemButton
                                onClick={() => handleClick(it)}
                                sx={{
                                    ...btnStyle,
                                    bgcolor: selected === it.path ? 'rgba(255,255,255,0.24)' : 'transparent',
                                    '&:hover': { bgcolor: 'rgba(255,255,255,0.16)' },
                                    transition: 'background-color .3s',
                                }}
                            >
                                {it.icon}
                                <Typography
                                    sx={{ fontSize: 12, textAlign: 'center', whiteSpace: 'pre-line', mt: 0.5 }}
                                >
                                    {it.label}
                                </Typography>
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Box>

            {/* ---------- 头像区（距底 48 px） ---------- */}
            <Box sx={{ mb: 6, display: 'flex', justifyContent: 'center' }}>
                <Tooltip title="账户设置">
                    {/* 外圈淡蓝环 */}
                    <Avatar
                        sx={{
                            width: 56,
                            height: 56,
                            bgcolor: 'rgba(255,255,255,0.25)',
                            cursor: 'pointer',
                        }}
                        onClick={openMenu}
                    >
                        {/* 内圈深蓝圆 */}
                        <Avatar
                            sx={{
                                width: 36,
                                height: 36,
                                bgcolor: '#1976d2',
                            }}
                        >
                            <AccountCircleIcon sx={{ fontSize: 20 }} />
                        </Avatar>
                    </Avatar>
                </Tooltip>

                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={closeMenu}
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                    transformOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                >
                    <MenuItem disabled>
                        <Typography variant="body2">用户信息</Typography>
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={logout}>
                        <LogoutIcon fontSize="small" style={{ marginRight: 8 }} />
                        退出登录
                    </MenuItem>
                </Menu>
            </Box>
        </Drawer>
    )
}

export default SideNav
