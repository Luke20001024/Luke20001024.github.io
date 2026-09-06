"use client";

import type { ReactNode } from "react";
import { useState } from "react";

export type PortfolioProject = {
  id: "aigc" | "search" | "evaluation" | "memento";
  number: string;
  title: string;
  focus: string;
  purpose: string;
  statement: string;
  resultLabel: string;
  result: string;
  directModules: string;
  supportModules: string;
  preview: string | null;
  previewAlt: string;
};

type ProjectCaseShellProps = {
  projects: PortfolioProject[];
  children: ReactNode;
};

const caseNavigation: Array<Pick<PortfolioProject, "id" | "number" | "title">> = [
  { id: "aigc", number: "01", title: "AIGC个性化生成" },
  { id: "search", number: "02", title: "AI Search" },
  { id: "evaluation", number: "03", title: "质量评测与规模化" },
  { id: "memento", number: "04", title: "Memento" },
];

function CaseReadingIndex() {
  return (
    <nav className="case-reading-index" id="project-case-index" aria-label="项目案例目录" tabIndex={-1}>
      <p>案例目录 <span>选择项目，直接阅读</span></p>
      <ol>
        {caseNavigation.map((project) => (
          <li key={project.id}>
            <a className={`case-index-${project.id}`} href={`#portfolio-case-${project.id}`} data-cursor="hover">
              <span>{project.number}</span><strong>{project.title}</strong><i aria-hidden="true">↘</i>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

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
      <p className="project-evidence-purpose">{project.purpose}</p>
      <div className="project-evidence-outcome">
        <span>{project.resultLabel}</span>
        <strong className="project-evidence-result">{project.result}</strong>
      </div>
      <p className="project-evidence-route">{project.statement}</p>
      <a
        className="project-case-open"
        href={`#portfolio-case-${project.id}`}
        aria-label={`查看${project.title}项目案例`}
        data-cursor="hover"
      >
        <span>查看案例</span>
        <i aria-hidden="true">↘</i>
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
      <header><small>结果与职责</small><h4>{title}</h4></header>
      <div className="portfolio-structured-outcome-grid">
        <section><small>为谁带来什么</small><ValueRows rows={values} /></section>
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
  const nextCase = caseNavigation[caseNavigation.findIndex((project) => project.id === id) + 1];
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
        <nav className="case-reading-footer" aria-label={`${title}案例导览`}>
          <a href="#project-case-index" data-cursor="hover"><span aria-hidden="true">↑</span> 返回项目目录</a>
          {nextCase && (
            <a className="case-reading-next" href={`#portfolio-case-${nextCase.id}`} data-cursor="hover">
              <small>下一项目 · {nextCase.number} / 04</small>
              <strong>{nextCase.title} <span aria-hidden="true">→</span></strong>
            </a>
          )}
        </nav>
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
      titleNote={<blockquote className="portfolio-aigc-title-note">针对高相关素材不足的高商业价值搜索词，先判断商品能否满足需求。<strong>不改变商品事实，把“为什么适合”表达清楚。</strong></blockquote>}
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

      <section className="portfolio-aigc-outcome" aria-labelledby="portfolio-aigc-outcome-title">
        <header>
          <small>结果与职责</small>
          <h4 id="portfolio-aigc-outcome-title">把广告服务能力，转化为高相关图文供给</h4>
        </header>
        <div className="portfolio-aigc-outcome-grid">
          <section><small>为谁带来什么</small><ValueRows rows={[
            { label: "用户", text: "更直接看见商品与当前搜索意图的关系，少一步从通用广告中自行推断" },
            { label: "广告主", text: "同一商品面向不同搜索词形成多套图文候选，增加可投素材与消耗机会" },
            { label: "平台", text: "让能承接、但原素材没表达出来的广告更容易被相关性模型识别与优选" },
          ]} /></section>
          <section className="portfolio-aigc-results"><small>策略生效范围结果</small><div className="portfolio-metrics"><div><b>+23.16%</b><span>Advv</span></div><div><b>+11.13%</b><span>CTR2</span></div><div><b>+25.39%</b><span>CVR</span></div></div><p>数字来自Query个性化策略生效范围内的实验结果，不归因到这条狗零食素材，也不证明单张图片必然提升全局排名</p></section>
          <section className="portfolio-aigc-role"><small>我的角色</small><strong>搜索个性化产品侧负责人</strong><ul><li>定义意图与广告服务边界</li><li>设计生成策略与事实约束</li><li>推动图文生成、质量评测与素材优选</li><li>负责实验评估与全量上线</li></ul></section>
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
      titleNote={<blockquote className="portfolio-case-title-note">把复杂搜索中的商品与内容，组织成<strong>可理解、可比较的结果卡。</strong></blockquote>}
    >
      <section className="portfolio-method-section portfolio-search-method" aria-labelledby="portfolio-search-how-title">
        <header className="portfolio-method-section-head">
          <div><small>怎么做</small><h4 id="portfolio-search-how-title">从复杂Query，到经过准出的AI结果卡</h4></div>
          <p>理解需求 → 召回供给 → 组织表达 → 评测准出</p>
        </header>
        <div className="portfolio-method-overview">
          <section className="portfolio-search-chain" aria-labelledby="portfolio-search-chain-title">
            <header><small>AI结果卡产品链</small><h5 id="portfolio-search-chain-title">先理解需求，再组织结果，最后决定是否准出</h5></header>
            <div className="portfolio-search-chain-flow">
              <article className="understanding"><span>01 / 理解需求</span><b>Query清洗与意图理解</b><p>判断是否需要AI卡，并得到可用于召回的意图表达</p><small>产出｜标准化意图</small></article>
              <i className="portfolio-search-chain-arrow" aria-hidden="true" />
              <article className="recall"><span>02 / 召回供给</span><b>相关性召回</b><p>按意图召回能承接需求的商品与可验证事实</p><small>产出｜候选商品池</small></article>
              <i className="portfolio-search-chain-arrow" aria-hidden="true" />
              <article className="compose"><span>03 / 组织表达</span><b>Planner规划 · Writer生成</b><p>Planner决定用什么、怎么组织；Writer负责具体怎么写</p><small>产出｜结果卡草稿</small></article>
              <i className="portfolio-search-chain-arrow" aria-hidden="true" />
              <article className="judge"><span>04 / 评测准出</span><b>Judge Model</b><p>评测事实、相关性、结构与风险，不满足则阻断</p><small>产出｜可展示结果卡 / 阻断</small></article>
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
      <StructuredOutcome
        title="帮助选择，也承接可验证的商业供给"
        values={[
          { label: "用户决策", text: "减少从混排内容中自行提炼标准、比较候选的负担，帮助缩小下一步选择" },
          { label: "商业供给", text: "让可验证的商品与广告事实进入总结与结构化推荐，参与复杂决策场景" },
          { label: "平台承接", text: "跑通AI Search原生商业承接的首版链路，并用事实边界和质量准出控制结果" },
        ]}
        evidenceTitle="首版离线人工评估"
        evidence={<><div className="portfolio-metrics two"><div><b>83%</b><span>Good Case</span></div><div><b>96%</b><span>结构有效率</span></div></div><p>用于解除首版开实验的质量阻塞，不归因到单张卡，也不等于线上决策效率或商业增量</p></>}
        roleTitle="AI卡生成能力与评估体系建设"
        roleItems={["定义搜索任务圈选与事实边界", "设计卡片信息组织与生成策略", "设计Planner/Writer协作与Judge Model准出", "用离线评估解除首版质量阻塞"]}
      />
      <DetailToggle open={detail} setOpen={setDetail} controls="portfolio-detail-search" title="展开这张AI卡的完整生成链路" route="理解需求 → 召回供给 → 组织表达 → 评测准出" />
      <section className="portfolio-case-detail" id="portfolio-detail-search" aria-labelledby="portfolio-detail-search-title" tabIndex={-1} hidden={!detail}>
        <header><div><small>完整执行链路 / 02</small><h4 id="portfolio-detail-search-title">一张AI结果卡，如何从Query走到准出</h4></div><p>理解需求 → 召回供给 → 组织表达 → 评测准出</p></header>
        <section className="search-detail-pipeline" aria-label="gym headphones从原始Query到AI结果卡的完整处理链路">
          <header className="search-detail-pipeline-head"><strong>上一阶段产出，成为下一阶段输入</strong><span>候选与文案均来自可验证的商品和广告事实</span></header>
          <div className="search-detail-lanes">
            <section className="search-detail-lane search-detail-understanding" aria-labelledby="search-detail-understanding-title">
              <header><small>理解需求</small><h5 id="search-detail-understanding-title">Query清洗与意图理解</h5><p>判断是否需要AI卡，并得到可用于召回的意图表达</p></header>
              <div className="search-detail-lane-body">
                <article className="search-detail-node search-detail-query"><small>原始Query</small><b>gym headphones</b></article>
                <div className="search-detail-down-arrow" aria-hidden="true"><i /></div>
                <article className="search-detail-node search-detail-intent"><small>任务圈选 · Query清洗 · 意图理解</small><b>运动场景下的耳机选择需求</b><em>产出｜标准化意图</em></article>
              </div>
            </section>

            <section className="search-detail-lane search-detail-recall" aria-labelledby="search-detail-recall-title">
              <header><small>召回供给</small><h5 id="search-detail-recall-title">相关性召回</h5><p>按意图找到能承接需求的商品与事实</p></header>
              <div className="search-detail-lane-body">
                <article className="search-detail-node search-detail-recall-model"><small>召回候选</small><b>商品池 + 可验证事实</b><div className="search-detail-candidate-list"><span><b>Jabra Elite Active 75t</b><small>长续航 · 良好音质</small></span><span><b>M39 Wireless earbuds</b><small>防水 · 降噪</small></span><span><b>Biaze Bass 15 Clip</b><small>开放式佩戴 · ENC音频</small></span></div><em>产出｜候选商品池</em></article>
              </div>
            </section>

            <section className="search-detail-lane search-detail-compose" aria-labelledby="search-detail-compose-title">
              <header><small>组织表达</small><h5 id="search-detail-compose-title">Planner规划 · Writer生成</h5><p>把选品与结构规划、具体文案生成拆开</p></header>
              <div className="search-detail-lane-body">
                <article className="search-detail-node search-detail-planner"><small>Planner</small><b>选品与结构规划</b><blockquote>决定用什么、怎么组织</blockquote><p>确定进卡商品、选择维度、顺序与卡片结构</p></article>
                <div className="search-detail-down-arrow" aria-hidden="true"><i /></div>
                <article className="search-detail-node search-detail-writer"><small>Writer</small><b>卡片文字生成</b><blockquote>负责具体怎么写</blockquote><div className="search-writer-outputs"><span>卡片总结</span><span>逐商品解释</span></div></article>
              </div>
            </section>

            <section className="search-detail-lane search-detail-gate" aria-labelledby="search-detail-gate-title">
              <header><small>评测准出</small><h5 id="search-detail-gate-title">Judge Model</h5><p>对整张结果卡草稿做最终判断</p></header>
              <div className="search-detail-lane-body">
                <article className="search-detail-node search-detail-judge"><small>评测维度</small><b>事实、相关性、结构与风险</b><div className="search-judge-criteria"><span>事实准确</span><span>搜索相关</span><span>结构完整</span><span>风险边界</span></div></article>
                <div className="search-detail-down-arrow" aria-hidden="true"><i /></div>
                <div className="search-detail-gate-output"><article className="search-detail-pass"><small>通过 · 进入展示候选</small><b>总结 + 结构化推荐结果卡</b></article><article className="search-detail-block"><small>失败</small><b>阻断，不进入展示候选</b></article></div>
              </div>
            </section>
          </div>
        </section>
        <DetailClose controls="portfolio-detail-search" setOpen={setDetail} />
      </section>
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
      titleNote={<blockquote className="portfolio-case-title-note">用可执行的质量规则<strong>决定上线、返工与阻断</strong>，让线上问题回到下一轮修改。</blockquote>}
    >
      <section className="portfolio-method-section portfolio-quality-method" aria-labelledby="portfolio-quality-how-title">
        <header className="portfolio-method-section-head portfolio-quality-cycle-head">
          <div><small>怎么做</small><h4 id="portfolio-quality-how-title">准入、巡检与归因，形成持续治理闭环</h4></div>
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
      <StructuredOutcome
        title="让质量结论推动上线与下一轮迭代"
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
      <DetailToggle open={detail} setOpen={setDetail} controls="portfolio-detail-evaluation" title="展开这个治理案例的完整闭环" route="标准定义 → 事前准入 → 线上巡检 → 归因修改 → 重新送评" />
      <section className="portfolio-case-detail" id="portfolio-detail-evaluation" aria-labelledby="portfolio-detail-evaluation-title" tabIndex={-1} hidden={!detail}>
        <header><div><small>完整执行链路 / 03</small><h4 id="portfolio-detail-evaluation-title">从一条问题样本，到下一轮可验证的修改</h4></div><p>完整闭环回答由谁判断、按什么判断、结论怎样改变上线和下一轮</p></header>
        <section className="quality-governance" aria-label="AI Search质量治理四阶段主链">
          <div className="quality-governance-head"><strong>一条能决定上线，也能牵引下一轮修改的质量闭环</strong><span>标准定义 → 事前准入 → 线上巡检 → 归因反哺</span></div>
          <div className="quality-governance-grid">
            <article className="quality-governance-card"><small>01 / 先把规则写清</small><h5>把“好卡片”写成可执行规则</h5><div className="quality-governance-body"><b>判断什么</b><p>把事实、相关性、结构与风险红线写成统一规则，形成跨策略人审可以共同执行的判断口径</p></div><div className="quality-governance-output"><b>阶段产物</b><span>评测规则表 · 严重度口径 · 标注执行说明</span></div></article>
            <article className="quality-governance-card"><small>02 / 上线前做决定</small><h5>在实验和推全前做分层判断</h5><div className="quality-governance-body"><b>怎样执行</b><p>按统一口径与风险红线做分层准入，需要结合上下文的复杂判断由人工复核</p></div><div className="quality-governance-output"><b>阶段产物</b><span>通过 / 返工 / 阻断 · 决定实验或全量上线</span></div></article>
            <article className="quality-governance-card"><small>03 / 上线后继续抽检</small><h5>持续监控已上线结果</h5><div className="quality-governance-body"><b>怎样执行</b><p>上线后持续抽检已推全策略，继续沉淀问题样本、风险与处理优先级</p></div><div className="quality-governance-output"><b>阶段产物</b><span>线上问题样本 · 风险优先级</span></div></article>
            <article className="quality-governance-card"><small>04 / 定位并重新送评</small><h5>把问题变成可验证的修改</h5><div className="quality-governance-body"><b>怎样回流</b><p>将问题定位到规则、模型或策略，完成修改后重新进入准入环节</p></div><div className="quality-governance-output"><b>阶段产物</b><span>规则 / 模型 / 策略变更项</span></div></article>
          </div>
          <div className="quality-governance-return"><span>问题变成修改项后，返回下一轮标准与准入</span></div>
        </section>
        <div className="portfolio-quality-evolution">
          <article><small>标准怎样持续更新</small><h5>争议样本与线上Bad Case共同推动口径迭代</h5><div className="portfolio-quality-track"><span>争议样本 / 线上Bad Case</span><i aria-hidden="true">→</i><span>确认新的判断边界</span><i aria-hidden="true">→</i><span>写回规则与执行说明</span><i aria-hidden="true">→</i><span>下一轮继续使用</span></div></article>
          <article><small>自动评审能力</small><h5>稳定规则进入自动送评、巡检与风险处置</h5><p>人审负责需要结合上下文的复杂判断，机审承担规模监控，结果继续反哺生成策略</p></article>
        </div>
        <DetailClose controls="portfolio-detail-evaluation" setOpen={setDetail} />
      </section>
    </CaseFrame>
  );
}

function MementoCase() {
  const [detail, setDetail] = useState(false);

  return (
    <CaseFrame
      id="memento"
      number="04"
      eyebrow="PERSONAL COGNITIVE SECRETARY"
      title="Memento：让每个 AI，都从同一个你开始"
      titleNote={<blockquote className="portfolio-case-title-note">电脑里的自动笔记与认知秘书：<strong>接住散落的意图，整理长期理解，再带回工作。</strong></blockquote>}
    >
      <section className="portfolio-method-section portfolio-memento-method" aria-labelledby="portfolio-memento-how-title">
        <header className="portfolio-method-section-head">
          <div><small>产品终态</small><h4 id="portfolio-memento-how-title">让散落的意图，最终形成可以带回工作的个人记忆</h4></div>
          <p>一次记录保留一个当下，跨时间的整理让这些当下逐渐认出同一个人</p>
        </header>

        <div className="memento-ideal-overview">
          <section className="memento-value-sequence" aria-labelledby="memento-value-title">
            <header><small>三项核心价值</small><h5 id="memento-value-title">从此刻的意图，到下一次工作的连续理解</h5></header>
            <ol>
              <li><span>01</span><div><b>接住正在发生的意图</b><p>在对话、网页、文档和语音中，保留原文、时间、来源和当时语境</p></div></li>
              <li><span>02</span><div><b>长期理解你的形状</b><p>让分散记录跨越时间，形成主题、形成依据和对你的当前理解</p></div></li>
              <li className="is-outcome"><span>03</span><div><b>让每个 AI，都从同一个你开始</b><small>可调用的个人记忆</small><p>根据当前任务带回相关理解，让写作、研究、编程和每一次 AI 协作都能从已经形成的你继续</p></div></li>
            </ol>
          </section>

          <figure className="memento-product-evidence">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/memento-public-home-20260906.png" alt="Memento 在线体验版认知主页实拍，使用合成示例展示今天的时间河、认知地景和她理解的我" />
            <figcaption>
              <div><b>今天的时间河</b><span>看见意图如何进入同一条记录流</span></div>
              <div><b>认知地景</b><span>看见记录如何跨时间形成长期主题</span></div>
              <div><b>她理解的我</b><span>看见多个主题如何收束成当前理解</span></div>
            </figcaption>
            <div className="memento-product-actions" aria-label="Memento 产品入口">
              <a className="memento-product-detail-link" href="https://luke20001024.github.io/Memento/" target="_blank" rel="noreferrer" data-cursor="hover"><span className="memento-action-copy"><small>PRODUCT HOME</small><b>查看 Memento 产品主页</b></span><span className="memento-action-arrow" aria-hidden="true">↗</span></a>
              <a className="memento-product-demo-link" href="https://luke20001024.github.io/Memento/demo/dashboard.html" target="_blank" rel="noreferrer" data-cursor="hover"><span className="memento-action-copy"><small>LIVE DEMO · 最新版本</small><b>直接体验 Memento Demo</b></span><span className="memento-action-arrow" aria-hidden="true">↗</span></a>
            </div>
          </figure>
        </div>
      </section>

      <DetailToggle open={detail} setOpen={setDetail} controls="portfolio-detail-memento" title="展开 Memento 的完整产品链路" route="接住并保存 → 整理记忆 → 形成理解 → 调用与回流" />
      <section className="portfolio-case-detail" id="portfolio-detail-memento" aria-labelledby="portfolio-detail-memento-title" tabIndex={-1} hidden={!detail}>
        <header><div><small>完整产品链路</small><h4 id="portfolio-detail-memento-title">一条意图，如何沿时间形成理解，再回到下一次工作</h4></div><p>完整关系图保留产品全貌，单轴讲清四段 Agent 实现逻辑</p></header>

        <section className="memento-ideal-loop" aria-labelledby="memento-ideal-loop-title">
          <header><small>一份记忆的完整去向</small><h4 id="memento-ideal-loop-title">记录在时间中形成理解，理解在下一次工作中继续生长</h4></header>
          <ol>
            <li><span>01</span><b>接住意图</b></li>
            <li><span>02</span><b>保存事实</b></li>
            <li><span>03</span><b>整理记忆</b></li>
            <li><span>04</span><b>形成理解</b></li>
            <li><span>05</span><b>带回工作</b></li>
            <li><span>06</span><b>交流继续回流</b></li>
          </ol>
          <p>让每个 AI 都从同一个你开始，也让每一次交流继续参与你的形成</p>
        </section>

        <figure className="memento-continuity-figure">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/memento-value-triptych-master-v1.png" alt="散落记录沿时间形成个人理解，再进入写作、研究和编程等工作场景" />
          <figcaption><small>完整关系</small><b>不同窗口里的局部意图，沿时间形成一个人，再以相关个人记忆回到真实工作</b><span>接住 → 理解 → 使用 → 回流</span></figcaption>
        </figure>

        <section className="memento-product-axis" aria-labelledby="memento-product-axis-title">
          <header>
            <div><small>四段 Agent · 一条主链</small><h5 id="memento-product-axis-title">从一个当下，到可以继续工作的个人记忆</h5></div>
            <p>每一段直接展示 Agent 看见什么、如何判断、怎样行动，以及最终留下什么</p>
          </header>
          <ol>
            <li>
              <span>01</span>
              <b>接住并保存当下</b>
              <p>在聊天、网页、文档、截图和语音现场，先保存原文、时间、来源与资产。</p>
              <div className="memento-agent-logic">
                <small>实现逻辑 · 记录入口 Agent</small>
                <div><em>看见</em><b>内容 + 来源 + 当前场景</b><p>同时读取原文、页面或对话来源，以及用户正在做什么。</p></div>
                <i aria-hidden="true">↓</i>
                <div><em>判断</em><b>这次记录应该去哪里</b><p>识别它是待理解的想法、可索引资源、稍后再读，还是只需归档。</p></div>
                <i aria-hidden="true">↓</i>
                <div><em>行动</em><b>先保存现场，再执行分流</b><p>任何理解都发生在原文落盘之后，避免 AI 改写覆盖真实来源。</p></div>
              </div>
              <div className="memento-axis-objects"><small>系统留痕</small><span>原始记录</span><span>分流决定</span><span>资源卡</span></div>
              <footer><small>阶段产物</small><b>可追溯的本地事实</b></footer>
            </li>
            <li>
              <span>02</span>
              <b>整理成可追溯记忆</b>
              <p>把一次表达整理成可读、可检索的记忆，同时保留它来自哪里、适用于什么范围。</p>
              <div className="memento-agent-logic">
                <small>实现逻辑 · 记忆整理 Agent</small>
                <div><em>看见</em><b>原文 + 精确出处 + 相邻记录</b><p>逐句对应来源位置，同时读取同一时段内可能相关的记录。</p></div>
                <i aria-hidden="true">↓</i>
                <div><em>判断</em><b>哪些事实能合并，哪些边界要保留</b><p>识别人物、事件、判断和未确认信息，判断重复、支持、反例与适用范围。</p></div>
                <i aria-hidden="true">↓</i>
                <div><em>行动</em><b>拆分、去重并建立关系</b><p>形成可读记忆；每条结论都能回到对应原文，而不会脱离语境。</p></div>
              </div>
              <div className="memento-axis-objects"><small>系统留痕</small><span>逐条解释</span><span>记忆原子</span><span>关系版本</span></div>
              <footer><small>阶段产物</small><b>带来源与边界的个人记忆</b></footer>
            </li>
            <li>
              <span>03</span>
              <b>跨时间形成理解</b>
              <p>让反复出现的记忆形成长期主题，再由多个主题收束为少量当前理解。</p>
              <div className="memento-agent-logic">
                <small>实现逻辑 · 主题与理解 Agent</small>
                <div><em>看见</em><b>跨时间记忆 + 已有主题</b><p>同时观察重复出现的选择、关系变化、矛盾证据和新的行为结果。</p></div>
                <i aria-hidden="true">↓</i>
                <div><em>判断</em><b>新建、强化、修订，还是保留张力</b><p>只有证据变化达到门槛才更新理解；冲突信息会并列保留，不被强行抹平。</p></div>
                <i aria-hidden="true">↓</i>
                <div><em>行动</em><b>形成主题，再收束当前理解</b><p>保存依据、反例、适用范围与变化原因，让长期理解可以继续生长。</p></div>
              </div>
              <div className="memento-axis-objects"><small>系统留痕</small><span>主题版本</span><span>当前理解</span><span>形成依据</span></div>
              <footer><small>阶段产物</small><b>可回到证据的长期理解</b></footer>
            </li>
            <li>
              <span>04</span>
              <b>按任务调用并回流</b>
              <p>围绕写作、研究或编程任务，只带回当前真正相关的个人理解、记忆与原文依据。</p>
              <div className="memento-agent-logic">
                <small>实现逻辑 · 任务上下文 Agent</small>
                <div><em>看见</em><b>当前任务 + 可调用范围</b><p>读取任务目标、主题、时间范围与敏感边界，先确定这次允许使用什么。</p></div>
                <i aria-hidden="true">↓</i>
                <div><em>判断</em><b>哪些记忆与这次任务真正相关</b><p>按相关性和必要性筛选最小充分集合，避免把整份个人记忆交给外部 AI。</p></div>
                <i aria-hidden="true">↓</i>
                <div><em>行动</em><b>交付上下文，并把结果带回</b><p>记录本次读取；工作中的新决定、修正与结果重新进入记录入口。</p></div>
              </div>
              <div className="memento-axis-objects"><small>系统留痕</small><span>任务记忆包</span><span>读取记录</span><span>回流痕迹</span></div>
              <footer><small>阶段产物</small><b>最小充分任务记忆与下一轮证据</b></footer>
            </li>
          </ol>
          <footer>
            <div><small>产品终态</small><b>让每个 AI 都从同一个你开始</b></div>
            <div><small>我的工作</small><b>完整定义认知链、产品关系与任务调用体验</b></div>
          </footer>
        </section>
        <DetailClose controls="portfolio-detail-memento" setOpen={setDetail} />
      </section>
    </CaseFrame>
  );
}

export default function ProjectCaseShell({ projects, children }: ProjectCaseShellProps) {
  return (
    <div className="project-case-shell">
      <div className="project-overview-canvas" data-theme="dark">
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
      </div>
      <div className="project-cases" data-theme="light" aria-label="四项完整项目案例">
        <CaseReadingIndex />
        <AigcCase />
        <SearchCase />
        <QualityCase />
        <MementoCase />
      </div>
    </div>
  );
}
