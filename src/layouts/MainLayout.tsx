/**
 * 文件功能:
 * 此文件定义了应用的主UI布局（MainLayout），它包含了侧边栏、主内容区和搜索面板。
 * 它还通过 LayoutProvider 为所有子组件提供了控制右侧面板的状态。
 *
 * 本次修改:
 * - 【最终修复】彻底移除了 MainContentWrapper 组件内部引发无限循环和状态冲突的 `useEffect` Hook。
 * - 面板的关闭和内容清理逻辑，现在完全由各个页面组件（如 Servers.tsx）自身的 `useEffect` 清理函数负责，这才是正确的、解耦的模式。
 * - 此修改彻底解决了“刷新后自动收起”和“重新打开后无限加载”的问题。
 * - 【问题修复】移除在路由变化时强制重置面板状态的 `useEffect`：解决了即使在有搜索功能的页面之间跳转，搜索面板也会被收起的问题。
 *   现在，面板的打开、关闭和内容设置完全由各个页面组件在其生命周期中自行管理，确保了更灵活和预期的行为。
 */
import { useState, type JSX } from 'react'; // 导入 React 的 useState 和 useEffect Hook 用于组件内部状态管理；导入 JSX 类型用于函数组件的返回类型。
import { Outlet, useLocation } from 'react-router-dom'; // 导入 Outlet 组件用于渲染嵌套路由的子元素；导入 useLocation Hook 用于获取当前路由信息。
import { motion, AnimatePresence, type Variants } from 'framer-motion'; // 导入 motion 组件和 AnimatePresence 用于实现动画效果；导入 Variants 类型用于动画变体定义。
import { Box, useMediaQuery, useTheme, IconButton, Typography, CircularProgress } from '@mui/material'; // 导入 MUI 的 Box, useMediaQuery, useTheme, IconButton, Typography, CircularProgress 组件和 Hook。
import CloseIcon from '@mui/icons-material/Close'; // 导入 MUI Material Icons 的关闭图标。
import SideNav from '../components/SideNav'; // 导入侧边导航组件。
import { LayoutProvider, useLayout } from '../contexts/LayoutContext.tsx'; // 导入布局上下文的 Provider 和 Hook，用于全局管理布局状态。
import RightSearchPanel from '../components/RightSearchPanel'; // 导入右侧搜索面板组件。
import { pageVariants, pageTransition } from '../utils/pageAnimations'; // 导入页面动画的变体和过渡配置。

const MotionBox = motion(Box); // 将 MUI 的 Box 组件转换为 Framer Motion 组件，使其支持动画。
const MOBILE_TOP_BAR_HEIGHT = 56; // 定义移动设备顶部栏的高度常量，单位为像素。

// 定义移动端面板的动画变体，控制其进入、存在和退出时的样式和过渡。
const mobilePanelVariants: Variants = {
    initial: { opacity: 0, scale: 0.98, }, // 初始状态：完全透明，略微缩小。
    animate: { opacity: 1, scale: 1, transition: { duration: 0.2, ease: 'easeOut' }, }, // 动画状态：完全不透明，恢复原始大小，过渡时间0.2秒，缓出效果。
    exit: { opacity: 0, scale: 0.98, transition: { duration: 0.2, ease: 'easeOut' }, }, // 退出状态：完全透明，略微缩小，过渡时间0.2秒，缓出效果。
};

/**
 * MainContentWrapper 组件:
 * 负责渲染应用的核心内容区域，包括侧边导航、主内容（通过 Outlet 渲染）和右侧搜索/详情面板。
 *
 * @param {object} props - 组件属性。
 * @param {function} props.onFakeLogout - 模拟登出操作的回调函数，传递给 SideNav。
 * @returns {JSX.Element} 渲染的主内容区域。
 */
