/**
 * @file src/layouts/PageLayout.tsx
 * @description 定义了一个可重用的 `PageLayout` 组件，用于统一所有标准内容页面的基础布局和样式。
 * @modification
 *   - [UI/UX]：精确地增加了白色工作区内部的顶部内边距，为页面标题和顶部边缘提供了更多的呼吸空间，以匹配设计要求。
 *   - [解决方案]：将 `sx` 属性中的通用 `p` 分解为更具体的 `pt`（顶部）、`pb`（底部）和 `px`（水平方向），并为它们设置了更合理的默认值。这使得页面级组件可以精确地覆盖单个方向的内边距，而不会意外重置其他方向。
 *   - [UI/UX]：恢复并优化了桌面端视图的动态边距效果。
 *   - [移动端布局]：在 `xs` 断点，容器宽度保持 `100%`，实现边到边布局。
 */
import {type JSX} from 'react';
import {Box, type BoxProps} from '@mui/material';

type PageLayoutProps = BoxProps;

const PageLayout = ({sx, ...rest}: PageLayoutProps): JSX.Element => {
    return (
        <Box
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',

                // --- 动态宽度与最大宽度限制 ---
                width: {xs: '95%', md: '80%'}, // 移动端95%宽度，桌面端80%宽度以创建动态边距
                maxWidth: {md: 1280, lg: 1440, xl: 1600}, // 桌面端最大宽度限制
                mx: 'auto', // 始终水平居中

                // --- 默认的、可被覆盖的响应式内边距 ---
                pt: {xs: 4, md: 5}, // 顶部内边距
                pb: {xs: 2, md: 3}, // 底部内边距
                px: {xs: 2, md: 3}, // 水平内边距

                // --- 合并传入的 sx，允许覆盖以上所有默认值 ---
                ...sx
            }}
            {...rest}
        />
    );
};

export default PageLayout;