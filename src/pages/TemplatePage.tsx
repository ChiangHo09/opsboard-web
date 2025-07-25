/**
 * 文件名: src/pages/TemplatePage.tsx
 *
 * 文件功能描述:
 * 此文件定义了一个【模板页面】组件（TemplatePage）。它展示了如何以最佳实践的方式集成右侧搜索面板和全局模态框（弹窗），
 * 并遵循了“路由驱动状态”和“按需加载”的设计模式。此文件可以作为创建新页面的基础模板。
 *
 * 本次修改内容:
 * - 【跳转逻辑修复】配合 MainLayout 的新逻辑，修改了本页面的副作用清理函数。
 * - **解决方案**:
 *   1.  `useEffect` 的清理函数 (return) 现在不再负责清空面板内容（`setPanelContent(null)`）和标题（`setPanelTitle('')`）。
 *   2.  它的唯一职责是在组件卸载时，将 `isPanelRelevant` 标志设置为 `false`。
 * - **最终效果**:
 *   此页面不再“擅自”关闭面板。它只是向布局系统报告自己的状态，而关闭面板的最终决策由 `MainLayout` 根据新页面的特性来智能决定，从而实现了无缝的跨页跳转体验。
 */

import React, { useEffect, useCallback, useState, lazy, Suspense } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Typography, Button, Stack, CircularProgress } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useLayoutDispatch, useLayoutState } from '../contexts/LayoutContext.tsx';
import PageLayout from '../layouts/PageLayout.tsx';
import { type TemplateSearchValues } from '../components/forms/TemplateSearchForm.tsx';

// 【核心优化】使用 React.lazy 动态导入组件
const TemplateSearchForm = lazy(() => import('../components/forms/TemplateSearchForm.tsx'));
const TemplateModalContent = lazy(() => import('../components/modals/TemplateModalContent.tsx'));


const TemplatePage: React.FC = () => {
    // --- 1. HOOKS INITIALIZATION ---
    const {
        togglePanel, setPanelContent, setPanelTitle, setPanelWidth,
        setIsPanelRelevant, setIsModalOpen, setModalConfig,
    } = useLayoutDispatch();
    const { isMobile } = useLayoutState();
    const navigate = useNavigate();
    const { itemId } = useParams<{ itemId: string }>();

    // 为懒加载面板引入状态
    const [isPanelContentSet, setIsPanelContentSet] = useState(false);

    // --- 2. CALLBACKS & EVENT HANDLERS ---
    const handleSearch = useCallback((values: TemplateSearchValues) => {
        console.log('在 TemplatePage 页面接收到搜索条件:', values);
        alert(`搜索: ${JSON.stringify(values)}`);
        togglePanel();
    }, [togglePanel]);

    const handleReset = useCallback(() => {
        console.log('TemplatePage 感知到表单已重置');
        alert('表单已重置');
    }, []);

    const handleTogglePanel = () => {
        if (!isPanelContentSet) {
            setIsPanelContentSet(true);
        }
        togglePanel();
    };

    // --- 3. SIDE EFFECTS MANAGEMENT (useEffect) ---
    useEffect(() => {
        const itemExists = !!itemId;
        if (itemExists && !isMobile) {
            setModalConfig({
                content: (
                    <Suspense fallback={<Box sx={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><CircularProgress /></Box>}>
                        <TemplateModalContent id={itemId} />
                    </Suspense>
                ),
                onClose: () => navigate('/app/template-page', { replace: true }),
            });
            setIsModalOpen(true);
        } else {
            setIsModalOpen(false);
            setModalConfig({ content: null, onClose: null });
        }
    }, [itemId, isMobile, navigate, setIsModalOpen, setModalConfig]);

    useEffect(() => {
        if (!isPanelContentSet) return;

        const timerId = setTimeout(() => {
            setPanelContent(
                <Suspense fallback={<Box sx={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><CircularProgress /></Box>}>
                    <TemplateSearchForm onSearch={handleSearch} onReset={handleReset} />
                </Suspense>
            );
            setPanelTitle('模板搜索');
            setPanelWidth(360);
            setIsPanelRelevant(true);
        }, 0);

        // 【核心修复】修改清理函数
        return () => {
            clearTimeout(timerId);
            // 在组件卸载时，不再清空面板内容，只标记为“不相关”
            setIsPanelRelevant(false);
        };
    }, [isPanelContentSet, setPanelContent, setPanelTitle, setPanelWidth, setIsPanelRelevant, handleSearch, handleReset]);

    // --- 4. JSX RENDER ---
    return (
        <PageLayout>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
                <Typography variant="h4">模板页面 (Template Page)</Typography>
                <Button
                    variant="contained"
                    startIcon={<SearchIcon />}
                    onClick={handleTogglePanel}
                    sx={{
                        height: '42px', borderRadius: '50px', bgcolor: 'app.button.background',
                        color: 'neutral.main', boxShadow: 'none', textTransform: 'none',
                        fontSize: '15px', fontWeight: 500, px: 3,
                        '&:hover': { bgcolor: 'app.button.hover', boxShadow: 'none' },
                    }}
                >
                    <Typography component="span" sx={{ transform: 'translateY(1px)' }}>
                        搜索
                    </Typography>
                </Button>
            </Box>

            <Stack spacing={1} sx={{ mt: 2 }}>
                <Typography>这是一个根据其他页面样式生成的通用模板。</Typography>
                <Typography>在这里编写您的页面内容。例如：</Typography>
            </Stack>

            <Box sx={{ mt: 2, p: 2, border: '1px dashed grey', minHeight: '300px' }}>
                <Typography>您的实际内容会在这里渲染。</Typography>
                <Button
                    variant="outlined"
                    sx={{ mt: 2 }}
                    onClick={() => {
                        navigate('/app/template-page/template-123', { replace: true });
                    }}
                >
                    打开弹窗 (ID: template-123)
                </Button>
            </Box>
        </PageLayout>
    );
};

export default TemplatePage;