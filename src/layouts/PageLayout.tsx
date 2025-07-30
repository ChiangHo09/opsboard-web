/**
 * 文件名: src/layouts/PageLayout.tsx
 *
 * 代码功能:
 * 此文件定义了一个可重用的 `PageLayout` 组件，用于统一所有标准内容页面的基础布局和样式。
 *
 * 本次修改内容:
 * - 【组件写法现代化】移除了 `React.FC`，采用了现代的函数组件定义方式。
 * - **解决方案**:
 *   1.  为 props 定义了 `PageLayoutProps` 接口，并显式地在其中定义了 `children: React.ReactNode`。
 *   2.  为组件注解了 props 类型和 `: JSX.Element` 返回值类型。
 */
import {type JSX, type ReactNode} from 'react';
import {Box, type BoxProps} from '@mui/material';

// 【核心修改】显式定义 children
interface PageLayoutProps extends BoxProps {
    children: ReactNode;
}

// 【核心修改】移除 React.FC，使用现代写法
const PageLayout = ({children, sx, ...rest}: PageLayoutProps): JSX.Element => {
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
                ...sx
            }}
            {...rest}
        >
            {children}
        </Box>
    );
};

export default PageLayout;