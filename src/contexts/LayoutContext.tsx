/**
 * 文件名: src/contexts/LayoutContext.tsx
 *
 * 本次修改内容:
 * - 【解耦】将移动设备视图的判断逻辑 (`isMobile`) 集中到此上下文中，作为全局共享状态。
 * - 在 `LayoutContextType` 接口中增加了 `isMobile: boolean` 属性。
 * - 在 `LayoutProvider` 组件内部使用 `useTheme` 和 `useMediaQuery` 来计算 `isMobile` 状态。
 * - 将 `isMobile` 状态添加到 `useMemo` 缓存的 `value` 对象中，使其可通过 `useLayout` hook 被所有子组件访问。
 *
 * 文件功能描述:
 * 此文件定义了全局布局上下文（LayoutContext），用于管理整个应用的共享布局状态，
 * 包括侧边面板的开关、内容，以及响应式的视图状态（如是否为移动设备）。
 */
import React, { createContext, useState, useContext, useMemo, useCallback, type ReactNode } from 'react';
import { useTheme, useMediaQuery } from '@mui/material'; // 【新增】导入 useTheme 和 useMediaQuery

interface LayoutContextType {
    isPanelOpen: boolean;
    togglePanel: () => void;
    closePanel: () => void;
    panelContent: ReactNode | null;
    setPanelContent: (content: ReactNode | null) => void;
    panelTitle: string;
    setPanelTitle: (title: string) => void;
    panelWidth: number;
    setPanelWidth: (width: number) => void;
    isPanelRelevant: boolean;
    setIsPanelRelevant: (relevant: boolean) => void;
    isMobile: boolean; // 【新增】响应式状态
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export const LayoutProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isPanelOpen, setIsPanelOpen] = useState<boolean>(() => {
        try {
            const item = window.localStorage.getItem('panelOpen');
            return item ? JSON.parse(item) : false;
        } catch (error) {
            console.error("Error reading 'panelOpen' from localStorage:", error);
            return false;
        }
    });

    const [panelContent, setPanelContent] = useState<ReactNode | null>(null);
    const [panelTitle, setPanelTitle] = useState<string>('');
    const [panelWidth, setPanelWidth] = useState<number>(360);
    const [isPanelRelevant, setIsPanelRelevant] = useState<boolean>(false);

    // 【新增】集中处理响应式判断逻辑
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    React.useEffect(() => {
        try {
            window.localStorage.setItem('panelOpen', JSON.stringify(isPanelOpen));
        } catch (error) {
            console.error("Error writing 'panelOpen' to localStorage:", error);
        }
    }, [isPanelOpen]);

    const togglePanel = useCallback(() => {
        setIsPanelOpen(prev => !prev);
    }, []);

    const closePanel = useCallback(() => {
        setIsPanelOpen(false);
    }, []);

    const value = useMemo(() => ({
        isPanelOpen,
        togglePanel,
        closePanel,
        panelContent,
        setPanelContent,
        panelTitle,
        setPanelTitle,
        panelWidth,
        setPanelWidth,
        isPanelRelevant,
        setIsPanelRelevant,
        isMobile, // 【新增】将 isMobile 添加到 context value 中
    }), [isPanelOpen, panelContent, panelTitle, panelWidth, togglePanel, closePanel, isPanelRelevant, isMobile]); // 【新增】将 isMobile 添加到依赖数组

    return (
        <LayoutContext.Provider value={value}>
            {children}
        </LayoutContext.Provider>
    );
};

export const useLayout = (): LayoutContextType => {
    const context = useContext(LayoutContext);
    if (!context) {
        throw new Error('useLayout 必须在 LayoutProvider 内部使用');
    }
    return context;
};