"use client";

import type { ReactNode } from "react";
import { useState } from "react";

export type PortfolioProject = {
  id: "aigc" | "search" | "evaluation" | "memento";
  number: string;
  title: string;
  focus: string;
  coverage: string;
  statement: string;
  result: string;
  directModules: string;
  supportModules: string;
  status?: string;
  preview: string | null;
  previewAlt: string;
};

type ProjectCaseShellProps = {
  projects: PortfolioProject[];
  children: ReactNode;
};

function ProjectEvidence({ project }: { project: PortfolioProject }) {
  return (
    <article
      className={`project-evidence-item project-evidence-${project.id}`}
      id={`project-${project.id}`}
      data-project={project.id}
      data-project-evidence={project.id}
      data-project-preview={project.id}
      data-direct-modules={project.directModules}
      data-support-modules={project.supportModules}
    >
      <header>
        <span>{project.number}</span>
        <b>{project.focus}</b>
      </header>
      <h3>{project.title}</h3>
      <strong className="project-evidence-result">{project.result}</strong>
      <p className="project-evidence-route">{project.statement}</p>
      <footer>
        <span className="project-evidence-coverage">{project.coverage}</span>
        {project.status ? <span className="project-status">{project.status}</span> : null}
      </footer>
      <a
        className="project-case-open"
        href={`#portfolio-case-${project.id}`}
        aria-label={`查看${project.title}项目案例`}
        data-cursor="hover"
      >
        <span>查看项目案例</span>
        <i aria-hidden="true">↓</i>
      </a>
    </article>
  );
}

function PhoneShot({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="portfolio-phone" aria-label={alt}>
      <span className="portfolio-phone-key action" aria-hidden="true" />
      <span className="portfolio-phone-key volume" aria-hidden="true" />
      <span className="portfolio-phone-key power" aria-hidden="true" />
      <div className="portfolio-phone-screen">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="portfolio-phone-blur" src={src} alt="" aria-hidden="true" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="portfolio-phone-media" src={src} alt={alt} />
      </div>
    </div>
  );
}

function AigcPositionPhone({ after = false }: { after?: boolean }) {
  const adCard = (
    <article
      className="portfolio-aigc-result-card ad"
      aria-label={after ? "位于Top 1的个性化场景广告" : "位于Top 4的通用商品广告"}
    >
      <div className={`portfolio-aigc-ad-visual ${after ? "personalized" : "generic"}`}>
        <div className="portfolio-aigc-ad-crop">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={after ? "/assets/search-personalized-ad.webp" : "/assets/search-generic-ad.webp"}
            alt={after ? "狗、人与EcoKind商品同场的训练场景素材" : "EcoKind狗零食通用商品素材"}
          />
        </div>
      </div>
      <div className="portfolio-aigc-result-copy">
        <b>{after ? "Pet care and training | Dog treat?" : "25% OFF SALE | GET YOURS NOW!"}</b>
        <span>EcoKind Pet Treats · 广告</span>
      </div>
    </article>
  );

  const skeletonCard = (key: string) => (
    <div className="portfolio-aigc-result-card skeleton" aria-hidden="true" key={key}>
      <div className="portfolio-aigc-skeleton-image" />
      <span />
      <span className="short" />
    </div>
  );

  return (
    <a
      className={`portfolio-aigc-phone-preview-trigger ${after ? "after" : "before"}`}
      href={after ? "/assets/search-personalized-ad.webp" : "/assets/search-generic-ad.webp"}
      target="_blank"
      rel="noreferrer"
      aria-label={`${after ? "个性化素材位于Top 1" : "通用素材位于Top 4"}，悬停或聚焦可查看素材大图，点击可打开原图`}
    >
      <div className="portfolio-phone portfolio-aigc-position-phone" aria-hidden="true">
        <span className="portfolio-phone-key action" aria-hidden="true" />
        <span className="portfolio-phone-key volume" aria-hidden="true" />
        <span className="portfolio-phone-key power" aria-hidden="true" />
        <div className="portfolio-phone-screen portfolio-aigc-position-screen">
          <div className="portfolio-aigc-phone-status"><b>9:41</b><span>▮▮▮ ◒ ▰</span></div>
          <div className="portfolio-aigc-phone-query"><i aria-hidden="true">‹</i><b>How do I train my dog?</b><span aria-hidden="true">•••</span></div>
          <div className="portfolio-aigc-phone-tabs"><b>Top</b><span>Videos</span><span>Users</span><span>Sounds</span><span>Shop</span><span>Live</span></div>
          <div className="portfolio-aigc-result-grid">
            {after ? adCard : skeletonCard("before-1")}
            {skeletonCard(after ? "after-1" : "before-2")}
            {skeletonCard(after ? "after-2" : "before-3")}
            {after ? skeletonCard("after-3") : adCard}
          </div>
        </div>
      </div>
      <div className={`portfolio-aigc-ad-visual portfolio-aigc-material-preview ${after ? "personalized" : "generic"}`} aria-hidden="true">
        <div className="portfolio-aigc-ad-crop">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={after ? "/assets/search-personalized-ad.webp" : "/assets/search-generic-ad.webp"} alt="" />
        </div>
      </div>
    </a>
  );
}

function StoryArrow() {
  return <div className="portfolio-story-arrow" aria-hidden="true"><i /></div>;
}

function DetailToggle({
  open,
  setOpen,
  controls,
  title,
  route,
}: {
  open: boolean;
  setOpen: (next: boolean) => void;
  controls: string;
  title: string;
  route: string;
}) {
  const toggle = () => {
    setOpen(!open);
  };

  return (
    <button
      className="portfolio-case-detail-toggle"
      type="button"
      aria-expanded={open}
      aria-controls={controls}
      onClick={toggle}
      data-cursor="hover"
    >
      <span>{open ? "收起完整执行链路" : title}</span>
      <small>{route}</small>
      <i aria-hidden="true">{open ? "↑" : "↓"}</i>
    </button>
  );
}

