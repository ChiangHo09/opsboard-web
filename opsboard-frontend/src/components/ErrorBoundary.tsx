/**
 * 文件名: src/components/ErrorBoundary.tsx
 *
 * 文件功能描述:
 * 此文件定义了一个可重用的、基于类的 React 错误边界组件。
 * 它的核心职责是捕获其子组件树在渲染期间抛出的任何 JavaScript 错误，
 * 防止整个应用因此崩溃（白屏），并渲染一个备用的“降级”UI。
 *
 * 本次修改内容:
 * - 无需修改。此类组件的写法是 React 的标准，不涉及 React.FC。
 */
import {Component, type ErrorInfo, type ReactNode} from 'react';

interface Props {
    children: ReactNode;
    fallback: ReactNode; // 定义一个备用UI，在捕获到错误时显示
}

interface State {
    hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
    };

    // 当后代组件抛出错误后，此生命周期方法会被调用
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public static getDerivedStateFromError(_: Error): State {
        // 更新 state，使得下一次渲染可以显示降级后的 UI
        return {hasError: true};
    }

    // 当后代组件抛出错误后，此生命周期方法也会被调用
    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        // 在这里，你可以将错误信息记录到外部服务，例如 Sentry, LogRocket 等
        console.error("ErrorBoundary 捕获到错误:", error, errorInfo);
    }

    public render() {
        // 如果 state.hasError 为 true，渲染我们预设的 fallback UI
        if (this.state.hasError) {
            return this.props.fallback;
        }

        // 正常情况下，渲染子组件
        return this.props.children;
    }
}

export default ErrorBoundary