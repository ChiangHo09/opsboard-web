/**
 * 文件功能：
 * 此文件定义了 RightSearchPanel 组件，它是一个纯粹的、带动画的右侧“容器”或“壳”。
 * 它的职责是管理自身的展开/收起动画、显示标题和关闭按钮，并为子内容提供一个带标准内边距的插槽。
 *
 * 本次修改：
 * - 引入了 `AnimatePresence` 和 `motion` 组件，以便为面板内部的子内容（`children`）添加页面切换动画效果。
 * - 当面板内容发生变化时，内容将从下方滑入，并淡入，与主工作区的页面切换动画保持一致。
 * - 优雅地处理了内容加载状态（当 `open` 为 true 但 `children` 尚未提供时），加载指示器本身也会带有动画效果。
 * - 新增 `contentKey` 属性，用于 Framer Motion 识别内容变化并触发动画。
 */
import React from 'react'; // 导入 React 库。
import { Box, Typography, IconButton, CircularProgress } from '@mui/material'; // 导入 MUI 的 Box, Typography, IconButton 组件；导入 CircularProgress 组件。
import CloseIcon from '@mui/icons-material/Close'; // 导入 MUI Material Icons 的关闭图标。
import { motion, type Variants, AnimatePresence } from 'framer-motion'; // 导入 motion 组件和 Variants 类型，用于动画效果；导入 AnimatePresence 用于管理组件的进入/退出动画。
import { pageVariants, pageTransition } from '../utils/pageAnimations'; // 导入页面动画的变体和过渡配置，用于面板内部内容的动画。

// 定义 RightSearchPanel 组件的属性接口。
export interface RightSearchPanelProps {
    open: boolean; // 控制面板是否打开的布尔值。
    onClose: () => void; // 关闭面板的回调函数。
    title?: string; // 面板标题，可选，默认为 '搜索'。
    width?: number; // 面板宽度，可选，默认为 360。
    children: React.ReactNode; // 面板内部要渲染的子内容，可以是任何 React 节点。
    contentKey?: string | number; // 【新增】用于子内容动画的唯一键，当此键变化时，子内容会触发进入/退出动画。
}

const MotionBox = motion(Box); // 将 MUI 的 Box 组件转换为 Framer Motion 组件，使其支持动画。

