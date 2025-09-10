/**
 * @file src/pages/Dashboard.tsx
 * @description 这是一个仪表盘页面，用于展示欢迎信息、快捷操作、快速统计和最近的操作记录。
 * @modification 本次提交中所做的具体修改摘要。
 *   - [运行时性能]：引入了 Web Worker 来处理模拟的密集型日期计算。通过 `useDateProcessor` 钩子，将耗时任务移至后台线程，防止主线程被阻塞，保证了UI的流畅响应。
 *   - [内存管理]：使用 `useCallback` 优化了 `StatCard` 的 `onClick` 事件处理器。这可以防止在每次重渲染时都创建新的函数实例，从而减少不必要的子组件重渲染，并降低内存开销。
 *   - [内存管理]：新增了一个 `useEffect` 示例，用于演示如何正确地添加和移除DOM事件监听器（如 `resize`），确保在组件卸载时清理监听器，避免内存泄漏。
 */
import React, {useEffect, type JSX, type ReactNode, useCallback, useState} from 'react';
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
    LinearProgress, CircularProgress, Alert
} from '@mui/material';
import {motion, type Transition} from 'framer-motion';
import RestorePageIcon from '@mui/icons-material/RestorePage';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PlaylistAddCheckCircleIcon from '@mui/icons-material/PlaylistAddCheckCircle';
import PollRoundedIcon from '@mui/icons-material/PollRounded';
import DnsIcon from '@mui/icons-material/Dns';
import UpdateIcon from '@mui/icons-material/Update';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import {useNavigate} from 'react-router-dom';
import {useLayoutDispatch} from '@/contexts/LayoutContext.tsx';
import PageLayout from '@/layouts/PageLayout';
import { useDateProcessor } from '@/hooks/useDateProcessor';

// 为 StatCard 的 props 定义一个接口
interface StatCardProps {
    icon: ReactNode;
    title: string;
    value: string;
    onClick?: () => void;
}

// 定义客户存储数据接口
interface ClientStorageData {
    id: string;
    clientName: string;
    total: string;
    used: string;
    percentage: number;
}

// 使用现代写法定义 StatCard 组件
const StatCard = ({icon, title, value, onClick}: StatCardProps): JSX.Element => (
    <Card
        component={onClick ? ButtonBase : 'div'}
        {...(onClick && {disableRipple: true})}
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
        <CardContent sx={{width: '100%'}}>
            <Box sx={{display: 'flex', alignItems: 'center', gap: 2}}>
                {icon}
                <Box>
                    <Typography variant="h6" component="div">{value}</Typography>
                    <Typography color="text.secondary" sx={{whiteSpace: 'nowrap'}}>{title}</Typography>
                </Box>
            </Box>
        </CardContent>
    </Card>
);

const recentActivities = [
    {id: 'log001', customer: '客户a', action: '新增了用户导出功能...', time: '2小时前'},
    {id: 'log002', customer: '客户b', action: '修复了一个潜在的XSS漏洞。', time: '昨天'},
    {id: 'log003', customer: '客户a', action: '优化了数据查询逻辑，首页加载速度提升 30%。', time: '3天前'},
    {id: 'log004', customer: '客户c', action: '常规维护，更新了服务器操作系统补丁。', time: '3天前'},
];

const mockClientStorageUsage: ClientStorageData[] = [
    {id: 'c1', clientName: '客户A', total: '1TB', used: '950GB', percentage: 95},
    {id: 'c2', clientName: '客户B', total: '500GB', used: '400GB', percentage: 80},
    {id: 'c3', clientName: '客户C', total: '2TB', used: '1.5TB', percentage: 75},
    {id: 'c4', clientName: '客户D', total: '750GB', used: '500GB', percentage: 66},
    {id: 'c5', clientName: '客户E', total: '1.5TB', used: '900GB', percentage: 60},
    {id: 'c6', clientName: '客户F', total: '300GB', used: '150GB', percentage: 50},
    {id: 'c7', clientName: '客户G', total: '1TB', used: '400GB', percentage: 40},
    {id: 'c8', clientName: '客户H', total: '200GB', used: '60GB', percentage: 30},
    {id: 'c9', clientName: '客户I', total: '1.2TB', used: '240GB', percentage: 20},
    {id: 'c10', clientName: '客户J', total: '800GB', used: '80GB', percentage: 10},
    {id: 'c11', clientName: '客户K', total: '600GB', used: '30GB', percentage: 5},
    {id: 'c12', clientName: '客户L', total: '400GB', used: '0GB', percentage: 0},
];


