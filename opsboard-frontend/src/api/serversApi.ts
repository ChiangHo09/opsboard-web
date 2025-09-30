/**
 * @file src/api/serversApi.ts
 * @description 提供了与服务器相关的 API 函数和类型定义。
 * @modification 本次提交中所做的具体修改摘要。
 *   - [后端分页]：`fetchAll` 函数现在接收 `page` 和 `pageSize` 参数，并将其作为 URL 查询参数发送给后端。
 *   - [类型更新]：新增了 `PaginatedResponse` 类型，以匹配后端分页接口返回的 `{ total: number, data: T[] }` 结构。
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

// 定义通用的分页响应结构
export interface PaginatedResponse<T> {
    total: number;
    data: T[];
}

type ServerApiResponse = Omit<ServerRow, 'id' | 'customerId'> & {
    id: number;
    customerId: number;
};

export const serversApi = {
    /**
     * 从后端分页获取服务器列表。
     * @param {number} page - 当前页码 (从1开始)。
     * @param {number} pageSize - 每页记录数。
     * @returns {Promise<PaginatedResponse<ServerRow>>} 返回一个包含总数和当前页数据的 Promise。
     */
    fetchAll: async (page: number, pageSize: number): Promise<PaginatedResponse<ServerRow>> => {
        // 将分页参数附加到 URL query string
        const response = await api<PaginatedResponse<ServerApiResponse>>(`/servers/list?page=${page}&pageSize=${pageSize}`);

        // 转换 data 数组中的 id 类型
        const transformedData = response.data.map(server => ({
            ...server,
            id: String(server.id),
            customerId: String(server.customerId),
        }));

        return {
            total: response.total,
            data: transformedData,
        };
    },

    /**
     * 根据 ID 删除一个服务器。
     * @param {string} id - 要删除的服务器的 ID。
     * @returns {Promise<void>} 操作成功时不返回任何内容。
     */
    deleteById: (id: string): Promise<void> => {
        return api(`/servers/${id}`, {
            method: 'DELETE',
        });
    },
};