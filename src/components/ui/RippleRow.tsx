/**
 * @file src/components/ui/RippleRow.tsx
 * @description 定义了一个程序化控制的、覆盖整行的涟漪效果组件。
 * @modification
 *   - [Type Safety Fix]: 修复了因调用不存在的 `rippleStart` 方法而导致的 TypeScript 编译错误 (TS2339)。
 *   - [Core Logic]: 重构了涟漪触发机制。现在我们获取对 ButtonBase 的真实 DOM 元素 (`HTMLButtonElement`) 的引用，并通过调用其标准的 `.click()` 方法来程序化地触发涟漪动画。这是一个更健壮、更可靠且完全类型安全的实现方式。
 */
import {forwardRef, useImperativeHandle, useRef, type JSX} from 'react';
import {TableCell, ButtonBase} from '@mui/material';

// 定义父组件可以通过 ref 访问到的方法
export interface RippleRowRef {
    triggerRipple: () => void;
}

// 定义组件的 props
interface RippleRowProps {
    colSpan: number;
}

const RippleRow = forwardRef<RippleRowRef, RippleRowProps>(({colSpan}, ref): JSX.Element => {
    // 【核心修改】创建一个 ref 来引用 ButtonBase 渲染出的 HTMLButtonElement DOM 节点
    const buttonRef = useRef<HTMLButtonElement>(null);

    // 使用 useImperativeHandle 将自定义的 API 暴露给父组件
    useImperativeHandle(ref, () => ({
        /**
         * @function triggerRipple
         * @description 由父组件调用，以触发涟漪效果。
         */
        triggerRipple: () => {
            // 确保 buttonRef 已经绑定到了 DOM 元素
            if (buttonRef.current) {
                // 【核心修改】调用 DOM 元素的 .click() 方法。
                // 这会触发一个标准的点击事件，ButtonBase 会捕获它并播放涟漪动画。
                buttonRef.current.click();
            }
        },
    }));

    return (
        <TableCell
            padding="none"
            colSpan={colSpan}
            sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                border: 'none',
                pointerEvents: 'none',
            }}
        >
            <ButtonBase
                ref={buttonRef} // 【核心修改】使用标准的 ref prop 来获取 DOM 节点
                sx={{
                    display: 'block',
                    width: '100%',
                    height: '100%',
                    pointerEvents: 'none',
                }}
            />
        </TableCell>
    );
});

export default RippleRow;