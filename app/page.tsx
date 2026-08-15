import PortfolioMotion from "./portfolio-motion";
import ParticlePortrait from "./particle-portrait";
import ProjectCaseShell, { type PortfolioProject } from "./project-cases";

const projects = [
  {
    id: "aigc",
    number: "01",
    title: "AIGC个性化生成",
    focus: "搜索意图 → 个性化表达",
    purpose: "理解搜索意图，动态表达商品或服务为何能够承接需求",
    statement: "意图 → 服务判断 → 生成 → 准出 → 优选",
    resultLabel: "实验结果",
    result: "Advv +23.16% · CTR2 +11.13% · CVR +25.39%",
    directModules: "context intent action evaluation",
    supportModules: "",
    preview: "/assets/search-personalized-ad.webp",
    previewAlt: "AIGC个性化生成案例",
  },
  {
    id: "search",
    number: "02",
    title: "AI Search",
    focus: "复杂意图 → 决策框架",
    purpose: "把分散的商品与事实，组织成帮助用户比较与选择的 AI 结果卡",
    statement: "Query → 召回 → Planner/Writer → Judge",
    resultLabel: "离线人工评估",
    result: "Good Case 83% · 结构有效率96%",
    directModules: "context intent action evaluation",
    supportModules: "",
    preview: "/assets/ai-search-agentic.webp",
    previewAlt: "AI Search 结构化结果卡案例",
  },
  {
    id: "evaluation",
    number: "03",
    title: "质量评测与规模化",
    focus: "不确定性 → 质量边界",
    purpose: "用动态评测定义质量边界，持续牵引模型与策略迭代",
    statement: "标准定义 → 事前准入 → 线上巡检 → 归因反哺",
    resultLabel: "评测规模 / 产能",
    result: "累计评测 8 万+ · 日产能 200 → 10,000",
    directModules: "evaluation",
    supportModules: "context action",
    preview: null,
    previewAlt: "质量治理与评测规模化结果",
  },
  {
    id: "memento",
    number: "04",
    title: "Memento",
    focus: "碎片 → Context",
    purpose: "将零散事实组织成可持续更新、由用户校准的长期 Context",
    statement: "原窗口 → 本地事实 → 用户授权 Context",
    resultLabel: "当前状态",
    result: "独立构建 · 已形成记录闭环",
    directModules: "context memory",
    supportModules: "trust",
    preview: "/assets/memento-dashboard.png",
    previewAlt: "Memento记录与回看Dashboard",
  },
] satisfies PortfolioProject[];

