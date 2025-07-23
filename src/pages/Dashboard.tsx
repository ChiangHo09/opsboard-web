/**
 * 文件名: src/pages/Dashboard.tsx
 *
 * 本次修改内容:
 * - 【布局修复】优化了“快速统计信息”卡片组的布局逻辑。
 * - **替换 Stack 为 Box**:
 *   - 将用于包裹三个统计卡片的 `<Stack>` 组件替换为一个配置了 `display: 'flex'` 的 `<Box>` 组件。
 * - **启用 Flexbox 换行**:
 *   - 在新的 `<Box>` 容器上使用 `flexWrap: 'wrap'` 属性，允许卡片在空间不足时自动换行。
 * - **实现均匀间距**:
 *   - 使用 `gap` 属性来为卡片之间创建统一且可靠的间距，解决了等距问题。
 * - **实现单项拉伸**:
 *   - 为每个卡片的包装器 `<Box>` 设置了 `flex: '1 1 160px'`。
 *   - 这确保了当卡片组换行且最后一行只有一个卡片时，该卡片会自动利用 `flex-grow: 1` 的特性，伸展以填满整个可用宽度，完全符合要求。
 *
 * 文件功能描述:
 * 此文件定义了应用的仪表盘（Dashboard）页面，现在它采用了更宽敞、更均衡、视觉对齐、
 * 且在所有屏幕尺寸下都表现完美的响应式两栏布局，并带有一个粘性页眉。
 */
import React, { useEffect } from 'react';
import { Box, Typography, Button, Stack, Card, CardContent, List, ListItem, ListItemText, Divider, ButtonBase } from '@mui/material';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import StorageIcon from '@mui/icons-material/Storage';
import DnsIcon from '@mui/icons-material/Dns';
import UpdateIcon from '@mui/icons-material/Update';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import { useNavigate } from 'react-router-dom';
import type { JSX } from 'react';
import { useLayout } from '../contexts/LayoutContext.tsx';
import PageLayout from '../layouts/PageLayout';

const recentActivities = [ { id: 'log001', customer: '客户a', action: '新增了用户导出功能...', time: '2小时前' }, { id: 'log002', customer: '客户b', action: '修复了一个潜在的XSS漏洞。', time: '昨天' }, { id: 'log003', customer: '客户a', action: '优化了数据查询逻辑，首页加载速度提升 30%。', time: '3天前' }, { id: 'log004', customer: '客户c', action: '常规维护，更新了服务器操作系统补丁。', time: '3天前' }, ];

const StatCard = ({ icon, title, value, onClick }: { icon: JSX.Element, title: string, value: string, onClick?: () => void }) => (
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
                    <Typography color="text.secondary">{title}</Typography>
                </Box>
            </Box>
        </CardContent>
    </Card>
);

export default function Dashboard() {
    const nickname = 'chiangho';
    const navigate = useNavigate();
    const { setIsPanelRelevant } = useLayout();

    const quickBtnSX = { height: 44, minWidth: 160, px: 4, borderRadius: 30, bgcolor: 'app.button.background', color: 'neutral.main', boxShadow: 0, textTransform: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', columnGap: 1.5, '&:hover': { bgcolor: 'app.button.hover', boxShadow: 0 }, '& .MuiButton-startIcon': { margin: 0, display: 'inline-flex', alignItems: 'center' }, } as const;

    useEffect(() => {
        setIsPanelRelevant(false);
        return () => { setIsPanelRelevant(false); };
    }, [setIsPanelRelevant]);

    const label = (icon: JSX.Element, text: string) => ( <>{icon}<Typography component="span" variant="button" sx={{ lineHeight: 1, transform: 'translateY(1px)', fontWeight: 500 }}>{text}</Typography></> );

    return (
        <PageLayout sx={{ display: 'flex', flexDirection: 'column', height: '100%', py: 0 }}>
            <Box sx={{ pt: 4, pb: 2, flexShrink: 0 }}>
                <Stack spacing={1}>
                    <Typography variant="h5" sx={{ color: 'primary.main', fontSize: '2rem' }}>运维信息表</Typography>
                    <Typography variant="h6" color="text.secondary" sx={{ fontSize: '1.5rem' }}>欢迎回来，{nickname}！接下来想做些什么？</Typography>
                </Stack>
            </Box>

            <Box sx={{ flexGrow: 1, overflowY: 'auto', pb: 4 }}>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={{ xs: 4, md: 6 }}>
                    {/* 左栏 */}
                    <Box sx={{ width: { xs: '100%', md: '50%' } }}>
                        <Stack spacing={4}>
                            <Box>
                                <Typography variant="h6" mb={2}>快捷操作</Typography>
                                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                    <Button variant="contained" sx={quickBtnSX} onClick={() => navigate('/app/changelog')} startIcon={<NoteAddIcon />} > {label(<></>, '新建更新记录')} </Button>
                                    <Button variant="contained" sx={quickBtnSX} onClick={() => navigate('/app/tickets')} startIcon={<ReceiptLongIcon />} > {label(<></>, '生成工单')} </Button>
                                    <Button variant="contained" sx={quickBtnSX} onClick={() => navigate('/app/servers')} startIcon={<StorageIcon />} > {label(<></>, '查看服务器信息')} </Button>
                                </Box>
                            </Box>
                            <Box>
                                <Typography variant="h6" mb={2}>快速统计信息</Typography>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                                    <Box sx={{ flex: '1 1 160px' }}>
                                        <StatCard onClick={() => navigate('/app/servers')} icon={<DnsIcon color="primary" sx={{ fontSize: 40, transform: 'translateY(4px)' }} />} title="服务器总数" value="102" />
                                    </Box>
                                    <Box sx={{ flex: '1 1 160px' }}>
                                        <StatCard onClick={() => navigate('/app/changelog')} icon={<UpdateIcon color="secondary" sx={{ fontSize: 40, transform: 'translateY(4px)' }} />} title="本周更新" value="12次" />
                                    </Box>
                                    <Box sx={{ flex: '1 1 160px' }}>
                                        <StatCard onClick={() => navigate('/app/tickets')} icon={<AssignmentTurnedInIcon color="error" sx={{ fontSize: 40, transform: 'translateY(4px)' }} />} title="待处理工单" value="3个" />
                                    </Box>
                                </Box>
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
                                            <ListItem button onClick={() => navigate(`/app/changelog/${activity.id}`)} secondaryAction={<Typography variant="caption" color="text.secondary">{activity.time}</Typography>}>
                                                <ListItemText primary={activity.customer} secondary={activity.action} secondaryTypographyProps={{ noWrap: true, textOverflow: 'ellipsis' }} />
                                            </ListItem>
                                            {index < recentActivities.length - 1 && <Divider component="li" />}
                                        </React.Fragment>
                                    ))}
                                </List>
                            </Card>
                        </Box>
                    </Box>
                </Stack>
            </Box>
        </PageLayout>
    );
}