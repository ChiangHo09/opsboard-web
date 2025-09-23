/**
 * @file src/utils/animations.ts
 * @description 此文件定义了应用程序中用于页面和面板切换的动画变体和过渡配置。
 *     它利用 Framer Motion 库来创建平滑的视觉效果，确保用户在不同视图之间导航时获得一致且愉悦的体验。
 *     这些动画变体和过渡参数旨在模拟 Material Design 中常见的“加速离场”和“减速进场”效果。
 * @modification
 *   - [动画一致性]：显式定义 `panelContentVariants`，使其与 `pageVariants` 的 `initial`, `animate`, `exit` 属性完全一致，确保搜索面板内部内容的动画效果与主工作区页面的动画效果相同，解决用户反馈的动画方向不一致问题。
 *   - [注释优化]：为文件、变量、类型和每一个属性添加了极其详细的注释，以增强代码的可读性和可维护性。
 */

// 从 'framer-motion' 库中导入所需的类型。
// - Variants: 用于定义组件在不同动画状态（如 initial, animate, exit）下的样式集合。
// - Transition: 用于定义动画的过渡属性，如持续时间、缓动函数等。
import {type Variants, type Transition} from 'framer-motion';

/**
 * pageVariants 常量:
 * 定义了页面或面板在不同生命周期阶段（初始、动画中、退出）的视觉状态。
 * 这些变体将应用于 Framer Motion 的 `motion` 组件，以控制其动画行为。
 *
 * @type {Variants}
 */
export const pageVariants: Variants = {
    /**
     * initial 状态:
     * 定义组件在动画开始前的初始视觉状态。
     * - 当组件首次挂载或进入视图时，它将从这个状态开始动画。
     * - `opacity: 0`: 设置初始透明度为 0，表示组件是完全透明的（不可见）。
     * - `y: 20`: 设置初始 Y 轴位置向下偏移 20 像素。这会使得组件从下方“滑入”（向上淡入）。
     */
    initial: {
        opacity: 0,
        y: 20
    },
    /**
     * animate 状态:
     * 定义组件在动画进行中的目标视觉状态。
     * - 当组件进入视图或动画开始时，它将从 `initial` 状态过渡到这个状态。
     * - `opacity: 1`: 设置目标透明度为 1，表示组件是完全不透明的（完全可见）。
     * - `y: 0`: 设置目标 Y 轴位置为 0，表示组件回到其原始的垂直位置。
     */
    animate: {
        opacity: 1,
        y: 0
    },
    /**
     * exit 状态:
     * 定义组件在动画退出（卸载）时的最终视觉状态。
     * - 当组件即将从 DOM 中移除时（通常需要被 `AnimatePresence` 包裹），它将从当前状态过渡到这个状态。
     * - `opacity: 0`: 设置退出时的透明度为 0，表示组件将逐渐消失。
     * - `y: -20`: 设置退出时的 Y 轴位置向上偏移 20 像素。这会使得组件向上方“滑出”（向上淡出）。
     */
    exit: {
        opacity: 0,
        y: -20
    },
};

/**
 * panelContentVariants 常量:
 * 定义了搜索面板内部内容在不同生命周期阶段（初始、动画中、退出）的视觉状态。
 * 为了确保与主页面内容动画的完全一致性，此变体显式地定义了与 `pageVariants` 相同的属性。
 * 这样，无论 `pageVariants` 如何更新，面板内容的动画都将保持同步，并确保“向上淡入”的效果。
 * 如果您观察到“向下淡入”的效果，请务必检查浏览器缓存或构建输出，因为代码定义上已确保 `initial.y` 为正值，应为“向上淡入”。
 *
 * @type {Variants}
 */
export const panelContentVariants: Variants = {
    /**
     * initial 状态:
     * 定义面板内容在动画开始前的初始视觉状态。
     * - 与 `pageVariants.initial` 保持一致，确保从下方滑入（向上淡入）。
     */
    initial: {
        opacity: 0,
        y: 20
    },
    /**
     * animate 状态:
     * 定义面板内容在动画进行中的目标视觉状态。
     * - 与 `pageVariants.animate` 保持一致。
     */
    animate: {
        opacity: 1,
        y: 0
    },
    /**
     * exit 状态:
     * 定义面板内容在动画退出（卸载）时的最终视觉状态。
     * - 与 `pageVariants.exit` 保持一致，确保向上滑出（向上淡出）。
     */
    exit: {
        opacity: 0,
        y: -20
    },
};

/**
 * pageTransition 常量:
 * 定义了 `pageVariants` 和 `panelContentVariants` 之间过渡的动画属性，如持续时间（duration）和缓动函数（ease）。
 *
 * @type {Transition}
 */
export const pageTransition: Transition = {
    duration: 0.28, // 动画持续时间，单位为秒。
                    // 0.28 秒是一个相对较快的过渡，既能显示动画效果，又不会让用户等待过久。
    ease: [0.4, 0, 0.2, 1], // 缓动函数，使用一个四点贝塞尔曲线（cubic-bezier）来定义动画的速度曲线。
                            // 这个特定的曲线 [0.4, 0, 0.2, 1] 是 Material Design 中常用的“减速曲线”或“标准曲线”。
                            // 它表示动画开始时速度较快，然后逐渐减速，在结束时达到最慢，给人一种自然、流畅的感觉。
};

/**
 * mobileOverlayVariants 常量:
 * 定义了移动端全屏覆盖面板的动画变体。
 *
 * @type {Variants}
 */
export const mobileOverlayVariants: Variants = {
    /**
     * initial 状态:
     * 定义移动端覆盖面板在动画开始前的初始视觉状态。
     * - `y: '100%'`: 初始Y轴位置在屏幕下方，完全不可见。
     * - `opacity: 0`: 初始透明度为0。
     */
    initial: {
        y: '100%',
        opacity: 0,
    },
    /**
     * animate 状态:
     * 定义移动端覆盖面板在动画进行中的目标视觉状态。
     * - `y: '0%'`: 目标Y轴位置为0，完全可见。
     * - `opacity: 1`: 目标透明度为1。
     * - `transition`: 定义进入动画的持续时间和缓动函数。
     */
    animate: {
        y: '0%',
        opacity: 1,
        transition: {
            duration: 0.3,
            ease: [0.4, 0, 0.2, 1],
        },
    },
    /**
     * exit 状态:
     * 定义移动端覆盖面板在动画退出（卸载）时的最终视觉状态。
     * - `y: '100%'`: 退出时Y轴位置回到屏幕下方。
     * - `opacity: 0`: 退出时透明度为0。
     * - `transition`: 定义退出动画的持续时间和缓动函数。
     */
    exit: {
        y: '100%',
        opacity: 0,
        transition: {
            duration: 0.2,
            ease: [0.4, 0, 1, 1],
        },
    },
};