/**
 * 文件名: src/components/ReactLogoAnim.tsx
 *
 * 文件功能描述:
 * 一个简单的 SVG 动画组件。
 *
 * 本次修改内容:
 * - 【组件写法现代化】移除了 `React.FC`，采用了现代的函数组件定义方式，
 *   并显式注解了 props 类型和 `: JSX.Element` 返回值类型。
 */
import {type JSX, type SVGProps } from 'react';

// 【核心修改】移除 React.FC，使用现代写法
const ReactLogoAnim = (props: SVGProps<SVGSVGElement>): JSX.Element => {
    return (
        <svg
            {...props}
            viewBox="0 0 841.9 595.3"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{animation: 'spin 10s linear infinite'}}
        >
            <circle cx="420.9" cy="296.5" r="45.7" fill="#61dafb"/>
            {/* 省略复杂路径，示意用蓝色圆代替 */}
            <style>
                {`
          @keyframes spin {
            0% { transform: rotate(0deg);}
            100% { transform: rotate(360deg);}
          }
        `}
            </style>
        </svg>
    );
};

export default ReactLogoAnim;