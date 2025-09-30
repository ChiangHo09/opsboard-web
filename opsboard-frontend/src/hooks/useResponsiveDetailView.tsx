/**
 * @file src/hooks/useResponsiveDetailView.tsx
 * @description 一个自定义钩子，用于统一处理数据获取、后端分页以及响应式的详情视图（桌面端模态框 vs. 移动端页面）。
 * @modification 本次提交中所做的具体修改摘要。
 *   - [架构重构]：为钩子增加了完整的后端分页支持。
 *   - [功能增强]：
 *     - `UseResponsiveDetailViewOptions` 现在接收 `page` 和 `rowsPerPage` 作为输入。
 *     - `queryFn` 的类型被更新为 `(page: number, pageSize: number) => Promise<PaginatedResponse<TData>>`，以匹配分页 API 的签名。
 *     - `queryKey` 现在会自动将 `page` 和 `rowsPerPage` 包含进去，以实现 `react-query` 的自动缓存和重新获取。
 *     - 钩子的返回值现在是一个包含了 `data`, `total`, `isLoading` 等所有必要状态的对象。
 */
import {useEffect, Suspense, type LazyExoticComponent, type ReactElement} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {useQuery, type QueryKey} from '@tanstack/react-query';
import {Box, CircularProgress} from '@mui/material';
import {useLayoutState, useLayoutDispatch} from '@/contexts/LayoutContext';
import type { PaginatedResponse } from '@/api'; // 假设 PaginatedResponse 在 api/index.ts 或类似文件中导出

interface UseResponsiveDetailViewOptions<TData extends { id: string }, TProps> {
    paramName: keyof TProps & string;
    baseRoute: string;
    queryKey: QueryKey;
    // [核心修改] 更新 queryFn 的类型以接收分页参数
    queryFn: (page: number, pageSize: number) => Promise<PaginatedResponse<TData>>;
    DetailContentComponent: LazyExoticComponent<(props: TProps) => ReactElement>;
    enabled?: boolean;
    // [核心修改] 接收分页状态
    page: number;
    rowsPerPage: number;
}

// [核心修改] 定义钩子的返回值类型
interface UseResponsiveDetailViewResult<TData> {
    rows: TData[];
    totalRows: number;
    isLoading: boolean;
    isError: boolean;
    error: Error | null;
}

export const useResponsiveDetailView = <TData extends { id: string }, TProps extends object>({
                                                                                                 paramName,
                                                                                                 baseRoute,
                                                                                                 queryKey,
                                                                                                 queryFn,
                                                                                                 DetailContentComponent,
                                                                                                 enabled = true,
                                                                                                 page,
                                                                                                 rowsPerPage,
                                                                                             }: UseResponsiveDetailViewOptions<TData, TProps>): UseResponsiveDetailViewResult<TData> => {
    const {isMobile} = useLayoutState();
    const {setIsModalOpen, setModalConfig} = useLayoutDispatch();
    const navigate = useNavigate();
    const params = useParams();

    const entityId = params[paramName];

    // [核心修改] 将分页状态加入 queryKey，并调用新的 queryFn
    const { data, isLoading, isError, error } = useQuery<PaginatedResponse<TData>, Error>({
        queryKey: [...queryKey, page, rowsPerPage],
        queryFn: () => queryFn(page + 1, rowsPerPage), // page+1 以匹配后端从1开始的页码
        enabled: enabled,
    });

    const items = data?.data || [];
    const totalItems = data?.total || 0;

    // Effect 1: 负责控制桌面端弹窗的显示与隐藏
    useEffect(() => {
        const selectedItem = entityId ? items.find(item => item.id === entityId) : undefined;

        if (selectedItem && !isMobile) {
            setIsModalOpen(true);
            const contentProps = {[paramName]: entityId} as TProps;
            setModalConfig({
                content: (
                    <Suspense fallback={<Box sx={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><CircularProgress/></Box>}>
                        <DetailContentComponent {...contentProps} />
                    </Suspense>
                ),
                onClose: () => navigate(baseRoute, {replace: true}),
            });
        } else if (!isMobile) { // 如果在桌面端但没有选中项，确保弹窗是关闭的
            setIsModalOpen(false);
            setModalConfig({content: null, onClose: null});
        }
    }, [entityId, isMobile, items, navigate, baseRoute, paramName, DetailContentComponent, setIsModalOpen, setModalConfig]);

    // Effect 2: 负责处理从桌面端到移动端的视图重定向
    useEffect(() => {
        if (entityId && isMobile) {
            navigate(`${baseRoute}/mobile/${entityId}`, {replace: true});
        }
    }, [entityId, isMobile, navigate, baseRoute]);

    // [核心修改] 返回一个统一的、包含所有必要信息的结果对象
    return {
        rows: items,
        totalRows: totalItems,
        isLoading,
        isError,
        error,
    };
};