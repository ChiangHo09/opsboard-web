/**
 * 文件名：TemplatePage.tsx
 * 描述：此文件定义了一个【模板页面】组件（TemplatePage）。
 *
 * 本次修改：
 * - 将页面右上角“搜索”按钮的背景色和悬停色指向了新的、语义更清晰的 `app.button.background` 和 `app.button.hover` 主题颜色。
 */
import { useEffect, useCallback, type FC } from 'react';
import { Box, Typography, Button, Stack } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

import { useLayout } from '../contexts/LayoutContext.tsx';
import TemplateSearchForm, { type TemplateSearchValues } from '../components/forms/TemplateSearchForm.tsx';

const TemplatePage: FC = () => {
    const { togglePanel, setPanelContent, setPanelTitle, setPanelWidth, setIsPanelRelevant } = useLayout();

    const handleSearch = useCallback((values: TemplateSearchValues) => {
        console.log('在 TemplatePage 页面接收到搜索条件:', values);
        alert(`搜索: ${JSON.stringify(values)}`);
        togglePanel();
    }, [togglePanel]);

    const handleReset = useCallback(() => {
        console.log('TemplatePage 感知到表单已重置');
        alert('表单已重置');
    }, []);

    useEffect(() => {
        setPanelContent(
            <TemplateSearchForm onSearch={handleSearch} onReset={handleReset} />
        );
        setPanelTitle('模板搜索');
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
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
                    <Typography variant="h4">模板页面 (Template Page)</Typography>
                    <Button
                        variant="contained"
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

                <Stack spacing={1} sx={{ mt: 2, flexShrink: 0 }}>
                    <Typography>
                        这是一个根据其他页面样式生成的通用模板。
                    </Typography>
                    <Typography>
                        在这里编写您的页面内容。例如：
                    </Typography>
                </Stack>

                <Box sx={{ mt: 2, p: 2, border: '1px dashed grey', flexGrow: 1, overflowY: 'auto' }}>
                    <Typography>您的实际内容会在这里渲染。</Typography>
                </Box>
            </Box>
        </Box>
    );
};

export default TemplatePage;