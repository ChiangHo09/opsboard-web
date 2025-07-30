/**
 * 文件名: src/components/GlobalErrorFallback.tsx
 *
 * 文件功能描述:
 * 此文件定义了全局错误边界的备用（Fallback）UI组件。
 * 当应用发生无法恢复的顶层渲染错误时，此组件将被显示，为用户提供一个清晰的指引，
 * 并防止出现白屏。它的设计原则是“绝对简单”，不依赖任何可能出错的复杂逻辑或状态。
 *
 * 本次修改内容:
 * - 【全新文件】为全局错误边界提供一个稳定、可靠的降级UI。
 */
import React from 'react';
import {Box, Typography, Button} from '@mui/material';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';

const GlobalErrorFallback: React.FC = () => {
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