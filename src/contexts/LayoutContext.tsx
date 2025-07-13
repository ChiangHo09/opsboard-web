/*
 * [文件用途说明]
 * - 此文件定义了 LayoutContext 及其 Provider，用于在整个应用中管理和共享与主布局相关的UI状态。
 *
 * [本次修改记录]
 * - 彻底简化了 Context 的职责，使其只关心布局本身的UI状态。
 * - 移除了 `panelActions` 和 `setPanelActions`，将业务逻辑（如 onSearch）与布局状态解耦。
 * - `panelContent` 仍然保留，但其角色变为一个通用的JSX插槽，用于接收由页面传入的、完全独立的组件（如 ServerSearchForm）。
 * - 新增了 `panelWidth` 和 `setPanelWidth`，使得页面可以灵活控制面板宽度，同时保持上下文的简洁性。
 */
import { createContext, useContext, useState, useMemo, useCallback, type ReactNode } from 'react';

// Context 的类型定义，只包含纯粹的UI布局状态
export interface LayoutContextType {
    isPanelOpen: boolean;
    togglePanel: () => void;
    closePanel: () => void;
    panelContent: ReactNode | null;
    setPanelContent: (content: ReactNode | null) => void;
    panelTitle: string;
    setPanelTitle: (title: string) => void;
    panelWidth: number | undefined;
    setPanelWidth: (width: number | undefined) => void;
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
    const [panelTitle, setPanelTitle] = useState('搜索');
    const [panelWidth, setPanelWidth] = useState<number | undefined>(undefined);

    const togglePanel = useCallback(() => setIsPanelOpen(prev => !prev), []);
    const closePanel = useCallback(() => setIsPanelOpen(false), []);

    const contextValue = useMemo(() => ({
        isPanelOpen,
        togglePanel,
        closePanel,
        panelContent,
        setPanelContent,
        panelTitle,
        setPanelTitle,
        panelWidth,
        setPanelWidth,
    }), [isPanelOpen, panelContent, panelTitle, panelWidth, togglePanel, closePanel]);

    return (
        <LayoutContext.Provider value={contextValue}>
            {children}
        </LayoutContext.Provider>
    );
}