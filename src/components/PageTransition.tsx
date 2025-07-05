/*****************************************************************
 * PageTransition —— Material Design Fade-Through 动画（完整版）
 * --------------------------------------------------------------
 * - 使用 MUI <Fade>（无第三方依赖）
 * - 动画：opacity 0→1、scale 0.96→1
 * - 无绝对定位，100% 填充父容器，避免重叠和滚动条
 *****************************************************************/
import React from 'react'
import { useLocation } from 'react-router-dom'
import { Fade } from '@mui/material'
import { styled } from '@mui/system'

/* 包裹层：普通 block 元素，撑满父容器 */
const Wrapper = styled('div')({
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    transform: 'scale(0.96)',                       // 初始略缩小
    transition: 'transform 280ms cubic-bezier(0.4,0,0.2,1)',
})

/* 进入结束时 scale → 1 */
const enteredStyle = { transform: 'scale(1)' }

const PageTransition: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
    const { pathname } = useLocation()              // 每次路由变化触发动画

    return (
        <Fade
            key={pathname}
            in
            appear
            timeout={280}
            mountOnEnter
            unmountOnExit
        >
            <Wrapper style={enteredStyle}>{children}</Wrapper>
        </Fade>
    )
}

export default PageTransition
