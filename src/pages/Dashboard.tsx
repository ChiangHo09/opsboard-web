/*
 * 文件名: src/pages/Dashboard.tsx
 *
 * 代码功能:
 * - 这是一个仪表盘页面，用于展示欢迎信息、快捷操作、快速统计和最近的操作记录。
 * - 使用 Material-UI (MUI) 构建界面布局和组件。
 * - 使用 Framer Motion 添加平滑的动画效果。
 * - 提供了到其他页面（如服务器列表、更新日志、工单）的导航链接。
 *
 * 本次修改内容:
 * - 【核心动画修复】重构了整个页面的布局结构，以解决因“嵌套滚动容器”导致的 framer-motion 动画失效问题。
 * - 移除了页面内部的 `overflowY: 'auto'` 容器，确保页面内容只有一个由父级 `MainLayout` 提供的主滚动条。
 * - 简化了 `PageLayout` 的用法，移除了 `display: 'flex'` 和 `height: '100%'`，使其只负责水平居中。
 * - 使用根级的 `<Stack>` 来组织所有页面内容，实现自然的垂直流式布局。
 * - 此修改为 `motion` 组件提供了稳定的坐标环境，从而恢复了按钮换行时的平滑过渡动画。
 */

import React, { useEffect } from 'react';
import {
    Box,
    Typography,
    Button,
    Stack,
    Card,
    CardContent,
    List,
    ListItem,
    ListItemText,
    Divider,
    ButtonBase,
    ListItemButton
} from '@mui/material';

import { motion, type Transition } from 'framer-motion';

import NoteAddIcon from '@mui/icons-material/NoteAdd';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import StorageIcon from '@mui/icons-material/Storage';
import DnsIcon from '@mui/icons-material/Dns';
import UpdateIcon from '@mui/icons-material/Update';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';

import { useNavigate } from 'react-router-dom';
import { useLayout } from '../contexts/LayoutContext.tsx';
import PageLayout from '../layouts/PageLayout';

// 最近活动数据
const recentActivities = [
    { id: 'log001', customer: '客户a', action: '新增了用户导出功能...', time: '2小时前' },
    { id: 'log002', customer: '客户b', action: '修复了一个潜在的XSS漏洞。', time: '昨天' },
    { id: 'log003', customer: '客户a', action: '优化了数据查询逻辑，首页加载速度提升 30%。', time: '3天前' },
    { id: 'log004', customer: '客户c', action: '常规维护，更新了服务器操作系统补丁。', time: '3天前' },
];

