/*
 * [文件用途说明]
 * - 此文件是一个通用的页面模板，旨在为新页面提供一个包含标准布局、响应式设计以及右侧搜索面板集成逻辑的起点。
 * - 开发者可以复制此文件，重命名后仅需修改少量占位内容（如标题、搜索表单字段、搜索逻辑）即可快速创建一个功能完备的新页面。
 *
 * [本次修改记录]
 * - 导入了 `useEffect`, `useCallback`, `useLayout` 及 MUI 的 `Button`, `SearchIcon`, `TextField` 组件。
 * - 在页面标题旁边添加了一个“搜索”按钮，并将其 `onClick` 事件绑定到从 `useLayout` 中获取的 `togglePanel` 方法。
 * - 添加了 `useEffect` 钩子，用于在组件加载时设置右侧搜索面板的内容（一个示例表单）和行为（搜索/重置处理函数）。
 * - 实现了 `handleSearch` 和 `handleReset` 回调函数作为搜索逻辑的占位符，新页面可直接在此基础上进行修改。
 * - 更新了文件顶部的文档注释，以反映其作为更完整模板的功能。
 */
import React, { useEffect, useCallback } from 'react';
import { Box, Typography, Button, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useLayout } from '../contexts/LayoutContext.tsx';

// 为搜索表单定义一个通用类型，新页面可以根据需要进行替换
type TemplateSearchForm = Record<string, unknown>;

/**
 * 通用页面模板组件。
 *
 * 该模板旨在为应用程序中的新页面提供一致的布局和样式。
 * 它已内置了与右侧搜索面板交互的完整逻辑。
 *
 * 使用方法：
 * 1. 将此文件重命名为您的页面名称 (例如 UserManagement.tsx)。
 * 2. 修改页面标题、正文内容。
 * 3. 在 useEffect 中，修改 panelInnerContent 以构建您需要的搜索表单。
 * 4. 在 handleSearch 和 handleReset 函数中，实现您自己的搜索和重置逻辑。
 */
const TemplatePage: React.FC = () => {
    // 1. 从 useLayout 获取控制面板所需的方法
    const { togglePanel, setPanelContent, setPanelActions } = useLayout();

    // 2. 定义页面特定的搜索处理函数（占位逻辑）
    const handleSearch = useCallback((values: TemplateSearchForm) => {
        console.log('在 TemplatePage 页面执行搜索:', values);
        alert(`搜索: ${JSON.stringify(values)}`);
        // TODO: 在这里替换为实际的搜索逻辑，例如调用 API
    }, []);

    // 3. 定义页面特定的重置处理函数（占位逻辑）
    const handleReset = useCallback(() => {
        alert('重置表单');
        // TODO: 在这里替换为实际的重置逻辑
    }, []);

    // 4. 使用 useEffect 设置面板内容和动作
    useEffect(() => {
        // 定义右侧搜索面板的表单内容
        const panelInnerContent = (
            <React.Fragment>
                <TextField fullWidth margin="normal" label="搜索字段一" variant="outlined" />
                <TextField fullWidth margin="normal" label="搜索字段二" variant="outlined" />
                <Typography variant="caption" color="textSecondary">
                    这是一个示例搜索表单，请在新页面中替换为您需要的字段。
                </Typography>
            </React.Fragment>
        );

        // 设置面板内容
        setPanelContent(panelInnerContent);

        // 设置面板动作（处理函数、标题等）
        setPanelActions({
            onSearch: handleSearch,
            onReset: handleReset,
            title: '模板搜索',
            showActionBar: true,
        });

        // 组件卸载时，清理面板内容和动作
        return () => {
            setPanelContent(null);
            setPanelActions({});
        };
    }, [setPanelContent, setPanelActions, handleSearch, handleReset]);


    return (
        // 外层 Box: 负责填充可用空间
        <Box sx={{
            width: '100%',
            height: '100%',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column'
        }}>
            {/* 内层 Box: 负责内容的响应式布局和内外边距 */}
            <Box sx={{
                width: { xs: '90%', md: '80%' },
                maxWidth: 1280,
                mx: 'auto',
                py: 4,
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column'
            }}>
                {/* 页面头部：标题和操作按钮 */}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
                    <Typography variant="h4">模板页面 (Template Page)</Typography>
                    {/* 5. 添加搜索按钮，点击时打开/关闭面板 */}
                    <Button
                        variant="contained"
                        startIcon={<SearchIcon />}
                        onClick={togglePanel}
                    >
                        搜索
                    </Button>
                </Box>

                {/* 页面正文内容 */}
                <Typography sx={{ mt: 2, flexShrink: 0 }}>
                    这是一个根据其他页面样式生成的通用模板。
                </Typography>
                <Typography sx={{ mt: 1, flexShrink: 0 }}>
                    在这里编写您的页面内容。例如：
                </Typography>
                <Box sx={{ mt: 2, p: 2, border: '1px dashed grey', flexGrow: 1, overflowY: 'auto' }}>
                    <Typography>您的实际内容会在这里渲染。</Typography>
                    <Typography>您可以添加表格、表单、图表或其他组件。</Typography>
                    <Typography>此区域将自动获得响应式左右留白和内部上下边距。</Typography>
                </Box>
            </Box>
        </Box>
    );
};

export default TemplatePage;