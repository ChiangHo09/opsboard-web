// src/contexts/LayoutContext.tsx
import { createContext, useContext, useState, type ReactNode } from 'react';

// 定义面板操作的类型，T 约束为键为字符串、值为 unknown 的对象
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
    panelContent: ReactNode | null; // 用于存放右侧面板的内容
    setPanelContent: (content: ReactNode | null) => void; // 用于设置右侧面板的内容
    // 使用 Record<string, unknown> 替代 any，更具体和安全
    panelActions: PanelActions<Record<string, unknown>>; // 新增：用于存放面板的搜索/重置函数及其他属性
    setPanelActions: (actions: PanelActions<Record<string, unknown>>) => void; // 新增：用于设置面板动作
}

// FIX: 将 createContext 的默认值从 undefined 更改为 null!，
// 并明确上下文类型为 LayoutContextType。
// useLayout 中的非空检查仍然提供运行时安全。
export const LayoutContext = createContext<LayoutContextType>(null!);

export function useLayout() {
    const context = useContext(LayoutContext);
    if (!context) {
        throw new Error('useLayout 必须在 LayoutProvider 内部使用');
    }
    return context;
}

// 新增 LayoutProvider 组件
export function LayoutProvider({ children }: { children: ReactNode }) {
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [panelContent, setPanelContent] = useState<ReactNode | null>(null);
    // 使用 Record<string, unknown> 替代 any 进行初始化
    const [panelActions, setPanelActions] = useState<PanelActions<Record<string, unknown>>>({}); // 初始化面板动作为空对象

    const togglePanel = () => setIsPanelOpen(prev => !prev);

    const contextValue: LayoutContextType = {
        isPanelOpen,
        togglePanel,
        panelContent,
        setPanelContent,
        panelActions,
        setPanelActions,
    };

    return (
        <LayoutContext.Provider value={contextValue}>
            {children}
        </LayoutContext.Provider>
    );
}
