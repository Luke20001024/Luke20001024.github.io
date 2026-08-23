import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

async function render(pathname = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${pathname}`, {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the complete first-delivery narrative", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  const headingTexts = [...html.matchAll(/<h[1-6]\b[^>]*>([\s\S]*?)<\/h[1-6]>/gi)]
    .map(([, inner]) => inner
      .replaceAll("<!-- -->", "")
      .replace(/<[^>]+>/g, "")
      .replace(/&nbsp;/g, " ")
      .trim());

  assert.ok(headingTexts.length >= 10);
  for (const heading of headingTexts) {
    assert.doesNotMatch(heading, /[。.]$/u, `标题末尾不应有句号：${heading}`);
  }

  assert.match(html, /<title>Luke Shi 史翼洋｜AI 产品经理<\/title>/i);
  assert.match(html, /史翼洋/);
  assert.match(html, /<a class="site-identity"[^>]*>[\s\S]*?class="identity-mark"[^>]*>LS<\/span>[\s\S]*?<strong>Luke Shi<\/strong>[\s\S]*?<\/a>/);

  const heroStart = html.indexOf('<div class="hero-inner page-shell">');
  const heroEnd = html.indexOf('<section class="hero-career"', heroStart);
  assert.ok(heroStart >= 0 && heroEnd > heroStart);
  const heroVisualHtml = html.slice(heroStart, heroEnd);

  assert.match(heroVisualHtml, /TIMEZONE[\s\S]*?GMT\+8/);
  assert.match(heroVisualHtml, /SELECTED WORK[\s\S]*?四项 AI 产品实践/);
  assert.doesNotMatch(heroVisualHtml, /EVIDENCE|10\+ 项策略上线 · 8 万\+ 样本评测/);
  assert.match(heroVisualHtml, /<h1[^>]*>[\s\S]*?让 <em>AI<\/em> 持续创造[\s\S]*?真实的用户价值[\s\S]*?<\/h1>/);
  assert.match(heroVisualHtml, /class="hero-identity[^"]*"[^>]*>[\s\S]*?史翼洋 \/ Luke Shi[\s\S]*?浙江大学硕士 · 2027 届 · AI 产品经理[\s\S]*?AI 应用 · 质量治理 · 规模化落地 · 关注 AI Native/);
  assert.doesNotMatch(heroVisualHtml, /hero-meta|hero-lede|hero-goal|portrait-seal|目标方向/);
  assert.match(html, /教育与实习/);
  assert.match(html, /浙江大学/);
  assert.match(html, /城市规划学 · 硕士/);
  assert.doesNotMatch(html, /浙江工业大学|城乡规划学 · 本科/);
  assert.match(html, /dateTime="2024-10">2024\.10<\/time>—<time dateTime="2025-02">2025\.02/);
  assert.match(html, /dateTime="2025-02">2025\.02<\/time>—<time dateTime="2025-06">2025\.06/);
  assert.match(html, /dateTime="2025-07">2025\.07<\/time>—<time dateTime="2026-07">2026\.07/);
  assert.match(html, /class="career-summary"[^>]*>[\s\S]*?实习累计[\s\S]*?<strong>约 20 个月<\/strong>[\s\S]*?2024\.10—2026\.07/);
  assert.match(html, /约 4 个月/);
  assert.match(html, /约 12 个月/);
  assert.match(html, /data-internship-stage="didi-growth">[\s\S]*?class="career-duration">约 4 个月<\/strong><span class="career-dates">/);
  assert.match(html, /data-internship-stage="didi-strategy">[\s\S]*?class="career-duration">约 4 个月<\/strong><span class="career-dates">/);
  assert.match(html, /data-internship-stage="bytedance-ai">[\s\S]*?class="career-duration">约 12 个月<\/strong><span class="career-dates">/);
  const byteDanceIndex = html.indexOf('data-internship-stage="bytedance-ai"');
  const didiStrategyIndex = html.indexOf('data-internship-stage="didi-strategy"');
  const didiGrowthIndex = html.indexOf('data-internship-stage="didi-growth"');
  assert.ok(byteDanceIndex < didiStrategyIndex && didiStrategyIndex < didiGrowthIndex);
  assert.match(html, /<h3 class="career-role">B 端增长产品<\/h3><strong class="career-company">滴滴出行 · 代驾事业部<\/strong><p>司机生态<\/p>/);
  assert.match(html, /<h3 class="career-role">C 端策略产品<\/h3><strong class="career-company">滴滴出行 · 代驾事业部<\/strong><p>费用体验治理<\/p>/);
  assert.match(html, /<h3 class="career-role">AI 产品经理<\/h3><strong class="career-company">字节跳动 · TikTok GMPT Ads Core<\/strong><p>搜索 × 多模态生成 × 广告<\/p>/);
  assert.match(html, /四项 AI 产品实践/);
  assert.match(html, /四项核心项目/);
  assert.match(html, /AI 应用/);
  assert.match(html, /规模化落地/);
  assert.match(html, /AI Native/);
  assert.match(html, /理解所需的 Context/);
  assert.match(html, /长期 Context/);
  assert.match(html, /当前 Context/);
  assert.match(html, /任务判断/);
  assert.match(html, /产品动作/);
  assert.match(html, /质量控制/);
  assert.match(html, /用户校准/);
  assert.match(html, /长期记忆/);
  assert.match(html, /结果与反馈进入下一次 Context/);
  assert.match(html, /AIGC个性化生成/);
  assert.match(html, /aria-label="位于Top 4的通用商品广告"/);
  assert.match(html, /aria-label="位于Top 1的个性化场景广告"/);
  assert.match(html, /把能够满足需求、却没有表达清楚的广告，转化为可被识别、优选和投放的高相关图文供给/);
  assert.doesNotMatch(html, /案例关系复现|这项策略最终带来了什么/);
  assert.match(html, /AI Search/);
  assert.match(html, /质量评测与规模化/);
  assert.match(html, /Memento/);
  assert.match(html, /id="about"/);
  assert.match(html, /id="system"/);
  assert.match(html, /id="work"/);
  assert.match(html, /id="contact"/);
  assert.match(html, /id="project-aigc"/);
  assert.match(html, /id="project-search"/);
  assert.match(html, /id="project-evaluation"/);
  assert.match(html, /id="project-memento"/);
  assert.equal((html.match(/class="[^"]*\bnarrative-module\b[^"]*"/g) ?? []).length, 2);
  assert.ok(html.indexOf('id="work"') < html.indexOf('id="project-aigc"'));
  assert.ok(html.indexOf('id="about"') < html.indexOf('id="system"'));
  assert.ok(html.indexOf('class="hero-career"') < html.indexOf('id="system"'));
  assert.ok(html.indexOf('class="hero-inner page-shell"') < html.indexOf('class="hero-career"'));
  assert.ok(html.indexOf('id="system"') < html.indexOf('id="work"'));
  assert.ok(html.indexOf('id="work"') < html.indexOf('id="contact"'));
  for (const agentModule of ["context", "intent", "action", "evaluation", "trust", "memory"]) {
    assert.equal((html.match(new RegExp(`data-agent-module="${agentModule}"`, "g")) ?? []).length, 1);
  }
  assert.doesNotMatch(html, /data-agent-module="input"/);
  assert.doesNotMatch(html, /输入线索/);
  for (const step of ["long-term", "now"]) {
    assert.match(html, new RegExp(`data-agent-substep="${step}"`));
  }
  for (const copy of [
    "历史 · 偏好 · 已确认线索",
    "表达 · 状态 · 环境 · 约束",
    "要完成什么 · 受到哪些约束",
    "规划 · 边界 · 工具 / 服务 · 交付",
    "标准 · 准入 · 反馈",
    "确认 · 纠偏 · 拒绝",
    "来源 · 结果 · 修正",
  ]) {
    assert.match(html, new RegExp(copy.replace("/", "\\/")));
  }
  assert.match(html, /data-feedback-from="memory"[^>]*data-feedback-to="context"/);
  assert.match(html, /我做 AI 产品时反复检查的六个问题/);
  assert.match(html, /class="project-zone"[^>]*data-theme="light"/);
  assert.match(html, /<section class="project-zone"[^>]*><div class="project-evidence-band">/);
  assert.match(html, /<figcaption class="agent-map-caption" id="agent-map-caption"><span>我做 AI 产品时反复检查的六个问题<\/span><\/figcaption>/);
  for (const resultLabel of ["实验结果", "离线人工评估", "评测规模 / 产能", "最终价值"]) {
    assert.match(html, new RegExp(`<span>${resultLabel}<\\/span>`));
  }
  assert.doesNotMatch(html, /项目先呈现结果与关键链路|项目先行 · 思路随后|先看项目结果与链路|长期 Context 与当前 Context 共同形成理解|悬停项目，对应环节亮起/);
  assert.doesNotMatch(html, /SELECTED PRACTICE|AGENT WORK MODEL|MY WORKING MODEL|FOUR PRACTICES/);

  const stageMarkers = [
    'data-agent-module="context"',
    'data-agent-module="intent"',
    'data-agent-module="action"',
    'data-agent-module="evaluation"',
    'data-agent-module="trust"',
    'data-agent-module="memory"',
  ];
  const normalizedHtml = html.replaceAll("<!-- -->", "");
  const heroHtml = normalizedHtml.slice(normalizedHtml.indexOf('id="about"'), normalizedHtml.indexOf('id="system"'));
  assert.doesNotMatch(heroHtml, /从意图理解|可信行动|长期 Context/);
  assert.doesNotMatch(heroHtml, /Memento|独立构建/);
  for (let index = 1; index < stageMarkers.length; index += 1) {
    assert.ok(normalizedHtml.indexOf(stageMarkers[index - 1]) < normalizedHtml.indexOf(stageMarkers[index]));
  }
  assert.ok(normalizedHtml.indexOf('id="project-memento"') < normalizedHtml.indexOf(stageMarkers[0]));
  assert.ok(normalizedHtml.indexOf('class="project-evidence-band"') < normalizedHtml.indexOf('class="agent-linear-axis"'));
  for (const [module, projectIds] of [
    ["context", "aigc search memento"],
    ["intent", "search aigc"],
    ["action", "search aigc"],
    ["evaluation", "search aigc evaluation"],
    ["trust", "memento"],
    ["memory", "memento"],
  ]) {
    assert.match(html, new RegExp(`data-agent-module="${module}"[^>]*data-projects="${projectIds}"`));
  }
  for (const [id, number] of [["aigc", "01"], ["search", "02"], ["evaluation", "03"], ["memento", "04"]]) {
    assert.match(html, new RegExp(`data-project-evidence="${id}"`));
    assert.match(html, new RegExp(`data-project-preview="${id}"`));
    assert.match(html, new RegExp(`>${number}(?:<!-- -->)?<`));
    assert.equal((html.match(new RegExp(`id="project-${id}"`, "g")) ?? []).length, 1);
  }
  assert.doesNotMatch(html, /<dl class="project-evidence-meta">/);
  assert.doesNotMatch(html, /class="project-evidence-coverage"|<footer><span class="project-evidence-coverage"/);
  assert.doesNotMatch(html, /data-project-anchor=/);
  assert.match(html, /data-project-evidence="search"[^>]*data-direct-modules="context intent action evaluation"[^>]*data-support-modules=""/);
  assert.match(html, /data-project-evidence="aigc"[^>]*data-direct-modules="context intent action evaluation"[^>]*data-support-modules=""/);
  assert.match(html, /data-project-evidence="evaluation"[^>]*data-direct-modules="evaluation"[^>]*data-support-modules="context action"/);
  assert.match(html, /data-project-evidence="memento"[^>]*data-direct-modules="context memory"[^>]*data-support-modules="trust"/);
  assert.doesNotMatch(html, /data-direct-modules="[^"]*input/);
  assert.doesNotMatch(html, /data-project-evidence="search"[^>]*data-direct-modules="[^"]*memory/);
  assert.doesNotMatch(html, /data-project-evidence="aigc"[^>]*data-direct-modules="[^"]*(?:trust|memory)/);
  assert.doesNotMatch(html, /data-project-evidence="evaluation"[^>]*data-direct-modules="[^"]*memory/);
  assert.doesNotMatch(html, /data-project-evidence="memento"[^>]*data-direct-modules="[^"]*(?:intent|evaluation|trust)/);
  for (const fact of [
    "离线人工评估",
    "Good Case 83%",
    "结构有效率96%",
    "Advv +23.16%",
    "累计评测 8 万+",
    "日产能 200 → 10,000",
    "片段 → 可调用的个人记忆",
    "让每个 AI，都从同一个你开始",
  ]) {
    assert.match(html, new RegExp(fact.replaceAll("+", "\\+")));
  }
  assert.doesNotMatch(html, /href="\/documents\//);
  assert.doesNotMatch(html, /class="project-material-link"|项目材料 PDF/);
  assert.equal((html.match(/class="project-case-open"/g) ?? []).length, 4);
  assert.equal((html.match(/<span>查看案例<\/span><i aria-hidden="true">↘<\/i>/g) ?? []).length, 4);
  assert.equal((html.match(/href="#portfolio-case-(?:aigc|search|evaluation|memento)"/g) ?? []).length, 4);
  assert.equal((html.match(/aria-label="查看(?:AIGC个性化生成|AI Search|质量评测与规模化|Memento)项目案例"/g) ?? []).length, 4);
  assert.equal((html.match(/class="portfolio-case-study portfolio-case-(?:aigc|search|evaluation|memento)"/g) ?? []).length, 4);
  for (const id of ["aigc", "search", "evaluation", "memento"]) {
    assert.match(html, new RegExp(`id="portfolio-case-${id}"`));
    assert.match(html, new RegExp(`id="portfolio-detail-${id}"`));
    assert.match(html, new RegExp(`aria-labelledby="portfolio-detail-${id}-title"`));
    assert.match(html, new RegExp(`id="portfolio-detail-${id}-title"`));
  }
  assert.equal((html.match(/class="portfolio-detail-close"/g) ?? []).length, 4);
  for (const restoredDetail of [
    "相关性分流",
    "失败 → 废弃或阻断",
    "图片质检与Title支路分开",
    "Jabra Elite Active 75t",
    "决定用什么、怎么组织",
    "负责具体怎么写",
    "不进入展示候选",
    "问题变成修改项后",
    "争议样本与线上Bad Case",
    "支撑10+项策略",
    "接住正在发生的意图",
    "长期理解你的形状",
    "可调用的个人记忆",
    "一条意图，如何沿时间形成理解，再回到下一次工作",
    "从一个当下，到可以继续工作的个人记忆",
    "可追溯的本地事实",
    "带来源与边界的个人记忆",
    "可回到证据的长期理解",
    "最小充分任务记忆与下一轮证据",
  ]) {
    assert.match(html, new RegExp(restoredDetail.replaceAll("+", "\\+")));
  }
  assert.equal((html.match(/href="\.\/memento\/Memento-4\.0\.html"/g) ?? []).length, 1);
  assert.equal((html.match(/href="\.\/memento\/Memento-Cognitive-Home-Standalone\.html"/g) ?? []).length, 1);
  assert.doesNotMatch(html, /\/demos\/memento-cognitive-home\.html|固定 20 天演示数据/);
  assert.doesNotMatch(html, /CandidateMemory|CONTEXT_AGENT|no_candidate|当前交付|仍待真实验收/);
  assert.match(html, /P00 5%/);
  assert.match(html, /30\+/);
  const mementoStart = html.indexOf('id="project-memento"');
  const mementoEnd = html.indexOf("</article>", mementoStart);
  assert.ok(mementoStart > -1 && mementoEnd > mementoStart);
  assert.doesNotMatch(html.slice(mementoStart, mementoEnd), /独立项目 · 持续构建|产品定义、系统设计与 AI 辅助实现/);
  assert.match(html.slice(mementoStart, mementoEnd), /href="#portfolio-case-memento"/);
  assert.doesNotMatch(html, /href="\/documents\/resume\.pdf"/);
  assert.match(html, /href="mailto:Shiyiyang_Luke@163\.com"/);
  assert.match(html, /href="tel:\+8618329134996"/);
  assert.match(html, /href="weixin:\/\/dl\/chat\?Luke001024"/);
  assert.match(html, />18329134996</);
  assert.match(html, />Luke001024</);
  assert.match(html, /data-particle-surface="hero"/);
  assert.equal((html.match(/<canvas\b/g) ?? []).length, 1);
  assert.equal((html.match(/data-particle-canvas/g) ?? []).length, 1);
  assert.match(html, /yiyang-particle-portrait-cobalt-engraving-v1-transparent\.webp/);
  assert.doesNotMatch(html, /yiyang-editorial-portrait-v2\.webp/);
  assert.doesNotMatch(html, /data-particle-surface="lab"|data-particle-lab-controls|隔离调试|立体粒子参数|CLICK → PARTICLES/);
  assert.doesNotMatch(html, /portrait-seal/);
  assert.doesNotMatch(heroVisualHtml, /不是|而是|不只是|不止是/);
  assert.doesNotMatch(html, /CHAPTER 03 · CAPABILITIES|EVIDENCE · NOT TESTIMONIALS|评价墙/);
  assert.doesNotMatch(html, /↳ 01 · Context|↳ 06 · Memory/);
  assert.doesNotMatch(html, /codex-preview/);
  assert.doesNotMatch(html, /Your site is taking shape/);
});

test("keeps the reference-led composition and interaction wired in", async () => {
  const [page, projectCases, caseStyles, motion, particlePortrait, layout, styles, packageJson] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/project-cases.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/project-cases.css", import.meta.url), "utf8"),
    readFile(new URL("../app/portfolio-motion.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/particle-portrait.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
    access(new URL("../public/assets/yiyang-particle-portrait-cobalt-engraving-v1-transparent.webp", import.meta.url)),
    access(new URL("../public/assets/search-generic-ad.webp", import.meta.url)),
    access(new URL("../public/assets/search-personalized-ad.webp", import.meta.url)),
    access(new URL("../public/assets/ai-search-standard.webp", import.meta.url)),
    access(new URL("../public/assets/ai-search-agentic.webp", import.meta.url)),
    access(new URL("../public/assets/memento-cognitive-home.webp", import.meta.url)),
    access(new URL("../public/assets/memento-cognitive-home-user-shot-20260823.png", import.meta.url)),
    access(new URL("../public/assets/memento-value-triptych-master-v1.png", import.meta.url)),
  ]);
  const projectSource = `${page}\n${projectCases}`;

  assert.match(page, /className="portfolio-whiteframe"/);
  assert.match(page, /className="work-model-shell"/);
  assert.match(page, /className="hero-career"/);
  assert.match(page, /className="hero-facts reveal-stagger"/);
  assert.match(page, /className="hero-identity reveal"/);
  assert.match(page, /className="identity-mark"[^>]*>LS<\/span>/);
  assert.doesNotMatch(page, /hero-meta|hero-lede|hero-goal|portrait-seal/);
  assert.match(page, /className="career-education"/);
  assert.match(page, /className="career-internship-list"/);
  assert.match(page, /className="career-summary"/);
  assert.doesNotMatch(page, /career-internship-head|career-internships/);
  assert.equal((page.match(/data-education-stage=/g) ?? []).length, 1);
  assert.equal((page.match(/data-internship-stage=/g) ?? []).length, 3);
  assert.match(projectCases, /className="project-zone"/);
  assert.match(page, /className="agent-zone"/);
  assert.match(page, /className="agent-linear-model"/);
  assert.match(page, /className="agent-linear-axis"/);
  assert.match(projectCases, /className="project-evidence-band"/);
  assert.match(projectCases, /project-evidence-item/);
  assert.doesNotMatch(projectCases, /className="project-evidence-meta"/);
  assert.doesNotMatch(page, /process-head-note|project-evidence-head/);
  assert.match(page, /data-agent-module="context"/);
  assert.match(page, /data-feedback-from="memory"/);
  assert.doesNotMatch(page, /data-agent-module="input"/);
  assert.doesNotMatch(page, /agent-input|agent-context-core|agent-action-steps|agent-guardrails|agent-memory-link|agent-feedback-loop/);
  assert.doesNotMatch(page, /ProjectPins|data-project-anchor/);
  assert.doesNotMatch(page, /axis-project-card|axis-project-grid|product-axis-map/);
  assert.match(page, /className="contact-links reveal-stagger"/);
  assert.match(page, /import ParticlePortrait from "\.\/particle-portrait"/);
  assert.equal((page.match(/<ParticlePortrait\b/g) ?? []).length, 1);
  assert.match(page, /<ParticlePortrait \/>/);
  assert.doesNotMatch(page, /yiyang-editorial-portrait-v2\.webp|particle-lab-workbench/);
  assert.doesNotMatch(page, /futureProblems|evidence-grid|resume-fold|id="direction"|project-list|project-row|work-table-head/);
  assert.doesNotMatch(page, /resume\.pdf|简历 PDF|>RESUME</);
  assert.doesNotMatch(page, /不是|而是|不只是|不止是/);
  for (const asset of [
    "search-personalized-ad.webp",
    "ai-search-agentic.webp",
    "memento-cognitive-home.webp",
    "memento-cognitive-home-user-shot-20260823.png",
    "memento-value-triptych-master-v1.png",
  ]) {
    assert.match(projectSource, new RegExp(asset.replace(".", "\\.")));
  }
  assert.match(page, /id: "aigc"[\s\S]*?preview: "\/assets\/search-personalized-ad\.webp"/);
  assert.match(page, /id: "search"[\s\S]*?preview: "\/assets\/ai-search-agentic\.webp"/);
  assert.match(page, /id: "evaluation"[\s\S]*?preview: null/);
  assert.match(page, /id: "memento"[\s\S]*?preview: "\/assets\/memento-cognitive-home\.webp"/);
  assert.match(page, /focus: "搜索意图 → 个性化表达"/);
  assert.match(page, /statement: "意图 → 服务判断 → 生成 → 准出 → 优选"/);
  assert.match(page, /focus: "复杂意图 → 决策框架"/);
  assert.match(page, /statement: "Query → 召回 → Planner\/Writer → Judge"/);
  assert.match(projectCases, /href=\{`#portfolio-case-\$\{project\.id\}`\}/);
  assert.doesNotMatch(projectCases, /openCase|setOpenCase|triggerRefs/);
  assert.doesNotMatch(projectCases, /hidden=\{openCase/);
  assert.match(projectCases, /<AigcCase \/>[\s\S]*<SearchCase \/>[\s\S]*<QualityCase \/>[\s\S]*<MementoCase \/>/);
  assert.match(projectCases, /function DetailClose/);
  assert.match(projectCases, /document\.querySelector<HTMLButtonElement>/);
  assert.equal((projectCases.match(/<DetailClose\b/g) ?? []).length, 4);
  assert.equal((projectCases.match(/aria-labelledby="portfolio-detail-(?:aigc|search|evaluation|memento)-title"/g) ?? []).length, 4);
  assert.doesNotMatch(projectCases, /window\.location|location\.hash/);
  assert.doesNotMatch(projectCases, /aria-live=/);
  assert.match(projectCases, /\.\/memento\/Memento-4\.0\.html/);
  assert.match(projectCases, /\.\/memento\/Memento-Cognitive-Home-Standalone\.html/);
  assert.doesNotMatch(projectCases, /\/demos\/memento-cognitive-home\.html/);
  assert.equal((projectCases.match(/<CaseFrame\b/g) ?? []).length, 4);
  assert.match(projectCases, /<CaseFrame\s+id="aigc"/);
  assert.match(projectCases, /<CaseFrame\s+id="search"/);
  assert.match(projectCases, /<CaseFrame\s+id="evaluation"/);
  assert.match(projectCases, /<CaseFrame\s+id="memento"/);
  assert.match(projectCases, /portfolio-search-chain-flow/);
  assert.match(projectCases, /理解需求[\s\S]*召回供给[\s\S]*组织表达[\s\S]*评测准出/);
  assert.equal((projectCases.match(/className="portfolio-search-chain-arrow"/g) ?? []).length, 3);
  assert.match(projectCases, /search-detail-pipeline[\s\S]*Query清洗[\s\S]*相关性召回[\s\S]*Planner[\s\S]*Writer[\s\S]*Judge Model/);
  assert.match(projectCases, /portfolio-quality-cycle-map/);
  assert.match(projectCases, /标准与风险边界[\s\S]*事前评测与判断[\s\S]*线上抽检与发现[\s\S]*归因修改与重评/);
  assert.equal((projectCases.match(/跨策略人审执行底座/g) ?? []).length, 1);
  assert.doesNotMatch(projectCases, /className="portfolio-quality-scale"/);
  assert.match(projectCases, /memento-ideal-overview/);
  assert.match(projectCases, /memento-cognitive-home-user-shot-20260823\.png/);
  assert.match(projectCases, /查看 Memento 产品主页[\s\S]*直接体验 Memento Demo/);
  assert.match(projectCases, /memento-continuity-figure/);
  assert.match(projectCases, /memento-product-axis/);
  assert.match(projectCases, /接住并保存当下[\s\S]*整理成可追溯记忆[\s\S]*跨时间形成理解[\s\S]*按任务调用并回流/);
  assert.match(projectCases, /记录入口 Agent[\s\S]*记忆整理 Agent[\s\S]*主题与理解 Agent[\s\S]*任务上下文 Agent/);
  assert.match(projectCases, /内容 \+ 来源 \+ 当前场景[\s\S]*原文 \+ 精确出处 \+ 相邻记录[\s\S]*跨时间记忆 \+ 已有主题[\s\S]*当前任务 \+ 可调用范围/);
  assert.equal((projectCases.match(/<em>看见<\/em>/g) ?? []).length, 4);
  assert.equal((projectCases.match(/<em>判断<\/em>/g) ?? []).length, 4);
  assert.equal((projectCases.match(/<em>行动<\/em>/g) ?? []).length, 4);
  assert.doesNotMatch(projectCases.slice(projectCases.indexOf("function MementoCase")), /技术方案/);
  const mementoCaseSource = projectCases.slice(projectCases.indexOf("function MementoCase"));
  assert.equal((mementoCaseSource.match(/<small>阶段产物<\/small>/g) ?? []).length, 4);
  assert.doesNotMatch(projectCases, /memento-detail-pipeline|memento-understanding-case|memento-task-return|memento-product-principles/);
  assert.doesNotMatch(projectCases.slice(projectCases.indexOf("function MementoCase")), /<StructuredOutcome/);
  assert.doesNotMatch(projectCases, /memento-live-frame|memento-object-revision|memento-delivery-state/);
  assert.doesNotMatch(projectCases, /<MethodFlow\b/);
  assert.doesNotMatch(page, /kinetic-field|system-map|meaning-beam/);
  assert.match(motion, /"use client"/);
  assert.match(motion, /IntersectionObserver/);
  assert.match(motion, /pointerenter/);
  assert.match(motion, /project-evidence-item\[data-project-preview\]/);
  assert.doesNotMatch(motion, /<figcaption>\{preview\.title\}<\/figcaption>/);
  assert.match(motion, /search-generic-ad\.webp/);
  assert.match(motion, /search-personalized-ad\.webp/);
  assert.match(motion, /preview\.id === "aigc"[\s\S]*?search-generic-ad\.webp[\s\S]*?search-personalized-ad\.webp/);
  assert.match(motion, /preview\.id === "evaluation"[\s\S]*?project-preview-quality-workflow/);
  assert.match(motion, /质量治理闭环/);
  assert.match(motion, /标准定义/);
  assert.match(motion, /事前准入/);
  assert.match(motion, /线上巡检/);
  assert.match(motion, /归因反哺/);
  assert.match(motion, /重新送评 ↺ 02/);
  assert.match(motion, /min-width: 981px/);
  assert.match(motion, /themedSurface\.dataset\.theme === "dark"/);
  assert.doesNotMatch(motion, /closest\("\[data-theme='dark'\]"\)/);
  assert.match(motion, /site-cursor/);
  assert.match(motion, /element\.dataset\.cursor !== "plain"/);
  assert.match(motion, /plainCursorAreas/);
  assert.match(motion, /data-rail-target/);
  assert.match(motion, /pointer: fine/);
  assert.doesNotMatch(motion, /ScrollTrigger|gsap|Lenis/);
  assert.equal((particlePortrait.match(/<canvas\b/g) ?? []).length, 1);
  assert.match(particlePortrait, /data-particle-canvas/);
  assert.match(particlePortrait, /data-particle-surface="hero"/);
  assert.match(particlePortrait, /data-cursor="plain"/);
  assert.match(particlePortrait, /pointermove/);
  assert.match(particlePortrait, /prefers-reduced-motion/);
  assert.match(particlePortrait, /reducedMotionRef\.current \|\| !portraitReady/);
  assert.match(particlePortrait, /yiyang-particle-portrait-cobalt-engraving-v1-transparent\.webp/);
  assert.match(particlePortrait, /sourcePixels/);
  assert.match(particlePortrait, /MOTION_HOLD_MS = 100/);
  assert.match(particlePortrait, /pointer\.lastMovedAt/);
  assert.match(particlePortrait, /pointer\.velocityX/);
  assert.match(particlePortrait, /renderParticlePortrait/);
  assert.match(particlePortrait, /BURST_ENTER_MS = 650/);
  assert.match(particlePortrait, /BURST_HOLD_MS = 900/);
  assert.match(particlePortrait, /BURST_RESTORE_MS = 550/);
  assert.match(particlePortrait, /cycleStartedAtRef/);
  assert.match(particlePortrait, /triggerParticleCycle/);
  assert.match(particlePortrait, /fullAmount/);
  assert.match(particlePortrait, /scatterAmount/);
  assert.match(particlePortrait, /scatterX/);
  assert.match(particlePortrait, /lowerWeight/);
  assert.match(particlePortrait, /binaryDigit/);
  assert.match(particlePortrait, /fillText/);
  assert.match(particlePortrait, /Math\.exp/);
  assert.match(particlePortrait, /particle-lab-upper/);
  assert.match(particlePortrait, /lowerWeight \+ \(1 - portraitParticle\.lowerWeight\) \* fullAmount/);
  assert.doesNotMatch(particlePortrait, /粒子浓度|particle: number|particle: 1/);
  assert.doesNotMatch(particlePortrait, /RETURN_DELAY_MS|particleModeRef|toggleParticleMode|aria-pressed/);
  assert.match(particlePortrait, /perspective\(1200px\)/);
  assert.match(particlePortrait, /rotateX/);
  assert.match(particlePortrait, /rotateY/);
  assert.doesNotMatch(particlePortrait, /triggerScatter|addWakeSegment|radialOffset|SCATTER_RETURN_MS/);
  assert.doesNotMatch(particlePortrait, /three|WebGL|requestPointerLock/);
  assert.match(styles, /\.project-preview\s*\{/);
  assert.match(styles, /\.hero-career\s*\{/);
  assert.match(styles, /\.hero-facts\s*\{/);
  assert.match(styles, /\.hero-identity\s*\{/);
  assert.doesNotMatch(styles, /\.hero-meta\s*\{|\.hero-lede\s*\{|\.hero-goal\s*\{|\.portrait-seal\s*\{/);
  assert.match(styles, /\.career-internship-list\s*\{/);
  assert.match(styles, /grid-template-columns:\s*repeat\(5, minmax\(0, 1fr\)\)/);
  assert.doesNotMatch(styles, /\.career-internship-head|\.career-internships/);
  assert.doesNotMatch(styles, /\.career-track::before|\.career-track li::before/);
  assert.match(styles, /\.work-model-shell\s*\{/);
  assert.match(styles, /\.project-zone\s*\{/);
  assert.match(styles, /\.agent-zone\s*\{/);
  assert.match(styles, /\.project-zone::before\s*\{/);
  assert.doesNotMatch(styles, /\.agent-work-figure\s*\{/);
  assert.doesNotMatch(styles, /\.work-model-shell\s*\{[^}]*border-radius/s);
  assert.doesNotMatch(styles, /\.project-zone\s*\{[^}]*border-radius/s);
  assert.match(styles, /\.agent-linear-model\s*\{/);
  assert.match(styles, /\.agent-linear-axis\s*\{/);
  assert.match(styles, /grid-template-columns:\s*minmax\(300px, 1\.8fr\) repeat\(5, minmax\(0, 1fr\)\)/);
  assert.match(styles, /\.agent-linear-return\s*\{/);
  assert.match(styles, /\.project-evidence-band\s*\{/);
  assert.match(styles, /\.project-evidence-item\s*\{/);
  assert.match(styles, /\.project-evidence-result\s*\{/);
  assert.doesNotMatch(styles, /\.project-evidence-meta\s*\{/);
  assert.match(caseStyles, /\.portfolio-case-study\s*\{/);
  assert.match(caseStyles, /\.portfolio-case-aigc\s*\{[^}]*--case-accent:\s*#2b31e8/s);
  assert.match(caseStyles, /\.portfolio-case-search\s*\{[^}]*--case-accent:\s*#2166b3/s);
  assert.match(caseStyles, /\.portfolio-case-evaluation\s*\{[^}]*--case-accent:\s*#5a4cc4/s);
  assert.match(caseStyles, /\.portfolio-case-memento\s*\{[^}]*--case-accent:\s*#4f7f9d/s);
  assert.match(caseStyles, /\.portfolio-case-study:focus-visible\s*\{[^}]*outline:\s*3px solid var\(--case-accent\)/s);
  assert.doesNotMatch(caseStyles, /linear-gradient|radial-gradient|box-shadow/);
  assert.doesNotMatch(caseStyles, /100svh|100vh|position:\s*sticky/);
  assert.match(styles, /\.project-overview-canvas\s*\{[^}]*background:\s*var\(--home-blue\)/s);
  assert.match(styles, /\.agent-zone\s*\{[^}]*background:\s*#fff/s);
  assert.match(styles, /project-evidence-item:is\(:hover, :focus-within\)[^}]*\.linear-stage\s*\{[^}]*opacity:\s*\.58/s);
  assert.match(styles, /background-color:\s*color-mix\(in srgb, var\(--home-blue\) 8%, transparent\)/);
  assert.doesNotMatch(styles, /\.project-evidence-head\s*\{|\.process-head-note\s*\{/);
  assert.match(styles, /data-projects~=/);
  assert.doesNotMatch(styles, /\.agent-model\s*\{|\.agent-input\s*\{|\.agent-context-core\s*\{|\.agent-action-steps\s*\{|\.agent-feedback-loop\s*\{/);
  assert.doesNotMatch(styles, /\.project-pin\s*\{|\.project-pins\s*\{/);
  assert.doesNotMatch(styles, /\.axis-project-card\s*\{|\.axis-project-grid\s*\{|\.product-axis-map\s*\{/);
  assert.match(styles, /\.particle-lab-stage\s*\{/);
  assert.match(styles, /perspective:\s*1200px/);
  assert.match(styles, /transition:\s*none/);
  assert.match(styles, /background:\s*transparent/);
  assert.match(styles, /\.site-cursor\s*\{/);
  assert.match(styles, /\.section-rail\s*\{/);
  assert.match(styles, /\.site-header\.is-hidden/);
  assert.match(styles, /\.hero-particle-portrait \.particle-lab-figure\s*\{/);
  assert.doesNotMatch(styles, /@keyframes portrait-float/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(styles, /mix-blend-mode:\s*multiply/);
  assert.doesNotMatch(styles, /\.evidence-grid\s*\{|\.capability-list\s*\{|\.narrative-spine\s*\{|\.understanding-map\s*\{|\.map-action-lane\s*\{|\.project-row\s*\{|\.work-table-head\s*\{/);
  assert.doesNotMatch(styles, /100svh|100vh|position:\s*sticky/);
  assert.match(layout, /Luke Shi 史翼洋｜AI 产品经理/);
  assert.match(layout, /import "\.\/project-cases\.css"/);
  assert.doesNotMatch(layout, /Memento/);
  assert.doesNotMatch(layout, /next\/font|Geist/);
  assert.doesNotMatch(packageJson, /"gsap"|"@gsap\/react"|"tailwindcss"|"@tailwindcss\/postcss"/);
  assert.doesNotMatch(page, /SkeletonPreview/);
});
