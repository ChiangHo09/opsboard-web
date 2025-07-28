/**
 * 文件名: src/components/modals/TicketDetailContent.tsx
 *
 * 文件功能描述:
 * 此文件提供了在通用模态框中显示的【工单详情】内容的具体实现。
 *
 * 本次修改内容:
 * - 【全新文件】基于 TemplateModalContent.tsx 模板创建。
 * - **功能实现**:
 *   1.  **Props 定义**: 定义了 `TicketDetailContentProps` 接口，接收一个 `ticketId`。
 *   2.  **内容渲染**: 组件内部根据传入的 `ticketId` 动态渲染标题和内容详情，以展示特定工单的信息。
 *   3.  **响应式布局**: 继承了模板的响应式设计，在移动端视图下为顶部的关闭按钮留出空间。
 */

// 导入 React 库，用于定义组件。
import React from 'react';

// 从 Material-UI 导入 Box 和 Typography 组件，用于布局和文本显示。
import {Box, Typography} from '@mui/material';

// 从全局布局上下文中导入 useLayout 钩子，以访问共享状态（如此处的 isMobile）。
import {useLayout} from '../../contexts/LayoutContext';

// 定义此组件接收的 props 的接口（Interface）。
interface TicketDetailContentProps {
    // ticketId: 一个工单ID，类型为字符串，用于演示如何将数据传递到弹窗内容中。
    ticketId: string;
}

// 定义 TicketDetailContent 组件，它是一个函数式组件（FC），并指定了其 props 类型。
const TicketDetailContent: React.FC<TicketDetailContentProps> = ({ticketId}) => {
    // 从全局布局上下文中解构出 isMobile 状态，用于响应式布局。
    const {isMobile} = useLayout();

    // 返回组件的 JSX 结构。
    return (
        // 使用 Box 组件作为内容的根容器。
        <Box
            // sx: Material-UI 的样式属性，用于定义 CSS。
            sx={{
                p: 4,                      // p: 4: 设置内边距为 theme.spacing(4)，即 32px。
                display: 'flex',           // display: 'flex': 使用 flex 布局。
                flexDirection: 'column',   // flexDirection: 'column': 使子元素垂直堆叠。
                height: '100%',            // height: '100%': 使其高度占满父容器（Modal 内容区）。
            }}
        >
            {/* 使用 Typography 组件显示弹窗标题。 */}
            <Typography
                variant="h5" // variant="h5": 使用 h5 标题样式。
                sx={{
                    mb: 2, // mb: 2: 设置下外边距为 theme.spacing(2)，即 16px。
                    // mt: 在移动端视图下设置上外边距，为关闭按钮留出空间。
                    mt: isMobile ? 4 : 0,
                }}
            >
                {/* 动态显示标题，并包含从 props 传入的 ticketId。 */}
                工单详情: {ticketId}
            </Typography>

            {/* 使用 Box 组件作为内容的主体区域。 */}
            <Box
                sx={{
                    flexGrow: 1,               // flexGrow: 1: 占据所有剩余的垂直空间。
                    border: '1px dashed grey', // border: 设置一个1像素宽的灰色虚线边框。
                    p: 2,                      // p: 2: 设置内边距为 16px。
                    overflow: 'auto',          // overflow: 'auto': 如果内容超出，则显示滚动条。
                }}
            >
                {/* 使用 Typography 组件显示占位符文本。 */}
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

// 默认导出该组件，以便在其他文件中导入和使用。
export default TicketDetailContent;