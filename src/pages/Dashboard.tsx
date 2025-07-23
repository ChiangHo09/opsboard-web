/**
 * 文件名: src/pages/Dashboard.tsx
 *
 * 本次修改内容:
 * - 【视觉终极修复】采用 `transform: translateY` 的方式，精确地将卡片内的图标下移，
 *   实现了最终的视觉对齐效果，同时保持文本位置不变。
 * - **精确图标定位**:
 *   - 在调用 `StatCard` 组件时，直接为传递的 `icon` JSX 元素添加了
 *     `sx={{ transform: 'translateY(4px)' }}` 样式。
 *   - `transform` 属性会在不影响布局流的情况下对元素进行视觉平移，
 *     这确保了只有图标被下移，而文本和其他所有元素的位置都保持稳定。
 * - **恢复稳定布局**: `StatCard` 组件的内部结构恢复到之前使用 Flexbox 实现的、
 *   健壮的整体垂直居中布局，为图标的微调提供了稳定的基础。
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
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={{ xs: 4, md: 8 }}>
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
                                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
                                    <Box sx={{ flex: 1 }}>
                                        {/* 【核心修复】直接在图标上添加 transform 样式 */}
                                        <StatCard onClick={() => navigate('/app/servers')} icon={<DnsIcon color="primary" sx={{ fontSize: 40, transform: 'translateY(4px)' }} />} title="服务器总数" value="102" />
                                    </Box>
                                    <Box sx={{ flex: 1 }}>
                                        <StatCard onClick={() => navigate('/app/changelog')} icon={<UpdateIcon color="secondary" sx={{ fontSize: 40, transform: 'translateY(4px)' }} />} title="本周更新" value="12次" />
                                    </Box>
                                    <Box sx={{ flex: 1 }}>
                                        <StatCard onClick={() => navigate('/app/tickets')} icon={<AssignmentTurnedInIcon color="error" sx={{ fontSize: 40, transform: 'translateY(4px)' }} />} title="待处理工单" value="3个" />
                                    </Box>
                                </Stack>
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