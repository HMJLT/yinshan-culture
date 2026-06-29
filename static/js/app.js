const state = {
  data: null,
  lang: "zh",
  activeTimeline: 0,
  activeSite: 0,
  activeCategory: "all"
};

const uiText = {
  zh: {
    brand: "阴山文明走廊",
    heroEyebrow: "AI + 数字文化遗产",
    startExplore: "开始探索",
    aiGuide: "AI 导览",
    exploreTitle: "文明探索",
    exploreSubtitle: "从阴山岩画的远古回响到草原丝路的驼铃声声，探寻游牧与农耕文明的千年交响。",
    timelineTitle: "文明时间轴",
    timelineSubtitle: "以文明交汇为故事线，串联岩画、边塞、迁徙、商贸与活态民俗。",
    mapTitle: "GIS 文化地图",
    mapSubtitle: "把“看地图”升级为“看遗址、读故事、进资源库”。",
    guideTitle: "AI 数字人导览",
    guideSubtitle: "来自阴山的AI小使者，为您讲述千年文明故事。",
    knowledgeTitle: "知识图谱",
    knowledgeSubtitle: "以关系网络呈现民族、王朝、遗址、人物与文物之间的文明关联。",
    archiveTitle: "文化资源库",
    archiveSubtitle: "以资源卡片承载岩画、文物、民俗、服饰、音乐与历史人物线索。",
    aboutTitle: "守望阴山 · 数字传承",
    aboutCopy: "阴山文明走廊致力于用数字技术守护和传承珍贵的文化遗产，让千年文明焕发新的生命力。",
    footerText: "数字人文 · 文化遗产 · 文旅融合",
    footerAbout: "关于我们",
    footerHelp: "帮助中心",
    footerContact: "联系方式",
    send: "发送",
    all: "全部",
    coordinates: "坐标",
    location: "地点",
    tags: "标签",
    searchType: "类型",
    noResults: "没有找到相关结果",
    chatPlaceholder: "问问阴山岩画、那达慕或草原丝路",
    searchPlaceholder: "搜索岩画、赵长城、祭敖包",
    welcome: "赛白努，我是阴山小使者。你可以问我阴山岩画、赵长城、那达慕或草原丝路的故事。",
    prompts: ["阴山岩画有什么价值？", "那达慕包含哪些项目？", "赵长城和阴山有什么关系？", "草原丝路有哪些历史故事？"],
    knowledgeHint: "点击图谱节点查看详情",
    aiFloatTitle: "AI 智能问答",
    aiFloatWelcome: "你好！我是阴山文明助手，问我任何关于阴山文化的问题吧。",
    aiFloatPrompts: ["阴山岩画是什么？", "推荐几个遗址", "草原丝路怎么走？", "匈奴和阴山的关系"]
  },
  en: {
    brand: "Yinshan Corridor",
    heroEyebrow: "AI + Digital Cultural Heritage",
    startExplore: "Explore",
    aiGuide: "AI Guide",
    exploreTitle: "Civilization Exploration",
    exploreSubtitle: "From ancient rock art to the steppe Silk Road, explore the millennia of nomadic and agrarian civilizations.",
    timelineTitle: "Civilization Timeline",
    timelineSubtitle: "A story of rock art, frontier passes, migration, trade, and living customs.",
    mapTitle: "GIS Cultural Map",
    mapSubtitle: "From viewing a map to exploring sites, stories, and archives.",
    guideTitle: "AI Digital Guide",
    guideSubtitle: "Your AI guide from Yinshan, sharing stories of ancient civilizations.",
    knowledgeTitle: "Knowledge Graph",
    knowledgeSubtitle: "A relational network of ethnic groups, dynasties, sites, figures, and artifacts.",
    archiveTitle: "Cultural Archive",
    archiveSubtitle: "Cards organize rock art, artifacts, customs, costume, music, and history.",
    aboutTitle: "Guardians of Yinshan · Digital Heritage",
    aboutCopy: "The Yinshan Civilization Corridor uses digital technology to preserve and revitalize precious cultural heritage, bringing ancient civilizations to new life.",
    footerText: "Digital humanities · Cultural heritage · Cultural tourism",
    footerAbout: "About",
    footerHelp: "Help",
    footerContact: "Contact",
    send: "Send",
    all: "All",
    coordinates: "Coordinates",
    location: "Location",
    tags: "Tags",
    searchType: "Type",
    noResults: "No related results",
    chatPlaceholder: "Ask about rock art, Naadam, or the steppe Silk Road",
    searchPlaceholder: "Search rock art, Great Wall, Ovoo",
    welcome: "Hello, I am the Yinshan guide. Ask me about rock art, the Great Wall, Naadam, or the steppe Silk Road.",
    prompts: ["What is the value of Yinshan rock art?", "What are the Naadam events?", "How is the Great Wall related to Yinshan?", "What stories are there about the steppe Silk Road?"],
    knowledgeHint: "Click a node to view details",
    aiFloatTitle: "AI Assistant",
    aiFloatWelcome: "Hello! I'm the Yinshan civilization assistant. Ask me anything about Yinshan culture.",
    aiFloatPrompts: ["What is Yinshan rock art?", "Recommend some sites", "What is the steppe Silk Road?", "Xiongnu and Yinshan"]
  }
};

