/**
 * 文件名: src/components/modals/TemplateModalContent.tsx
 *
 * 文件功能描述:
 * 此文件提供了在通用模态框或移动端详情页中显示的【模板详情】内容的具体实现。
 *
 * 本次修改内容:
 * - 【Props 命名修复】为了与路由参数保持一致，将期望接收的 prop 名称从 `id` 修改为 `itemId`。
 * - **问题根源**:
 *   此组件期望的 prop `id` 与其在路由配置中定义的参数 `:itemId` 不匹配，导致了类型冲突。
 * - **解决方案**:
 *   1.  将 `TemplateModalContentProps` 接口中的属性从 `id` 重命名为 `itemId`。
 *   2.  在组件内部，解构并使用新的 `itemId` prop。
 * - **最终效果**:
 *   此组件的 props 定义现在与应用的路由结构完全统一，消除了类型错误。
 */
import React from 'react';
import {Box, Typography} from '@mui/material';

export interface TemplateModalContentProps {
    // 【核心修复】将 prop 名称从 id 修改为 itemId
    itemId: string;
}

const TemplateModalContent: React.FC<TemplateModalContentProps> = ({itemId}) => { // 【核心修复】解构 itemId
    return (
        <Box
            sx={{
                p: 4,
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
            }}
        >
            <Typography
                variant="h5"
                sx={{
                    mb: 2,
                    pt: '2px',
                }}
            >
                {/* 【核心修复】使用 itemId */}
                模板弹窗详情: {itemId}
            </Typography>

            <Box
                sx={{
                    flexGrow: 1,
                    border: '1px dashed grey',
                    p: 2,
                    overflow: 'auto',
                }}
            >
                <Typography>
                    {/* 【核心修复】使用 itemId */}
                    这里是模板弹窗的详细信息占位符，ID 为 {itemId}。
                </Typography>
            </Box>
        </Box>
    );
};

export default TemplateModalContent;