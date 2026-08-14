# 史翼洋 AI 产品作品集 v5

Luke Shi 的公开个人主页与 AI 产品作品集。页面采用连续阅读结构：首屏呈现职业目标、身份方向与教育实习；项目区展示四项实践与产品检查轴，并支持在主页原地查看 AIGC、AI Search、质量评测与 Memento 的完整案例；最后进入联系入口。

## 当前范围

- 当前交付：完整个人主页、线性 Agent 工作轴、四案同页展开案例与视觉/交互系统
- 桌面端优先；当前不做移动端专项
- GitHub Pages 静态发布；同一份源码可继续部署到国内静态托管平台
- 主页首屏使用 `ParticlePortrait`；公开版本不包含人物动效调试路由
- 人物默认显示清晰头部与上身，并在身体下缘用密集碎片和由小到大的 `0 / 1` 形成数字瀑布；点击肖像后整个人短暂切换成向外打散的全身粒子，停留后先缓慢聚拢、再自动恢复默认混合肖像。鼠标移动只改变同一人物平面的克制 3D 方向，不触发粒子化
- 每案采用“策略与角色 → 具体案例 → 完整执行链路 → 价值与结果”的统一阅读节奏；浮窗术语解释作为后续优化项

完整项目上下文见：

- `../AGENTS.md`
- `../00_迁移到新电脑/项目完整交接.md`
- `../00_迁移到新电脑/文件与来源清单.md`

## 页面结构

1. 首屏：左上使用 `LS / Luke Shi` 品牌标识，主视觉呈现“让 AI 持续创造真实的用户价值”；左下以 `AI 产品经理 / AI 应用 / 质量治理 / 规模化落地 / AI Native` 定义身份与方向，首屏末尾呈现教育与三段实习经历
2. 项目与方法：按 AIGC 个性化生成、AI Search、质量评测与规模化、Memento 展示四项实践，再用横轴呈现 Context（长期 + 当前）→ Intent → Action → Evaluation → Trust → Memory ↺ Context；四个案例均在主页连续呈现，案例内部可继续展开完整执行链路
3. 联系：邮箱

全页处于正常文档流，不使用满屏章节、sticky 锁屏或项目逐屏翻页。参考站的设计令牌与结构/交互解剖保存在 `design-references/`。

## 技术栈

- Node.js `>=22.13.0`
- React 19 + TypeScript
- Vinext + Vite
- 原生 CSS；Fraunces、Inter Tight 与 JetBrains Mono，并设置系统字体回退
- 原生 `IntersectionObserver`、`requestAnimationFrame` 与指针事件；实现双层自定义鼠标、关键按钮磁吸、固定页头、章节 rail 和项目浮图，不依赖 GSAP、Lenis 或动画库
- Cloudflare Worker/Vite 适配层

当前页面不依赖数据库、环境变量、登录状态或外部业务 API，可直接导出为静态网站。

## 启动

```bash
npm ci
npm run dev
```

打开：

```text
http://localhost:3000/
```

生成 GitHub Pages 静态文件：

```bash
npm run build
```

产物位于 `dist/client/`。构建结束时会自动执行公开文件清理，任何 PDF 都不会保留在发布目录。推送到 `main` 后，`.github/workflows/pages.yml` 会再次验证并发布到：

```text
https://luke20001024.github.io/
```

## 验证

```bash
npm test
npm run lint
```

`npm test` 会执行生产构建和服务端渲染测试，并检查 Header、Hero、Agent 线性轴、四项实践证据带、四案同页展开结构、Memento Demo、主页人物模式、实验控件隔离与动效降级机制。

2026-08-14 的基线结果：

- 测试：2 项通过
- ESLint：0 error
- ESLint warning：0

## 关键目录

```text
app/                  页面、布局和全局样式
public/assets/        页面实际使用的头像与项目图片
public/demos/         Memento 自包含演示页面
tests/                渲染与结构回归测试
worker/               Worker 入口
build/                必须保留的 Sites Vite 插件源码
.openai/hosting.json  可选 Sites 配置；当前 D1/R2 为空
```

`build/` 需要保留。`dist/`、`.next/`、`.vinext/`、`.wrangler/` 和 `node_modules/` 可以重新生成。

所有 PDF 均为本地保密材料，不进入 Git 仓库，也不进入任何在线部署产物。公开页面不提供 PDF 或简历下载。

## 修改前的最低要求

1. 阅读根目录交接文件。
2. 运行当前页面，不从旧版 v2-v4 重建。
3. 项目事实以本地最新简历、演讲稿和项目材料为准；这些材料只用于本地核对，不进入公开仓库。
4. 主页人物交互支持 `prefers-reduced-motion`；本地实验路由不进入公开发布产物。
5. 保持连续网页结构，避免 `100svh` 项目章节与 sticky 滚动分页。