const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

function t(key) {
  return uiText[state.lang][key] || uiText.zh[key] || key;
}

function localize(value) {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value[state.lang] || value.zh || Object.values(value)[0] || "";
  }
  return value || "";
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function refreshIcons() {
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

function updateStaticText() {
  document.documentElement.lang = state.lang === "zh" ? "zh-CN" : "en";
  $$("[data-i18n]").forEach((node) => {
    node.textContent = t(node.dataset.i18n);
  });
  $("#globalSearch").placeholder = t("searchPlaceholder");
  $("#langToggle").textContent = state.lang === "zh" ? "中 / EN" : "EN / 中";
}

function renderNav() {
  const nav = $("#mainNav");
  nav.innerHTML = state.data.navigation
    .map((item) => {
      const href = item.href ? item.href : "#" + item.id;
      const sectionAttr = item.href ? "" : ` data-section="${item.id}"`;
      return `<a href="${href}"${sectionAttr}>${escapeHtml(localize(item.label))}</a>`;
    })
    .join("");
}

function renderHero() {
  const meta = state.data.meta;
  $("#heroTitle").textContent = localize(meta.title);
  $("#heroSubtitle").textContent = localize(meta.subtitle);
  $("#heroBg").style.backgroundImage = `url("${meta.heroImage}")`;
}

function renderMetrics() {
  $("#metricsGrid").innerHTML = state.data.metrics
    .map((item) => `
      <article class="metric-card">
        <strong>${escapeHtml(item.value)}</strong>
        <span>${escapeHtml(localize(item.label))}</span>
        <small>${escapeHtml(localize(item.note))}</small>
      </article>
    `)
    .join("");
}

function renderCivilizationCards() {
  const container = $("#civilizationGrid");
  if (!container) return;
  const cards = state.data.civilization_cards || [];
  container.innerHTML = cards
    .map((card) => `
      <article class="culture-card">
        <img src="${escapeHtml(card.image)}" alt="${escapeHtml(localize(card.title))}" loading="lazy">
        <div class="culture-card-body">
          <h3>${escapeHtml(localize(card.title))}</h3>
          <p>${escapeHtml(localize(card.summary))}</p>
        </div>
      </article>
    `)
    .join("");
}

function renderHeritageCards() {
  const container = $("#heritageGrid");
  if (!container) return;
  const cards = state.data.heritage_cards || [];
  container.innerHTML = cards
    .map((card) => `
      <article class="culture-card">
        <img src="${escapeHtml(card.image)}" alt="${escapeHtml(localize(card.title))}" loading="lazy">
        <div class="culture-card-body">
          <h3>${escapeHtml(localize(card.title))}</h3>
          <p>${escapeHtml(localize(card.summary))}</p>
        </div>
      </article>
    `)
    .join("");
}

function renderHeroRail() {
  $("#heroRail").innerHTML = state.data.timeline
    .map((item, index) => `
      <button class="rail-node ${index === state.activeTimeline ? "is-active" : ""}" type="button" data-index="${index}">
        <span>${escapeHtml(localize(item.era))}</span>
      </button>
    `)
    .join("");

  $$(".rail-node").forEach((button) => {
    button.addEventListener("click", () => {
      selectTimeline(Number(button.dataset.index));
      $("#heritage").scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

function renderTimeline() {
  $("#timelineTrack").innerHTML = state.data.timeline
    .map((item, index) => `
      <article class="timeline-card ${index === state.activeTimeline ? "is-active" : ""}">
        <div class="timeline-card-inner">
          <img src="${escapeHtml(item.image)}" alt="${escapeHtml(localize(item.title))}" loading="lazy">
          <div class="timeline-card-body">
            <span class="era">${escapeHtml(localize(item.era))}</span>
            <h3>${escapeHtml(localize(item.title))}</h3>
            <p>${escapeHtml(localize(item.summary))}</p>
            <div class="tag-row">
              ${item.tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}
            </div>
          </div>
        </div>
      </article>
    `)
    .join("");
}

function selectTimeline(index) {
  state.activeTimeline = index;
  renderHeroRail();
  renderTimeline();
}

function renderMap() {
  const canvas = $("#mapCanvas");
  canvas.innerHTML = '<div class="map-route" aria-hidden="true"></div>';

  state.data.map_sites.forEach((site, index) => {
    const [left, top] = site.position;
    const point = document.createElement("button");
    point.className = `map-point ${index === state.activeSite ? "is-active" : ""}`;
    point.type = "button";
    point.style.left = `${left}%`;
    point.style.top = `${top}%`;
    point.setAttribute("aria-label", localize(site.name));
    point.setAttribute("title", localize(site.name));
    point.addEventListener("click", () => selectSite(index));
    canvas.appendChild(point);

    const label = document.createElement("span");
    label.className = "map-label";
    label.style.left = `${left}%`;
    label.style.top = `${top}%`;
    label.textContent = localize(site.name);
    canvas.appendChild(label);
  });

  renderMapDetail();
}

function renderMapDetail() {
  const site = state.data.map_sites[state.activeSite];
  $("#mapDetail").innerHTML = `
    <img src="${escapeHtml(site.image)}" alt="${escapeHtml(localize(site.name))}" loading="lazy">
    <div class="map-detail-content">
      <h3>${escapeHtml(localize(site.name))}</h3>
      <p>${escapeHtml(localize(site.summary))}</p>
      <dl>
        <dt>${t("location")}</dt>
        <dd>${escapeHtml(localize(site.location))}</dd>
        <dt>${t("coordinates")}</dt>
        <dd>${site.coordinates.map((item) => Number(item).toFixed(2)).join(", ")}</dd>
        <dt>${t("tags")}</dt>
        <dd>${site.tags.map(escapeHtml).join(" / ")}</dd>
      </dl>
    </div>
  `;
}

function selectSite(index) {
  state.activeSite = index;
  renderMap();
  // 在移动端滚动到详情面板
  if (window.innerWidth <= 900) {
    $("#mapDetail").scrollIntoView({ behavior: "smooth", block: "nearest" });
  }
}

function renderCategories() {
  const tabs = [
    { id: "all", label: { zh: t("all"), en: t("all") } },
    ...state.data.categories
  ];
  $("#categoryTabs").innerHTML = tabs
    .map((tab) => `
      <button class="${tab.id === state.activeCategory ? "is-active" : ""}" type="button" role="tab" data-category="${tab.id}">
        ${escapeHtml(localize(tab.label))}
      </button>
    `)
    .join("");

  $$("#categoryTabs button").forEach((button) => {
    button.addEventListener("click", () => {
      state.activeCategory = button.dataset.category;
      renderCategories();
      renderResources();
    });
  });
}

function renderResources() {
  const resources = state.activeCategory === "all"
    ? state.data.resources
    : state.data.resources.filter((item) => item.category === state.activeCategory);

  $("#resourceGrid").innerHTML = resources
    .map((item) => `
      <article class="resource-card">
        <img src="${escapeHtml(item.image)}" alt="${escapeHtml(localize(item.title))}" loading="lazy">
        <div class="resource-content">
          <span class="resource-period">${escapeHtml(localize(item.period))}</span>
          <h3>${escapeHtml(localize(item.title))}</h3>
          <p>${escapeHtml(localize(item.summary))}</p>
          <div class="tag-row">
            ${item.tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}
          </div>
        </div>
      </article>
    `)
    .join("");
}

function renderMap() {
  const canvas = $("#mapCanvas");
  canvas.innerHTML = '<div class="map-route" aria-hidden="true"></div>';

  state.data.map_sites.forEach((site, index) => {
    const [left, top] = site.position;
    const point = document.createElement("button");
    point.className = `map-point ${index === state.activeSite ? "is-active" : ""}`;
    point.type = "button";
    point.style.left = `${left}%`;
    point.style.top = `${top}%`;
    point.setAttribute("aria-label", localize(site.name));
    point.setAttribute("title", localize(site.name));
    point.addEventListener("click", () => selectSite(index));
    canvas.appendChild(point);

    const label = document.createElement("span");
    label.className = "map-label";
    label.style.left = `${left}%`;
    label.style.top = `${top}%`;
    label.textContent = localize(site.name);
    canvas.appendChild(label);
  });

let searchTimer = null;

function setupSearch() {
  $("#globalSearch").addEventListener("input", (event) => {
    window.clearTimeout(searchTimer);
    const query = event.target.value.trim();
    searchTimer = window.setTimeout(() => runSearch(query), 220);
  });
}

async function runSearch(query) {
  const resultsNode = $("#searchResults");
  if (!query) {
    resultsNode.hidden = true;
    resultsNode.innerHTML = "";
    return;
  }

  try {
    const response = await fetch(`/api/search?q=${encodeURIComponent(query)}&lang=${state.lang}`);
    const payload = await response.json();
    const results = payload.results || [];
    resultsNode.hidden = false;
    resultsNode.innerHTML = results.length
      ? results.map((item) => `
          <article class="search-result">
            <strong>${escapeHtml(item.title)}</strong>
            <span>${escapeHtml(item.summary)}</span>
            <span>${t("searchType")}: ${escapeHtml(item.type)}</span>
          </article>
        `).join("")
      : `<article class="search-result"><strong>${t("noResults")}</strong></article>`;
  } catch (error) {
    resultsNode.hidden = false;
    resultsNode.innerHTML = `<article class="search-result"><strong>${t("noResults")}</strong></article>`;
  }
}

// ===== 知识图谱 =====
let knowledgeChart = null;

const categoryColors = {
  "地理": "#b7aa93", "Geography": "#b7aa93",
  "遗址": "#6f8f73", "Sites": "#6f8f73",
  "文物": "#b86b43", "Artifacts": "#b86b43",
  "王朝": "#55B6FF", "Dynasties": "#55B6FF",
  "交通": "#7cb7c7", "Routes": "#7cb7c7",
  "民族": "#D5A86A", "Ethnic Groups": "#D5A86A",
  "人物": "#8b3a2e", "Figures": "#8b3a2e",
  "非遗": "#c9a96e", "Intangible": "#c9a96e"
};

function renderKnowledgeGraph() {
  const container = $("#knowledgeGraph");
  if (!container || !state.data.knowledge_graph) return;

  if (knowledgeChart) {
    knowledgeChart.dispose();
  }
  knowledgeChart = echarts.init(container);

  const graphData = state.data.knowledge_graph;
  const nodes = graphData.nodes.map((node) => ({
    id: node.id,
    name: localize(node.name),
    category: localize(node.category),
    symbolSize: node.symbolSize,
    itemStyle: { color: categoryColors[localize(node.category)] || "#D5A86A" }
  }));

  const edges = graphData.edges.map((edge) => ({
    source: edge.source,
    target: edge.target,
    label: { show: true, formatter: localize(edge.relation), fontSize: 10, color: "rgba(201,169,110,0.7)" },
    lineStyle: { color: "rgba(201,169,110,0.18)", curveness: 0.2 }
  }));

  const categories = [...new Set(graphData.nodes.map((n) => localize(n.category)))].map((cat) => ({
    name: cat,
    itemStyle: { color: categoryColors[cat] || "#D5A86A" }
  }));

  knowledgeChart.setOption({
    backgroundColor: "transparent",
    tooltip: {
      trigger: "item",
      formatter: (params) => {
        if (params.dataType === "node") {
          return `<strong>${params.name}</strong><br/>${params.data.category}`;
        }
        return "";
      }
    },
    legend: {
      data: categories.map((c) => c.name),
      orient: "vertical",
      left: 10,
      top: 20,
      textStyle: { color: "rgba(247,240,223,0.7)", fontSize: 11 },
      icon: "circle"
    },
    series: [{
      type: "graph",
      layout: "force",
      roam: true,
      draggable: true,
      force: { repulsion: 600, edgeLength: [120, 280], gravity: 0.15 },
      data: nodes,
      edges: edges,
      categories: categories,
      label: {
        show: true,
        position: "right",
        fontSize: 11,
        color: "rgba(247,240,223,0.78)",
        formatter: "{b}"
      },
      lineStyle: { color: "source", curveness: 0.2, opacity: 0.4 },
      emphasis: {
        focus: "adjacency",
        lineStyle: { width: 3, opacity: 0.8 },
        itemStyle: { shadowBlur: 20, shadowColor: "rgba(201,169,110,0.6)" },
        label: { fontSize: 13, fontWeight: "bold" }
      }
    }]
  });

  // 窗口大小变化时重绘
  window.addEventListener("resize", () => {
    if (knowledgeChart) knowledgeChart.resize();
  });

  // 点击节点显示详情
  knowledgeChart.on("click", (params) => {
    if (params.dataType === "node") {
      showKnowledgeDetail(params.data);
    }
  });
}

function showKnowledgeDetail(nodeData) {
  const detail = $("#knowledgeDetail");
  const graphData = state.data.knowledge_graph;

  // 找所有与该节点相关的边
  const relatedEdges = graphData.edges.filter(
    (e) => e.source === nodeData.id || e.target === nodeData.id
  );

  const relations = relatedEdges.map((edge) => {
    const isSource = edge.source === nodeData.id;
    const otherId = isSource ? edge.target : edge.source;
    const otherNode = graphData.nodes.find((n) => n.id === otherId);
    const otherName = otherNode ? localize(otherNode.name) : otherId;
    const rel = localize(edge.relation);
    return isSource
      ? `<div class="kd-relation-item">${rel} → <strong>${escapeHtml(otherName)}</strong></div>`
      : `<div class="kd-relation-item"><strong>${escapeHtml(otherName)}</strong> → ${rel}</div>`;
  }).join("");

  detail.innerHTML = `
    <button class="knowledge-detail-close" onclick="document.getElementById('knowledgeDetail').classList.remove('is-open')" aria-label="关闭详情">✕</button>
    <h3>${escapeHtml(localize(nodeData.name))}</h3>
    <span class="kd-category">${escapeHtml(nodeData.category)}</span>
    <div class="kd-relations">
      <h4>关联关系 (${relatedEdges.length})</h4>
      ${relations || '<div class="kd-relation-item">暂无</div>'}
    </div>
  `;

  detail.classList.add("is-open");
}

// ===== 右下角AI浮动问答 =====
function setupAiFloat() {
  const toggle = $("#aiFloatToggle");
  const panel = $("#aiFloatPanel");
  const close = $("#aiFloatClose");
  const form = $("#aiFloatForm");
  const input = $("#aiFloatInput");
  const body = $("#aiFloatBody");
  const promptsRow = $("#aiFloatPrompts");

  // 渲染快捷提问
  promptsRow.innerHTML = t("aiFloatPrompts")
    .map((prompt) => `<button type="button">${escapeHtml(prompt)}</button>`)
    .join("");

  $$("#aiFloatPrompts button").forEach((button) => {
    button.addEventListener("click", () => {
      input.value = button.textContent;
      form.requestSubmit();
    });
  });

  // 切换面板
  toggle.addEventListener("click", () => {
    panel.classList.toggle("is-open");
  });

  close.addEventListener("click", () => {
    panel.classList.remove("is-open");
  });

  // 点击面板外部关闭
  document.addEventListener("click", (event) => {
    if (!event.target.closest("#aiFloat") && panel.classList.contains("is-open")) {
      panel.classList.remove("is-open");
    }
  });

  // 发送消息
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const message = input.value.trim();
    if (!message) return;

    appendAiFloatMessage("user", message);
    input.value = "";

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, lang: state.lang })
      });
      const payload = await response.json();
      appendAiFloatMessage("guide", payload.answer);
    } catch (error) {
      appendAiFloatMessage("guide", state.lang === "zh" ? "服务暂时不可用，请稍后再试。" : "Service temporarily unavailable.");
    }
  });
}

