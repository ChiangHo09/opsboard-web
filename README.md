# OpsBoard 本地运维信息系统

> **跨平台 · 本地部署 · 一键启动**
>
> * **后端**：Rust + Axum / SeaORM / SQLite（可切换 MySQL、Oracle）
> * **前端**：React + Vite + Material‑UI (M3 风格)
> * **特性**：桌面端优先布局、PDF 工单导出、离线可用

---

## 📑 项目定位

为 **中小型运维团队** 打造的本地化客户&资产管理／工单系统，强调 **无需联网**、**快速上手** 与 **跨平台兼容**。

| 目标   | 说明                                                         |
| ---- | ---------------------------------------------------------- |
| 一键启动 | 后端 & 前端资源打包，双击 `*.exe`（Windows）或 `./startup.sh`（Linux）即可运行 |
| 跨平台  | 同一份源码/产物同时支持 Windows & Linux 桌面环境                          |
| 可追溯  | 所有操作写入异步日志；日志按天/大小自动轮转                                     |
| 线下纸质 | 巡检/备份工单一键导出 **PDF**，兼容传统流程                                 |

---

## 🏗️ 技术栈

```
├── backend   # Rust ⟶ Axum / SeaORM / SQLite
└── frontend  # React ⟶ Vite / MUI / framer‑motion
```

| 层级       | 选型                      | 亮点                      |
| -------- | ----------------------- | ----------------------- |
| Back‑end | Rust · Axum             | 零成本跨平台； Tokio 异步；类型安全   |
| ORM      | SeaORM                  | 纯异步；关系映射；可切换多 DB        |
| 数据库      | SQLite 默认               | 免安装；亦可切换 MySQL / Oracle |
| 前端       | React + Vite            | HMR极速；代码分包；Tree‑Shaking |
| UI       | Material UI (M3)        | 跨平台一致；暗/亮主题预留           |
| 打包       | rust‑embed / vite build | 后端可执行文件 + 前端静态资源内嵌      |

---

## ⚙️ 环境依赖

| 组件             | 版本建议   | 备注                       |
| -------------- | ------ | ------------------------ |
| Rust toolchain | ≥ 1.72 | `rustup default stable`  |
| Node.js        | ≥ 18   | 建议配合 pnpm / yarn         |
| SQLite3        | 内置     | 若切换 MySQL / Oracle 需自备驱动 |

> **Windows** 用户请安装 MSVC；**Linux** 用户建议 clang + mold 提升编译速度。

---

## 🚀 快速开始

```bash
# 1. 克隆仓库
$ git clone https://gitea.example.com/you/opsboard-web.git
$ cd opsboard-web

# 2. 安装前端依赖
$ cd frontend
$ npm i   # 或 pnpm i / yarn

# 3. 启动前端 (开发热更新)
$ npm run dev

# 4. 启动后端 (开发模式)
$ cd ../backend
$ cargo run
```

前端默认访问 [http://localhost:5173](http://localhost:5173)，后端 API 监听 [http://localhost:8000](http://localhost:8000)。

### 一键打包

```bash
# 后端：生成单文件可执行程序（release模式）
$ cargo build --release --target x86_64-pc-windows-msvc   # 亦可替换 Linux target

# 前端：构建静态文件
$ cd frontend && npm run build
# 将 dist/ 拷贝到 backend 静态资源目录，或使用 rust-embed 自动打包
```

> 完整打包脚本见 `scripts/build_all.ps1 / build_all.sh`。

---

## 📁 目录结构

```
opsboard-web/
├─ backend/
│  ├─ src/
│  ├─ Cargo.toml
│  └─ .env.example
├─ frontend/
│  ├─ src/
│  ├─ public/
│  └─ vite.config.ts
└─ scripts/         # 辅助打包/部署脚本
```

---

## 🗺️ 路线图

* [x] 登录页 & 侧边栏 (M3)
* [x] 客户信息 CRUD
* [x] 巡检/备份工单 PDF 导出
* [ ] 多用户 / 角色权限（进行中）
* [ ] WebSocket 实时告警
* [ ] 移动端小程序（Taro）
* [ ] 云备份 / 同步

欢迎 **Issue / PR / Discussion**！

---

## 🤝 贡献指南

1. Fork → 新建分支 (`feature/xxx`)
2. 提交代码 (`git commit -s -m "feat: xxx"`)
3. Push & 发起 PR
4. 通过 CI / Code Review 后合并

> 提交信息遵循 **Conventional Commits**；请同时更新 Changelog。

---

## 📄 许可证

本项目采用 **MIT License**，详情见 [LICENSE](LICENSE)。

---

## ✨ 鸣谢

* [Axum](https://github.com/tokio-rs/axum) — 轻量级 Rust Web 框架
* [SeaORM](https://github.com/SeaQL/sea-orm) — 异步 ORM
* [Material UI](https://mui.com/) — React UI 框架
* [Vite](https://vitejs.dev/) — 前端极速构建工具

> 感谢所有开源社区，让这个项目成为可能！
