/**
 * @file src/api/serversApi.ts
 * @description 提供了与服务器相关的 API 函数和类型定义。
 * @modification 本次提交中所做的具体修改摘要。
 *   - [类型统一]：移除了本地的 `GoNullString` 定义，改为从 `api/index.ts` 导入，以解决重复导出问题。
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

    deleteById: (id: string): Promise<void> => {
        return api(`/servers/${id}`, {
            method: 'DELETE',
        });
    },
};