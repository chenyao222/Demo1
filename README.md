目录结构

```
.
├─ index.html                 # 入口 HTML
├─ vite.config.ts             # Vite 配置（别名 @ → src）
├─ tsconfig.json              # TS 配置（含路径别名）
├─ src
│  ├─ main.tsx                # 应用挂载
│  ├─ styles.css              # 全局样式（浅色主题、移动端适配）
│  ├─ config.ts               # 诊断端点/超时配置
│  ├─ pages
│  │  └─ App.tsx             # 页面编排（顶部栏 + 四大区块组装）
│  ├─ components              # 复用 UI 组件
│  │  ├─ Section.tsx         # 卡片容器（标题左、操作右）
│  │  ├─ Connectivity.tsx    # 连通性测试卡片
│  │  ├─ NetworkInfo.tsx     # 网络情况卡片
│  │  ├─ DeviceInfo.tsx      # 设备详情卡片
│  │  └─ UserInfo.tsx        # 用户信息卡片（如需可再次启用）
│  ├─ hooks
│  │  └─ useDiagnostics.ts   # 统一调度测速、网络详情、设备信息
│  └─ utils
│     └─ diagnostics.ts      # 能力方法（测速/网络/设备/用户解析）
```

本地运行

```bash
# 安装依赖
npm i

# 启动开发环境
npm run dev
# 打开： http://localhost:5173/
```