function DetailClose({ controls, setOpen }: { controls: string; setOpen: (next: boolean) => void }) {
  const close = () => {
    setOpen(false);
    window.requestAnimationFrame(() => {
      document.querySelector<HTMLButtonElement>(`[aria-controls="${controls}"]`)?.focus();
    });
  };

  return <div className="portfolio-detail-close"><button type="button" onClick={close} data-cursor="hover">收起完整执行链路 ↑</button></div>;
}

function ValueRows({
  rows,
}: {
  rows: Array<{ label: string; text: string }>;
}) {
  return (
    <div className="portfolio-value-list">
      {rows.map((row) => <div className="portfolio-value-row" key={row.label}><b>{row.label}</b><span>{row.text}</span></div>)}
    </div>
  );
}

function StructuredOutcome({
  title,
  values,
  evidenceTitle,
  evidence,
  roleTitle,
  roleItems,
}: {
  title: string;
  values: Array<{ label: string; text: string }>;
  evidenceTitle: string;
  evidence: ReactNode;
  roleTitle: string;
  roleItems: string[];
}) {
  return (
    <section className="portfolio-structured-outcome">
      <header><small>最终作用</small><h4>{title}</h4></header>
      <div className="portfolio-structured-outcome-grid">
        <section><small>三层价值</small><ValueRows rows={values} /></section>
        <section className="portfolio-structured-results"><small>{evidenceTitle}</small>{evidence}</section>
        <section className="portfolio-structured-role"><small>我的角色</small><strong>{roleTitle}</strong><ul>{roleItems.map((item) => <li key={item}>{item}</li>)}</ul></section>
      </div>
    </section>
  );
}

function CaseFrame({
  id,
  number,
  eyebrow,
  title,
  titleNote,
  children,
}: {
  id: PortfolioProject["id"];
  number: string;
  eyebrow: string;
  title: string;
  titleNote?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section
      className={`portfolio-case-study portfolio-case-${id}`}
      id={`portfolio-case-${id}`}
      data-theme="light"
      aria-labelledby={`portfolio-case-${id}-title`}
      tabIndex={-1}
    >
      <div className="portfolio-case-shell">
        <header className="portfolio-case-title">
          <div><span>{number} / 04</span><span>{eyebrow}</span></div>
          <h3 id={`portfolio-case-${id}-title`}>{title}</h3>
          {titleNote}
        </header>
        {children}
      </div>
    </section>
  );
}