export default function Home() {
  const previews = projects.map(({ id, preview, previewAlt }) => ({
    id,
    src: preview,
    alt: previewAlt,
  }));

  return (
    <main className="portfolio-whiteframe" id="top">
      <header className="site-header">
        <a className="site-identity" href="#top" aria-label="Luke Shi，返回页面顶部">
          <span className="identity-mark" aria-hidden="true">LS</span>
          <strong>Luke Shi</strong>
        </a>
        <p className="header-status"><i /> GMT+8</p>
        <nav aria-label="主页导航">
          <a href="#system">项目</a>
          <a href="#contact">联系</a>
        </nav>
      </header>

      <nav className="section-rail" aria-label="页面章节导航">
        <a href="#about" data-rail-target="about"><span>00</span><i /><b>首页</b></a>
        <a href="#system" data-rail-target="system"><span>01</span><i /><b>项目</b></a>
        <a href="#contact" data-rail-target="contact"><span>02</span><i /><b>联系</b></a>
      </nav>

      <section className="narrative-module hero" id="about" data-section="about" data-theme="light" aria-labelledby="about-title">
        <div className="hero-inner page-shell">
          <div className="hero-facts reveal-stagger" aria-label="个人概况">
            <div><span>TIMEZONE</span><strong>GMT+8</strong></div>
            <div><span>SELECTED WORK</span><strong>四项 AI 产品实践</strong></div>
          </div>

          <h1 className="hero-title reveal-lines" id="about-title">
            <span className="hero-title-line">让 <em>AI</em> 持续创造</span>
            <span className="hero-title-line">真实的用户价值</span>
          </h1>

                <ParticlePortrait />

          <div className="hero-identity reveal" aria-label="史翼洋的个人身份与方向">
            <span className="hero-identity-label" aria-hidden="true">PROFILE · FOCUS</span>
            <strong>史翼洋 / Luke Shi</strong>
            <p>浙江大学硕士 · 2027 届 · AI 产品经理</p>
            <small>AI 应用 · 质量治理 · 规模化落地 · 关注 AI Native</small>
          </div>

          <div className="hero-cta-row reveal">
            <a className="button-primary" href="#work" data-cursor="hover" data-magnetic>
              <span className="button-label">看四项实践</span><span className="button-arrow">↓</span>
            </a>
          </div>

          <p className="hero-scroll reveal"><span /> SCROLL TO EXPLORE</p>
        </div>

        <section className="hero-career" data-theme="light" aria-labelledby="career-title">
          <div className="page-shell hero-career-inner">
            <header className="hero-career-head">
              <h2 id="career-title">教育与实习</h2>
              <div className="career-summary" aria-label="实习累计约 20 个月，时间为 2024 年 10 月至 2026 年 7 月">
                <span>实习累计</span>
                <strong>约 20 个月</strong>
                <span className="career-dates">2024.10—2026.07</span>
              </div>
            </header>

            <article className="career-education" data-education-stage="zju">
              <div className="career-entry-meta">
                <span>最高学历</span>
                <span className="career-dates"><time dateTime="2024-09">2024.09</time>—<time dateTime="2027-06">2027.06</time></span>
              </div>
              <h3>浙江大学</h3>
              <p>城市规划学 · 硕士</p>
            </article>

            <ol className="career-internship-list" aria-label="三段实习经历">
              <li data-internship-stage="didi-growth">
                <div className="career-tenure">
                  <strong className="career-duration">约 4 个月</strong>
                  <span className="career-dates"><time dateTime="2024-10">2024.10</time>—<time dateTime="2025-02">2025.02</time></span>
                </div>
                <h3 className="career-role">B 端增长产品</h3>
                <strong className="career-company">滴滴出行 · 代驾事业部</strong>
                <p>司机生态</p>
              </li>
              <li data-internship-stage="didi-strategy">
                <div className="career-tenure">
                  <strong className="career-duration">约 4 个月</strong>
                  <span className="career-dates"><time dateTime="2025-02">2025.02</time>—<time dateTime="2025-06">2025.06</time></span>
                </div>
                <h3 className="career-role">C 端策略产品</h3>
                <strong className="career-company">滴滴出行 · 代驾事业部</strong>
                <p>费用体验治理</p>
              </li>
              <li data-internship-stage="bytedance-ai">
                <div className="career-tenure">
                  <strong className="career-duration">约 12 个月</strong>
                  <span className="career-dates"><time dateTime="2025-07">2025.07</time>—<time dateTime="2026-07">2026.07</time></span>
                </div>
                <h3 className="career-role">AI 产品经理</h3>
                <strong className="career-company">字节跳动 · TikTok GMPT Ads Core</strong>
                <p>搜索 × 多模态生成 × 广告</p>
              </li>
            </ol>
          </div>
        </section>

      </section>

      <section className="narrative-module system-module" id="system" data-section="system" data-theme="dark" aria-labelledby="process-title">
        <article className="process-section" id="thesis">
          <div className="page-shell">
            <div className="process-head reveal">
              <div>
                <p className="chapter-label chapter-label-dark">01 · 核心项目</p>
                <h2 id="process-title">四项 AI 产品实践</h2>
              </div>
              <div className="process-thesis">
                <strong>把 AI 能力变成可用、可判断、可持续迭代的产品结果</strong>
                <p>我在四个场景中持续处理四类 AI 产品问题：如何理解意图并动态表达服务价值，如何组织信息帮助用户决策，如何通过评测牵引策略迭代，以及如何利用 Context 形成持续的个性化理解</p>
              </div>
            </div>

            <div className="work-model-shell">
              <ProjectCaseShell projects={projects}>
                <figure className="agent-zone" aria-labelledby="agent-map-caption">
                <figcaption className="agent-map-caption" id="agent-map-caption">
                  <span>我做 AI 产品时反复检查的六个问题</span>
                </figcaption>

                <div className="agent-linear-model" aria-label="从 Context 到长期记忆的 Agent 产品检查轴线">
                  <div className="agent-linear-axis" role="list">
                    <article className="linear-stage linear-context agent-module" data-agent-module="context" data-projects="aigc search memento" role="listitem">
                      <span>CONTEXT</span>
                      <h3>理解所需的 Context</h3>
                      <div className="linear-context-pair">
                        <div data-agent-substep="long-term" data-context-scope="long-term" data-projects="memento">
                          <b>长期</b>
                          <strong>长期 Context</strong>
                          <p>历史 · 偏好 · 已确认线索</p>
                        </div>
                        <i aria-hidden="true">+</i>
                        <div data-agent-substep="now" data-context-scope="current" data-projects="aigc search memento">
                          <b>当前</b>
                          <strong>当前 Context</strong>
                          <p>表达 · 状态 · 环境 · 约束</p>
                        </div>
                      </div>
                    </article>

                    <article className="linear-stage agent-module" data-agent-module="intent" data-projects="search aigc" role="listitem">
                      <span>INTENT</span>
                      <h3>任务判断</h3>
                      <p>要完成什么 · 受到哪些约束</p>
                    </article>

                    <article className="linear-stage agent-module" data-agent-module="action" data-projects="search aigc" role="listitem">
                      <span>ACTION</span>
                      <h3>产品动作</h3>
                      <p>规划 · 边界 · 工具 / 服务 · 交付</p>
                    </article>

                    <article className="linear-stage agent-module" data-agent-module="evaluation" data-projects="search aigc evaluation" role="listitem">
                      <span>EVALUATION</span>
                      <h3>质量控制</h3>
                      <p>标准 · 准入 · 反馈</p>
                    </article>

                    <article className="linear-stage agent-module" data-agent-module="trust" data-projects="memento" role="listitem">
                      <span>TRUST · EXP</span>
                      <h3>用户校准</h3>
                      <p>确认 · 纠偏 · 拒绝</p>
                    </article>

                    <article className="linear-stage agent-module" data-agent-module="memory" data-projects="memento" role="listitem">
                      <span>MEMORY</span>
                      <h3>长期记忆</h3>
                      <p>来源 · 结果 · 修正</p>
                    </article>
                  </div>

                  <div className="agent-linear-return" data-feedback-from="memory" data-feedback-to="context">
                    <span>MEMORY ↺ CONTEXT</span>
                    <strong>结果与反馈进入下一次 Context</strong>
                  </div>
                </div>
                </figure>
              </ProjectCaseShell>
            </div>
          </div>
        </article>
      </section>

      <section className="contact-panel" id="contact" data-section="contact" data-theme="dark" aria-labelledby="contact-title">
        <div className="page-shell">
          <div className="contact-meta">
            <span>CONTACT</span>
            <span>LUKE SHI · GMT+8</span>
          </div>
          <div className="contact-grid">
            <div className="contact-copy reveal-lines">
              <h2 id="contact-title">一起把 AI 做成<br /><em>可用的产品</em></h2>
              <p>如果你想交流 AI 产品、合作方向或新的机会，欢迎联系。</p>
            </div>

            <div className="contact-links reveal-stagger">
              <a href="mailto:Shiyiyang_Luke@163.com" data-cursor="hover" data-magnetic>
                <span>EMAIL</span><strong>Shiyiyang_Luke@163.com</strong><i>↗</i>
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer className="site-footer" data-theme="dark">
        <div className="footer-wordmark" aria-hidden="true">LUKE SHI</div>
        <div className="page-shell footer-meta">
          <span>史翼洋 · AI PRODUCT MANAGER · 2026</span>
          <span>ONLINE PORTFOLIO / GMT+8</span>
          <a href="#top">返回顶部 ↑</a>
        </div>
      </footer>

      <PortfolioMotion previews={previews} />
    </main>
  );
}
