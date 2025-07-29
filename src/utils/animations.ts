/**
 * 文件名: src/utils/animations.ts
 *
 * 文件功能描述:
 * 此文件是应用的动画配置中心。它定义并导出了所有可重用的 `framer-motion` 动画变体（variants）
 * 和过渡（transition）配置，以确保整个应用中的动画效果在视觉和节奏上保持一致。
 *
 * 本次修改内容:
 * - 【动画统一修复】将移动端面板的专属动画（`mobilePanelVariants`）添加到了此集中配置文件中。
 * - **问题根源**:
 *   之前为移动端详情页设计的动画与搜索面板的实际动画不一致。
 * - **解决方案**:
 *   1.  从 `MainLayout.tsx` 中提取出基于 `scale` (缩放) 的 `mobilePanelVariants` 定义。
 *   2.  将其添加到此文件中，并重命名为 `mobileOverlayVariants` 以获得更通用的语义（因为它现在用于所有移动端的覆盖层）。
 *   3.  保留了原有的 `pageVariants` 和 `panelContentVariants`，用于桌面端和其他不需要缩放动画的场景。
 * - **最终效果**:
 *   所有移动端的覆盖层（搜索面板、详情页）现在都可以从同一个源文件导入完全相同的动画配置，确保了视觉体验的绝对一致。
 */
import { type Variants, type Transition } from 'framer-motion';

// 定义一个全局共享的过渡效果配置
export const pageTransition: Transition = {
    duration: 0.28,
    ease: [0.4, 0, 0.2, 1],
};

// 为主内容区域的页面切换定义的标准动画变体
export const pageVariants: Variants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
};

// 为【桌面端】右侧面板内容切换定义的、基于垂直位移的动画变体
export const panelContentVariants: Variants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
};

// 【核心修复】为【移动端】所有覆盖层（搜索面板、详情页）定义的、基于缩放的动画变体
export const mobileOverlayVariants: Variants = {
    initial: { opacity: 0, scale: 0.98 },
    animate: { opacity: 1, scale: 1, transition: { duration: 0.2, ease: 'easeOut' } },
    exit: { opacity: 0, scale: 0.98, transition: { duration: 0.2, ease: 'easeIn' } },
};