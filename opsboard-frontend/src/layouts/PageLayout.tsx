/**
 * @file src/layouts/PageLayout.tsx
 * @description 定义了一个可重用的 `PageLayout` 组件，用于统一所有标准内容页面的基础布局和样式。
 * @modification
 *   - [类型修复]: 重写了 `PageLayoutProps` 的类型定义，采用正确的泛型模式来包装 MUI 的 `Box` 组件。这解决了在传递 `component` 等复杂属性时出现的 `TS2558` 和 `TS2769` 类型重载错误。
 */
import { type JSX, type ElementType } from 'react';
import { Box, type BoxProps } from '@mui/material';

// 采用更健壮的泛型模式来定义 props，以正确继承 MUI Box 的所有属性，特别是泛型的 `component` prop。
type PageLayoutProps<C extends ElementType = 'div'> = BoxProps<C, { component?: C }>;

const PageLayout = <C extends ElementType = 'div'>(props: PageLayoutProps<C>): JSX.Element => {
    const { sx, ...rest } = props;
    return (
        <Box
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                width: { xs: '95%', md: '80%' },
                maxWidth: { md: 1280, lg: 1440, xl: 1600 },
                mx: 'auto',
                pt: { xs: 4, md: 5 },
                pb: { xs: 2, md: 3 },
                px: { xs: 2, md: 3 },
                ...sx
            }}
            {...rest}
        />
    );
};

export default PageLayout;