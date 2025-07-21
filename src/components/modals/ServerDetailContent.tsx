/**
 * 文件名: src/components/modals/ServerDetailContent.tsx
 *
 * 本次修改内容:
 * - 这是一个全新的文件。
 * - 定义了 `ServerDetailContent` 组件，它只负责渲染服务器详情弹窗的 *内部* 内容。
 * - 该组件是无状态的，仅根据传入的 `serverId` prop 来显示信息。
 * - 这种分离使得通用 `Modal` 组件可以复用，而具体业务内容则封装在此组件中。
 *
 * 文件功能描述:
 * 此文件提供了在通用模态框中显示的服务器详情内容的具体实现。
 */
import React from 'react';
import { Box, Typography } from '@mui/material';
import { useLayout } from '../../contexts/LayoutContext';

interface ServerDetailContentProps {
    serverId: string;
}

const ServerDetailContent: React.FC<ServerDetailContentProps> = ({ serverId }) => {
    const { isMobile } = useLayout();

    return (
        <Box sx={{ p: 4, display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Typography variant="h5" sx={{ mb: 2, mt: isMobile ? 4 : 0 }}>
                服务器详情: {serverId}
            </Typography>
            <Box sx={{ flexGrow: 1, border: '1px dashed grey', p: 2, overflow: 'auto' }}>
                <Typography>这里是服务器 {serverId} 的详细信息占位符。</Typography>
            </Box>
        </Box>
    );
};

export default ServerDetailContent;