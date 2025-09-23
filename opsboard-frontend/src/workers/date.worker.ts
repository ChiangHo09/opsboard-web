/**
 * @file src/workers/date.worker.ts
 * @description 这是一个 Web Worker 脚本，专门用于在后台线程处理计算密集型任务，避免阻塞主线程。
 * @modification
 *   - [新功能]：创建了此文件，以演示如何将耗时操作移出主线程。
 *     - 监听 'message' 事件以接收来自主线程的数据。
 *     - 模拟一个耗时的日期处理任务（例如，循环一百万次）。
 *     - 任务完成后，通过 `postMessage` 将结果发送回主线程。
 */

// 监听来自主线程的消息
self.addEventListener('message', (event: MessageEvent<Date[]>) => {
    console.log('Web Worker: Received data from main thread.', event.data);

    const dates = event.data;

    // 模拟一个计算密集型任务
    // 注意：在真实场景中，这里会是复杂的数据处理、加密、或大型JSON解析等。
    // 这里用一个循环来模拟阻塞，以便在性能分析工具中清晰地看到效果。
    const startTime = performance.now();
    for (let i = 0; i < 1000000; i++) {
        // 模拟复杂计算
        Math.sqrt(i);
    }
    const processedResult = `Processed ${dates.length} dates. Mock calculation took ${Math.round(performance.now() - startTime)}ms on a background thread.`;

    // 将处理结果发送回主线程
    self.postMessage(processedResult);
});

// 导出空对象以符合 TypeScript 的模块系统要求
export default {};