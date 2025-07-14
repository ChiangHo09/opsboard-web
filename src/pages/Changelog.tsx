/**
 * 文件功能：
 * 此文件定义了应用的“更新日志”页面。
 *
 * 本次修改：
 * - 集成了右侧搜索面板功能，允许用户通过地区、服务器和时间进行搜索。
 * - 页面加载时，通过 `useEffect` 将独立的 `ChangelogSearchForm` 组件注入到右侧面板。
 * - 定义了 `handleSearch` 和 `handleReset` 回调函数，用于处理从搜索表单传回的事件。
 * - 更新了页面的标题布局，使其与其他页面（如“服务器信息”）的风格保持一致。
 */
import React, { useEffect, useCallback } from 'react';
import { Box, Typography, Button } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useLayout } from '../contexts/LayoutContext.tsx';
import ChangelogSearchForm, { type ChangelogSearchValues } from '../components/forms/ChangelogSearchForm.tsx';

const Changelog: React.FC = () => {
    const { togglePanel, setPanelContent, setPanelTitle, setPanelWidth } = useLayout();

    const handleSearch = useCallback((values: ChangelogSearchValues) => {
        // 在实际应用中，这里会根据 values 对象构建 API 请求
        console.log('在 Changelog 页面接收到搜索条件:', values);
        // 将 Dayjs 对象格式化为字符串以便显示或发送到后端
        const searchInfo = {
            ...values,
            updateTime: values.updateTime ? values.updateTime.format('YYYY-MM-DD') : '未选择',
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

        return () => {
            setPanelContent(null);
        };
    }, [setPanelContent, setPanelTitle, setPanelWidth, handleSearch, handleReset]);

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
                        sx={{ color: '#1976d2', fontSize: '2rem' }}
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
                            bgcolor: '#F0F4F9',
                            color: '#424242',
                            boxShadow: 'none',
                            textTransform: 'none',
                            fontSize: '15px',
                            fontWeight: 500,
                            px: 3,
                            '&:hover': {
                                bgcolor: '#E1E5E9',
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