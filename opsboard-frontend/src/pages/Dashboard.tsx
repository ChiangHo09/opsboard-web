/**
 * @file src/pages/Dashboard.tsx
 * @description 这是一个仪表盘页面，用于展示欢迎信息、快捷操作、快速统计和最近的操作记录。
 * @modification 本次提交中所做的具体修改摘要。
 *   - [最终修复]：将“新建巡检备份任务”快捷操作的导航路径从 `/app/inspection-backup` 更新为 `/app/tasks`。
 *   - [原因]：此修改是为了与 `App.tsx` 中更新后的路由配置保持一致，确保了概览页面的快捷链接能够正确地指向新的 `Tasks` 页面。
 */
import React, { useEffect, type JSX, type ReactNode, useCallback } from 'react';
import {
    Box,
    Button,
    ButtonBase,
    Card,
    CardContent,
    Divider,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Stack,
    Typography,
    CircularProgress,
    Alert
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
import { useLayoutDispatch } from '@/contexts/LayoutContext.tsx';
import PageLayout from '@/layouts/PageLayout';
import { useDateProcessor } from '@/hooks/useDateProcessor';
import { useAuth } from '@/hooks/useAuth';

interface StatCardProps {
    icon: ReactNode;
    title: string;
    value: string;
    onClick?: () => void;
}

const StatCard = ({ icon, title, value, onClick }: StatCardProps): JSX.Element => (
    <Card
        component={onClick ? ButtonBase : 'div'}
        {...(onClick && { disableRipple: true })}
        onClick={onClick}
        variant="outlined"
        sx={{
            minHeight: 100,
            height: 100,
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


const Dashboard = (): JSX.Element => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { closePanel } = useLayoutDispatch();

    const { result: workerResult, isLoading: isWorkerLoading, processData } = useDateProcessor();

    const handleProcessData = () => {
        const datesToProcess = Array.from({ length: 100 }, () => new Date());
        processData(datesToProcess);
    };

    const handleNavigation = useCallback((path: string) => {
        navigate(path);
    }, [navigate]);

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

    useEffect(() => {
        closePanel();
    }, [closePanel]);

    const label = (icon: ReactNode, text: string) => (
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

    const statCards = [
        {
            key: 'servers',
            onClick: () => handleNavigation('/app/servers'),
            icon: <DnsIcon color="primary" sx={{ fontSize: 40, transform: 'translateY(4px)' }} />,
            title: "服务器总数",
            value: "102"
        },
        {
            key: 'changelog',
            onClick: () => handleNavigation('/app/changelog'),
            icon: <UpdateIcon color="secondary" sx={{ fontSize: 40, transform: 'translateY(4px)' }} />,
            title: "本周更新",
            value: "12次"
        },
        {
            key: 'tickets',
            onClick: () => handleNavigation('/app/tickets'),
            icon: <AssignmentTurnedInIcon color="error" sx={{ fontSize: 40, transform: 'translateY(4px)' }} />,
            title: "待处理工单",
            value: "3个"
        },
    ];

    const motionTransition: Transition = {
        type: 'spring',
        stiffness: 500,
        damping: 30,
        mass: 0.5,
    };

    return (
        <PageLayout>
            <Stack spacing={4}>
                <Box>
                    <Stack spacing={1}>
                        <Typography variant="h5" sx={{ color: 'primary.main', fontSize: '2rem' }}>运维信息表</Typography>
                        <Typography variant="h6" color="text.secondary" sx={{ fontSize: '1.5rem' }}>
                            欢迎回来，{user?.nickname || '用户'}！接下来想做些什么？
                        </Typography>
                    </Stack>
                </Box>

                <Stack direction={{ xs: 'column', md: 'row' }} spacing={{ xs: 4, md: 6 }}>
                    <Box sx={{ width: { xs: '100%', md: '50%' } }}>
                        <Stack spacing={4}>
                            <Box>
                                <motion.div
                                    layout
                                    style={{ display: 'flex', flexWrap: 'wrap', gap: 16, paddingTop: 16 }}
                                >
                                    {[
                                        { key: 'new-changelog', text: '新建更新记录', icon: <RestorePageIcon />, to: '/app/changelog' },
                                        { key: 'new-ticket', text: '生成工单', icon: <AssignmentIcon />, to: '/app/tickets' },
                                        // [核心修复] 更新路径和文本
                                        { key: 'new-task', text: '新建任务', icon: <PlaylistAddCheckCircleIcon />, to: '/app/tasks' },
                                        { key: 'view-stats', text: '查看统计信息', icon: <PollRoundedIcon />, to: '/app/stats' },
                                        { key: 'view-servers', text: '查看服务器信息', icon: <DnsIcon />, to: '/app/servers' }
                                    ].map(({ key, text, icon, to }) => (
                                        <motion.div
                                            key={key}
                                            layout
                                            transition={motionTransition}
                                            style={{ flex: '1 1 160px', minWidth: 160 }}
                                        >
                                            <Button
                                                variant="contained"
                                                sx={{ ...quickBtnSX, width: '100%' }}
                                                onClick={() => handleNavigation(to)}
                                                startIcon={icon}
                                            >
                                                {label(<></>, text)}
                                            </Button>
                                        </motion.div>
                                    ))}
                                </motion.div>
                            </Box>

                            <Box>
                                <Typography variant="h6" mb={2}>快速统计信息</Typography>
                                <motion.div
                                    layout
                                    style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}
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

                            <Box>
                                <Typography variant="h6" mb={2}>主线程性能优化 (Web Worker)</Typography>
                                <Card variant="outlined">
                                    <CardContent>
                                        <Typography paragraph>
                                            点击下方按钮，将在后台线程中执行一个模拟的密集计算任务。这可以防止UI在计算过程中卡顿。
                                        </Typography>
                                        <Button variant="contained" onClick={handleProcessData} disabled={isWorkerLoading}>
                                            {isWorkerLoading ? <CircularProgress size={24} color="inherit" /> : '开始后台计算'}
                                        </Button>
                                        {workerResult && (
                                            <Alert severity="info" sx={{ mt: 2 }}>
                                                <strong>Worker Result:</strong> {workerResult}
                                            </Alert>
                                        )}
                                    </CardContent>
                                </Card>
                            </Box>
                        </Stack>
                    </Box>

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
                                                <ListItemButton onClick={() => handleNavigation(`/app/changelog/${activity.id}`)}>
                                                    <ListItemText
                                                        primary={activity.customer}
                                                        secondary={activity.action}
                                                        secondaryTypographyProps={{ noWrap: true, textOverflow: 'ellipsis' }}
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
};

export default Dashboard;