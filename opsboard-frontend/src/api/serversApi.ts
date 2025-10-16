/**
 * @file src/api/serversApi.ts
 * @description 提供了与服务器相关的 API 函数和类型定义。
 * @modification 本次提交中所做的具体修改摘要。
 *   - [类型新增]：新增了 `ServerDetail` 接口，用于描述从后端获取的单条服务器的完整信息，其结构与数据库表直接对应。
 *   - [API扩展]：在 `serversApi` 对象中新增了 `fetchById` 方法，用于根据服务器 ID 发起 GET 请求，获取其详细数据。
 */
import api, { type PaginatedResponse, type GoNullString } from './index';

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

/**
 * 单个服务器的完整详细信息类型。
 * 这直接对应于 `servers` 表的结构，并包含了通过 JOIN 查询得到的客户名称。
 */
export interface ServerDetail {
    id: number;
    customerId: number;
    customerName: string;
    serverName: string;
    ipAddress: string;
    role: GoNullString;
    deploymentType: GoNullString;
    customerNote: GoNullString;
    usageNote: GoNullString;
    createdAt: string; // ISO 8601 date string
    updatedAt: GoNullString; // ISO 8601 date string or null
}


type ServerApiResponse = Omit<ServerRow, 'id' | 'customerId'> & {
    id: number;
    customerId: number;
};

export const serversApi = {
    fetchAll: async (page: number, pageSize: number): Promise<PaginatedResponse<ServerRow>> => {
        const response = await api<PaginatedResponse<ServerApiResponse>>(`/servers/list?page=${page}&pageSize=${pageSize}`);

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
     * 根据 ID 获取单个服务器的详细信息。
     * @param {string} id - 服务器的 ID。
     * @returns {Promise<ServerDetail>} 服务器的详细数据。
     */
    fetchById: (id: string): Promise<ServerDetail> => {
        return api<ServerDetail>(`/servers/${id}`);
    },

    deleteById: (id: string): Promise<void> => {
        return api(`/servers/${id}`, {
            method: 'DELETE',
        });
    },
};