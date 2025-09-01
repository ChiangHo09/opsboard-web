/**
 * @file src/pages/Dashboard.tsx
 * @description 这是一个仪表盘页面，用于展示欢迎信息、快捷操作、快速统计和最近的操作记录。
 * @modification 本次提交中所做的具体修改摘要。
 *   - [动画优化]：修改 `useEffect` 钩子的依赖数组为 `[]`。此举确保 `closePanel()` 只在组件首次挂载时执行一次，从而解决首次登录或导航到 Dashboard 页面时，搜索面板“弹出一个面板然后自动收起”的用户体验问题。
 *   - [组件写法现代化]：移除了 `export default function` 的写法，并为内部的 `StatCard` 组件和 `Dashboard` 组件本身采用了现代的、不使用 `React.FC` 的类型定义方式。
 *   - 1. **StatCard**: 为其 props 定义了独立的 `StatCardProps` 接口，并显式注解了 props 类型和 `: JSX.Element` 返回值类型。
 *   - 2. **Dashboard**: 将其改造为 `const Dashboard = (): JSX.Element => { ... }` 的形式，并添加了 `export default`。
 *   - [视觉简化]：移除了 `StatCard` 组件在悬浮（hover）时的动画效果（如阴影和位移），现在仅保留背景色变为灰色的效果，以简化交互。
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

// 使用现代写法定义 StatCard 组件
const StatCard = ({icon, title, value, onClick}: StatCardProps): JSX.Element => (
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
                // 根据用户要求，悬浮时仅改变背景色为灰色（action.hover），移除了动画效果
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

    // 【核心修改】将 useEffect 的依赖数组更改为 []
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
                                            transition={motionTransition}
                                            style={{flex: '1 1 160px', minWidth: 160}}
                                        >
                                            <StatCard onClick={card.onClick} icon={card.icon} title={card.title}
                                                      value={card.value}/>
                                        </motion.div>
                                    ))}
                                </motion.div>
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