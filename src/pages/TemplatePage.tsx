import React from 'react';
import { Box, Typography } from '@mui/material';

/**
 * 通用页面模板组件。
 *
 * 该模板旨在为应用程序中的新页面提供一致的布局和样式。
 * 它继承了以下关键样式：
 * 1. 页面整体在 MainLayout 中的固定内边距 (p:3)。
 * 2. 内容区域在浏览器尺寸收窄时左右留白随之收窄，
 *    默认左右各 10% 留白，最低收窄到各 5% 留白（通过响应式宽度和 mx:'auto' 实现）。
 * 3. 内容区域内部的顶部和底部有固定的内边距 (py:4)，提供视觉上的“呼吸空间”。
 *
 * 使用方法：
 * 将此文件重命名为您的页面名称 (例如 UserList.tsx)，
 * 并替换 <Typography> 标签内的占位内容为您的实际页面 UI。
 */
const TemplatePage: React.FC = () => {
    return (
        // 外层 Box:
        // 负责页面的整体布局和与 MainLayout 容器之间的固定内边距。
        // 它确保无论内部内容如何，页面视图本身都占满可用空间并具有统一的外边距。
        <Box sx={{
            width: '100%', // 确保 Box 占据其父容器（MainLayout 的 MotionBox）的全部宽度。
            height: '100%', // 确保 Box 占据其父容器的全部高度，以便内部内容可以伸展或滚动。
            p: 3, // 固定内边距：在所有四个方向（上、下、左、右）都应用 3 个 MUI 主题单位（默认 3*8=24px）的内边距。
                  // 这是页面与应用主内容面板边缘的间距。
            boxSizing: 'border-box', // 盒模型设置：确保 padding 和 border 包含在元素的总宽度和高度内。
            display: 'flex', // 启用 Flexbox 布局：允许其子元素进行灵活排列。
            flexDirection: 'column' // Flex 方向：使子元素垂直堆叠。
        }}>
            {/* 内层 Box:
                负责页面内容的实际显示区域。
                它实现了响应式的左右留白和内部上下边距，确保内容在不同屏幕尺寸下都能居中且有良好间距。 */}
            <Box sx={{
                // 响应式宽度：
                // 定义内容区域的宽度相对于其父容器的百分比，以此创建左右留白。
                // xs: '90%' -> 在超小屏幕 (viewport width < 600px) 及以上，内容宽度为父容器的 90%，左右各留 5% 留白。
                // md: '80%' -> 在中等屏幕 (viewport width >= 900px) 及以上，内容宽度为父容器的 80%，左右各留 10% 留白。
                width: { xs: '90%', md: '80%' },
                maxWidth: 1280, // 最大宽度限制：无论屏幕多宽，内容区域的最大宽度都不会超过 1280px。
                                // 这在超宽屏幕上尤为重要，可以防止文本行过长，提高可读性。
                mx: 'auto', // 自动水平外边距：将此 Box 在水平方向上居中对齐，并将其父容器剩余的水平空间等分给左右外边距。
                            // 这是实现响应式左右留白的关键机制。
                py: 4, // 垂直内边距：在内容区域的顶部和底部应用 4 个 MUI 主题单位（默认 4*8=32px）的内边距。
                       // 这为实际内容提供上下方“呼吸空间”，优化视觉效果。
                flexGrow: 1, // Flex 增长：允许此 Box 垂直方向上增长，以填充其父容器中所有可用的剩余空间。
                             // 确保即使内容较少，此内容区域也能撑满高度。
                display: 'flex', // 启用 Flexbox 布局：允许此 Box 内部的子元素（如 Typography）进行灵活排列。
                flexDirection: 'column' // Flex 方向：使此 Box 内部的子元素垂直堆叠。
            }}>
                {/* 页面内容从这里开始 */}
                <Typography variant="h4">模板页面 (Template Page)</Typography>
                <Typography sx={{ mt: 2 }}>
                    这是一个根据其他页面样式生成的通用模板。
                </Typography>
                <Typography sx={{ mt: 1 }}>
                    在这里编写您的页面内容。例如：
                </Typography>
                {/* 示例内容 */}
                <Box sx={{ mt: 2, p: 2, border: '1px dashed grey', flexGrow: 1 }}>
                    <Typography>您的实际内容会在这里渲染。</Typography>
                    <Typography>您可以添加表格、表单、图表或其他组件。</Typography>
                    <Typography>此区域将自动获得响应式左右留白和内部上下边距。</Typography>
                </Box>
                {/* 页面内容到这里结束 */}
            </Box>
        </Box>
    );
};

export default TemplatePage;
