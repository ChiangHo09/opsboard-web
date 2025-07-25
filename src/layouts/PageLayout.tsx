/**
 * 文件名: src/layouts/PageLayout.tsx
 *
 * 代码功能:
 * 此文件定义了一个可重用的 `PageLayout` 组件，用于统一所有标准内容页面的
 * 基础布局和样式。它封装了响应式的宽度、最大宽度、居中对齐和垂直内边距的逻辑。
 *
 * 本次修改内容:
 * - 【结构性重构】简化了组件的职责。
 * - **解决方案**:
 *   1.  移除了 `display: 'flex'`, `flexDirection: 'column'`, 和 `flex: '1 1 auto'` 样式。
 *   2.  这些关于“如何填充父容器”的布局职责现在完全由 `MainLayout.tsx` 中的动画容器 `<MotionBox>` 来承担。
 * - **最终效果**: `PageLayout` 的职责更加单一和清晰，它只负责“约束内容宽度并提供内边距”，不再关心外部的 flex 布局，这使得整体结构更具可维护性。
 */
import React from 'react';
import { Box, type BoxProps } from '@mui/material';

interface PageLayoutProps extends BoxProps {
    children: React.ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = ({ children, sx, ...rest }) => {
    return (
        <Box
            sx={{
                width: '80%',
                maxWidth: {
                    md: 1280,
                    lg: 1440,
                    xl: 1600,
                },
                mx: 'auto',
                py: 4,
                // 【核心修复】移除了 flex 相关属性，因为父级动画容器现在负责此项工作。
                // 这使得 PageLayout 的职责更纯粹：只负责内容区的宽度约束和内边距。
                ...sx
            }}
            {...rest}
        >
            {children}
        </Box>
    );
};

export default PageLayout;