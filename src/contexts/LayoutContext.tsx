// START OF FILE LayoutContext.tsx
/**
 * 文件功能：
 * 此文件定义了全局布局上下文（LayoutContext），用于管理整个应用的共享布局状态。
 *
 * 本次修改：
 * - 解决了导致无限渲染循环的致命bug。
 * - 使用了 `useCallback` Hook 来包裹 `togglePanel` 和 `closePanel` 函数。
 * - 这确保了这些函数在组件的生命周期内保持稳定，不会在每次重渲染时都创建新的实例，从而打破了与 `MainLayout` 中 `useEffect` 的无限依赖循环。
 * - 【新增】增加了 `isPanelRelevant` 状态，用于指示当前页面是否与侧边面板相关，从而实现面板的智能关闭逻辑。
 */
import React, { createContext, useState, useContext, useMemo, useCallback, type ReactNode } from 'react'; // 导入 React 核心功能和 Hooks。

interface LayoutContextType {
    isPanelOpen: boolean; // 面板是否打开的布尔状态。
    togglePanel: () => void; // 切换面板打开/关闭状态的函数。
    closePanel: () => void; // 关闭面板的函数。
    panelContent: ReactNode | null; // 面板中要显示的内容，可以是 React 节点或 null。
    setPanelContent: (content: ReactNode | null) => void; // 设置面板内容的函数。
    panelTitle: string; // 面板标题的字符串。
    setPanelTitle: (title: string) => void; // 设置面板标题的函数。
    panelWidth: number; // 面板宽度的数字。
    setPanelWidth: (width: number) => void; // 设置面板宽度的函数。
    isPanelRelevant: boolean; // 【新增】指示当前页面是否与面板相关。
    setIsPanelRelevant: (relevant: boolean) => void; // 【新增】设置面板相关性的函数。
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined); // 创建 LayoutContext，初始值为 undefined。

/**
 * LayoutProvider 组件:
 * 提供 LayoutContext，管理共享的布局状态，并将其值提供给所有子组件。
 *
 * @param {object} props - 组件属性。
 * @param {ReactNode} props.children - 需要访问上下文的子组件。
 * @returns {JSX.Element} 提供上下文的组件。
 */
export const LayoutProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // 定义 isPanelOpen 状态，并尝试从 localStorage 读取其初始值，如果不存在或读取失败则默认为 false。
    const [isPanelOpen, setIsPanelOpen] = useState<boolean>(() => {
        try {
            const item = window.localStorage.getItem('panelOpen'); // 尝试从 localStorage 获取 'panelOpen' 键的值。
            return item ? JSON.parse(item) : false; // 如果有值，则解析为布尔值；否则默认为 false。
        } catch (error) {
            console.error("Error reading 'panelOpen' from localStorage:", error); // 捕获并打印读取 localStorage 时的错误。
            return false; // 读取失败时也默认为 false。
        }
    });

    const [panelContent, setPanelContent] = useState<ReactNode | null>(null); // 定义面板内容状态，初始为 null。
    const [panelTitle, setPanelTitle] = useState<string>(''); // 定义面板标题状态，初始为空字符串。
    const [panelWidth, setPanelWidth] = useState<number>(360); // 定义面板宽度状态，初始为 360。
    const [isPanelRelevant, setIsPanelRelevant] = useState<boolean>(false); // 【新增】定义面板相关性状态，初始为 false。

    // 使用 useEffect 将 isPanelOpen 状态的变化同步到 localStorage。
    React.useEffect(() => {
        try {
            window.localStorage.setItem('panelOpen', JSON.stringify(isPanelOpen)); // 将 isPanelOpen 的当前值序列化为 JSON 字符串并存储到 localStorage。
        } catch (error) {
            console.error("Error writing 'panelOpen' to localStorage:", error); // 捕获并打印写入 localStorage 时的错误。
        }
    }, [isPanelOpen]); // 依赖项为 isPanelOpen，每当其值改变时，此 effect 就会运行。

    // 修复点：使用 useCallback 包裹 togglePanel 函数，确保其引用稳定。
    // 这避免了在每次组件重渲染时创建新的函数实例，从而防止了不必要的子组件渲染和潜在的无限循环问题。
    const togglePanel = useCallback(() => {
        setIsPanelOpen(prev => !prev); // 切换 isPanelOpen 的布尔值。
    }, []); // 空依赖数组表示此函数在组件生命周期内只会创建一次。

    // 修复点：使用 useCallback 包裹 closePanel 函数，确保其引用稳定。
    // 提供一个明确的关闭面板的方法，而不是依赖 togglePanel 来推断。
    const closePanel = useCallback(() => {
        setIsPanelOpen(false); // 强制将 isPanelOpen 设置为 false。
    }, []); // 空依赖数组表示此函数在组件生命周期内只会创建一次。

    // 使用 useMemo 缓存上下文值，只有当依赖项变化时才重新计算。
    // 这进一步优化了性能，避免了不必要的 Context 消费者组件的重新渲染。
    const value = useMemo(() => ({
        isPanelOpen,     // 面板打开状态。
        togglePanel,     // 切换面板函数。
        closePanel,      // 关闭面板函数。
        panelContent,    // 面板内容。
        setPanelContent, // 设置面板内容函数。
        panelTitle,      // 面板标题。
        setPanelTitle,   // 设置面板标题函数。
        panelWidth,      // 面板宽度。
        setPanelWidth,   // 设置面板宽度函数。
        isPanelRelevant, // 【新增】面板相关性状态。
        setIsPanelRelevant // 【新增】设置面板相关性函数。
    }), [isPanelOpen, panelContent, panelTitle, panelWidth, togglePanel, closePanel, isPanelRelevant]); // 依赖项包括所有在 value 对象中使用的状态和稳定的回调函数。

    return (
        <LayoutContext.Provider value={value}> {/* 将缓存的上下文值传递给 Provider。 */}
            {children} {/* 渲染子组件，使它们能够访问上下文。 */}
        </LayoutContext.Provider>
    );
};

/**
 * useLayout Hook:
 * 一个自定义 Hook，用于在 LayoutProvider 的子组件中方便地访问 LayoutContext。
 *
 * @returns {LayoutContextType} LayoutContext 的当前值。
 * @throws {Error} 如果在 LayoutProvider 外部使用此 Hook，则抛出错误。
 */
export const useLayout = (): LayoutContextType => {
    const context = useContext(LayoutContext); // 使用 useContext Hook 获取 LayoutContext 的当前值。
    if (!context) { // 如果 context 为 undefined，表示 Hook 在 Provider 外部被调用。
        throw new Error('useLayout 必须在 LayoutProvider 内部使用'); // 抛出错误。
    }
    return context; // 返回上下文值。
};
// END OF FILE LayoutContext.tsx