function AigcCase() {
  const [detail, setDetail] = useState(false);
  return (
    <CaseFrame
      id="aigc"
      number="01"
      eyebrow="PERSONALIZED GENERATION"
      title="AIGC个性化生成"
      titleNote={<blockquote className="portfolio-aigc-title-note">面向高商业价值、但高相关素材不足的搜索词：先判断商品能不能承接用户需求；能承接，再在不改变商品事实的前提下，把“为什么相关”写进图片和标题</blockquote>}
    >

      <section className="portfolio-aigc-how" aria-labelledby="portfolio-aigc-how-title">
        <header className="portfolio-aigc-section-head">
          <div><small>怎么做</small><h4 id="portfolio-aigc-how-title">从意图理解，到可在线优选的图文候选</h4></div>
          <p>离线完成生成、评测与候选入库，在线请求只做召回和优选</p>
        </header>
        <div className="portfolio-aigc-overview">
          <section className="portfolio-aigc-product-flow" aria-labelledby="portfolio-aigc-product-flow-title">
            <header><small>产品流程模块</small><h5 id="portfolio-aigc-product-flow-title">离线准备供给，在线完成选择</h5></header>
            <ol>
              <li><span>01</span><div><b>意图理解与服务判断</b><p>结合搜索词、广告内容与落地页事实，判断广告能否回应当前需求</p><small>产出｜可进入生成的搜索词 × 广告组合</small></div></li>
              <li><span>02</span><div><b>多模态生成与表达适配</b><p>将可承接的卖点与搜索意图转化为图片和标题，并保留商品与品牌事实</p><small>产出｜多个个性化图文版本</small></div></li>
              <li><span>03</span><div><b>质量评测与准出</b><p>评测搜索相关性、文字准确性、商品主体一致性与生成问题，未通过则拦截</p><small>产出｜通过评测的生成结果</small></div></li>
              <li><span>04</span><div><b>候选入库与投放优选</b><p>将图片与标题组成候选，新请求到来时从同一广告的多个版本中选出更贴合当前搜索的一版</p><small>产出｜进入当前流量的图文版本</small></div></li>
            </ol>
          </section>

          <section className="portfolio-aigc-comparison" aria-labelledby="portfolio-aigc-comparison-title">
            <header>
              <div><small>案例对照</small><h5 id="portfolio-aigc-comparison-title">搜索词：How do I train my dog?</h5></div>
              <p>商品事实不变，表达与搜索意图对齐</p>
            </header>
            <div className="portfolio-aigc-comparison-body">
              <div className="portfolio-aigc-phone-pair">
                <figure>
                  <figcaption><small>之前</small><b>Top 4 · 通用商品表达</b></figcaption>
                  <AigcPositionPhone />
                </figure>
                <div className="portfolio-aigc-compare-arrow" aria-hidden="true"><span>表达变化</span><i /></div>
                <figure className="after">
                  <figcaption><small>之后</small><b>Top 1 · 训练场景表达</b></figcaption>
                  <AigcPositionPhone after />
                </figure>
              </div>
              <div className="portfolio-aigc-case-effects" aria-label="案例在用户、商家与平台三侧的变化">
                <article><b>用户</b><span>自己猜为什么相关</span><i aria-hidden="true">→</i><strong>训练意图被直接回应</strong></article>
                <article><b>商家</b><span>商品能承接但没说清</span><i aria-hidden="true">→</i><strong>狗零食服务被看见</strong></article>
                <article><b>平台</b><span>广告位于Top 4</span><i aria-hidden="true">→</i><strong>Top 1获得更多消耗机会</strong></article>
              </div>
            </div>
          </section>
        </div>
      </section>

      <DetailToggle open={detail} setOpen={setDetail} controls="portfolio-detail-aigc" title="展开这个案例的完整执行链路" route="搜索词聚合 → 服务判断 → 参考图匹配 → 图文生成 → 质量评测 → 候选入库 → 在线召回 → 相关性优选" />
      <section className="portfolio-case-detail" id="portfolio-detail-aigc" aria-labelledby="portfolio-detail-aigc-title" tabIndex={-1} hidden={!detail}>
        <header><div><small>完整执行链路 / 01</small><h4 id="portfolio-detail-aigc-title">从“能不能承接”，到可在线选择的图文候选</h4></div><p>离线完成判断、生成、质检和建库；在线请求只做召回与优选</p></header>
        <div className="aigc-mechanism-grid">
          <section className="aigc-mech-stage">
            <div className="aigc-stage-head"><small>01—04 / 输入准备</small><h5>先决定能不能生成、拿什么生成</h5><p>把搜索词、广告事实和参考图整理成合格输入</p></div>
            <div className="aigc-detail-inputs">
              <article className="aigc-detail-card"><small>01 / 搜索词</small><b>历史Query → 中心词</b><p>聚合历史搜索词，完成语言过滤、去重去噪与语义聚类</p></article>
              <article className="aigc-detail-card"><small>广告事实</small><b>Caption + Landing Page</b><p>限定品牌、商品与可以表达的事实，避免生成脱离广告内容</p></article>
            </div>
            <article className="aigc-detail-card"><small>02 / 搜索词 × 广告</small><b>相关性分流</b><div className="aigc-route-list"><span><b>高相关</b>采用中心词</span><span><b>中相关</b>基于事实改写</span><span><b>低相关</b>停止进入下游</span></div><p>本页沿“可承接、进入生成”的路径说明狗零食案例</p></article>
            <article className="aigc-detail-card"><small>03—04 / 参考图匹配</small><b>参考图候选 → Query–Image Pair</b><p>URL图先做低质过滤，再与BAU Carousel共同分类；中心词与候选图匹配后形成Pair</p></article>
            <div className="aigc-stage-output"><small>阶段产物</small><b>合格的Query–Reference Image Pair</b></div>
          </section>
          <div className="aigc-detail-arrow" aria-hidden="true"><span>合格输入</span></div>
          <section className="aigc-mech-stage core">
            <div className="aigc-stage-head"><small>05—07 / 生成 · 准出 · 入库</small><h5>把搜索意图写进画面，通过准出才算完成</h5><p>图片走质量门，Title走并行支路，最后汇成候选</p></div>
            <article className="aigc-detail-card"><small>05 / 视觉要求</small><b>构建结构化视觉生成要求</b><div className="aigc-instruction-tags"><span>场景与核心视觉</span><span>商品主体与构图</span><span>文字、色彩与布局</span><span>风格与规避项</span></div><p>页面只展示要求结构，不展示具体Prompt</p></article>
            <div className="aigc-generation-split">
              <article className="aigc-detail-card">
                <small>06 / 图片分支</small>
                <div className="aigc-image-result">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/assets/search-personalized-ad.webp" alt="训练场景中的狗、人和商品" />
                  <div><b>生成个性化图片</b><p>狗、人宠互动与商品同场</p></div>
                </div>
                <div className="aigc-image-gate"><b>图片质量门</b><div className="aigc-gate-tags"><span>Query–Image冲突</span><span>文字拼写</span><span>商品主体一致</span><span>物理幻觉</span></div><p><b>通过 → 汇入候选</b><span>失败 → 废弃或阻断</span></p></div>
              </article>
              <article className="aigc-detail-card aigc-title-branch"><small>并行标题分支</small><b>个性化Title</b><p>由搜索意图和广告事实生成，不穿过图片质检线</p></article>
            </div>
            <div className="aigc-merge-bar"><small>07 / 合并入库</small><b>通过的图片 + Title → AIGC图文候选</b><p>ABase → IndexService</p></div>
            <div className="aigc-stage-output"><small>阶段产物</small><b>按source/CID可召回的图文候选</b></div>
          </section>
          <div className="aigc-detail-arrow" aria-hidden="true"><span>新请求</span></div>
          <section className="aigc-mech-stage serve">
            <div className="aigc-stage-head"><small>08 / 召回 · 优选 · 下发</small><h5>新搜索到来后，从候选中选择</h5><p>在线只召回、优选和打包下发</p></div>
            <div className="aigc-request-flow">
              <article className="aigc-request-node"><small>08A / 再次搜索</small><b>How do I train my dog?</b><p>新的搜索请求再次到来</p></article>
              <div className="aigc-request-arrow" aria-hidden="true">↓</div>
              <article className="aigc-request-node">
                <small>08B / 召回</small><b>同一CID的多个source</b>
                <div className="aigc-candidate-pair">
                  <div>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/assets/search-generic-ad.webp" alt="原始图文候选" /><span>原始版本</span>
                  </div>
                  <div>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/assets/search-personalized-ad.webp" alt="个性化图文候选" /><span>个性化版本</span>
                  </div>
                </div>
              </article>
              <div className="aigc-request-arrow" aria-hidden="true">↓</div>
              <article className="aigc-request-node"><small>08C / 优选下发</small><b>按相关性优选并下发</b><p>输出本次请求中更匹配的图文表达</p></article>
            </div>
            <div className="aigc-stage-output"><small>阶段产物</small><b>更贴近当前搜索词的图文Pair</b></div>
          </section>
        </div>
        <div className="aigc-mechanism-notes"><div><small>产品判断</small><b>离线准备供给，在线只做选择</b><p>不是搜索时现场生图</p></div><div><small>质量边界</small><b>图片质检与Title支路分开</b><p>图片通过后再汇成候选</p></div><div><small>证据范围</small><b>同一CID内优选，不等于全局排名</b><p>狗零食用于说明机制，策略指标不归因单条素材</p></div></div>
        <DetailClose controls="portfolio-detail-aigc" setOpen={setDetail} />
      </section>
      <section className="portfolio-aigc-outcome" aria-labelledby="portfolio-aigc-outcome-title">
        <header>
          <small>最终作用</small>
          <h4 id="portfolio-aigc-outcome-title">把能够满足需求、却没有表达清楚的广告，转化为可被识别、优选和投放的高相关图文供给</h4>
        </header>
        <div className="portfolio-aigc-outcome-grid">
          <section><small>三方价值</small><ValueRows rows={[
            { label: "用户", text: "更直接看见商品与当前搜索意图的关系，少一步从通用广告中自行推断" },
            { label: "广告主", text: "同一商品面向不同搜索词形成多套图文候选，增加可投素材与消耗机会" },
            { label: "平台", text: "让能承接、但原素材没表达出来的广告更容易被相关性模型识别与优选" },
          ]} /></section>
          <section className="portfolio-aigc-results"><small>策略生效范围结果</small><div className="portfolio-metrics"><div><b>+23.16%</b><span>Advv</span></div><div><b>+11.13%</b><span>CTR2</span></div><div><b>+25.39%</b><span>CVR</span></div></div><p>数字来自Query个性化策略生效范围内的实验结果，不归因到这条狗零食素材，也不证明单张图片必然提升全局排名</p></section>
          <section className="portfolio-aigc-role"><small>我的角色</small><strong>搜索个性化产品侧负责人</strong><ul><li>定义意图与广告服务边界</li><li>设计生成策略与事实约束</li><li>推动图文生成、质量评测与素材优选</li><li>负责实验评估与全量上线</li></ul></section>
        </div>
      </section>
    </CaseFrame>
  );
}

