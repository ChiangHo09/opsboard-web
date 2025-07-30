/**
 * 文件名: src/components/modals/TemplateModalContent.tsx
 *
 * 文件功能描述:
 * 此文件定义了一个纯粹的【模板详情内容】展示组件。它的唯一职责是接收一个 `itemId`，
 * 并以一种标准化的布局来显示这个ID及其相关的占位符信息。
 *
 * 该组件被设计为高度可复用，可被嵌入在任何容器中，例如：
 * - 桌面端的全局模态框（Modal）。
 * - 移动端专用的全屏详情页（MobileDetailPageLayout）。
 *
 * 本次修改内容:
 * - 【注释完善】为文件、接口、组件和每一个重要属性添加了极其详尽的注释。
 */

// 从 'react' 库导入核心功能。
import React from 'react';

// 从 Material-UI (MUI) 库导入用于布局和文本显示的组件。
import {Box, Typography} from '@mui/material';

/**
 * @interface TemplateModalContentProps
 * @description 定义了 TemplateModalContent 组件所接收的 props 的类型。
 */
export interface TemplateModalContentProps {
    /**
     * @property {string} itemId - 必需的字符串属性，代表要显示的模板项的唯一标识符。
     *           这个 prop 的名称与应用的路由参数（如 `/app/template-page/:itemId`）保持一致。
     */
    itemId: string;
}

// 定义 TemplateModalContent 组件。
// 它是一个函数式组件（FC），接收符合 TemplateModalContentProps 接口的 props。
const TemplateModalContent: React.FC<TemplateModalContentProps> = ({itemId}) => { // 使用解构赋值直接获取 itemId prop。
    return (
        // 使用 Box 组件作为根容器，并设置内边距、flex 布局等样式。
        <Box
            sx={{
                p: 4, // p: 4 -> 设置内边距为 theme.spacing(4)。
                display: 'flex', // 使用 flex 布局。
                flexDirection: 'column', // 子元素垂直排列。
                height: '100%', // 高度占满其父容器。
            }}
        >
            {/* 详情页的标题 */}
            <Typography
                variant="h5" // variant="h5": 使用 h5 标题的排版样式。
                sx={{
                    mb: 2, // mb: 2 -> 设置下外边距为 theme.spacing(2)。
                    pt: '2px', // pt: '2px' -> 一个微调，用于在桌面端弹窗中与右上角的关闭按钮在视觉上垂直对齐。
                }}
            >
                {/* 动态显示从 props 接收到的 itemId */}
                模板弹窗详情: {itemId}
            </Typography>

            {/* 详情内容的主体区域 */}
            <Box
                sx={{
                    flexGrow: 1, // flexGrow: 1 -> 此区域将占据所有可用的垂直空间。
                    border: '1px dashed grey', // 添加一个虚线边框作为占位符样式。
                    p: 2, // 设置内边距。
                    overflow: 'auto', // 如果内容超出，则显示滚动条。
                }}
            >
                <Typography>
                    {/* 动态显示从 props 接收到的 itemId */}
                    这里是模板弹窗的详细信息占位符，ID 为 {itemId}。
                </Typography>
            </Box>
        </Box>
    );
};

// 默认导出该组件。
export default TemplateModalContent;