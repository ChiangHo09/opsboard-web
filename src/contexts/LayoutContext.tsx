/**
 * 文件名: src/contexts/LayoutContext.tsx
 *
 * 本次修改内容:
 * - 【架构重构】为了解决弹窗状态的竞态条件问题，重构了上下文的 API。
 * - 移除了 `openModal` 和 `closeModal` 方法。
 * - 新增了 `setIsModalOpen` 状态设置函数，允许消费者直接控制弹窗的开关。
 * - 新增了 `setModalConfig` 函数，用于一次性设置弹窗的 `content` 和 `onClose` 回调。
 * - 这种更直接的状态管理方式，避免了由命令式调用（open/close）引起的副作用问题。
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
    // 【修改】弹窗 API
    isModalOpen: boolean;
    setIsModalOpen: (isOpen: boolean) => void;
    modalContent: ReactNode | null;
    onModalClose: (() => void) | null;
    setModalConfig: (config: { content: ReactNode | null; onClose: (() => void) | null }) => void;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export const LayoutProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // 面板状态
    const [isPanelOpen, setIsPanelOpen] = useState<boolean>(() => {
        try { const item = window.localStorage.getItem('panelOpen'); return item ? JSON.parse(item) : false; }
        catch (error) { console.error(error); return false; }
    });
    const [panelContent, setPanelContent] = useState<ReactNode | null>(null);
    const [panelTitle, setPanelTitle] = useState<string>('');
    const [panelWidth, setPanelWidth] = useState<number>(360);
    const [isPanelRelevant, setIsPanelRelevant] = useState<boolean>(false);

    // 弹窗状态
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

    // 【修改】设置弹窗配置
    const setModalConfig = useCallback((config: { content: ReactNode | null; onClose: (() => void) | null }) => {
        setModalContent(config.content);
        setOnModalClose(() => config.onClose);
    }, []);


    const value = useMemo(() => ({
        isPanelOpen, togglePanel, closePanel, panelContent, setPanelContent, panelTitle,
        setPanelTitle, panelWidth, setPanelWidth, isPanelRelevant, setIsPanelRelevant, isMobile,
        // 【修改】导出新的弹窗 API
        isModalOpen, setIsModalOpen, modalContent, onModalClose, setModalConfig,
    }), [
        isPanelOpen, panelContent, panelTitle, panelWidth, isPanelRelevant, isMobile,
        togglePanel, closePanel,
        isModalOpen, modalContent, onModalClose, // 依赖 setIsModalOpen 和 setModalConfig
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