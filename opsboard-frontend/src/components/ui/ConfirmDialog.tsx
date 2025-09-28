/**
 * @file src/components/ui/ConfirmDialog.tsx
 * @description 一个可重用的确认对话框组件，用于危险操作前的用户确认。
 * @modification 本次提交中所做的具体修改摘要。
 *   - [UI 风格统一]：更新了 `PaperProps` 的样式，为其增加了圆角和柔和的阴影效果，以匹配项目中详情弹窗 (`Modal.tsx`) 的视觉风格。
 *   - [原因]：此修改旨在提升应用的视觉一致性，确保所有对话框和模态框都采用统一的设计语言，从而改善整体的用户体验。
 */
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import type { JSX } from 'react';

interface ConfirmDialogProps {
    open: boolean;
    title: string;
    content: string;
    confirmText?: string;
    onConfirm: () => void;
    onCancel: () => void;
}

const ConfirmDialog = ({
                           open,
                           title,
                           content,
                           confirmText = '确认',
                           onConfirm,
                           onCancel,
                       }: ConfirmDialogProps): JSX.Element => {
    return (
        <Dialog
            open={open}
            onClose={onCancel}
            aria-labelledby="confirm-dialog-title"
            aria-describedby="confirm-dialog-content"
            BackdropProps={{
                sx: {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(4px)',
                },
            }}
            PaperProps={{
                elevation: 0, // 我们将使用自定义的 boxShadow，所以禁用默认的 elevation 阴影
                sx: {
                    // [核心修复] 复制 Modal.tsx 的核心样式
                    borderRadius: 2, // 对应 theme.shape.borderRadius * 2
                    boxShadow: 24,   // 对应 theme.shadows[24]
                }
            }}
        >
            <DialogTitle id="confirm-dialog-title">{title}</DialogTitle>
            <DialogContent>
                <DialogContentText id="confirm-dialog-content">{content}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onCancel}>取消</Button>
                <Button onClick={onConfirm} color="error" autoFocus>
                    {confirmText}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmDialog;