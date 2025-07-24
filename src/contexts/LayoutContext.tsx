/**
 * 文件名: src/contexts/LayoutContext.tsx
 *
 * 文件功能描述:
 * 此文件定义了全局布局上下文（LayoutContext），用于管理整个应用的共享布局状态，
 * 包括侧边面板、通用弹窗，以及响应式的视图状态。
 *
 * 本次修改内容:
 * - 【结构性重构】通过将单一上下文拆分为“状态上下文”和“派发/更新上下文”的模式，彻底解决了因不必要重渲染导致的页面切换闪烁等性能问题。
 * - **重构背景**: 原有的单一上下文将状态值和更新函数捆绑在一起，导致任何状态更新都会创建一个新的上下文`value`对象，从而强制重渲染所有消费者，与Framer Motion的动画时机产生冲突。
 * - **解决方案**:
 *   1.  创建了两个独立的Context: `LayoutStateContext`用于传递会变化的状态值，`LayoutDispatchContext`用于传递永远不会变化的更新函数。
 *   2.  `LayoutProvider`现在同时提供这两个Context。`LayoutDispatchContext`的`value`被`useMemo`包裹，且其依赖项(所有`useCallback`函数)是稳定的，因此它只会被创建一次。
 *   3.  创建了两个独立的消费钩子: `useLayoutState`和`useLayoutDispatch`，以便组件能按需订阅，避免不必要的渲染。
 *   4.  保留了组合式的 `useLayout` hook，以便在需要同时访问状态和派发函数的组件中无缝地、向后兼容地使用。
 * - **结果**: 现在，当组件(如新载入的页面)只需要调用更新函数(如`setPanelTitle`)时，它可以只消费稳定不变的`LayoutDispatchContext`，不再触发对`MainLayout`的意外重渲染。这保证了`AnimatePresence`能够平滑、无干扰地执行其过渡动画，闪烁问题被彻底根除。
 */
import React, { createContext, useState, useContext, useMemo, useCallback, type ReactNode, useEffect } from 'react';
import { useTheme, useMediaQuery } from '@mui/material';

// 定义【状态值】的接口
interface LayoutStateContextType {
    isPanelOpen: boolean;
    panelContent: ReactNode | null;
    panelTitle: string;
    panelWidth: number;
    isPanelRelevant: boolean;
    isMobile: boolean;
    isModalOpen: boolean;
    modalContent: ReactNode | null;
    onModalClose: (() => void) | null;
}

// 定义【更新函数】的接口
interface LayoutDispatchContextType {
    togglePanel: () => void;
    closePanel: () => void;
    setPanelContent: (content: ReactNode | null) => void;
    setPanelTitle: (title: string) => void;
    setPanelWidth: (width: number) => void;
    setIsPanelRelevant: (relevant: boolean) => void;
    setIsModalOpen: (isOpen: boolean) => void;
    setModalConfig: (config: { content: ReactNode | null; onClose: (() => void) | null }) => void;
}

// 1. 创建两个独立的上下文
const LayoutStateContext = createContext<LayoutStateContextType | undefined>(undefined);
const LayoutDispatchContext = createContext<LayoutDispatchContextType | undefined>(undefined);

export const LayoutProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // 状态定义 (保持不变)
    const [isPanelOpen, setIsPanelOpen] = useState<boolean>(() => {
        try { const item = window.localStorage.getItem('panelOpen'); return item ? JSON.parse(item) : false; }
        catch (error) { console.error(error); return false; }
    });
    const [panelContent, setPanelContent] = useState<ReactNode | null>(null);
    const [panelTitle, setPanelTitle] = useState<string>('');
    const [panelWidth, setPanelWidth] = useState<number>(360);
    const [isPanelRelevant, setIsPanelRelevant] = useState<boolean>(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState<ReactNode | null>(null);
    const [onModalClose, setOnModalClose] = useState<(() => void) | null>(null);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    useEffect(() => {
        try { window.localStorage.setItem('panelOpen', JSON.stringify(isPanelOpen)); }
        catch (error) { console.error(error); }
    }, [isPanelOpen]);

    // 更新函数定义 (使用 useCallback 保证引用稳定)
    const togglePanel = useCallback(() => { setIsPanelOpen(prev => !prev); }, []);
    const closePanel = useCallback(() => { setIsPanelOpen(false); }, []);
    const setModalConfig = useCallback((config: { content: ReactNode | null; onClose: (() => void) | null }) => {
        setModalContent(config.content);
        setOnModalClose(() => config.onClose);
    }, []);

    // 2. 创建分离的 value 对象
    // a. 状态对象：它的引用会在任何状态值变化时改变
    const stateValue = useMemo<LayoutStateContextType>(() => ({
        isPanelOpen, panelContent, panelTitle, panelWidth, isPanelRelevant, isMobile,
        isModalOpen, modalContent, onModalClose,
    }), [
        isPanelOpen, panelContent, panelTitle, panelWidth, isPanelRelevant, isMobile,
        isModalOpen, modalContent, onModalClose,
    ]);

    // b. 派发/更新函数对象：它的引用是永久稳定的
    const dispatchValue = useMemo<LayoutDispatchContextType>(() => ({
        togglePanel,
        closePanel,
        setPanelContent,
        setPanelTitle,
        setPanelWidth,
        setIsPanelRelevant,
        setIsModalOpen,
        setModalConfig,
    }), [togglePanel, closePanel, setModalConfig]); // 依赖都是稳定函数, 此 useMemo 仅运行一次

    return (
        <LayoutStateContext.Provider value={stateValue}>
            <LayoutDispatchContext.Provider value={dispatchValue}>
                {children}
            </LayoutDispatchContext.Provider>
        </LayoutStateContext.Provider>
    );
};

// 3. 提供分离的 hook
/**
 * [性能优化 Hook] 只订阅布局的状态值。
 * 当布局状态（如面板是否打开）发生变化时，消费此 Hook 的组件将会重渲染。
 * @returns {LayoutStateContextType} 布局状态对象。
 */
export const useLayoutState = (): LayoutStateContextType => {
    const context = useContext(LayoutStateContext);
    if (!context) { throw new Error('useLayoutState 必须在 LayoutProvider 内部使用'); }
    return context;
};

/**
 * [性能优化 Hook] 只获取布局的更新函数。
 * 这些函数的引用是永久稳定的，消费此 Hook 的组件不会因为布局状态的变化而重渲染。
 * @returns {LayoutDispatchContextType} 布局更新函数对象。
 */
export const useLayoutDispatch = (): LayoutDispatchContextType => {
    const context = useContext(LayoutDispatchContext);
    if (!context) { throw new Error('useLayoutDispatch 必须在 LayoutProvider 内部使用'); }
    return context;
};

/**
 * [兼容性 Hook] 同时获取布局的状态值和更新函数。
 * 注意：消费此 Hook 的组件会在任何布局状态变化时都重渲染。
 * 为了最佳性能，请优先使用 `useLayoutState` 和 `useLayoutDispatch`。
 * @returns {LayoutStateContextType & LayoutDispatchContextType} 包含所有状态和更新函数的组合对象。
 */
export const useLayout = (): LayoutStateContextType & LayoutDispatchContextType => {
    return {
        ...useLayoutState(),
        ...useLayoutDispatch(),
    };
};