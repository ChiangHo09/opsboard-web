/**
 * 文件名: src/hooks/useResponsiveDetailView.ts
 *
 * 文件功能描述:
 * 此文件定义了一个名为 `useResponsiveDetailView` 的自定义 Hook。
 * 它封装了在应用中处理响应式详情视图（桌面端弹窗 vs. 移动端整页）的通用逻辑。
 *
 * 本次修改内容:
 * - 【全新文件】创建此文件以抽象和复用逻辑。
 * - **功能实现**:
 *   1.  **参数化**: Hook 接收模块的基本配置（路由、参数名、数据获取函数、详情组件）。
 *   2.  **数据获取**: 内部使用 TanStack Query 的 `useQuery` 来获取列表数据。
 *   3.  **桌面端弹窗**: 包含一个 `useEffect`，用于监听 URL 参数变化，并在桌面视图下打开/关闭全局模态框。
 *   4.  **移动端重定向**: 包含另一个 `useEffect`，用于在移动端视图下自动重定向到专属的详情页面。
 * - **最终效果**:
 *   通过使用此 Hook，所有列表页面（如 Tickets, Servers, Changelog）都可以移除重复的
 *   `useEffect` 代码，使页面组件本身更简洁，只关注于渲染 UI。
 */
import {useEffect, Suspense, type LazyExoticComponent, type FC} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {useQuery, type QueryKey, type QueryFunction} from '@tanstack/react-query';
import {Box, CircularProgress} from '@mui/material';
import {useLayoutState, useLayoutDispatch} from '@/contexts/LayoutContext';

// 定义 Hook 接收的参数类型
interface UseResponsiveDetailViewOptions<TData extends { id: string }, TProps> {
    paramName: keyof TProps & string;
    baseRoute: string;
    queryKey: QueryKey;
    queryFn: QueryFunction<TData[]>;
    DetailContentComponent: LazyExoticComponent<FC<TProps>>;
}

export const useResponsiveDetailView = <TData extends { id: string }, TProps extends object>({
                                                                                                 paramName,
                                                                                                 baseRoute,
                                                                                                 queryKey,
                                                                                                 queryFn,
                                                                                                 DetailContentComponent,
                                                                                             }: UseResponsiveDetailViewOptions<TData, TProps>) => {
    const {isMobile} = useLayoutState();
    const {setIsModalOpen, setModalConfig} = useLayoutDispatch();
    const navigate = useNavigate();
    const params = useParams();

    const entityId = params[paramName];

    const queryResult = useQuery<TData[], Error>({
        queryKey: queryKey,
        queryFn: queryFn,
    });
    const {data = []} = queryResult;

    // Effect 1: 负责控制桌面端弹窗的显示与隐藏
    useEffect(() => {
        const entityExists = entityId && data.some(item => item.id === entityId);

        if (entityExists && !isMobile) {
            setIsModalOpen(true);
            const contentProps = {[paramName]: entityId} as TProps;
            setModalConfig({
                content: (
                    <Suspense fallback={<Box sx={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}><CircularProgress/></Box>}>
                        <DetailContentComponent {...contentProps} />
                    </Suspense>
                ),
                onClose: () => navigate(baseRoute, {replace: true}),
            });
        } else {
            setIsModalOpen(false);
            setModalConfig({content: null, onClose: null});
        }
    }, [entityId, isMobile, data, navigate, baseRoute, paramName, DetailContentComponent, setIsModalOpen, setModalConfig]);

    // Effect 2: 负责处理从桌面端到移动端的视图重定向
    useEffect(() => {
        if (entityId && isMobile) {
            navigate(`${baseRoute}/mobile/${entityId}`, {replace: true});
        }
    }, [entityId, isMobile, navigate, baseRoute]);

    return queryResult;
};