/**
 * 文件功能：
 * 此文件定义了 RightSearchPanel 组件，它是一个纯粹的、带动画的右侧“容器”或“壳”。
 * 它的职责是管理自身的展开/收起动画、显示标题和关闭按钮，并为子内容提供一个带标准内边距的插槽。
 *
 * 本次修改：
 * - 解决了在页面刷新后，面板内容区域短暂显示为空白的问题。
 * - 新增了条件渲染逻辑：当面板被要求打开（`open` 为 true）但内容（`children`）尚未被提供时，显示一个居中的加载指示器（`CircularProgress`）。
 * - 这优雅地处理了布局渲染和页面 `useEffect` 设置内容之间的竞争条件，改善了用户体验。
 */
import React from 'react'; // 导入 React 库。
import { Box, Typography, IconButton, CircularProgress } from '@mui/material'; // 导入 MUI 的 Box, Typography, IconButton 组件；导入 CircularProgress 组件。
import CloseIcon from '@mui/icons-material/Close'; // 导入 MUI Material Icons 的关闭图标。
import { motion, type Variants } from 'framer-motion'; // 导入 motion 组件和 Variants 类型，用于动画效果。

// 定义 RightSearchPanel 组件的属性接口。
export interface RightSearchPanelProps {
    open: boolean; // 控制面板是否打开的布尔值。
    onClose: () => void; // 关闭面板的回调函数。
    title?: string; // 面板标题，可选，默认为 '搜索'。
    width?: number; // 面板宽度，可选，默认为 360。
    children: React.ReactNode; // 面板内部要渲染的子内容，可以是任何 React 节点。
}

const MotionBox = motion(Box); // 将 MUI 的 Box 组件转换为 Framer Motion 组件，使其支持动画。

/**
 * RightSearchPanel 组件:
 * 一个可展开/收起的右侧面板，用于显示搜索结果或详情内容。
 *
 * @param {RightSearchPanelProps} props - 组件属性。
 * @returns {JSX.Element} 渲染的右侧搜索面板。
 */
export default function RightSearchPanel({
                                             open, // 面板是否打开的状态。
                                             onClose, // 关闭面板的回调函数。
                                             title = '搜索', // 面板标题，默认为 '搜索'。
                                             width = 360, // 面板宽度，默认为 360 像素。
                                             children, // 面板内部的子内容。
                                         }: RightSearchPanelProps) {

    // 定义面板展开/收起的动画变体。
    const panelVariants: Variants = {
        open: { // 面板打开时的状态。
            width: width, // 宽度设置为传入的 width 值。
            transition: { duration: 0.28, ease: [0.4, 0, 0.2, 1] }, // 动画过渡时间0.28秒，使用 Material Design 标准的缓动曲线。
        },
        closed: { // 面板关闭时的状态。
            width: 0, // 宽度设置为 0，使其隐藏。
            transition: { duration: 0.28, ease: [0.4, 0, 0.2, 1] }, // 动画过渡时间0.28秒，使用 Material Design 标准的缓动曲线。
        },
    };

    return (
        <MotionBox
            variants={panelVariants} // 应用定义的动画变体。
            initial="closed" // 初始状态设置为 'closed'。
            animate={open ? "open" : "closed"} // 根据 open 属性动态切换动画状态。
            sx={{ // 外层 MotionBox 的样式。
                flexShrink: 0, // 防止在 flex 容器中收缩。
                overflow: 'hidden', // 隐藏超出宽度的内容，实现收缩动画。
                height: '100%', // 高度占满父容器。
                bgcolor: 'background.paper', // 背景颜色为主题的 paper 背景色。
                borderRadius: 2, // 边框圆角为 2 单位。
                boxSizing: 'border-box', // 盒子模型为 border-box。
                ml: open ? 3 : 0, // 左侧外边距：如果面板打开则为 3 单位，否则为 0。
                transition: 'margin-left 0.28s ease', // 为左侧外边距变化添加过渡效果。
            }}
        >
            <Box
                sx={{ // 面板内部内容的容器样式。
                    width: width, // 宽度设置为传入的 width 值，确保内容区域的实际宽度。
                    height: '100%', // 高度占满父容器。
                    p: 3, // 内边距为 3 单位。
                    display: 'flex', // flex 布局。
                    flexDirection: 'column', // 垂直堆叠子元素。
                    boxSizing: 'border-box', // 盒子模型为 border-box。
                }}
            >
                <Box sx={{ // 面板头部区域样式，包含标题和关闭按钮。
                    display: 'flex', // flex 布局。
                    alignItems: 'center', // 垂直居中对齐。
                    justifyContent: 'space-between', // 水平方向两端对齐。
                    mb: 2, // 底部外边距为 2 单位。
                    flexShrink: 0 // 防止收缩。
                }}>
                    <Typography variant="h6" noWrap>{title}</Typography> {/* 面板标题，不换行。 */}
                    <IconButton size="small" onClick={onClose} aria-label="close search panel"> {/* 关闭按钮，点击调用 onClose 函数。 */}
                        <CloseIcon /> {/* 关闭图标。 */}
                    </IconButton>
                </Box>
                <Box sx={{ // 面板内容区域样式。
                    mt: 2, // 顶部外边距为 2 单位。
                    flexGrow: 1, // 占据剩余垂直空间。
                    overflowY: 'hidden', // 垂直方向隐藏滚动条。
                    display: 'flex', // flex 布局。
                    justifyContent: 'center', // 水平居中对齐。
                    alignItems: 'center' // 垂直居中对齐。
                }}>
                    {/* 添加条件渲染逻辑 */}
                    {open && !children ? ( // 如果面板已打开（`open` 为 true）但 `children` 为空（内容尚未加载）。
                        <CircularProgress /> // 显示一个圆形加载指示器。
                    ) : (
                        children // 否则，正常显示传入的子内容。
                    )}
                </Box>
            </Box>
        </MotionBox>
    );
}