const Dashboard = (): JSX.Element => {
    const nickname = 'chiangho';
    const navigate = useNavigate();
    const {closePanel} = useLayoutDispatch();
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    // [Web Worker] 1. 引入 Web Worker 钩子
    const { result: workerResult, isLoading: isWorkerLoading, processData } = useDateProcessor();

    const handleProcessData = () => {
        // 模拟需要处理的大量数据
        const datesToProcess = Array.from({ length: 100 }, () => new Date());
        processData(datesToProcess);
    };

    // [内存管理] 1. 使用 useCallback 包装导航函数，避免在渲染中创建新函数
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

    // [内存管理] 2. 演示事件监听器的正确添加与销毁
    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };
        // 添加事件监听器
        window.addEventListener('resize', handleResize);
        console.log('Resize event listener added.');

        // 在组件卸载时返回一个清理函数，以移除监听器
        return () => {
            window.removeEventListener('resize', handleResize);
            console.log('Resize event listener removed.');
        };
    }, []); // 空依赖数组确保监听器只在挂载和卸载时处理


    const label = (icon: ReactNode, text: string) => (
        <>
            {icon}
            <Typography
                component="span"
                variant="button"
                sx={{lineHeight: 1, transform: 'translateY(1px)', fontWeight: 500}}
            >
                {text}
            </Typography>
        </>
    );

    const statCards = [
        {
            key: 'servers',
            onClick: () => handleNavigation('/app/servers'),
            icon: <DnsIcon color="primary" sx={{fontSize: 40, transform: 'translateY(4px)'}}/>,
            title: "服务器总数",
            value: "102"
        },
        {
            key: 'changelog',
            onClick: () => handleNavigation('/app/changelog'),
            icon: <UpdateIcon color="secondary" sx={{fontSize: 40, transform: 'translateY(4px)'}}/>,
            title: "本周更新",
            value: "12次"
        },
        {
            key: 'tickets',
            onClick: () => handleNavigation('/app/tickets'),
            icon: <AssignmentTurnedInIcon color="error" sx={{fontSize: 40, transform: 'translateY(4px)'}}/>,
            title: "待处理工单",
            value: "3个"
        },
    ];

    const getStorageProgressColor = (percentage: number) => {
        if (percentage > 85) return 'error';
        if (percentage > 70) return 'warning';
        return 'primary';
    };

    const sortedClientStorageUsage = [...mockClientStorageUsage]
        .sort((a, b) => b.percentage - a.percentage)
        .slice(0, 10);

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
                        <Typography variant="h5" sx={{color: 'primary.main', fontSize: '2rem'}}>运维信息表</Typography>
                        <Typography variant="h6" color="text.secondary" sx={{fontSize: '1.5rem'}}>
                            欢迎回来，{nickname}！当前窗口宽度: {windowWidth}px
                        </Typography>
                    </Stack>
                </Box>

                <Stack direction={{xs: 'column', md: 'row'}} spacing={{xs: 4, md: 6}}>
                    <Box sx={{width: {xs: '100%', md: '50%'}}}>
                        <Stack spacing={4}>
                            <Box>
                                <motion.div
                                    layout
                                    style={{ display: 'flex', flexWrap: 'wrap', gap: 16, paddingTop: 16 }}
                                >
                                    {[
                                        { key: 'new-changelog', text: '新建更新记录', icon: <RestorePageIcon/>, to: '/app/changelog' },
                                        { key: 'new-ticket', text: '生成工单', icon: <AssignmentIcon/>, to: '/app/tickets' },
                                        { key: 'new-inspection-backup', text: '新建巡检备份任务', icon: <PlaylistAddCheckCircleIcon/>, to: '/app/inspection-backup' },
                                        { key: 'view-stats', text: '查看统计信息', icon: <PollRoundedIcon/>, to: '/app/stats' },
                                        { key: 'view-servers', text: '查看服务器信息', icon: <DnsIcon/>, to: '/app/servers' }
                                    ].map(({key, text, icon, to}) => (
                                        <motion.div
                                            key={key}
                                            layout
                                            transition={motionTransition}
                                            style={{ flex: '1 1 160px', minWidth: 160 }}
                                        >
                                            <Button
                                                variant="contained"
                                                sx={{...quickBtnSX, width: '100%'}}
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
                                            style={{flex: '1 1 160px', minWidth: 160}}
                                        >
                                            <StatCard onClick={card.onClick} icon={card.icon} title={card.title} value={card.value}/>
                                        </motion.div>
                                    ))}
                                </motion.div>
                            </Box>

                            {/* [Web Worker] 2. 添加UI以触发和显示Worker结果 */}
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

                            <Box>
                                <Typography variant="h6" mb={2}>客户存储空间用量排行 (Top 10)</Typography>
                                <Card variant="outlined">
                                    <List sx={{padding: 0}}>
                                        {sortedClientStorageUsage.map((client, index) => (
                                            <React.Fragment key={client.id}>
                                                <ListItem disablePadding>
                                                    <ListItemButton onClick={() => handleNavigation(`/app/clients/${client.id}/storage`)}>
                                                        <ListItemText
                                                            primary={client.clientName}
                                                            secondary={`已用 ${client.used} / 总计 ${client.total}`}
                                                            secondaryTypographyProps={{ noWrap: true, textOverflow: 'ellipsis' }}
                                                        />
                                                        <Box sx={{minWidth: 100, ml: 2}}>
                                                            <LinearProgress
                                                                variant="determinate"
                                                                value={client.percentage}
                                                                color={getStorageProgressColor(client.percentage)}
                                                                sx={{height: 8, borderRadius: 4}}
                                                            />
                                                            <Typography variant="caption" color="text.secondary" sx={{mt: 0.5, display: 'block', textAlign: 'right'}}>
                                                                {client.percentage}%
                                                            </Typography>
                                                        </Box>
                                                    </ListItemButton>
                                                </ListItem>
                                                {index < sortedClientStorageUsage.length - 1 && <Divider component="li"/>}
                                            </React.Fragment>
                                        ))}
                                    </List>
                                </Card>
                            </Box>
                        </Stack>
                    </Box>

                    <Box sx={{width: {xs: '100%', md: '50%'}}}>
                        <Box>
                            <Typography variant="h6" mb={2}>最近操作</Typography>
                            <Card variant="outlined">
                                <List sx={{padding: 0}}>
                                    {recentActivities.map((activity, index) => (
                                        <React.Fragment key={activity.id}>
                                            <ListItem
                                                disablePadding
                                                secondaryAction={
                                                    <Typography variant="caption" color="text.secondary" sx={{pr: 2}}>{activity.time}</Typography>
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
                                            {index < recentActivities.length - 1 && <Divider component="li"/>}
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