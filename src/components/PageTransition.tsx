/*****************************************************************
 * PageTransition —— Fade-Through 动画（绝对定位 + 内边距）
 *****************************************************************/
import React, { useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { Fade, useTheme } from '@mui/material'
import { styled } from '@mui/system'

interface WrapProps { padding: number }

/* 绝对定位层，覆盖父容器，带统一内边距 */
const Wrapper = styled('div')<WrapProps>(({ padding }) => ({
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

const entered = { transform: 'scale(1)' }

const PageTransition: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
    const { pathname } = useLocation()
    const theme = useTheme()
    const ref = useRef<HTMLDivElement>(null) // 防 StrictMode warning

    return (
        <Fade key={pathname} in appear timeout={280} mountOnEnter unmountOnExit>
            <Wrapper ref={ref} padding={theme.spacing(3) as unknown as number} style={entered}>
                {children}
            </Wrapper>
        </Fade>
    )
}

export default PageTransition
