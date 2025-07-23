/**
 * 文件名: src/pages/Dashboard.tsx
 *
 * 本次修改内容:
 * - 【布局统一】使用 `PageLayout` 组件来包裹页面内容，确保布局与其他页面完全一致。
 *
 * 文件功能描述:
 * 此文件定义了应用的仪表盘（Dashboard）页面。
 */
import { Box, Typography, Button, Stack } from '@mui/material';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import StorageIcon from '@mui/icons-material/Storage';
import { useNavigate } from 'react-router-dom';
import type { JSX } from 'react';
import { useEffect } from 'react';
import { useLayout } from '../contexts/LayoutContext.tsx';
import PageLayout from '../layouts/PageLayout';

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
        <PageLayout>
            <Stack spacing={1} mb={6}>
                <Typography variant="h5" sx={{ color: 'primary.main', fontSize: '2rem' }}>
                    运维信息表
                </Typography>
                <Typography variant="h6" color="text.secondary" sx={{ fontSize: '1.5rem' }}>
                    欢迎回来，{nickname}！接下来想做些什么？
                </Typography>
            </Stack>
            <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
                <Button variant="contained" sx={quickBtnSX} onClick={() => navigate('/app/changelog')} startIcon={<NoteAddIcon />}>
                    {label(<></>, '新建更新记录')}
                </Button>
                <Button variant="contained" sx={quickBtnSX} onClick={() => navigate('/app/tickets')} startIcon={<ReceiptLongIcon />}>
                    {label(<></>, '生成工单')}
                </Button>
                <Button variant="contained" sx={quickBtnSX} onClick={() => navigate('/app/servers')} startIcon={<StorageIcon />}>
                    {label(<></>, '查看服务器信息')}
                </Button>
            </Box>
        </PageLayout>
    );
}