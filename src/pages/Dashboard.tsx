/**
 * 文件名: src/pages/Dashboard.tsx
 *
 * 代码功能:
 * - 这是一个仪表盘页面，用于展示欢迎信息、快捷操作、快速统计和最近的操作记录。
 *
 * 本次修改内容:
 * - 【跳转逻辑终极修复】此页面现在负责在挂载时，主动关闭任何可能处于打开状态的搜索面板。
 * - **解决方案**:
 *   1.  在 `useEffect` 中，除了原有的逻辑，现在会直接调用从 `useLayoutDispatch` 中获取的 `closePanel()` 函数。
 *   2.  这确保了无论从哪个页面跳转到 `Dashboard`，如果搜索面板是打开的，它都会被可靠地关闭。
 * - **最终效果**:
 *   通过让无面板的页面主动承担关闭职责，我们获得了一个简单、健壮且无竞态条件的解决方案。
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

import RestorePageIcon from '@mui/icons-material/RestorePage';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PlaylistAddCheckCircleIcon from '@mui/icons-material/PlaylistAddCheckCircle';
import PollRoundedIcon from '@mui/icons-material/PollRounded';
import DnsIcon from '@mui/icons-material/Dns';
import UpdateIcon from '@mui/icons-material/Update';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';

import { useNavigate } from 'react-router-dom';
import { useLayoutDispatch } from '../contexts/LayoutContext.tsx';
import PageLayout from '../layouts/PageLayout';

// ... (StatCard, recentActivities 等组件和数据保持不变)

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
const recentActivities = [
    { id: 'log001', customer: '客户a', action: '新增了用户导出功能...', time: '2小时前' },
    { id: 'log002', customer: '客户b', action: '修复了一个潜在的XSS漏洞。', time: '昨天' },
    { id: 'log003', customer: '客户a', action: '优化了数据查询逻辑，首页加载速度提升 30%。', time: '3天前' },
    { id: 'log004', customer: '客户c', action: '常规维护，更新了服务器操作系统补丁。', time: '3天前' },
];

export default function Dashboard() {
    const nickname = 'chiangho';
    const navigate = useNavigate();
    // 【核心修复】从 dispatch 中获取 closePanel 函数
    const { closePanel } = useLayoutDispatch();

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

    // 【核心修复】对于不使用面板的页面，在挂载时应主动关闭任何可能打开的面板。
    useEffect(() => {
        closePanel();
    }, [closePanel]);

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
        <PageLayout>
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
                                <motion.div
                                    layout
                                    style={{
                                        display: 'flex',
                                        flexWrap: 'wrap',
                                        gap: 16,
                                        paddingTop: 16,
                                    }}
                                >
                                    {[
                                        { key: 'new-changelog', text: '新建更新记录', icon: <RestorePageIcon />, to: '/app/changelog' },
                                        { key: 'new-ticket', text: '生成工单', icon: <AssignmentIcon />, to: '/app/tickets' },
                                        { key: 'new-inspection-backup', text: '新建巡检备份任务', icon: <PlaylistAddCheckCircleIcon />, to: '/app/inspection-backup' },
                                        { key: 'view-stats', text: '查看统计信息', icon: <PollRoundedIcon />, to: '/app/stats' },
                                        { key: 'view-servers', text: '查看服务器信息', icon: <DnsIcon />, to: '/app/servers' }
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