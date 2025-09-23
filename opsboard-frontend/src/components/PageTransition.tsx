/**
 * 文件名: src/components/PageTransition.tsx
 *
 * 文件功能描述:
 * PageTransition —— Fade-Through 动画（绝对定位 + 内边距）
 *
 * 本次修改内容:
 * - 【组件写法现代化】移除了 `React.FC`，采用了现代的函数组件定义方式，
 *   并显式注解了 props 类型和 `: JSX.Element` 返回值类型。
 */
import {useRef, type JSX, type ReactNode} from 'react'
import {useLocation} from 'react-router-dom'
import {Fade, useTheme} from '@mui/material'
import {styled} from '@mui/system'

interface WrapProps {
    padding: number
}

const Wrapper = styled('div')<WrapProps>(({padding}) => ({
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    boxSizing: 'border-box',
    padding,
    transform: 'scale(0.96)',
    transition: 'transform 280ms cubic-bezier(0.4,0,0.2,1)',
}))

const entered = {transform: 'scale(1)'}

// 【核心修改】为 props 定义接口
interface PageTransitionProps {
    children?: ReactNode;
}

// 【核心修改】移除 React.FC，使用现代写法
const PageTransition = ({children}: PageTransitionProps): JSX.Element => {
    const {pathname} = useLocation()
    const theme = useTheme()
    const ref = useRef<HTMLDivElement>(null)

    return (
        <Fade key={pathname} in appear timeout={280} mountOnEnter unmountOnExit>
            <Wrapper ref={ref} padding={theme.spacing(3) as unknown as number} style={entered}>
                {children}
            </Wrapper>
        </Fade>
    )
}

export default PageTransition