function MainContentWrapper({ onFakeLogout }: { onFakeLogout: () => void }) {
    const { pathname } = useLocation(); // 使用 useLocation 获取当前 URL 的路径名，用于页面切换动画的 key。
    const [sideNavOpen, setSideNavOpen] = useState(false); // 定义侧边导航的打开/关闭状态。
    const theme = useTheme(); // 获取当前 MUI 主题对象。
    const isMobile = useMediaQuery(theme.breakpoints.down('md')); // 判断当前屏幕是否为移动设备（宽度小于 'md' 断点）。

    // 从 LayoutContext 中解构出面板相关的状态和控制函数。
    const {
        isPanelOpen,      // 右侧面板是否打开的状态。
        panelContent,     // 右侧面板中显示的内容（React 节点）。
        togglePanel,      // 切换右侧面板打开/关闭的函数。
        panelTitle,       // 右侧面板的标题。
        panelWidth,       // 右侧面板的宽度。
        // setPanelContent,  // 之前用于强制清空面板内容，现已移除 MainLayout 的此职责。
        // setPanelTitle,    // 之前用于强制清空面板标题，现已移除 MainLayout 的此职责。
    } = useLayout(); // 使用自定义 Hook useLayout 获取布局上下文的值。

    // 【问题修复】移除之前在路由变化时强制重置面板状态的 useEffect。
    // 该 useEffect 导致了即使在有搜索功能的页面之间跳转，搜索面板也会被收起。
    // 现在，面板的打开、关闭和内容设置完全由各个页面组件在其生命周期中自行管理。
    // useEffect(() => {
    //     if (isPanelOpen) {
    //         setPanelContent(null);
    //         setPanelTitle('');
    //         togglePanel();
    //     }
    // }, [pathname]);

    return (
        <Box sx={{ // 最外层 Box，定义整个布局的容器样式。
            display: 'flex', // flex 布局，使子元素（SideNav 和主内容区）并排显示。
            height: '100dvh', // 高度占满视口高度，dvh 是动态视口高度，考虑了移动端浏览器地址栏。
            overflow: 'hidden', // 隐藏超出内容的滚动条。
            bgcolor: '#F0F4F9' // 背景颜色。
        }}>
            {/* 侧边导航组件 */}
            <SideNav
                open={sideNavOpen} // 传递侧边导航的打开状态。
                onToggle={() => setSideNavOpen(o => !o)} // 传递切换侧边导航状态的函数。
                onFakeLogout={onFakeLogout} // 传递模拟登出函数。
            />

            <Box
                component="main" // 定义 Box 的语义 HTML 标签为 main。
                sx={{ // 主内容区样式。
                    flexGrow: 1, // 占据剩余所有可用空间。
                    height: '100%', // 高度占满父容器。
                    pt: { xs: `${MOBILE_TOP_BAR_HEIGHT}px`, md: 3 }, // 顶部内边距：移动端为顶部栏高度，非移动端为 3 单位。
                    pb: { xs: 0, md: 3 }, // 底部内边距：移动端为 0，非移动端为 3 单位。
                    pr: { xs: 0, md: 3 }, // 右侧内边距：移动端为 0，非移动端为 3 单位。
                    pl: 0, // 左侧内边距为 0。
                    boxSizing: 'border-box', // 盒子模型为 border-box。
                    display: 'flex', // flex 布局。
                    flexDirection: { xs: 'column', md: 'row' }, // 移动端垂直堆叠，非移动端水平并排。
                    transition: theme.transitions.create('padding-top', { // 为顶部内边距变化添加过渡效果。
                        duration: theme.transitions.duration.short, // 过渡持续时间为短。
                    }),
                }}
            >
                <Box
                    sx={{ // 主内容区域的背景卡片样式。
                        flexGrow: 1, // 占据剩余空间。
                        bgcolor: 'background.paper', // 背景颜色为主题的 paper 背景色。
                        borderRadius: { xs: '16px 16px 0 0', md: 2 }, // 边框圆角：移动端顶部圆角，非移动端全圆角。
                        p: { xs: 0, md: 3 }, // 内边距：移动端为 0，非移动端为 3 单位。
                        boxSizing: 'border-box', // 盒子模型为 border-box。
                        display: 'flex', // flex 布局。
                        flexDirection: 'column', // 垂直堆叠。
                        position: 'relative', // 相对定位，用于移动端面板的绝对定位。
                        transition: theme.transitions.create(['border-radius', 'padding'], { // 为边框圆角和内边距变化添加过渡效果。
                            duration: theme.transitions.duration.short, // 过渡持续时间为短。
                        }),
                        overflow: 'hidden', // 隐藏超出内容的滚动条。
                    }}
                >
                    {/* 路由出口，用于渲染当前匹配的路由组件，并添加页面切换动画 */}
                    <MotionBox
                        key={pathname} // 使用 pathname 作为 key，当路径改变时，组件会被重新挂载，触发动画。
                        variants={pageVariants} // 应用页面动画变体。
                        transition={pageTransition} // 应用页面动画过渡配置。
                        initial="initial" // 初始动画状态。
                        animate="animate" // 进入动画状态。
                        exit="exit" // 退出动画状态。
                        sx={{ // 路由出口内容的样式。
                            width: '100%', // 宽度占满父容器。
                            height: '100%', // 高度占满父容器。
                            boxSizing: 'border-box', // 盒子模型为 border-box。
                            overflowY: 'auto', // 垂直方向允许滚动。
                            overflowX: 'hidden', // 水平方向隐藏滚动条。
                            display: 'flex', // flex 布局。
                            flexDirection: 'column', // 垂直堆叠。
                            p: { xs: 2, md: 0 } // 内边距：移动端为 2 单位，非移动端为 0。
                        }}
                    >
                        <Outlet /> {/* 实际渲染当前路由匹配到的子组件。 */}
                    </MotionBox>

                    {/* 移动端搜索面板的动画容器 */}
                    <AnimatePresence> {/* 用于在组件卸载时触发退出动画。 */}
                        {isMobile && isPanelOpen && ( // 仅在移动端且面板打开时渲染。
                            <MotionBox
                                variants={mobilePanelVariants} // 应用移动端面板动画变体。
                                initial="initial" // 初始动画状态。
                                animate="animate" // 进入动画状态。
                                exit="exit" // 退出动画状态。
                                sx={{ // 移动端面板的样式。
                                    position: 'absolute', // 绝对定位。
                                    inset: 0, // 占据整个父容器。
                                    bgcolor: 'background.paper', // 背景颜色。
                                    zIndex: 10, // 层级高于其他内容。
                                    p: 3, // 内边距为 3 单位。
                                    display: 'flex', // flex 布局。
                                    flexDirection: 'column', // 垂直堆叠。
                                }}
                            >
                                <Box sx={{ // 移动端面板的头部区域样式。
                                    display: 'flex', // flex 布局。
                                    alignItems: 'center', // 垂直居中对齐。
                                    justifyContent: 'space-between', // 水平两端对齐。
                                    mb: 2, // 底部外边距为 2 单位。
                                    flexShrink: 0 // 防止收缩。
                                }}>
                                    <Typography variant="h6" noWrap>{panelTitle}</Typography> {/* 面板标题，不换行。 */}
                                    <IconButton size="small" onClick={togglePanel} aria-label="close search panel"> {/* 关闭按钮。 */}
                                        <CloseIcon /> {/* 关闭图标。 */}
                                    </IconButton>
                                </Box>
                                <Box sx={{ // 移动端面板的内容区域样式。
                                    mt: 2, // 顶部外边距为 2 单位。
                                    flexGrow: 1, // 占据剩余垂直空间。
                                    overflowY: 'hidden', // 垂直方向隐藏滚动条。
                                    display: 'flex', // flex 布局。
                                    justifyContent: 'center', // 水平居中对齐。
                                    alignItems: 'center' // 垂直居中对齐。
                                }}>
                                    {/* 为移动端面板内容添加加载指示器 */}
                                    {isPanelOpen && !panelContent ? <CircularProgress /> : panelContent} {/* 如果面板打开但内容未加载，显示加载指示器；否则显示面板内容。 */}
                                </Box>
                            </MotionBox>
                        )}
                    </AnimatePresence>
                </Box>

                {/* 非移动端搜索面板 */}
                {!isMobile && ( // 仅在非移动端渲染。
                    <RightSearchPanel
                        open={isPanelOpen} // 传递面板打开状态。
                        onClose={togglePanel} // 传递关闭面板的函数。
                        title={panelTitle} // 传递面板标题。
                        width={panelWidth} // 传递面板宽度。
                    >
                        {/* 为桌面端面板内容添加加载指示器 */}
                        {isPanelOpen && !panelContent ? ( // 如果面板打开但内容未加载。
                            <Box sx={{ // 加载指示器容器样式。
                                width: '100%', // 宽度占满。
                                height: '100%', // 高度占满。
                                display: 'flex', // flex 布局。
                                justifyContent: 'center', // 水平居中。
                                alignItems: 'center' // 垂直居中。
                            }}>
                                <CircularProgress /> {/* 显示加载指示器。 */}
                            </Box>
                        ) : panelContent} {/* 否则显示面板内容。 */}
                    </RightSearchPanel>
                )}
            </Box>
        </Box>
    );
}

/**
 * MainLayout 组件:
 * 应用程序的顶级布局组件，负责提供 LayoutProvider 上下文，并渲染 MainContentWrapper。
 *
 * @param {object} props - 组件属性。
 * @param {function} props.onFakeLogout - 模拟登出操作的回调函数，传递给 MainContentWrapper。
 * @returns {JSX.Element} 渲染的应用程序主布局。
 */
export default function MainLayout({ onFakeLogout }: { onFakeLogout: () => void }): JSX.Element {
    return (
        <LayoutProvider> {/* 提供布局上下文，使所有子组件可以访问和修改布局状态。 */}
            <MainContentWrapper onFakeLogout={onFakeLogout} /> {/* 渲染主内容包装器。 */}
        </LayoutProvider>
    );
}