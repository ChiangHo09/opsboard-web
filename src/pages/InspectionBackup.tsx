/*
 * [文件用途说明]
 * - 此文件是“巡检备份”的占位页面。
 * - 它是基于通用页面模板创建的，旨在提供一个功能齐全的页面起点，包括与右侧搜索面板的交互逻辑。
 *
 * [本次修改记录]
 * - 新建文件，作为“巡检备份”功能的主页面。
 * - 【新增】在组件挂载时设置 `isPanelRelevant` 为 `true`，在卸载时设置为 `false`，并清理面板状态。
 */
import React, { useEffect, useCallback } from 'react';
import { Box, Typography, Button, TextField, Stack } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useLayout } from '../contexts/LayoutContext.tsx';

// 定义一个简单的搜索表单组件
const InspectionSearchForm: React.FC<{ onSearch: (v: string) => void }> = ({ onSearch }) => {
    const [searchTerm, setSearchTerm] = React.useState('');
    return (
        <Stack spacing={2} sx={{ width: '100%' }}>
            <TextField
                fullWidth
                margin="normal"
                label="按设备或日期搜索..."
                variant="outlined"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Box sx={{ flexGrow: 1 }} />
            <Button variant="contained" onClick={() => onSearch(searchTerm)} size="large">
                搜索记录
            </Button>
        </Stack>
    );
};

const InspectionBackup: React.FC = () => {
    const { togglePanel, setPanelContent, setPanelTitle, setPanelWidth, setIsPanelRelevant } = useLayout(); // 获取所有相关方法

    const handleSearch = useCallback((searchTerm: string) => {
        console.log('在巡检备份页面执行搜索:', searchTerm);
        alert(`搜索: ${searchTerm}`);
        togglePanel();
    }, [togglePanel]);

    useEffect(() => {
        setPanelContent(<InspectionSearchForm onSearch={handleSearch} />);
        setPanelTitle('巡检记录搜索');
        setPanelWidth(360); // 确保设置宽度
        setIsPanelRelevant(true); // 【新增】标记此页面与面板相关

        return () => {
            setPanelContent(null);
            setPanelTitle('');
            setPanelWidth(360); // 恢复默认宽度
            setIsPanelRelevant(false); // 【新增】标记此页面与面板不相关
        };
    }, [setPanelContent, setPanelTitle, setPanelWidth, setIsPanelRelevant, handleSearch]); // 依赖项

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
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
                    <Typography variant="h4">巡检备份</Typography>
                    <Button
                        variant="contained"
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
                <Box sx={{ mt: 2, p: 2, border: '1px dashed grey', flexGrow: 1, overflowY: 'auto' }}>
                    <Typography>这里将用于展示巡检任务和备份记录。</Typography>
                </Box>
            </Box>
        </Box>
    );
};

export default InspectionBackup;