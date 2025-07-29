/**
 * 文件名: src/components/modals/TicketDetailContent.tsx
 *
 * 文件功能描述:
 * 此文件提供了在通用模态框或移动端详情页中显示的【工单详情】内容的具体实现。
 *
 * 本次修改内容:
 * - 【代码清理与类型修复】进行了一次全面的代码清理和类型导出修复。
 * - **问题根源**:
 *   此组件内部包含了对 `isMobile` 状态的依赖，这破坏了其作为纯内容组件的独立性。同时，其 props 类型没有被导出，导致在泛型组件中无法使用。
 * - **解决方案**:
 *   1.  **移除冗余逻辑**: 删除了不再需要的 `useLayout` 钩子和所有与 `isMobile` 相关的响应式样式，因为这些现在由其父布局组件（`Modal` 或 `MobileDetailPageLayout`）统一处理。
 *   2.  **导出 Props 类型**: 使用 `export` 关键字导出了 `TicketDetailContentProps` 接口，以便在其他文件中（如 `TicketDetailMobile.tsx`）导入并用于泛型约束，从而解决 TypeScript 类型错误。
 * - **最终效果**:
 *   此组件现在是一个更纯粹的、与布局无关的内容渲染组件，其类型定义可以被安全地重用，完全符合单一职责原则。
 */
import React from 'react';
import {Box, Typography} from '@mui/material';

// 【核心修复】导出 props 接口以供其他文件使用
export interface TicketDetailContentProps {
    ticketId: string;
}

const TicketDetailContent: React.FC<TicketDetailContentProps> = ({ticketId}) => {
    // 【核心修复】移除 useLayout 和 isMobile 的所有引用
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
                    pt: '2px', // 保留此项以在桌面端弹窗中与关闭按钮对齐
                }}
            >
                工单详情: {ticketId}
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
                    这里是工单的详细信息占位符，ID 为 {ticketId}。
                </Typography>
                <Typography sx={{mt: 2}}>
                    这里可以渲染更复杂的工单数据，例如操作步骤、日志、附件等。
                </Typography>
            </Box>
        </Box>
    );
};

export default TicketDetailContent;