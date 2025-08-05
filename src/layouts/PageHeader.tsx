/**
 * @file src/layouts/PageHeader.tsx
 * @description 定义了一个可复用的 PageHeader 组件，它标准化了页面标题和其关联操作按钮的响应式布局。
 * @modification
 *   - [File Structure]: 将此文件放置在 `src/layouts` 目录下，以正确反映其作为高阶页面结构组件的职责。
 *   - [New Component]: 创建了此新组件，以封装“标题在左，操作在右，空间不足时自动换行”的通用 Flexbox 布局逻辑。
 *   - [Props]: 组件被设计为接受 `title` (ReactNode) 和 `actions` (ReactNode) 作为其主要内容，并允许通过 `mb` prop 自定义其下方的外边距。
 */
import {type JSX, type ReactNode} from 'react';
import {Box, Typography, type BoxProps} from '@mui/material';

interface PageHeaderProps extends Omit<BoxProps, 'title'> {
    title: ReactNode;
    actions: ReactNode;
    mb?: number;
}

const PageHeader = ({title, actions, mb = 2, sx, ...rest}: PageHeaderProps): JSX.Element => {
    return (
        <Box
            sx={{
                display: 'flex',
                flexShrink: 0,
                mb: mb,
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 2,
                ...sx,
            }}
            {...rest}
        >
            <Typography variant="h5" sx={{color: 'primary.main', fontSize: '2rem'}}>
                {title}
            </Typography>
            {actions}
        </Box>
    );
};

export default PageHeader;