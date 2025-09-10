/**
 * @file src/components/RightSearchPanel.tsx
 * @description 此文件定义了 RightSearchPanel 组件，一个带动画的右侧容器。
 * @modification
 *   - [性能优化]：为搜索输入框实现了300ms的防抖功能。通过引入 `useDebounce` 钩子，避免了在用户快速输入时频繁触发搜索逻辑，显著降低了不必要的计算或API请求。
 *   - [性能优化]：为执行动画的 `MotionBox` 添加了 `will-change: 'width'` CSS属性。此举向浏览器提示该元素的 `width` 属性即将发生变化，允许浏览器提前进行优化，将该元素提升到独立的合成层，从而使动画更平滑。
 *   - [功能增强]：在面板内部新增了一个 `TextField` 作为搜索框示例，并展示了如何结合 `useState` 和 `useDebounce` 来管理和响应用户输入。
 */
import {type JSX, type ReactNode, useState, useEffect } from 'react';
import {Box, Typography, IconButton, CircularProgress, TextField, Alert} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import {motion, type Variants, AnimatePresence} from 'framer-motion';
import { pageTransition, panelContentVariants } from '@/utils/animations';
import { useDebounce } from '@/hooks/useDebounce';

export interface RightSearchPanelProps {
    open: boolean;
    onClose: () => void;
    title?: string;
    width?: number;
    children: ReactNode;
    contentKey?: string | number;
}

const MotionBox = motion(Box);

const RightSearchPanel = ({
                              open,
                              onClose,
                              title = '搜索',
                              width = 360,
                              children,
                              contentKey,
                          }: RightSearchPanelProps): JSX.Element => {

    // [防抖实现] 1. 为搜索输入框创建状态
    const [searchTerm, setSearchTerm] = useState('');
    // [防抖实现] 2. 使用 useDebounce 钩子，延迟300ms
    const debouncedSearchTerm = useDebounce(searchTerm, 300);
    const [isSearching, setIsSearching] = useState(false);
    const [searchResult, setSearchResult] = useState('');

    // [防抖实现] 3. 使用 useEffect 监听防抖后的值
    useEffect(() => {
        if (debouncedSearchTerm) {
            setIsSearching(true);
            setSearchResult('');
            console.log(`Searching for: "${debouncedSearchTerm}"`);
            // 模拟 API 调用
            const searchTimeout = setTimeout(() => {
                setIsSearching(false);
                setSearchResult(`找到了关于 "${debouncedSearchTerm}" 的结果。`);
            }, 1000);
            return () => clearTimeout(searchTimeout);
        } else {
            setIsSearching(false);
            setSearchResult('');
        }
    }, [debouncedSearchTerm]);


    const panelVariants: Variants = {
        open: {width: width, transition: {duration: 0.28, ease: [0.4, 0, 0.2, 1]}},
        closed: {width: 0, transition: {duration: 0.28, ease: [0.4, 0, 0.2, 1]}},
    };

    const animationKey = contentKey || title || 'default-panel-content';

    return (
        <MotionBox
            variants={panelVariants}
            initial="closed"
            animate={open ? "open" : "closed"}
            sx={{
                flexShrink: 0,
                overflow: 'hidden',
                height: '100%',
                bgcolor: 'background.paper',
                borderRadius: 2,
                boxSizing: 'border-box',
                ml: open ? 3 : 0,
                transition: 'margin-left 0.28s ease',
                // [图层优化] 提示浏览器 width 属性将要改变，以便进行优化
                willChange: 'width',
            }}
        >
            <Box
                sx={{
                    width: width,
                    height: '100%',
                    p: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    boxSizing: 'border-box',
                    position: 'relative',
                }}
            >
                <IconButton
                    size="small"
                    onClick={onClose}
                    aria-label="close search panel"
                    sx={{position: 'absolute', top: 24, right: 24, zIndex: 2}}
                >
                    <CloseIcon/>
                </IconButton>

                <Box
                    sx={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden',
                        position: 'relative',
                    }}
                >
                    <AnimatePresence mode="wait">
                        {open && (
                            <MotionBox
                                key={animationKey}
                                variants={panelContentVariants}
                                transition={pageTransition}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                sx={{
                                    position: 'absolute',
                                    inset: 0,
                                    width: '100%',
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    overflowY: 'auto',
                                    overflowX: 'hidden',
                                    zIndex: 1,
                                }}
                            >
                                <Typography variant="h6" noWrap sx={{mb: 2, pr: 4, flexShrink: 0}}>
                                    {title}
                                </Typography>

                                {/* [防抖实现] 4. 添加搜索输入框和结果展示 */}
                                <Box sx={{ mb: 2 }}>
                                    <TextField
                                        fullWidth
                                        label="输入以搜索..."
                                        variant="outlined"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                    <Box sx={{ height: 40, mt: 1, display: 'flex', alignItems: 'center' }}>
                                        {isSearching && <CircularProgress size={20} />}
                                        {searchResult && <Alert severity="success" sx={{ width: '100%', py: 0 }}>{searchResult}</Alert>}
                                    </Box>
                                </Box>

                                {children ? (
                                    <Box sx={{ flexGrow: 1 }}>
                                        {children}
                                    </Box>
                                ) : (
                                    <Box sx={{
                                        width: '100%',
                                        height: '100%',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}>
                                        <CircularProgress/>
                                    </Box>
                                )}
                            </MotionBox>
                        )}
                    </AnimatePresence>
                </Box>
            </Box>
        </MotionBox>
    );
};

export default RightSearchPanel;