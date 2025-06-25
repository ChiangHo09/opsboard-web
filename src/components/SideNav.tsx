// src/components/SideNav.tsx
import React, { useState } from 'react'
import {
    Box,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    Typography,
    Collapse,
    Slide,
    Avatar,
    Tooltip,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import DashboardIcon from '@mui/icons-material/Dashboard'
import PeopleIcon from '@mui/icons-material/People'
import DnsIcon from '@mui/icons-material/Dns'
import UpdateIcon from '@mui/icons-material/Update'
import AssignmentIcon from '@mui/icons-material/Assignment'
import ScienceIcon from '@mui/icons-material/Science'
import SettingsIcon from '@mui/icons-material/Settings'
import LogoutIcon from '@mui/icons-material/Logout'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

interface NavItem {
    label: string
    path: string
    icon?: React.ReactNode
    children?: NavItem[]
}

const navItems: NavItem[] = [
    { label: '搜索',       path: '/search',    icon: <SearchIcon /> },
    { label: '概览',       path: '/dashboard', icon: <DashboardIcon /> },
    {
        label: '客户信息',   path: '/customers',  icon: <PeopleIcon />,
        children: [
            { label: '某某市', path: '/customers/city', children: [
                    { label: '某某区', path: '/customers/city/district' },
                ] },
        ],
    },
    { label: '服务器信息', path: '/servers',   icon: <DnsIcon /> },
    { label: '更新日志',   path: '/changelog', icon: <UpdateIcon /> },
    { label: '工单',       path: '/tickets',   icon: <AssignmentIcon /> },
    { label: '实验功能',   path: '/labs',      icon: <ScienceIcon /> },
    { label: '设置',       path: '/settings',  icon: <SettingsIcon /> },
]

const BASE_WIDTH = 82
const SUB_WIDTH = 220
const btnStyle = {
    width: 70,
    height: 70,
    m: 0.5,
    p: 0,
    borderRadius: 2,
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'center',
    alignItems: 'center',
    color: '#fff',
}

const SideNav: React.FC = () => {
    const [selected, setSelected] = useState<string>('/dashboard')
    const [subMenu, setSubMenu]       = useState<NavItem[] | null>(null)
    const [openMap, setOpenMap]       = useState<Record<string, boolean>>({})

    const handleMainClick = (item: NavItem) => {
        setSelected(item.path)
        setSubMenu(item.children ?? null)
        setOpenMap({})
    }
    const toggleFold = (path: string) => {
        setOpenMap(o => ({ ...o, [path]: !o[path] }))
    }

    const renderSubItems = (items: NavItem[], depth = 0): React.ReactNode => (
        <List disablePadding sx={{ pl: depth * 2, transition: 'padding .3s ease' }}>
            {items.map(it => {
                const has = !!it.children?.length
                const open = openMap[it.path] || false
                return (
                    <React.Fragment key={it.path + depth}>
                        <ListItem disablePadding>
                            <ListItemButton
                                onClick={() => has ? toggleFold(it.path) : handleMainClick(it)}
                                sx={{
                                    py: 1,
                                    pr: 1,
                                    borderRadius: 1,
                                    color: '#fff',
                                    backgroundColor: selected === it.path ? '#64b5f6' : 'transparent',
                                    '&:hover': { backgroundColor: '#5fa8ec' },
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    transition: 'background-color .3s ease',
                                }}
                            >
                                <Typography sx={{ fontSize: 14 - depth, transition: 'font-size .3s ease' }}>
                                    {it.label}
                                </Typography>
                                {has && (open ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />)}
                            </ListItemButton>
                        </ListItem>
                        {has && (
                            <Collapse in={open} timeout={300} unmountOnExit sx={{ transition: 'height .3s ease' }}>
                                {renderSubItems(it.children!, depth + 1)}
                            </Collapse>
                        )}
                    </React.Fragment>
                )
            })}
        </List>
    )

    return (
        <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
            {/* 主侧边栏 */}
            <Drawer
                variant="permanent"
                sx={{
                    width: BASE_WIDTH,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: BASE_WIDTH,
                        backgroundColor: '#1976d2',
                        borderRight: 'none',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                    },
                }}
            >
                <Box sx={{ mt: 1 }}>
                    <List disablePadding>
                        {navItems.map(item => (
                            <ListItem key={item.path} disablePadding sx={{ justifyContent: 'center' }}>
                                <ListItemButton
                                    onClick={() => handleMainClick(item)}
                                    sx={{
                                        ...btnStyle,
                                        backgroundColor: selected === item.path ? '#64b5f6' : 'transparent',
                                        '&:hover': { backgroundColor: '#64b5f6' },
                                        transition: 'background-color .3s ease',
                                    }}
                                >
                                    {item.icon}
                                    <Typography sx={{ fontSize: 12, textAlign: 'center', whiteSpace: 'pre-line' }}>
                                        {item.label}
                                    </Typography>
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </Box>
                <Box sx={{ textAlign: 'center', pb: 1 }}>
                    <Tooltip title="用户信息">
                        <Avatar sx={{ mx: 'auto', mb: 1, bgcolor: '#64b5f6', width: 40, height: 40 }}>
                            <AccountCircleIcon sx={{ color: '#1976d2', fontSize: 20 }} />
                        </Avatar>
                    </Tooltip>
                    <Tooltip title="退出登录">
                        <Box
                            sx={{
                                width: 60,
                                height: 60,
                                m: 0.5,
                                p: 0,
                                borderRadius: 2,
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                color: '#fff',
                                cursor: 'pointer',
                                transition: 'background-color .3s ease',
                            }}
                            onClick={() => alert('退出登录')}
                        >
                            <LogoutIcon fontSize="small" />
                        </Box>
                    </Tooltip>
                </Box>
            </Drawer>

            {/* 二级侧边栏滑出 */}
            {subMenu && (
                <Slide
                    direction="right"
                    in={Boolean(subMenu)}
                    mountOnEnter
                    unmountOnExit
                    timeout={300}
                    style={{ position: 'absolute', left: BASE_WIDTH, top: 0 }}
                >
                    <Box sx={{ width: SUB_WIDTH, height: '100%', bgcolor: '#1976d2', overflowY: 'auto' }}>
                        {renderSubItems(subMenu)}
                    </Box>
                </Slide>
            )}
        </Box>
    )
}

export default SideNav
