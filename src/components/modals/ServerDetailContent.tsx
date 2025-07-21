/**
 * 文件名: src/components/modals/ServerDetailContent.tsx
 *
 * 本次修改内容:
 * - 【视觉微调】调整了弹窗标题的垂直位置，以配合关闭按钮的移动，实现视觉对齐。
 * - 移除了之前为移动端视图添加的 `mt` (margin-top) 属性。
 * - 为标题 `Typography` 的 `sx` 属性增加了 `pt: '2px'`，
 *   通过微调内边距使其在视觉上与右上角的关闭按钮顶部平齐。
 *
 * 文件功能描述:
 * 此文件提供了在通用模态框中显示的服务器详情内容的具体实现。
 */
import React from 'react';
import { Box, Typography } from '@mui/material';

interface ServerDetailContentProps {
    serverId: string;
}

const ServerDetailContent: React.FC<ServerDetailContentProps> = ({ serverId }) => {
    return (
        <Box sx={{ p: 4, display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Typography
                variant="h5"
                sx={{
                    mb: 2,
                    pt: '2px',
                    // 【核心修复】移除不再需要的移动端上边距
                }}
            >
                服务器详情: {serverId}
            </Typography>
            <Box sx={{ flexGrow: 1, border: '1px dashed grey', p: 2, overflow: 'auto' }}>
                <Typography>这里是服务器 {serverId} 的详细信息占位符。</Typography>
            </Box>
        </Box>
    );
};

export default ServerDetailContent;