// 统计信息卡片组件
const StatCard = ({
                      icon,
                      title,
                      value,
                      onClick
                  }: {
    icon: React.ReactNode,
    title: string,
    value: string,
    onClick?: () => void
}) => (
    <Card
        component={onClick ? ButtonBase : 'div'}
        onClick={onClick}
        variant="outlined"
        sx={{
            height: '100%',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            textAlign: 'initial',
            '&:hover': {
                bgcolor: onClick ? 'action.hover' : 'transparent',
            },
        }}
    >
        <CardContent sx={{ width: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {icon}
                <Box>
                    <Typography variant="h6" component="div">{value}</Typography>
                    <Typography color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>{title}</Typography>
                </Box>
            </Box>
        </CardContent>
    </Card>
);

export default function Dashboard() {
    const nickname = 'chiangho';
    const navigate = useNavigate();
    const { setIsPanelRelevant } = useLayout();

    // 胶囊按钮样式
    const quickBtnSX = {
        height: 44,
        minWidth: 160,
        width: '100%',
        px: 4,
        borderRadius: 30,
        bgcolor: 'app.button.background',
        color: 'neutral.main',
        boxShadow: 0,
        textTransform: 'none',
        whiteSpace: 'nowrap',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        columnGap: 1.5,
        '&:hover': {
            bgcolor: 'app.button.hover',
            boxShadow: 0
        },
        '& .MuiButton-startIcon': {
            margin: 0,
            display: 'inline-flex',
            alignItems: 'center'
        },
    } as const;

    // 页面初始化时取消右侧抽屉
    useEffect(() => {
        setIsPanelRelevant(false);
        return () => {
            setIsPanelRelevant(false);
        };
    }, [setIsPanelRelevant]);

    // 按钮文字样式
    const label = (icon: React.ReactNode, text: string) => (
        <>
            {icon}
            <Typography
                component="span"
                variant="button"
                sx={{ lineHeight: 1, transform: 'translateY(1px)', fontWeight: 500 }}
            >
                {text}
            </Typography>
        </>
    );

    // 统计卡片数据
    const statCards = [
        {
            key: 'servers',
            onClick: () => navigate('/app/servers'),
            icon: <DnsIcon color="primary" sx={{ fontSize: 40, transform: 'translateY(4px)' }} />,
            title: "服务器总数",
            value: "102"
        },
        {
            key: 'changelog',
            onClick: () => navigate('/app/changelog'),
            icon: <UpdateIcon color="secondary" sx={{ fontSize: 40, transform: 'translateY(4px)' }} />,
            title: "本周更新",
            value: "12次"
        },
        {
            key: 'tickets',
            onClick: () => navigate('/app/tickets'),
            icon: <AssignmentTurnedInIcon color="error" sx={{ fontSize: 40, transform: 'translateY(4px)' }} />,
            title: "待处理工单",
            value: "3个"
        },
    ];

    // 动画参数（弹簧型）
    const motionTransition: Transition = {
        type: 'spring',
        stiffness: 500,
        damping: 30,
        mass: 0.5,
    };

    return (
        // ✅ PageLayout 只负责居中，不再是 flex 容器
        <PageLayout>
            {/* ✅ 使用一个根级 Stack 来组织所有内容 */}
            <Stack spacing={4}>
                {/* 顶部欢迎语 */}
                <Box>
                    <Stack spacing={1}>
                        <Typography variant="h5" sx={{ color: 'primary.main', fontSize: '2rem' }}>运维信息表</Typography>
                        <Typography variant="h6" color="text.secondary" sx={{ fontSize: '1.5rem' }}>
                            欢迎回来，{nickname}！接下来想做些什么？
                        </Typography>
                    </Stack>
                </Box>

                {/* 主体内容 */}
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={{ xs: 4, md: 6 }}>
                    {/* 左栏 */}
                    <Box sx={{ width: { xs: '100%', md: '50%' } }}>
                        <Stack spacing={4}>
                            {/* 快捷操作区 */}
                            <Box>
                                <Typography variant="h6" mb={2}>快捷操作</Typography>
                                <motion.div
                                    layout
                                    style={{
                                        display: 'flex',
                                        flexWrap: 'wrap',
                                        gap: 16,
                                    }}
                                >
                                    {[
                                        { key: 'new-log', text: '新建更新记录', icon: <NoteAddIcon />, to: '/app/changelog' },
                                        { key: 'new-ticket', text: '生成工单', icon: <ReceiptLongIcon />, to: '/app/tickets' },
                                        { key: 'view-servers', text: '查看服务器信息', icon: <StorageIcon />, to: '/app/servers' }
                                    ].map(({ key, text, icon, to }) => (
                                        <motion.div
                                            key={key}
                                            layout
                                            transition={motionTransition}
                                            style={{
                                                flex: '1 1 160px',
                                                minWidth: 160,
                                            }}
                                        >
                                            <Button
                                                variant="contained"
                                                sx={{ ...quickBtnSX, width: '100%' }}
                                                onClick={() => navigate(to)}
                                                startIcon={icon}
                                            >
                                                {label(<></>, text)}
                                            </Button>
                                        </motion.div>
                                    ))}
                                </motion.div>
                            </Box>

                            {/* 快速统计区 */}
                            <Box>
                                <Typography variant="h6" mb={2}>快速统计信息</Typography>
                                <motion.div
                                    layout
                                    style={{
                                        display: 'flex',
                                        flexWrap: 'wrap',
                                        gap: 16,
                                    }}
                                >
                                    {statCards.map(card => (
                                        <motion.div
                                            key={card.key}
                                            layout
                                            transition={motionTransition}
                                            style={{ flex: '1 1 160px', minWidth: 160 }}
                                        >
                                            <StatCard onClick={card.onClick} icon={card.icon} title={card.title} value={card.value} />
                                        </motion.div>
                                    ))}
                                </motion.div>
                            </Box>
                        </Stack>
                    </Box>

                    {/* 右栏 */}
                    <Box sx={{ width: { xs: '100%', md: '50%' } }}>
                        <Box>
                            <Typography variant="h6" mb={2}>最近操作</Typography>
                            <Card variant="outlined">
                                <List sx={{ padding: 0 }}>
                                    {recentActivities.map((activity, index) => (
                                        <React.Fragment key={activity.id}>
                                            <ListItem
                                                disablePadding
                                                secondaryAction={
                                                    <Typography variant="caption" color="text.secondary" sx={{ pr: 2 }}>{activity.time}</Typography>
                                                }
                                            >
                                                <ListItemButton onClick={() => navigate(`/app/changelog/${activity.id}`)}>
                                                    <ListItemText
                                                        primary={activity.customer}
                                                        secondary={activity.action}
                                                        secondaryTypographyProps={{
                                                            noWrap: true,
                                                            textOverflow: 'ellipsis',
                                                        }}
                                                    />
                                                </ListItemButton>
                                            </ListItem>
                                            {index < recentActivities.length - 1 && <Divider component="li" />}
                                        </React.Fragment>
                                    ))}
                                </List>
                            </Card>
                        </Box>
                    </Box>
                </Stack>
            </Stack>
        </PageLayout>
    );
}