import React from 'react';

const ReactLogoAnim: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {
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
