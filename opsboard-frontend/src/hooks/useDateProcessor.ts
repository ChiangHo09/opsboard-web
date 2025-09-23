/**
 * @file src/hooks/useDateProcessor.ts
 * @description 提供一个与 Web Worker 通信的自定义钩子，用于将耗时计算任务委托给后台线程。
 * @modification
 *   - [新功能]：创建了此文件，封装了与 `date.worker.ts` 的交互逻辑。
 *     - 在组件挂载时初始化 Web Worker，并在卸载时终止它，以避免内存泄漏。
 *     - 管理与 Worker 通信相关的状态（如 `isLoading`, `result`）。
 *     - 提供一个 `processData` 函数，供组件调用以向 Worker 发送数据。
 *     - 监听来自 Worker 的消息以更新状态。
 */
import { useState, useEffect, useRef, useCallback } from 'react';

// 定义钩子返回值的接口
interface UseDateProcessorReturn {
    result: string | null;
    isLoading: boolean;
    processData: (data: Date[]) => void;
}

/**
 * 自定义钩子，用于管理与日期处理 Web Worker 的交互。
 * @returns {UseDateProcessorReturn} 返回包含处理结果、加载状态和触发处理函数组成的对象。
 */
export function useDateProcessor(): UseDateProcessorReturn {
    const [result, setResult] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // 使用 useRef 来持有 worker 实例，避免在每次重渲染时重新创建
    const workerRef = useRef<Worker | null>(null);

    // 组件挂载时初始化 Worker
    useEffect(() => {
        // 创建一个新的 Worker 实例
        // `new URL(...)` 是 Vite 和其他现代构建工具推荐的创建 Worker 的方式
        workerRef.current = new Worker(new URL('../workers/date.worker.ts', import.meta.url), {
            type: 'module',
        });

        // 设置消息监听器，用于接收来自 Worker 的结果
        workerRef.current.onmessage = (event: MessageEvent<string>) => {
            setResult(event.data);
            setIsLoading(false);
        };

        // 组件卸载时终止 Worker，释放资源
        return () => {
            workerRef.current?.terminate();
        };
    }, []); // 空依赖数组确保此 effect 只运行一次

    // 定义一个函数，用于向 Worker 发送数据
    const processData = useCallback((data: Date[]) => {
        if (workerRef.current) {
            setIsLoading(true);
            setResult(null);
            workerRef.current.postMessage(data);
        }
    }, []); // useCallback 确保此函数的引用稳定

    return { result, isLoading, processData };
}