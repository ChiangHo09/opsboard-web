/**
 * 文件名: src/components/Modal.tsx
 *
 * 本次修改内容:
 * - 【问题修复】解决了由于 `import` 语句语法错误导致的大量连锁编译错误。
 * - 修正了 `import React, { useEffect } from 'react';` 这一行，确保其语法正确。
 *
 * 文件功能描述:
 * 此文件定义了一个全局通用的模态框（弹窗）组件，负责处理弹窗的“外壳”、动画和关闭逻辑。
 */
import React, {useEffect} from 'react'; // 【核心修复】修正了 import 语句
import {Box, IconButton, useTheme} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import {motion, type Variants} from 'framer-motion';
import {useLayout} from '../contexts/LayoutContext';

const backdropVariants: Variants = {visible: {opacity: 1}, hidden: {opacity: 0}};
const modalContentVariants: Variants = {
    hidden: {opacity: 0, scale: 0.95},
    visible: {opacity: 1, scale: 1, transition: {duration: 0.2, ease: 'easeOut'}},
    exit: {opacity: 0, scale: 0.95, transition: {duration: 0.15, ease: 'easeIn'}}
};

interface ModalProps {
    onClose: () => void;
    children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({onClose, children}) => {
    const {isMobile} = useLayout();
    const theme = useTheme();

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    return (
        <Box sx={{position: 'absolute', inset: 0, zIndex: 1200}}>
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
            <Box sx={{width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
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
                    <Box sx={{
                        width: '100%',
                        height: '100%',
                        bgcolor: 'background.paper',
                        borderRadius: isMobile ? 0 : 2,
                        boxShadow: isMobile ? 'none' : 24,
                        display: 'flex',
                        flexDirection: 'column'
                    }}>
                        <IconButton onClick={onClose} sx={{position: 'absolute', top: 12, right: 12, zIndex: 1}}
                                    aria-label="关闭">
                            <CloseIcon/>
                        </IconButton>
                        {children}
                    </Box>
                </motion.div>
            </Box>
        </Box>
    );
};

export default Modal;