function SearchCase() {
  const [detail, setDetail] = useState(false);
  return (
    <CaseFrame
      id="search"
      number="02"
      eyebrow="AI SEARCH"
      title="AI搜索结果卡"
      titleNote={<blockquote className="portfolio-case-title-note">面对“该怎么选”这类复杂搜索，先判断是否需要AI承接，再用可验证的商品与广告事实组织选择标准、候选与理由，最后通过质量评测决定是否准出</blockquote>}
    >
      <section className="portfolio-method-section portfolio-search-method" aria-labelledby="portfolio-search-how-title">
        <header className="portfolio-method-section-head">
          <div><small>怎么做</small><h4 id="portfolio-search-how-title">从复杂搜索任务，到能帮助选择的AI结果卡</h4></div>
          <p>任务适配 → 事实召回与Planner组织 → Judge准出</p>
        </header>
        <div className="portfolio-method-overview">
          <section className="portfolio-search-chain" aria-labelledby="portfolio-search-chain-title">
            <header><small>AI结果卡产品链</small><h5 id="portfolio-search-chain-title">先判断任务，再组织事实，最后决定是否准出</h5></header>
            <div className="portfolio-search-chain-flow">
              <article><span>任务适配</span><b>判断是否需要AI承接</b><p>事实查询和简单找商品不强行出卡，需要比较与选择的任务才进入下游</p><small>进入｜决策型与探索型搜索任务</small></article>
              <i aria-hidden="true">↓</i>
              <article className="planner"><span>事实召回 + Planner</span><b>召回可验证事实，再组织选择框架</b><p>先从广告和商品信息中召回事实，再由Planner组织选择标准、候选顺序与推荐理由</p><small>产出｜结构化结果卡草案</small></article>
              <i aria-hidden="true">↓</i>
              <article className="judge"><span>Judge Model</span><b>评测后决定是否准出</b><p>检查事实准确、搜索相关、结构完整与风险边界，不满足则阻断</p><small>产出｜可展示候选 / 阻断</small></article>
            </div>
          </section>
          <section className="portfolio-evidence-board portfolio-search-board" aria-labelledby="portfolio-search-case-title">
            <header><div><small>案例对照</small><h5 id="portfolio-search-case-title">搜索词：gym headphones</h5></div><p>从内容混排，变成能帮助选择的结果卡</p></header>
            <div className="portfolio-search-board-body">
              <div className="portfolio-search-phone-pair">
                <figure><figcaption><small>普通结果</small><b>选择标准由用户自己整理</b></figcaption><PhoneShot src="/assets/ai-search-standard.webp" alt="gym headphones普通搜索结果" /></figure>
                <div className="portfolio-search-arrow" aria-hidden="true"><span>信息组织</span><i /></div>
                <figure><figcaption><small>AI结果卡</small><b>先给选择维度，再给候选理由</b></figcaption><PhoneShot src="/assets/ai-search-agentic.webp" alt="gym headphones AI搜索结果卡" /></figure>
              </div>
            </div>
          </section>
        </div>
      </section>
      <DetailToggle open={detail} setOpen={setDetail} controls="portfolio-detail-search" title="展开这张AI卡的完整生成链路" route="任务圈选 → 事实召回 → Planner建卡 → Judge Model准出" />
      <section className="portfolio-case-detail" id="portfolio-detail-search" aria-labelledby="portfolio-detail-search-title" tabIndex={-1} hidden={!detail}>
        <header><div><small>完整执行链路 / 02</small><h4 id="portfolio-detail-search-title">从搜索任务，到一张可以展示的AI结果卡</h4></div><p>系统负责判断、组织和准出；用户选择是最终输出，不是第五个系统节点</p></header>
        <section className="search-workbench" aria-label="gym headphones从搜索任务到AI结果卡的四步处理">
          <div className="search-workbench-head"><div><strong>从搜索词到可展示结果卡</strong><small>案例重组 · 非逐请求日志</small></div><span>事实组织与质量准出<br />分开表达</span></div>
          <div className="search-flow-row"><div className="search-flow-label"><small>01 / 任务适配</small><b>判断是否需要AI承接</b></div><div className="search-query-task"><div><strong>gym + headphones</strong><span>商品对象 + 健身场景</span></div><i aria-hidden="true">→</i><div><strong>运动场景下的耳机选择任务</strong><span>决策型与探索型搜索优先</span></div></div></div>
          <div className="search-flow-row"><div className="search-flow-label"><small>02 / 商品事实</small><b>召回可验证事实</b></div><div className="search-product-facts"><article className="search-product-fact"><small>候选01 · 4.7 (64)</small><b>Jabra Elite Active 75t</b><span>长续航 · 良好音质</span></article><article className="search-product-fact"><small>候选02 · 4.7 (38)</small><b>M39 Wireless earbuds</b><span>防水 · 降噪</span></article><article className="search-product-fact"><small>候选03 · 4.6 (72)</small><b>Biaze Bass 15 Clip</b><span>开放式佩戴 · ENC音频</span></article></div></div>
          <div className="search-flow-row"><div className="search-flow-label"><small>03 / 信息规划</small><b>组织选择框架</b></div><div className="search-planner-grid"><div className="search-planner-block"><b>先提出选择标准</b><div className="search-dimensions"><span>稳固佩戴</span><span>耐汗 / 防水</span><span>续航</span></div></div><div className="search-planner-block"><b>再决定卡片结构</b><p>一句话总结 → 三个候选 → 关键事实与适配理由</p></div></div></div>
          <div className="search-flow-row"><div className="search-flow-label"><small>04 / 质量准出</small><b>判断是否出卡</b></div><div className="search-final-grid"><div className="search-judge"><div className="search-judge-grid"><span>事实准确</span><span>搜索相关</span><span>结构完整</span><span>风险红线</span></div><div className="search-serve-state"><span className="search-serve-pass">通过 → 进入候选</span><span className="search-serve-fail">失败 → 阻断</span></div></div><div className="search-answer-card"><small>信息规划输出</small><b>Gym Headphone Picks</b><p>选择标准 + 候选事实 + 推荐理由</p></div></div></div>
        </section>
        <div className="search-user-output"><b>输出交还用户</b><span>结果卡提供选择标准、候选事实与适配理由，帮助用户缩小下一步选择</span><small>当前证据不证明已经缩短决策时间或带来线上商业增长</small></div>
        <DetailClose controls="portfolio-detail-search" setOpen={setDetail} />
      </section>
      <StructuredOutcome
        title="把分散的商品与内容事实，组织成用户可以直接理解、比较和继续选择的AI结果卡"
        values={[
          { label: "用户决策", text: "减少从混排内容中自行提炼标准、比较候选的负担，帮助缩小下一步选择" },
          { label: "商业供给", text: "让可验证的商品与广告事实进入总结与结构化推荐，参与复杂决策场景" },
          { label: "平台承接", text: "跑通AI Search原生商业承接的首版链路，并用事实边界和质量准出控制结果" },
        ]}
        evidenceTitle="首版离线人工评估"
        evidence={<><div className="portfolio-metrics two"><div><b>83%</b><span>Good Case</span></div><div><b>96%</b><span>结构有效率</span></div></div><p>用于解除首版开实验的质量阻塞，不归因到单张卡，也不等于线上决策效率或商业增量</p></>}
        roleTitle="AI卡生成能力与评估体系建设"
        roleItems={["定义搜索任务圈选与事实边界", "设计卡片信息组织与生成策略", "推动Planner建卡与Judge Model准出", "用离线评估解除首版质量阻塞"]}
      />
    </CaseFrame>
  );
}

function QualityCase() {
  const [detail, setDetail] = useState(false);
  return (
    <CaseFrame
      id="evaluation"
      number="03"
      eyebrow="QUALITY GOVERNANCE"
      title="质量评测与规模化"
      titleNote={<blockquote className="portfolio-case-title-note">把模型输出中的不确定性，转成能决定通过、返工和阻断的质量规则；上线后再把问题送回规则、模型或策略，进入下一轮评测</blockquote>}
    >
      <section className="portfolio-method-section portfolio-quality-method" aria-labelledby="portfolio-quality-how-title">
        <header className="portfolio-method-section-head portfolio-quality-cycle-head">
          <div><small>怎么做</small><h4 id="portfolio-quality-how-title">质量不是一次打分，而是一条回到下一轮的治理闭环</h4></div>
          <p>标准决定什么能上线，线上问题决定下一轮具体改什么</p>
        </header>
        <div className="portfolio-quality-cycle-layout">
          <section className="portfolio-quality-cycle" aria-labelledby="portfolio-quality-cycle-title">
            <header><small>质量治理闭环</small><h5 id="portfolio-quality-cycle-title">从判断边界，到修改后重新送评</h5></header>
            <div className="portfolio-quality-cycle-map">
              <article className="definition"><small>定义</small><b>标准与风险边界</b><p>把事实、相关性、结构与风险红线写成统一规则</p><em>规则表 · 严重度口径 · 标注说明</em></article>
              <i className="arrow top" aria-hidden="true">→</i>
              <article className="admission"><small>准入</small><b>事前评测与判断</b><p>在实验和推全前给出通过、返工或阻断结论</p><em>能否进入实验或全量上线</em></article>
              <i className="arrow right" aria-hidden="true">↓</i>
              <article className="inspection"><small>巡检</small><b>线上抽检与发现</b><p>持续观察已推全策略，发现新增问题与风险</p><em>风险样本 · 处理优先级</em></article>
              <i className="arrow bottom" aria-hidden="true">←</i>
              <article className="feedback"><small>回流</small><b>归因修改与重评</b><p>定位到规则、模型或策略，修改后重新送评</p><em>可验证的修改项</em></article>
              <i className="arrow left" aria-hidden="true">↑</i>
            </div>
            <div className="portfolio-quality-cycle-decision"><small>每轮结论</small><b>通过 / 返工 / 阻断</b><span>完成修改后重新进入评测与准入</span></div>
          </section>
          <section className="portfolio-evidence-board portfolio-quality-board" aria-labelledby="portfolio-quality-case-title">
            <header><div><small>AI Search治理案例</small><h5 id="portfolio-quality-case-title">结果卡已经能生成，为什么仍不能全量上线</h5></div><p>P00/P0沿用项目内部严重度口径</p></header>
            <div className="portfolio-quality-result-pair">
              <article><small>治理前</small><h6>链路跑通，仍不满足全量上线条件</h6><div><span><b>P00 5%</b><i>P00问题样本率</i></span><span><b>P0 8%</b><i>P0问题样本率</i></span></div></article>
              <div className="portfolio-quality-result-arrow" aria-hidden="true"><span>标准重建</span><i>→</i><span>准入与巡检</span><i>→</i><span>归因回流</span></div>
              <article className="after"><small>治理后</small><h6>高严重度问题下降，恢复全量放量</h6><div><span><b>P00 0%</b><i>P00问题样本率</i></span><span><b>P0 1%</b><i>P0问题样本率</i></span></div></article>
            </div>
            <p className="portfolio-quality-board-note">以上为该阶段评估与监控口径，不代表整个AI Search产品的线上错误率</p>
          </section>
        </div>
      </section>
      <DetailToggle open={detail} setOpen={setDetail} controls="portfolio-detail-evaluation" title="展开这个治理案例的完整闭环" route="标准定义 → 事前准入 → 线上巡检 → 归因修改 → 重新送评" />
      <section className="portfolio-case-detail" id="portfolio-detail-evaluation" aria-labelledby="portfolio-detail-evaluation-title" tabIndex={-1} hidden={!detail}>
        <header><div><small>完整执行链路 / 03</small><h4 id="portfolio-detail-evaluation-title">从一条问题样本，到下一轮可验证的修改</h4></div><p>完整闭环回答由谁判断、按什么判断、结论怎样改变上线和下一轮</p></header>
        <section className="quality-governance" aria-label="AI Search质量治理四阶段主链">
          <div className="quality-governance-head"><strong>一条能决定上线，也能牵引下一轮修改的质量闭环</strong><span>标准定义 → 事前准入 → 线上巡检 → 归因反哺</span></div>
          <div className="quality-governance-grid">
            <article className="quality-governance-card"><small>01 / 先把规则写清</small><h5>把“好卡片”写成可执行规则</h5><div className="quality-governance-body"><b>判断什么</b><p>事实是否准确、是否回答搜索需求、卡片结构是否完整、是否触及风险红线</p></div><div className="quality-governance-output"><b>阶段产物</b><span>评测规则表 · 严重度口径 · 标注执行说明</span></div></article>
            <article className="quality-governance-card"><small>02 / 上线前做决定</small><h5>在实验和推全前做分层判断</h5><div className="quality-governance-body"><b>怎样执行</b><p>按严重度与风险红线做分层准入，需要结合上下文的复杂判断由人工复核</p></div><div className="quality-governance-output"><b>阶段产物</b><span>通过 / 返工 / 阻断 · 决定实验或全量上线</span></div></article>
            <article className="quality-governance-card"><small>03 / 上线后继续抽检</small><h5>持续监控已上线结果</h5><div className="quality-governance-body"><b>怎样执行</b><p>上线后持续抽检已推全策略，监控问题样本率并及时发现新增风险</p></div><div className="quality-governance-output"><b>阶段产物</b><span>线上问题样本 · 风险优先级</span></div></article>
            <article className="quality-governance-card"><small>04 / 定位并重新送评</small><h5>把问题变成可验证的修改</h5><div className="quality-governance-body"><b>怎样回流</b><p>将问题定位到规则、模型或策略，完成修改后重新进入准入环节</p></div><div className="quality-governance-output"><b>阶段产物</b><span>规则 / 模型 / 策略变更项</span></div></article>
          </div>
          <div className="quality-governance-return"><span>问题变成修改项后，返回下一轮标准与准入</span></div>
        </section>
        <div className="portfolio-quality-evolution">
          <article><small>标准怎样持续更新</small><h5>争议样本与线上Bad Case共同推动口径迭代</h5><div className="portfolio-quality-track"><span>争议样本 / 线上Bad Case</span><i aria-hidden="true">→</i><span>确认新的判断边界</span><i aria-hidden="true">→</i><span>写回规则与执行说明</span><i aria-hidden="true">→</i><span>下一轮继续使用</span></div></article>
          <article><small>自动评审能力</small><h5>稳定规则进入自动送评、巡检与风险处置</h5><p>人审负责需要结合上下文的复杂判断，机审承担规模监控，结果继续反哺生成策略</p></article>
        </div>
        <div className="portfolio-quality-scale"><header><b>跨策略人审执行底座</b><span>支撑10+项策略，不是AI Search单项目样本量，也不是机器产能</span></header><div className="portfolio-metrics three"><div><b>30+</b><span>统一执行标准的评测人员</span></div><div><b>200 → 10k</b><span>日评测能力</span></div><div><b>80k+</b><span>累计人审样本</span></div></div><p>三组数字说明跨策略评测执行规模，不能与上方AI Search单项目的P00/P0结果混为同一口径</p></div>
        <DetailClose controls="portfolio-detail-evaluation" setOpen={setDetail} />
      </section>
      <StructuredOutcome
        title="让质量结论直接决定什么能上线、什么应阻断，以及下一轮具体改什么"
        values={[
          { label: "用户与广告主", text: "减少事实错误、无关表达和高风险内容进入线上结果，保护搜索体验与品牌安全" },
          { label: "业务", text: "让质量结论直接支撑实验、全量上线或及时阻断，AI Search因此恢复全量放量" },
          { label: "研发与运营", text: "把问题定位到规则、模型或策略，形成下一轮可以重新评测的修改" },
        ]}
        evidenceTitle="跨策略人审执行底座"
        evidence={<><div className="portfolio-quality-scale-metrics"><div><b>30+</b><span>统一标准的评测人员</span></div><div><b>200 → 10k</b><span>日评测能力</span></div><div><b>80k+</b><span>累计人审样本</span></div></div><p>支撑10+项策略；不是AI Search单项目样本量，也不是机器产能</p></>}
        roleTitle="生成质量与评测负责人"
        roleItems={["定义质量标准、严重度与风险红线", "推动事前准入、线上巡检与归因", "重建AI Search卡片标准和标注口径", "建立跨策略评测执行与自动化能力"]}
      />
    </CaseFrame>
  );
}

