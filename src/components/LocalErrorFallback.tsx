/**
 * 文件名: src/components/LocalErrorFallback.tsx
 *
 * 文件功能描述:
 * 此文件定义了局部错误边界的备用（Fallback）UI组件。
 * 当应用中某个特定的、被错误边界包裹的功能模块（如主内容区、侧面板）发生渲染错误时，
 * 此组件将被显示。它的目的是在不中断整个应用流程的情况下，向用户指明哪个部分出了问题。
 *
 * 本次修改内容:
 * - 【全新文件】为局部错误边界提供一个信息清晰且侵入性较低的降级UI。
 */
import React from 'react';
import {Box, Typography} from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const LocalErrorFallback: React.FC = () => {
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