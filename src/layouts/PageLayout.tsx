/**
 * 文件名: src/layouts/PageLayout.tsx
 *
 * 本次修改内容:
 * - 【高分辨率终极修复】采用响应式的 `maxWidth` 属性，彻底解决了在超宽屏幕上左右留白过大的问题。
 * - **将 `maxWidth` 修改为响应式对象**:
 *   - 在中等屏幕 (`md`) 上，最大宽度为 1280px。
 *   - 在大屏幕 (`lg`) 上，最大宽度增加到 1440px。
 *   - 在超大屏幕 (`xl`) 上，最大宽度进一步增加到 1600px。
 * - **简化 `width` 属性**: 将 `width` 统一为 `90%`，让 `maxWidth` 成为控制大屏幕布局的主要因素。
 * - 这个方案确保了在从小屏幕到超宽屏的各种设备上，都能获得和谐、美观的左右留白。
 *
 * 文件功能描述:
 * 此文件定义了一个可重用的 `PageLayout` 组件，用于统一所有标准内容页面的
 * 基础布局和样式。它封装了响应式的宽度、最大宽度、居中对齐和垂直内边距的逻辑。
 */
import React from 'react';
import { Box, type BoxProps } from '@mui/material';

// 我们可以继承 MUI Box 的所有 props，使我们的组件更灵活
interface PageLayoutProps extends BoxProps {
    children: React.ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = ({ children, sx, ...rest }) => {
    return (
        // 这个 Box 就是我们之前在每个页面中重复编写的那个
        <Box
            sx={{
                // 宽度在所有尺寸下都为 90%，提供了基础的左右留白
                width: '80%',

                // 【核心修复】使用响应式对象来控制最大宽度
                maxWidth: {
                    md: 1280, // 在中等屏幕 (>=900px) 上，最大宽度为 1280px
                    lg: 1440, // 在大屏幕 (>=1200px) 上，最大宽度增加到 1440px
                    xl: 1600, // 在超大屏幕 (>=1536px) 上，最大宽度进一步增加到 1600px
                },

                mx: 'auto',     // 水平居中
                py: 4,          // 上下内边距
                ...sx           // 允许从外部传入额外的 sx 样式进行覆盖或扩展
            }}
            {...rest} // 传递所有其他 props, 如 component, id 等
        >
            {children}
        </Box>
    );
};

export default PageLayout;