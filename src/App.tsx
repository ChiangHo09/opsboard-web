import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// 引入资源和样式
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';

// 引入页面组件
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

// 一个示例组件，用于演示嵌入 Dashboard 的内容
const CounterDemo = () => {
    const [count, setCount] = useState(0);
    return (
        <div>
            <button onClick={() => setCount((c) => c + 1)}>计数器：{count}</button>
        </div>
    );
};

// 这是登录后跳转的主内容页面
const DashboardHome = () => {
    return (
        <Dashboard>
            <div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <a href="https://vite.dev" target="_blank" rel="noreferrer">
                        <img src={viteLogo} className="logo" alt="Vite logo" width="80" />
                    </a>
                    <a href="https://react.dev" target="_blank" rel="noreferrer">
                        <img src={reactLogo} className="logo react" alt="React logo" width="80" />
                    </a>
                </div>

                <h2 style={{ marginTop: '1rem' }}>欢迎使用运维信息系统</h2>
                <CounterDemo />

                <p style={{ marginTop: '1rem' }}>
                    点击图标访问官网，或者继续开发你的运维系统功能。
                </p>
            </div>
        </Dashboard>
    );
};

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                {/* 登录页 */}
                <Route path="/" element={<Login />} />

                {/* 后台首页 */}
                <Route path="/dashboard" element={<DashboardHome />} />
            </Routes>
        </Router>
    );
};

export default App;