function appendAiFloatMessage(role, text) {
  const body = $("#aiFloatBody");
  const div = document.createElement("div");
  div.className = `chat-message ${role}`;
  div.textContent = text;
  body.appendChild(div);
  body.scrollTop = body.scrollHeight;
}

function resetAiFloat() {
  $("#aiFloatBody").innerHTML = `<div class="chat-message guide">${t("aiFloatWelcome")}</div>`;
}

function setupHeader() {
  $("#menuToggle").addEventListener("click", () => {
    $("#mainNav").classList.toggle("is-open");
  });

  $("#langToggle").addEventListener("click", () => {
    state.lang = state.lang === "zh" ? "en" : "zh";
    renderAll();
    resetChat();
    resetAiFloat();
    const query = $("#globalSearch").value.trim();
    if (query) runSearch(query);
  });

  window.addEventListener("scroll", () => {
    $("#siteHeader").classList.toggle("is-scrolled", window.scrollY > 20);
  }, { passive: true });

  document.addEventListener("click", (event) => {
    if (!event.target.closest(".site-header")) {
      $("#mainNav").classList.remove("is-open");
    }
  });
}

function setupScrollSpy() {
  const sections = state.data.navigation.map((item) => document.getElementById(item.id)).filter(Boolean);
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      $$("#mainNav a").forEach((link) => {
        link.classList.toggle("is-active", link.dataset.section === entry.target.id);
      });
    });
  }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });

  sections.forEach((section) => observer.observe(section));
}

