/**
 * @file src/hooks/useAuth.ts
 * @description 一个自定义钩子，用于简化对 AuthContext 的访问。
 * @modification
 *   - [New File]: 创建此文件以提供一个便捷的、类型安全的 AuthContext 访问器。
 *   - [Best Practice]: 确保 `useContext` 在 `AuthProvider` 的子组件中被调用，否则会抛出错误，这是一种良好的实践。
 */
import { useContext } from 'react';
import { AuthContext } from '@/contexts/AuthContext';

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth 必须在 AuthProvider 内部使用');
    }
    return context;
};