/**
 * RightSearchPanel 组件:
 * 一个可展开/收起的右侧面板，用于显示搜索结果或详情内容。
 * 面板本身的展开/收起（宽度）有动画，面板内部的实际内容（`children`）也有独立的页面切换动画。
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
                                             contentKey, // 子内容动画的唯一键。
                                         }: RightSearchPanelProps) {

    // 定义面板展开/收起的动画变体。此动画只控制面板的宽度。
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
            variants={panelVariants} // 应用定义的面板展开/收起动画变体。
            initial="closed" // 初始状态设置为 'closed'，确保首次渲染时面板是收起的。
            animate={open ? "open" : "closed"} // 根据 open 属性动态切换动画状态。
            sx={{ // 外层 MotionBox 的样式。
                flexShrink: 0, // 防止在 flex 容器中收缩，确保面板占据其应有的宽度。
                overflow: 'hidden', // 隐藏超出宽度的内容，实现收缩动画效果。
                height: '100%', // 高度占满父容器。
                bgcolor: 'background.paper', // 背景颜色为主题的 paper 背景色，提供视觉上的卡片效果。
                borderRadius: 2, // 边框圆角为 2 单位，使面板外观柔和。
                boxSizing: 'border-box', // 盒子模型为 border-box，确保 padding 和 border 不会增加元素总宽度。
                ml: open ? 3 : 0, // 左侧外边距：如果面板打开则为 3 单位，否则为 0。这为面板与主内容之间提供了间隔。
                transition: 'margin-left 0.28s ease', // 为左侧外边距变化添加过渡效果，使其平滑。
            }}
        >
            <Box
                sx={{ // 面板内部内容的容器样式。这个 Box 确保了内容区域有固定的宽度。
                    width: width, // 宽度设置为传入的 width 值，确保内容区域的实际宽度。
                    height: '100%', // 高度占满父容器。
                    p: 3, // 内边距为 3 单位，为内容提供舒适的留白。
                    display: 'flex', // flex 布局。
                    flexDirection: 'column', // 垂直堆叠子元素，使标题和内容垂直排列。
                    boxSizing: 'border-box', // 盒子模型为 border-box。
                }}
            >
                <Box sx={{ // 面板头部区域样式，包含标题和关闭按钮。
                    display: 'flex', // flex 布局。
                    alignItems: 'center', // 垂直居中对齐标题和按钮。
                    justifyContent: 'space-between', // 水平方向两端对齐标题和按钮。
                    mb: 2, // 底部外边距为 2 单位，与下方内容分隔。
                    flexShrink: 0 // 防止收缩，确保头部始终显示。
                }}>
                    <Typography variant="h6" noWrap>{title}</Typography> {/* 面板标题，设置 `noWrap` 防止标题过长时换行。 */}
                    <IconButton size="small" onClick={onClose} aria-label="close search panel"> {/* 关闭按钮，点击调用 onClose 函数。 */}
                        <CloseIcon /> {/* 关闭图标。 */}
                    </IconButton>
                </Box>
                <Box sx={{ // 面板内容区域样式。
                    mt: 2, // 顶部外边距为 2 单位，与上方头部分隔。
                    flexGrow: 1, // 占据剩余垂直空间，使内容区尽可能大。
                    overflowY: 'hidden', // 垂直方向隐藏此容器的滚动条，内部 MotionBox 会处理滚动。
                    display: 'flex', // flex 布局。
                    justifyContent: 'center', // 水平居中对齐。
                    alignItems: 'center', // 垂直居中对齐。
                }}>
                    {/* AnimatePresence 用于管理子内容的进入/退出动画。
                        `mode="wait"` 确保前一个子组件完全退出后，新的子组件才开始进入动画，避免内容重叠。 */}
                    <AnimatePresence mode="wait">
                        {open && !children ? ( // 条件：如果面板已打开（`open` 为 true）但 `children` 为空（内容尚未加载）。
                            <MotionBox
                                key="loading-panel-content" // 为加载指示器设置一个唯一键。
                                variants={pageVariants} // 应用页面进入/退出动画变体。
                                transition={pageTransition} // 应用页面动画过渡配置。
                                initial="initial" // 初始状态为页面动画的 'initial'。
                                animate="animate" // 动画至页面动画的 'animate'。
                                exit="exit" // 退出时动画至页面动画的 'exit'。
                                sx={{ // 加载指示器容器的样式。
                                    width: '100%', // 宽度占满父容器。
                                    height: '100%', // 高度占满父容器。
                                    display: 'flex', // flex 布局，用于居中 `CircularProgress`。
                                    justifyContent: 'center', // 水平居中。
                                    alignItems: 'center', // 垂直居中。
                                }}
                            >
                                <CircularProgress /> {/* 显示一个圆形加载指示器。 */}
                            </MotionBox>
                        ) : open && children ? ( // 条件：如果面板已打开且 `children` 已提供（内容已加载）。
                            <MotionBox
                                // 为实际内容设置一个唯一键。`contentKey` 由父组件提供，如果未提供，则使用 `title` 作为备用，
                                // 确保当内容变化时，Framer Motion 能检测到并触发动画。
                                key={contentKey || title || 'default-panel-content'}
                                variants={pageVariants} // 应用页面进入/退出动画变体。
                                transition={pageTransition} // 应用页面动画过渡配置。
                                initial="initial" // 初始状态为页面动画的 'initial'。
                                animate="animate" // 动画至页面动画的 'animate'。
                                exit="exit" // 退出时动画至页面动画的 'exit'。
                                sx={{ // 内容区域的样式。
                                    width: '100%', // 宽度占满父容器。
                                    height: '100%', // 高度占满父容器。
                                    boxSizing: 'border-box', // 盒子模型为 border-box。
                                    overflowY: 'auto', // 垂直方向允许内容滚动，因为内容可能超出面板高度。
                                    overflowX: 'hidden', // 水平方向隐藏滚动条。
                                    display: 'flex', // flex 布局。
                                    flexDirection: 'column', // 垂直堆叠子元素。
                                }}
                            >
                                {children} {/* 正常显示传入的子内容。 */}
                            </MotionBox>
                        ) : null /* 如果面板关闭或 `open` 为 false，则不渲染任何内容。 */}
                    </AnimatePresence>
                </Box>
            </Box>
        </MotionBox>
    );
}
