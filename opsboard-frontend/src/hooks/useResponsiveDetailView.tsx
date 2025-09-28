/**
 * @file src/hooks/useResponsiveDetailView.tsx
 * @description 一个自定义钩子，用于统一处理桌面端（模态框）和移动端（独立页面）的数据详情展示逻辑。
 * @modification 本次提交中所做的具体修改摘要。
 *   - [功能增强]：为 `UseResponsiveDetailViewOptions` 接口增加了可选的 `enabled` 属性，并将其传递给内部的 `useQuery`。
 *   - [原因]：此修改是为了解决在页面组件中传递 `enabled` 选项时出现的 TypeScript 类型错误 (TS2353)。通过扩展此钩子的能力，我们允许父组件控制 `useQuery` 的执行时机，从而实现了延迟数据加载以优化页面动画性能的功能。
 */
import {useEffect, Suspense, type LazyExoticComponent, type ReactElement} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {useQuery, type QueryKey, type QueryFunction} from '@tanstack/react-query';
import {Box, CircularProgress} from '@mui/material';
import {useLayoutState, useLayoutDispatch} from '@/contexts/LayoutContext';

interface UseResponsiveDetailViewOptions<TData extends { id: string }, TProps> {
    paramName: keyof TProps & string;
    baseRoute: string;
    queryKey: QueryKey;
    queryFn: QueryFunction<TData[]>;
    DetailContentComponent: LazyExoticComponent<(props: TProps) => ReactElement>;
    // [核心修改] 增加 enabled 属性
    enabled?: boolean;
}

export const useResponsiveDetailView = <TData extends { id: string }, TProps extends object>({
                                                                                                 paramName,
                                                                                                 baseRoute,
                                                                                                 queryKey,
                                                                                                 queryFn,
                                                                                                 DetailContentComponent,
                                                                                                 // [核心修改] 接收 enabled 选项，并设置默认值
                                                                                                 enabled = true,
                                                                                             }: UseResponsiveDetailViewOptions<TData, TProps>) => {
    const {isMobile} = useLayoutState();
    const {setIsModalOpen, setModalConfig} = useLayoutDispatch();
    const navigate = useNavigate();
    const params = useParams();

    const entityId = params[paramName];

    const queryResult = useQuery<TData[], Error>({
        queryKey: queryKey,
        queryFn: queryFn,
        // [核心修改] 将 enabled 选项传递给 useQuery
        enabled: enabled,
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