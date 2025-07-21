/**
 * 文件名: src/components/Modal.tsx
 *
 * 本次修改内容:
 * - 【布局修复】将模态框根元素的定位方式从 `position: 'fixed'` 修改为 `position: 'absolute'`。
 * - 这一修改是为了配合 `MainLayout` 的调整，确保弹窗只覆盖主内容区，而不是整个视口。
 *
 * 文件功能描述:
 * 此文件定义了一个全局通用的模态框（弹窗）组件，负责处理弹窗的“外壳”、动画和关闭逻辑。
 */
import React, { useEffect } from 'react';
import { Box, IconButton, useTheme } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { motion, type Variants } from 'framer-motion';
import { useLayout } from '../contexts/LayoutContext';

// ... (variants 保持不变)
const backdropVariants: Variants = { visible: { opacity: 1 }, hidden: { opacity: 0 } };
const modalContentVariants: Variants = { hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.2, ease: 'easeOut' } }, exit: { opacity: 0, scale: 0.95, transition: { duration: 0.15, ease: 'easeIn' } } };

interface ModalProps {
    onClose: () => void;
    children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ onClose, children }) => {
    const { isMobile } = useLayout();
    const theme = useTheme();

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    return (
        <Box sx={{ position: 'absolute', inset: 0, zIndex: 1200 }}> {/* 【修改】position: absolute */}
            <motion.div
                key="backdrop"
                variants={backdropVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                onClick={onClose}
                style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundColor: isMobile ? theme.palette.background.paper : `${theme.palette.background.default}80`,
                    backdropFilter: isMobile ? 'none' : 'blur(4px)',
                }}
            />
            <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <motion.div
                    key="modal"
                    variants={modalContentVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    style={{
                        position: 'relative',
                        width: isMobile ? '100%' : '80%',
                        height: isMobile ? '100%' : '80%',
                        maxWidth: isMobile ? '100%' : 1200,
                        maxHeight: isMobile ? '100%' : 800,
                    }}
                >
                    <Box sx={{ width: '100%', height: '100%', bgcolor: 'background.paper', borderRadius: isMobile ? 0 : 2, boxShadow: isMobile ? 'none' : 24, display: 'flex', flexDirection: 'column' }}>
                        <IconButton onClick={onClose} sx={{ position: 'absolute', top: 16, right: 16, zIndex: 1 }} aria-label="关闭">
                            <CloseIcon />
                        </IconButton>
                        {children}
                    </Box>
                </motion.div>
            </Box>
        </Box>
    );
};

export default Modal;