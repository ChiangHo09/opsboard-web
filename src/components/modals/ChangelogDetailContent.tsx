/**
 * 文件名: src/components/modals/ChangelogDetailContent.tsx
 *
 * 文件功能描述:
 * 此文件提供了更新日志详情内容的具体实现。
 *
 * 本次修改内容:
 * - 【组件写法现代化】移除了 `React.FC`，采用了现代的函数组件定义方式，
 *   并显式注解了 props 类型和 `: JSX.Element` 返回值类型。
 */
import {Box, Typography} from '@mui/material';
import type { JSX } from 'react';

export interface ChangelogDetailContentProps {
    logId: string;
}

// 【核心修改】移除 React.FC，使用现代写法
const ChangelogDetailContent = ({logId}: ChangelogDetailContentProps): JSX.Element => {
    return (
        <Box sx={{p: 4, display: 'flex', flexDirection: 'column', height: '100%'}}>
            <Typography
                variant="h5"
                sx={{
                    mb: 2,
                    pt: '2px',
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