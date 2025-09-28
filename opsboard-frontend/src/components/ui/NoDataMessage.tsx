/**
 * @file src/components/ui/NoDataMessage.tsx
 * @description 一个可重用的组件，用于在数据为空时向用户显示提示信息。
 * @modification 本次提交中所做的具体修改摘要。
 *   - [新文件]：创建此组件以提供一个统一的、标准化的“暂无数据”UI 元素。
 *   - [功能]：组件接收一个可选的 `message` prop，允许自定义显示的文本，并包含一个信息图标以增强视觉提示。
 */
import { Box, Typography } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import type { JSX } from 'react';

interface NoDataMessageProps {
    message?: string;
}

const NoDataMessage = ({ message = '暂无可用数据' }: NoDataMessageProps): JSX.Element => {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                color: 'text.secondary',
                textAlign: 'center',
                p: 3,
            }}
        >
            <InfoOutlinedIcon sx={{ fontSize: 48, mb: 2 }} />
            <Typography variant="h6">{message}</Typography>
        </Box>
    );
};

export default NoDataMessage;