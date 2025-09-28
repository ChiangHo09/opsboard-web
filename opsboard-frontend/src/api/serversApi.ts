/**
 * @file src/api/serversApi.ts
 * @description 提供了与服务器相关的 API 函数和类型定义。
 * @modification 本次提交中所做的具体修改摘要。
 *   - [最终修复]：重构了 `ServerApiResponse` 的类型定义，使用 `Omit` 和交叉类型 `&` 来精确描述其结构。
 *   - [原因]：此修改是解决 TypeScript 类型推断失败 (TS2322) 的决定性方案。通过为 `ServerApiResponse` 提供一个精确的、而非模糊的（带有索引签名）类型定义，我们使得 TypeScript 能够正确推断出扩展运算符（`...server`）的结果，从而确保了数据转换后对象的类型与 `ServerRow` 完全匹配。
 */
import api from './index';

export type GoNullString = {
    String: string;
    Valid: boolean;
} | null;

export interface ServerRow {
    id: string;
    customerId: string;
    serverName: string;
    ip: string;
    role: GoNullString;
    dep: GoNullString;
    custNote: GoNullString;
    note: GoNullString;
    createdAt: string;
    updatedAt: GoNullString;
    customerName: string;
}

// [核心修复] 使用 Omit 和交叉类型来创建精确的 API 响应类型
// 这个类型的意思是：“它拥有 ServerRow 的所有属性，除了 'id' 和 'customerId'，
// 然后再加上自己的 'id' 和 'customerId'，这两个是 number 类型。”
type ServerApiResponse = Omit<ServerRow, 'id' | 'customerId'> & {
    id: number;
    customerId: number;
};

export const serversApi = {
    /**
     * 从后端获取所有服务器的列表，并进行类型转换。
     * @returns {Promise<ServerRow[]>} 返回一个解析为服务器数组的 Promise。
     */
    fetchAll: async (): Promise<ServerRow[]> => {
        const response = await api<ServerApiResponse[]>('/servers/list');

        // 现在 TypeScript 知道 response 中的每个 server 对象都包含了所有必需的属性
        return response.map(server => ({
            ...server,
            id: String(server.id),
            customerId: String(server.customerId),
        }));
    },
};