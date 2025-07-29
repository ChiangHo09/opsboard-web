/**
 * 文件名: src/layouts/MobileDetailPageLayout.tsx
 *
 * 文件功能描述:
 * 此文件定义了一个【可复用的】移动端详情页面布局组件。它封装了所有移动端详情页共享的
 * UI 结构和业务逻辑，包括全屏布局、带关闭按钮的标题栏、以及从移动端到桌面端的自动重定向功能。
 *
 * 本次修改内容:
 * - 【TypeScript 终极修复】通过使用更准确的泛型约束，彻底解决了所有类型不匹配的错误。
 * - **问题根源**:
 *   之前的泛型约束 `T extends Record<string, unknown>` 错误地要求传入的 props 类型必须包含一个“索引签名”，而我们具体的 props 类型（如 `{ logId: string }`）并不满足此条件。
 * - **解决方案**:
 *   1.  将泛型约束从 `T extends Record<string, unknown>` 修改为 `T extends object`。
 *   2.  这个新的约束只要求 `T` 是一个对象即可，这与我们所有具体的 props 接口（`...Props`）都完全兼容。
 * - **最终效果**:
 *   TypeScript 现在能够正确地验证所有传入的组件及其 props，所有类型错误都已消除，
 *   通用布局组件现在真正实现了类型安全和高度可复用性。
 */
import {Suspense, useEffect, type LazyExoticComponent, type FC} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {Box, Typography, IconButton, CircularProgress} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import {useLayoutState} from '../contexts/LayoutContext.tsx';
import {mobileOverlayVariants} from '../utils/animations';
import {motion} from 'framer-motion';

const MotionBox = motion(Box);

// 【核心修复】将泛型约束 T 修改为 extends object
interface MobileDetailPageLayoutProps<T extends object> {
    title: string;
    backPath: string;
    paramName: keyof T & string;
    DetailContentComponent: LazyExoticComponent<FC<T>>;
}

// 【核心修复】将泛型约束 T 修改为 extends object
const MobileDetailPageLayout = <T extends object>({
                                                      title,
                                                      backPath,
                                                      paramName,
                                                      DetailContentComponent,
                                                  }: MobileDetailPageLayoutProps<T>) => {
    const navigate = useNavigate();
    const params = useParams();
    const {isMobile} = useLayoutState();

    const id = params[paramName];

    useEffect(() => {
        if (id && !isMobile) {
            navigate(`${backPath}/${id}`, {replace: true});
        }
    }, [isMobile, id, navigate, backPath]);

    if (!id) {
        return null;
    }

    const contentProps = {[paramName]: id} as T;

    return (
        <MotionBox
            sx={{boxSizing: 'border-box', height: '100%', display: 'flex', flexDirection: 'column', p: 3}}
            variants={mobileOverlayVariants}
            initial="initial"
            animate="animate"
            exit="exit"
        >
            <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, flexShrink: 0}}>
                <Typography variant="h6">{title}</Typography>
                <IconButton
                    onClick={() => navigate(backPath)}
                    aria-label="关闭"
                    sx={{mr: -1.5}}
                >
                    <CloseIcon/>
                </IconButton>
            </Box>

            <Box sx={{flexGrow: 1, overflow: 'hidden'}}>
                <Suspense fallback={
                    <Box sx={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <CircularProgress/>
                    </Box>
                }>
                    <DetailContentComponent {...contentProps} />
                </Suspense>
            </Box>
        </MotionBox>
    );
};

export default MobileDetailPageLayout;