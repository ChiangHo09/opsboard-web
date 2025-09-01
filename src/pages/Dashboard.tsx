/**
 * @file src/pages/Dashboard.tsx
 * @description 这是一个仪表盘页面，用于展示欢迎信息、快捷操作、快速统计和最近的操作记录。
 * @modification 本次提交中所做的具体修改摘要。
 *   - [动画优化]：修改 `useEffect` 钩子的依赖数组为 `[]`。此举确保 `closePanel()` 只在组件首次挂载时执行一次，从而解决首次登录或导航到 Dashboard 页面时，搜索面板“弹出一个面板然后自动收起”的用户体验问题。
 *   - [组件写法现代化]：移除了 `export default function` 的写法，并为内部的 `StatCard` 组件和 `Dashboard` 组件本身采用了现代的、不使用 `React.FC` 的类型定义方式。
 *   - 1. **StatCard**: 为其 props 定义了独立的 `StatCardProps` 接口，并显式注解了 props 类型和 `: JSX.Element` 返回值类型。
 *   - 2. **Dashboard**: 将其改造为 `const Dashboard = (): JSX.Element => { ... }` 的形式，并添加了 `export default`。
 *   - [视觉简化]：移除了 `StatCard` 组件在悬浮（hover）时的动画效果（如阴影和位移），现在仅保留背景色变为灰色的效果，以简化交互。
 *   - [修复悬浮收缩问题]：针对 `StatCard` 组件，通过设置固定的 `height` 和 `minHeight`，确保卡片在悬浮时高度保持不变，彻底解决用户反馈的悬浮时卡片收缩问题。
 *   - [修复内容下移问题]：为 `StatCard` 组件的 `ButtonBase` 实例添加 `disableRipple` 属性。此举旨在禁用 Material-UI 按钮默认的涟漪（ripple）效果，该效果有时会引入微小的 `transform` 或 `position` 变化，从而导致内容在鼠标悬浮和移开时出现不必要的视觉抖动或下移。
 *   - [视觉调整]：将 `StatCard` 组件的固定高度从 `120px` 调整为 `100px`，以使按钮视觉上更小巧。
 *   - [新增客户存储用量排行]：在“快速统计信息”下方新增了一个“客户存储空间用量排行”区域。该区域展示了至多十个客户的存储空间使用情况，并按照使用百分比从高到低排序，每个客户的用量通过 `ListItem` 和 `LinearProgress` 直观呈现，便于快速识别存储高占用客户。
 *   - [移除整体存储用量]：根据用户反馈，移除了之前添加的“整体存储空间用量”展示区域，仅保留按客户分类的存储用量排行。
 */
