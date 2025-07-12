/*
 * [文件用途说明]
 * - 此文件定义了 LayoutContext 及其 Provider，用于在整个应用中管理和共享与主布局相关的状态，
 *   例如右侧面板的开关状态、内容和动作。
 *
 * [本次修改记录]
 * - 导入了 `useCallback` 和 `useMemo` 钩子。
 * - 使用 `useCallback` 包装了 `togglePanel` 和 `closePanel` 函数。
 *   这可以确保这些函数的引用在组件的多次渲染之间保持稳定，
 *   解决了因函数引用变化而错误触发 MainLayout 中 useEffect 的问题，修复了面板无法正常打开的 bug。
 * - 使用 `useMemo` 包装了 `contextValue` 对象，这是 context provider 的一个最佳实践，可以防止不必要的子组件重渲染。
 */
import { createContext, useContext, useState, useMemo, useCallback, type ReactNode } from 'react';

// 定义面板操作的类型
export interface PanelActions<T extends Record<string, unknown>> {
    onSearch?: (values: T) => void;
    onReset?: () => void;
    title?: string;
    width?: number;
    showActionBar?: boolean;
}

// 更新 LayoutContextType
export interface LayoutContextType {
    isPanelOpen: boolean;
    togglePanel: () => void;
    closePanel: () => void;
    panelContent: ReactNode | null;
    setPanelContent: (content: ReactNode | null) => void;
    panelActions: PanelActions<Record<string, unknown>>;
    setPanelActions: (actions: PanelActions<Record<string, unknown>>) => void;
}

export const LayoutContext = createContext<LayoutContextType>(null!);

export function useLayout() {
    const context = useContext(LayoutContext);
    if (!context) {
        throw new Error('useLayout 必须在 LayoutProvider 内部使用');
    }
    return context;
}

export function LayoutProvider({ children }: { children: ReactNode }) {
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [panelContent, setPanelContent] = useState<ReactNode | null>(null);
    const [panelActions, setPanelActions] = useState<PanelActions<Record<string, unknown>>>({});

    // 使用 useCallback 稳定化函数引用
    const togglePanel = useCallback(() => setIsPanelOpen(prev => !prev), []);
    const closePanel = useCallback(() => setIsPanelOpen(false), []);

    // 使用 useMemo 稳定化 context 的值，避免不必要的重渲染
    const contextValue = useMemo(() => ({
        isPanelOpen,
        togglePanel,
        closePanel,
        panelContent,
        setPanelContent,
        panelActions,
        setPanelActions,
    }), [isPanelOpen, panelContent, panelActions, togglePanel, closePanel]);


    return (
        <LayoutContext.Provider value={contextValue}>
            {children}
        </LayoutContext.Provider>
    );
}