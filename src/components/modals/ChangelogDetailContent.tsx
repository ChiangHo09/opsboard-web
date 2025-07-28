/**
 * 文件名: src/components/modals/ChangelogDetailContent.tsx
 *
 * 本次修改内容:
 * - 这是一个全新的文件，为“更新日志”详情弹窗提供内容。
 * - 它的结构与 `ServerDetailContent.tsx` 类似，只负责渲染弹窗的 *内部* 内容。
 *
 * 文件功能描述:
 * 此文件提供了在通用模态框中显示的更新日志详情内容的具体实现。
 */
import React from 'react';
import {Box, Typography} from '@mui/material';
import {useLayout} from '../../contexts/LayoutContext';

interface ChangelogDetailContentProps {
    logId: string;
}

const ChangelogDetailContent: React.FC<ChangelogDetailContentProps> = ({logId}) => {
    const {isMobile} = useLayout();

    return (
        <Box sx={{p: 4, display: 'flex', flexDirection: 'column', height: '100%'}}>
            <Typography
                variant="h5"
                sx={{
                    mb: 2,
                    pt: '2px',
                    mt: isMobile ? 4 : 0,
                }}
            >
                日志详情: {logId}
            </Typography>
            <Box sx={{flexGrow: 1, border: '1px dashed grey', p: 2, overflow: 'auto'}}>
                <Typography>这里是日志 ID 为 {logId} 的详细信息占位符。</Typography>
            </Box>
        </Box>
    );
};

export default ChangelogDetailContent;