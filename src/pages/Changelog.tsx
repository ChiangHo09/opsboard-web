/**
 * 文件名：Changelog.tsx
 * 描述：此文件定义了应用的“更新日志”页面。
 *
 * 本次修改：
 * - 将页面右上角“搜索”按钮的背景色和悬停色指向了新的、语义更清晰的 `app.button.background` 和 `app.button.hover` 主题颜色。
 */
import React, { useEffect, useCallback } from 'react';
import { Box, Typography, Button } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useLayout } from '../contexts/LayoutContext.tsx';
import ChangelogSearchForm, { type ChangelogSearchValues } from '../components/forms/ChangelogSearchForm.tsx';

const Changelog: React.FC = () => {
    const { togglePanel, setPanelContent, setPanelTitle, setPanelWidth, setIsPanelRelevant } = useLayout();

    const handleSearch = useCallback((values: ChangelogSearchValues) => {
        console.log('在 Changelog 页面接收到搜索条件:', values);
        const searchInfo = {
            ...values,
            startTime: values.startTime ? values.startTime.format('YYYY-MM-DD') : '未选择',
            endTime: values.endTime ? values.endTime.format('YYYY-MM-DD') : '未选择',
        };
        alert(`搜索: ${JSON.stringify(searchInfo)}`);
        togglePanel();
    }, [togglePanel]);

    const handleReset = useCallback(() => {
        alert('重置表单');
    }, []);

    useEffect(() => {
        setPanelContent(<ChangelogSearchForm onSearch={handleSearch} onReset={handleReset} />);
        setPanelTitle('日志搜索');
        setPanelWidth(360);
        setIsPanelRelevant(true);

        return () => {
            setPanelContent(null);
            setPanelTitle('');
            setPanelWidth(360);
            setIsPanelRelevant(false);
        };
    }, [setPanelContent, setPanelTitle, setPanelWidth, setIsPanelRelevant, handleSearch, handleReset]);

    return (
        <Box sx={{ width: '100%', height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{
                width: { xs: '90%', md: '80%' },
                maxWidth: 1280,
                mx: 'auto',
                py: 4,
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column'
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, mb: 4 }}>
                    <Typography
                        variant="h5"
                        sx={{ color: 'primary.main', fontSize: '2rem' }}
                    >
                        更新日志
                    </Typography>
                    <Button
                        variant="contained"
                        size="large"
                        startIcon={<SearchIcon />}
                        onClick={togglePanel}
                        sx={{
                            height: '42px',
                            borderRadius: '50px',
                            bgcolor: 'app.button.background', // 使用新的按钮背景色
                            color: 'neutral.main',
                            boxShadow: 'none',
                            textTransform: 'none',
                            fontSize: '15px',
                            fontWeight: 500,
                            px: 3,
                            '&:hover': {
                                bgcolor: 'app.button.hover', // 使用新的按钮悬停色
                                boxShadow: 'none',
                            },
                        }}
                    >
                        <Typography component="span" sx={{ transform: 'translateY(1px)' }}>
                            搜索
                        </Typography>
                    </Button>
                </Box>
                <Typography sx={{ flexShrink: 0 }}>这里实现更新日志的记录/查询/生成工单</Typography>
                {/* 在这里放置您的更新日志列表等内容 */}
            </Box>
        </Box>
    );
};

export default Changelog;