function MementoCase() {
  const [detail, setDetail] = useState(false);
  return (
    <CaseFrame
      id="memento"
      number="04"
      eyebrow="MEMORY → CONTEXT"
      title="Memento：事实先记录，上下文再授权"
      titleNote={<blockquote className="portfolio-case-title-note">在当前窗口主动留下文字、备注、标签和截图，按日形成可回看的本地事实；在工作区实验中，需要长期复用时，再由用户决定什么可以进入Context</blockquote>}
    >
      <section className="portfolio-method-section portfolio-memento-method" aria-labelledby="portfolio-memento-how-title">
        <header className="portfolio-method-section-head">
          <div><small>怎么做</small><h4 id="portfolio-memento-how-title">从原窗口记录，到本地Dashboard回看</h4></div>
          <p>默认区只展示v0.8.9已发布的记录与回看能力</p>
        </header>
        <div className="portfolio-method-overview portfolio-memento-overview">
          <section className="portfolio-memento-public-flow" aria-labelledby="portfolio-memento-public-flow-title">
            <header><small>已发布主链</small><h5 id="portfolio-memento-public-flow-title">先把事实留下，再回到Dashboard重新找到</h5></header>
            <div className="portfolio-memento-public-route">
              <ol>
                <li><span>记录</span><div><b>在当前窗口主动留下内容</b><p>文字、备注、标签和截图/OCR进入Memento</p><small>产出｜发生在当下的原始记录</small></div></li>
                <li><span>保存</span><div><b>按日保存在本地</b><p>正文进入当天Markdown，媒体保留原件</p><small>产出｜可追溯的日级事实</small></div></li>
                <li><span>回看</span><div><b>从Dashboard重新找到</b><p>按日期和标签查看记录，并按需复制</p><small>产出｜可以重新使用的记录</small></div></li>
              </ol>
              <aside className="portfolio-memento-review-branch"><div><small>可选支路</small><b>回看时生成Daily Review</b></div><p>用户主动启用后，目标日文本交给已配置的Codex生成总结；总结与原始事实分层，不改写原记录</p></aside>
            </div>
          </section>
          <section className="portfolio-evidence-board portfolio-memento-board" aria-labelledby="portfolio-memento-case-title">
            <header><div><small>已发布能力 · v0.8.9</small><h5 id="portfolio-memento-case-title">Memento Dashboard</h5></div><p>主动记录、本地按日保存，再按日期和标签回看</p></header>
            <div className="portfolio-memento-dashboard"><iframe src="/demos/memento-v089-demo.html" title="Memento v0.8.9 Dashboard可操作演示" loading="lazy" /></div>
            <p className="portfolio-memento-privacy">隐私边界：原始记录与Dashboard保存在本地；启用Daily Review时，目标日文本交给已配置的Codex；主动运行Context Agent时，本次选定的日级文本交给DeepSeek；Dashboard不持有API Key，也不直接调用模型</p>
          </section>
        </div>
      </section>
      <DetailToggle open={detail} setOpen={setDetail} controls="portfolio-detail-memento" title="展开授权机制与验证边界" route="原始事实 → 理解候选 → 证据校验 → 五种决定 → 已确认Context → Context Pack" />
      <section className="portfolio-case-detail" id="portfolio-detail-memento" aria-labelledby="portfolio-detail-memento-title" tabIndex={-1} hidden={!detail}>
        <header><div><small>完整执行链路 / 04</small><h4 id="portfolio-detail-memento-title">从原始事实，到用户授权的上下文</h4></div><p>v0.8.9负责留下和回看；下方授权链路属于工作区Context Agent实验，不是v0.8.9公开能力</p></header>
        <div className="portfolio-memento-track"><article><small>公开基线 · v0.8.9</small><b>记录与回看已形成闭环</b><span>主动记录 → 本地日级事实 → Dashboard回看 / 复制</span></article><article><small>工作区实验</small><b>候选、证据与授权</b><span>完成工程合同与模型小样本验证，不属于v0.8.9公开能力</span></article><article><small>E3未运行</small><b>真实未来任务复用尚未验证</b><span>当前不能证明减少重复说明或改变用户信任</span></article></div>
        <div className="portfolio-memento-flow">
          <article className="memento-panel"><header className="memento-panel-head"><div><small>01 / 已发布记录层</small><h5>先保留原始事实</h5></div><span>v0.8.9</span></header><div className="memento-dashboard-redraw"><div className="memento-appbar"><b>Memento</b><span>今日 · 回看 · 归档</span></div><div className="memento-capture-strip"><span>主动记录</span><b>文本 · 备注 · 标签 · 截图/OCR</b><small>语音按系统条件启用</small></div><article className="memento-record"><small>2026-08-08.md · 本地事实</small><p>用户要求先看可验证的结果</p></article><article className="memento-record"><small>2026-08-09.md · 本地事实</small><p>用户再次要求先验证</p></article><div className="memento-record-rule"><b>事实层不被模型改写</b><span>正文留在日级Markdown，媒体保留原件</span></div></div></article>
          <StoryArrow />
          <article className="memento-panel"><header className="memento-panel-head"><div><small>02—04 / 工作区授权实验</small><h5>先核对证据，再让用户决定</h5></div><span>合成合同示例</span></header><div className="memento-candidate-body"><div className="memento-proof-row"><div><small>引文校验</small><b>08-08 L12 · 08-09 L04 · 逐字一致</b></div><div><small>来源完整性</small><b>两份来源hash均匹配</b></div><span className="memento-pass">通过</span></div><article className="memento-candidate-card"><div><small>合成合同示例 · 模拟模型输出</small><span>工作偏好 · 低不确定性</span></div><strong>“在做重要变更前先验证”</strong><p>通过只证明引文与来源完整，不代表候选判断正确，仍需用户决定</p></article><div className="memento-decision-label"><b>用户选择</b><span>本案点击“改一下”</span></div><div className="portfolio-decisions memento-decisions"><span>是的<small>confirm</small></span><span className="active">改一下<small>edit</small></span><span>限定范围<small>scope</small></span><span>只是这次<small>just_once</small></span><span>不要记住<small>reject</small></span></div><div className="memento-edit-result"><small>用户修改后的表述</small><b>“重要变更前，只做与风险匹配的验证”</b></div><div className="memento-decision-routes"><span><b>是的 / 改一下 / 限定范围</b>写入长期Context</span><span><b>只是这次</b>生成单次Context Pack，不进入长期Context，当前不会自动消费或过期</span><span><b>不要记住</b>只保存决定，不写入长期Context</span></div><p className="memento-close-boundary">关闭候选卡不等于同意或拒绝</p></div></article>
          <StoryArrow />
          <article className="memento-panel"><header className="memento-panel-head"><div><small>05 / 授权后的输出</small><h5>只复用用户明确授权的内容</h5></div><span>工作区MVP</span></header><div className="memento-output-body"><article className="memento-file-card confirmed"><div><small>已确认Context</small><span>状态 · 生效</span></div><b>重要变更前，只做与风险匹配的验证</b><p>决定：修改 · 范围：工程任务</p></article><div className="memento-output-arrow" aria-hidden="true">↓</div><article className="memento-file-card pack"><div><small>Context Pack · Markdown</small><span>手动复制</span></div><b># 工程任务</b><p>- 重要变更前，只做与风险匹配的验证</p><p>复制给下一次AI任务，当前不自动消费，来源失效时跳过</p></article><div className="memento-output-boundary"><b>Dashboard长期包</b><span>不含原始引文</span><b>命令行包</b><span>包含证据定位</span><b>能证明</b><span>候选、授权语义与Context Pack合同可执行</span><b>不能证明</b><span>尚未证明减少真实未来任务的重复说明</span></div></div></article>
        </div>
        <section className="portfolio-memento-validation"><header><small>验证状态</small><h5>工程合同、模型回归与真实用户价值分开看</h5></header><div><article><b>E0—E1通过</b><span>静态安全、离线合同与数据流</span></article><article><b>E2通过</b><span>Pro与Flash在同组7个合成回归中各7/7</span></article><article><b>E3未运行</b><span>尚未验证是否减少真实任务中的重复说明</span></article></div><p>Chrome手工端到端未运行；7/7不代表真实用户判断质量或长期稳定性</p></section>
        <DetailClose controls="portfolio-detail-memento" setOpen={setDetail} />
      </section>
      <StructuredOutcome
        title="让重要判断先被留下、能被重新找到；是否进入长期Context，始终由用户决定"
        values={[
          { label: "记录连续性", text: "在意图发生处主动留下文字、截图等内容，并能按日期和标签重新找到" },
          { label: "授权与边界", text: "原始事实、AI候选和用户决定彼此分层，未经确认的模型判断不能进入长期Context" },
          { label: "未来AI协作", text: "工作区实验中，已确认Context可生成可复制的Context Pack；是否真的减少重复说明仍待E3验证" },
        ]}
        evidenceTitle="完成状态"
        evidence={<ValueRows rows={[{ label: "已发布", text: "v0.8.9主动记录、本地按日事实与回看闭环" }, { label: "工作区实验", text: "候选、证据校验、五种决定与Context Pack；E0—E2通过" }, { label: "未验证", text: "E3真实未来任务复用与信任变化" }]} />}
        roleTitle="个人项目 · 产品定义、系统设计与AI辅助实现"
        roleItems={["定义接近0摩擦的记录入口与本地事实层", "设计Dashboard与可选Daily Review回看闭环", "设计候选、证据、五种决定与Context Pack合同", "完成实现、文档、测试与迭代验证"]}
      />
    </CaseFrame>
  );
}

export default function ProjectCaseShell({ projects, children }: ProjectCaseShellProps) {
  return (
    <div className="project-case-shell">
      <section className="project-zone" id="work" data-theme="light" aria-label="四项核心项目">
        <div className="project-evidence-band">
          {projects.map((project) => (
            <div className="project-evidence-slot" key={project.id}>
              <ProjectEvidence project={project} />
            </div>
          ))}
        </div>
      </section>
      {children}
      <div className="project-cases" aria-label="四项完整项目案例">
        <AigcCase />
        <SearchCase />
        <QualityCase />
        <MementoCase />
      </div>
    </div>
  );
}
