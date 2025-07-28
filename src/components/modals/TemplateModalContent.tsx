/**
 * 文件名: src/components/modals/TemplateModalContent.tsx
 *
 * 本次修改内容:
 * - 这是一个全新的文件。
 * - 定义了 `TemplateModalContent` 组件，它只负责渲染模板弹窗的 *内部* 内容。
 * - 这个组件的设计是为了与通用的 `Modal` 组件解耦，使 `Modal` 可以复用。
 *
 * 文件功能描述:
 * 此文件提供了在通用模态框中显示的模板页面内容的具体实现。
 */

// 导入 React 库，用于定义组件。
import React from 'react';

// 从 Material-UI 导入 Box 和 Typography 组件，用于布局和文本显示。
import {Box, Typography} from '@mui/material';

// 从全局布局上下文中导入 useLayout 钩子，以访问共享状态（如此处的 isMobile）。
import {useLayout} from '../../contexts/LayoutContext';

// 定义此组件接收的 props 的接口（Interface）。
interface TemplateModalContentProps {
    // id: 一个示例属性，类型为字符串，用于演示如何将数据传递到弹窗内容中。
    id: string;
}

// 定义 TemplateModalContent 组件，它是一个函数式组件（FC），并指定了其 props 类型。
const TemplateModalContent: React.FC<TemplateModalContentProps> = ({id}) => {
    // 从全局布局上下文中解构出 isMobile 状态，用于响应式布局。
    const {isMobile} = useLayout();

    // 返回组件的 JSX 结构。
    return (
        // 使用 Box 组件作为内容的根容器。
        <Box
            // sx: Material-UI 的样式属性，用于定义 CSS。
            sx={{
                // p: 4: 设置内边距为 theme.spacing(4)，即 32px。
                p: 4,
                // display: 'flex': 使用 flex 布局。
                display: 'flex',
                // flexDirection: 'column': 使子元素垂直堆叠。
                flexDirection: 'column',
                // height: '100%': 使其高度占满父容器（Modal 内容区）。
                height: '100%',
            }}
        >
            {/* 使用 Typography 组件显示弹窗标题。 */}
            <Typography
                // variant="h5": 使用 h5 标题样式。
                variant="h5"
                // sx: 定义行内样式。
                sx={{
                    // mb: 2: 设置下外边距为 theme.spacing(2)，即 16px。
                    mb: 2,
                    // mt: isMobile ? 4 : 0: 在移动端视图下设置上外边距，为关闭按钮留出空间。
                    mt: isMobile ? 4 : 0,
                }}
            >
                {/* 动态显示标题，并包含从 props 传入的 id。 */}
                模板弹窗详情: {id}
            </Typography>

            {/* 使用 Box 组件作为内容的主体区域。 */}
            <Box
                // sx: 定义样式。
                sx={{
                    // flexGrow: 1: 占据所有剩余的垂直空间。
                    flexGrow: 1,
                    // border: '1px dashed grey': 设置一个1像素宽的灰色虚线边框。
                    border: '1px dashed grey',
                    // p: 2: 设置内边距为 16px。
                    p: 2,
                    // overflow: 'auto': 如果内容超出，则显示滚动条。
                    overflow: 'auto',
                }}
            >
                {/* 使用 Typography 组件显示占位符文本。 */}
                <Typography>
                    这里是模板弹窗的详细信息占位符，ID 为 {id}。
                </Typography>
            </Box>
        </Box>
    );
};

// 默认导出该组件，以便在其他文件中导入和使用。
export default TemplateModalContent;