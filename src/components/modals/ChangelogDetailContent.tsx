/**
 * 文件名: src/components/modals/ChangelogDetailContent.tsx
 *
 * 文件功能描述:
 * 此文件提供了在通用模态框或移动端详情页中显示的更新日志详情内容的具体实现。
 *
 * 本次修改内容:
 * - 【代码清理与类型修复】进行了一次全面的代码清理和类型导出修复。
 * - **解决方案**:
 *   1.  **移除冗余逻辑**: 删除了不再需要的 `useLayout` 钩子和所有与 `isMobile` 相关的响应式样式。
 *   2.  **导出 Props 类型**: 使用 `export` 关键字导出了 `ChangelogDetailContentProps` 接口，以解决 TypeScript 类型错误。
 * - **最终效果**:
 *   此组件现在是一个更纯粹的、与布局无关的内容渲染组件，并且其类型定义可以被安全地重用。
 */
import React from 'react';
import {Box, Typography} from '@mui/material';

// 【核心修复】导出 props 接口以供其他文件使用
export interface ChangelogDetailContentProps {
    logId: string;
}

const ChangelogDetailContent: React.FC<ChangelogDetailContentProps> = ({logId}) => {
    return (
        <Box sx={{p: 4, display: 'flex', flexDirection: 'column', height: '100%'}}>
            <Typography
                variant="h5"
                sx={{
                    mb: 2,
                    pt: '2px', // 保留此项以在桌面端弹窗中与关闭按钮对齐
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