import React, {useEffect, type JSX, type ReactNode} from 'react';
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
    LinearProgress,
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
        // 当 onClick 存在时，使用 ButtonBase 并禁用涟漪效果，以避免内容抖动
        component={onClick ? ButtonBase : 'div'}
        {...(onClick && {disableRipple: true})} // 有条件地应用 disableRipple 属性
        onClick={onClick}
        variant="outlined"
        sx={{
            minHeight: 100, // 设置最小高度以确保内容完整显示
            height: 100,    // 设置固定高度为 100px，使按钮更小巧
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            textAlign: 'initial',
            '&:hover': {
                // 悬浮时仅改变背景色为灰色（action.hover），移除了动画效果
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

// 模拟多个客户的存储空间用量数据
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
    {id: 'c11', clientName: '客户K', total: '600GB', used: '30GB', percentage: 5}, // 超过10个，用于测试切片
    {id: 'c12', clientName: '客户L', total: '400GB', used: '0GB', percentage: 0},
];


// 使用现代写法定义 Dashboard 组件
const Dashboard = (): JSX.Element => {
    const nickname = 'chiangho';
    const navigate = useNavigate();
    const {closePanel} = useLayoutDispatch();

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

    // 确保搜索面板在 Dashboard 页面首次加载时自动关闭，避免不必要的弹出动画。
    useEffect(() => {
        closePanel();
    }, []); // 仅在组件首次挂载时运行一次

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
            onClick: () => navigate('/app/servers'),
            icon: <DnsIcon color="primary" sx={{fontSize: 40, transform: 'translateY(4px)'}}/>,
            title: "服务器总数",
            value: "102"
        },
        {
            key: 'changelog',
            onClick: () => navigate('/app/changelog'),
            icon: <UpdateIcon color="secondary" sx={{fontSize: 40, transform: 'translateY(4px)'}}/>,
            title: "本周更新",
            value: "12次"
        },
        {
            key: 'tickets',
            onClick: () => navigate('/app/tickets'),
            icon: <AssignmentTurnedInIcon color="error" sx={{fontSize: 40, transform: 'translateY(4px)'}}/>,
            title: "待处理工单",
            value: "3个"
        },
    ];

    // 根据使用百分比确定进度条颜色
    const getStorageProgressColor = (percentage: number) => {
        if (percentage > 85) return 'error'; // 超过85%为红色警告
        if (percentage > 70) return 'warning'; // 超过70%为黄色警告
        return 'primary'; // 否则为蓝色正常
    };

    // 对客户存储用量数据进行排序（从高到低）并截取前10个
    const sortedClientStorageUsage = [...mockClientStorageUsage]
        .sort((a, b) => b.percentage - a.percentage)
        .slice(0, 10);

    // 用于快速操作按钮组和布局变化的动画过渡
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
                        <Typography variant="h5" sx={{color: 'primary.main', fontSize: '2rem'}}>运维信息表</Typography>
                        <Typography variant="h6" color="text.secondary" sx={{fontSize: '1.5rem'}}>
                            欢迎回来，{nickname}！接下来想做些什么？
                        </Typography>
                    </Stack>
                </Box>

                {/* 主体内容 */}
                <Stack direction={{xs: 'column', md: 'row'}} spacing={{xs: 4, md: 6}}>
                    {/* 左栏 */}
                    <Box sx={{width: {xs: '100%', md: '50%'}}}>
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
                                        {
                                            key: 'new-changelog',
                                            text: '新建更新记录',
                                            icon: <RestorePageIcon/>,
                                            to: '/app/changelog'
                                        },
                                        {
                                            key: 'new-ticket',
                                            text: '生成工单',
                                            icon: <AssignmentIcon/>,
                                            to: '/app/tickets'
                                        },
                                        {
                                            key: 'new-inspection-backup',
                                            text: '新建巡检备份任务',
                                            icon: <PlaylistAddCheckCircleIcon/>,
                                            to: '/app/inspection-backup'
                                        },
                                        {
                                            key: 'view-stats',
                                            text: '查看统计信息',
                                            icon: <PollRoundedIcon/>,
                                            to: '/app/stats'
                                        },
                                        {
                                            key: 'view-servers',
                                            text: '查看服务器信息',
                                            icon: <DnsIcon/>,
                                            to: '/app/servers'
                                        }
                                    ].map(({key, text, icon, to}) => (
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
                                                sx={{...quickBtnSX, width: '100%'}}
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
                                            transition={motionTransition} // 此过渡用于父级 div 的布局变化
                                            style={{flex: '1 1 160px', minWidth: 160}}
                                        >
                                            <StatCard onClick={card.onClick} icon={card.icon} title={card.title}
                                                      value={card.value}/>
                                        </motion.div>
                                    ))}
                                </motion.div>
                            </Box>

                            {/* 客户存储空间用量排行区域 */}
                            <Box>
                                <Typography variant="h6" mb={2}>客户存储空间用量排行 (Top 10)</Typography>
                                <Card variant="outlined">
                                    <List sx={{padding: 0}}>
                                        {sortedClientStorageUsage.map((client, index) => (
                                            <React.Fragment key={client.id}>
                                                <ListItem disablePadding>
                                                    <ListItemButton onClick={() => navigate(`/app/clients/${client.id}/storage`)}>
                                                        <ListItemText
                                                            primary={client.clientName}
                                                            secondary={`已用 ${client.used} / 总计 ${client.total}`}
                                                            secondaryTypographyProps={{
                                                                noWrap: true,
                                                                textOverflow: 'ellipsis',
                                                            }}
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

                    {/* 右栏 */}
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
                                                    <Typography variant="caption" color="text.secondary"
                                                                sx={{pr: 2}}>{activity.time}</Typography>
                                                }
                                            >
                                                <ListItemButton
                                                    onClick={() => navigate(`/app/changelog/${activity.id}`)}>
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