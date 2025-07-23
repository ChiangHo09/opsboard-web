/**
 * 文件名: src/contexts/LayoutContext.tsx
 *
 * 本次修改内容:
 * - 【问题修复】修复了 `useMemo` 钩子的依赖数组，将 `setIsModalOpen` 和 `setModalConfig` 添加进去。
 * - 这个修复确保了从 `useLayout` 返回的上下文 `value` 对象本身是稳定的，
 *   只在真正需要时才创建新的引用，这是避免下游组件不必要重渲染的关键一步。
 *
 * 文件功能描述:
 * 此文件定义了全局布局上下文（LayoutContext），用于管理整个应用的共享布局状态，
 * 包括侧边面板、通用弹窗，以及响应式的视图状态。
 */
import React, { createContext, useState, useContext, useMemo, useCallback, type ReactNode, useEffect } from 'react';
import { useTheme, useMediaQuery } from '@mui/material';

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
    isMobile: boolean;
    isModalOpen: boolean;
    setIsModalOpen: (isOpen: boolean) => void;
    modalContent: ReactNode | null;
    onModalClose: (() => void) | null;
    setModalConfig: (config: { content: ReactNode | null; onClose: (() => void) | null }) => void;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export const LayoutProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
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

    const togglePanel = useCallback(() => { setIsPanelOpen(prev => !prev); }, []);
    const closePanel = useCallback(() => { setIsPanelOpen(false); }, []);

    const setModalConfig = useCallback((config: { content: ReactNode | null; onClose: (() => void) | null }) => {
        setModalContent(config.content);
        setOnModalClose(() => config.onClose);
    }, []);

    const value = useMemo(() => ({
        isPanelOpen, togglePanel, closePanel, panelContent, setPanelContent, panelTitle,
        setPanelTitle, panelWidth, setPanelWidth, isPanelRelevant, setIsPanelRelevant, isMobile,
        isModalOpen, setIsModalOpen, modalContent, onModalClose, setModalConfig,
    }), [
        isPanelOpen, panelContent, panelTitle, panelWidth, isPanelRelevant, isMobile,
        togglePanel, closePanel,
        isModalOpen, modalContent, onModalClose, setIsModalOpen, setModalConfig // 【核心修复】补全依赖
    ]);

    return (
        <LayoutContext.Provider value={value}>
            {children}
        </LayoutContext.Provider>
    );
};

export const useLayout = (): LayoutContextType => {
    const context = useContext(LayoutContext);
    if (!context) { throw new Error('useLayout 必须在 LayoutProvider 内部使用'); }
    return context;
};