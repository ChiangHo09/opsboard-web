/**
 * 文件名: src/components/GlobalErrorFallback.tsx
 *
 * 文件功能描述:
 * 此文件定义了全局错误边界的备用（Fallback）UI组件。
 *
 * 本次修改内容:
 * - 【组件写法现代化】移除了 `React.FC`，采用了现代的函数组件定义方式，
 *   并显式注解了 `: JSX.Element` 返回值类型。
 */
import {Box, Typography, Button} from '@mui/material';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import type { JSX } from 'react';

// 【核心修改】移除 React.FC，添加 : JSX.Element 返回值类型
const GlobalErrorFallback = (): JSX.Element => {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                width: '100vw',
                bgcolor: 'background.default',
                p: 3,
                boxSizing: 'border-box',
            }}
        >
            <ReportProblemIcon sx={{fontSize: 60, color: 'error.main', mb: 2}}/>
            <Typography variant="h4" component="h1" gutterBottom>
                应用出错了
            </Typography>
            <Typography color="text.secondary" sx={{mb: 4, textAlign: 'center'}}>
                很抱歉，程序遇到了一个意外问题，导致无法继续。
            </Typography>
            <Button
                variant="contained"
                size="large"
                onClick={() => window.location.reload()}
            >
                刷新页面重试
            </Button>
        </Box>
    );
};

export default GlobalErrorFallback;