/**
 * 文件名: src/components/LocalErrorFallback.tsx
 *
 * 文件功能描述:
 * 此文件定义了局部错误边界的备用（Fallback）UI组件。
 *
 * 本次修改内容:
 * - 【组件写法现代化】移除了 `React.FC`，采用了现代的函数组件定义方式，
 *   并显式注解了 `: JSX.Element` 返回值类型。
 */
import {Box, Typography} from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import type { JSX } from 'react';

// 【核心修改】移除 React.FC，添加 : JSX.Element 返回值类型
const LocalErrorFallback = (): JSX.Element => {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                width: '100%',
                bgcolor: 'transparent',
                p: 3,
                boxSizing: 'border-box',
            }}
        >
            <ErrorOutlineIcon sx={{fontSize: 48, color: 'text.secondary', mb: 2}}/>
            <Typography variant="h6" component="h2" color="text.secondary">
                此模块加载失败
            </Typography>
            <Typography color="text.disabled" sx={{mt: 1}}>
                请尝试刷新或导航至其他页面。
            </Typography>
        </Box>
    );
};

export default LocalErrorFallback;