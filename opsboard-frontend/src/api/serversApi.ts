/**
 * @file src/api/serversApi.ts
 * @description 提供了与服务器相关的 API 函数和类型定义。
 * @modification 本次提交中所做的具体修改摘要。
 *   - [新增功能]：添加了 `deleteById` 函数，用于调用后端的删除服务器接口。
 *   - [实现]：该函数接收一个服务器 ID，并向 `/servers/:id` 端点发送一个 `DELETE` 方法的 HTTP 请求。
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

        return response.map(server => ({
            ...server,
            id: String(server.id),
            customerId: String(server.customerId),
        }));
    },

    /**
     * 根据 ID 删除一个服务器。
     * @param {string} id - 要删除的服务器的 ID。
     * @returns {Promise<void>} 操作成功时不返回任何内容。
     */
    deleteById: (id: string): Promise<void> => {
        // 假设后端的删除接口是 DELETE /api/servers/:id
        return api(`/servers/${id}`, {
            method: 'DELETE',
        });
    },
};