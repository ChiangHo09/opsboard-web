/**
 * 文件名: src/contexts/LayoutContext.tsx
 *
 * 文件功能描述:
 * 此文件定义了全局布局上下文（LayoutContext），用于管理整个应用的共享布局状态。
 *
 * 本次修改内容:
 * - 【代码简化】移除了 `isPanelRelevant` 状态及其更新函数。
 * - **优化背景**:
 *   `isPanelRelevant` 是为了解决跨页面跳转时面板关闭问题而引入的中间状态，但它本身也引发了复杂的竞态条件。
 * - **解决方案**:
 *   通过将面板管理的责任完全下放到各个页面组件，我们不再需要这个在布局层进行通信的标志。
 * - **结果**: 上下文的接口更简洁，整体状态管理逻辑更清晰。
 */
import React, { createContext, useState, useContext, useMemo, useCallback, type ReactNode, useEffect } from 'react';
import { useTheme, useMediaQuery } from '@mui/material';

// 定义【状态值】的接口
interface LayoutStateContextType {
    isPanelOpen: boolean;
    panelContent: ReactNode | null;
    panelTitle: string;
    panelWidth: number;
    // isPanelRelevant: boolean; // 【核心修复】移除
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
    // setIsPanelRelevant: (relevant: boolean) => void; // 【核心修复】移除
    setIsModalOpen: (isOpen: boolean) => void;
    setModalConfig: (config: { content: ReactNode | null; onClose: (() => void) | null }) => void;
}

const LayoutStateContext = createContext<LayoutStateContextType | undefined>(undefined);
const LayoutDispatchContext = createContext<LayoutDispatchContextType | undefined>(undefined);

export const LayoutProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isPanelOpen, setIsPanelOpen] = useState<boolean>(() => {
        try { const item = window.localStorage.getItem('panelOpen'); return item ? JSON.parse(item) : false; }
        catch (error) { console.error(error); return false; }
    });
    const [panelContent, setPanelContent] = useState<ReactNode | null>(null);
    const [panelTitle, setPanelTitle] = useState<string>('');
    const [panelWidth, setPanelWidth] = useState<number>(360);
    // const [isPanelRelevant, setIsPanelRelevant] = useState<boolean>(false); // 【核心修复】移除
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

    const stateValue = useMemo<LayoutStateContextType>(() => ({
        isPanelOpen, panelContent, panelTitle, panelWidth, isMobile,
        isModalOpen, modalContent, onModalClose,
    }), [
        isPanelOpen, panelContent, panelTitle, panelWidth, isMobile,
        isModalOpen, modalContent, onModalClose,
    ]);

    const dispatchValue = useMemo<LayoutDispatchContextType>(() => ({
        togglePanel,
        closePanel,
        setPanelContent,
        setPanelTitle,
        setPanelWidth,
        setIsModalOpen,
        setModalConfig,
    }), [togglePanel, closePanel, setModalConfig]);

    return (
        <LayoutStateContext.Provider value={stateValue}>
            <LayoutDispatchContext.Provider value={dispatchValue}>
                {children}
            </LayoutDispatchContext.Provider>
        </LayoutStateContext.Provider>
    );
};

export const useLayoutState = (): LayoutStateContextType => {
    const context = useContext(LayoutStateContext);
    if (!context) { throw new Error('useLayoutState 必须在 LayoutProvider 内部使用'); }
    return context;
};

export const useLayoutDispatch = (): LayoutDispatchContextType => {
    const context = useContext(LayoutDispatchContext);
    if (!context) { throw new Error('useLayoutDispatch 必须在 LayoutProvider 内部使用'); }
    return context;
};

export const useLayout = (): LayoutStateContextType & LayoutDispatchContextType => {
    return {
        ...useLayoutState(),
        ...useLayoutDispatch(),
    };
};