function setupScrollAnimations() {
  const animatedElements = document.querySelectorAll(".section-animate");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
        }
      });
    },
    { rootMargin: "-10% 0px -10% 0px", threshold: 0.1 }
  );

  animatedElements.forEach((el) => observer.observe(el));
}

function setupCardMouseTrack() {
  const cards = document.querySelectorAll(".culture-card, .resource-card");
  cards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty("--mouse-x", `${x}%`);
      card.style.setProperty("--mouse-y", `${y}%`);
    });
    card.addEventListener("mouseleave", () => {
      card.style.setProperty("--mouse-x", "50%");
      card.style.setProperty("--mouse-y", "50%");
    });
  });
}

function setupCarousel() {
  const track = $("#carouselTrack");
  if (!track) return;

  const items = track.children;
  const len = items.length;
  let current = 0;
  let timer = null;

  function updateCarousel() {
    const mlen = Math.floor(len / 2);
    for (let i = 0; i < mlen; i++) {
      const limg = (len + current - i - 1) % len;
      const rimg = (current + i + 1) % len;

      if (rimg !== limg) {
        items[limg].style.transform = `translateX(${-180 * (i + 1)}px) translateZ(${200 - i * 80}px) rotateY(25deg) scale(${1 - 0.08 * (i + 1)})`;
        items[rimg].style.transform = `translateX(${180 * (i + 1)}px) translateZ(${200 - i * 80}px) rotateY(-25deg) scale(${1 - 0.08 * (i + 1)})`;
      } else {
        items[limg].style.transform = "translateZ(0px)";
      }

      items[current].style.transform = "translateZ(300px)";
    }
  }

  function autoplay() {
    timer = setInterval(() => {
      current = (current >= len - 1) ? 0 : current + 1;
      updateCarousel();
    }, 4000);
  }

  for (let i = 0; i < len; i++) {
    (function(i) {
      items[i].addEventListener("click", () => {
        current = i;
        updateCarousel();
      });
      items[i].addEventListener("mouseenter", () => {
        if (timer) clearInterval(timer);
      });
      items[i].addEventListener("mouseleave", () => {
        autoplay();
      });
    })(i);
  }

  updateCarousel();
  autoplay();
}

function renderAll() {
  updateStaticText();
  renderNav();
  renderHero();
  renderMetrics();
  renderCivilizationCards();
  renderHeritageCards();
  renderHeroRail();
  renderTimeline();
  renderMap();
  renderKnowledgeGraph();
  renderCategories();
  renderResources();
  setupScrollSpy();
  setupScrollAnimations();
  setupCardMouseTrack();
  setupCarousel();
  refreshIcons();
}

async function boot() {
  const response = await fetch("/api/site");
  state.data = await response.json();
  renderAll();
  setupHeader();
  setupSearch();
  setupAiFloat();
  resetAiFloat();
  refreshIcons();
}

boot().catch((error) => {
  document.body.innerHTML = `<main class="section"><div class="section-shell"><h1>启动失败</h1><p>${escapeHtml(error.message)}</p></div></main>`;
});
