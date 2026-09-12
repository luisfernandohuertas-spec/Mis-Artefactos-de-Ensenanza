// app.js — Descubre automáticamente las herramientas dentro de /tools/ leyendo
// el árbol del repositorio con la API pública de GitHub. Para publicar una
// herramienta nueva: crea (o reutiliza) una carpeta bajo /tools/ y pon ahí tu
// archivo .html. No hay que tocar este archivo ni ningún manifiesto.
//
// Requisito: el repositorio debe ser público, y esta página debe cargarse
// por HTTP (GitHub Pages, o un servidor local) — no funciona abriendo
// index.html con doble clic, porque necesita hacer fetch() por red.

const REPO_OWNER = "luisfernandohuertas-spec";
const REPO_NAME = "Mis-Artefactos-de-Ensenanza";
const REPO_BRANCH = "main";
const TOOLS_PATTERN = /^tools\/([^/]+)\/([^/]+)\.html$/i;

(function () {
  const grid = document.getElementById("gallery");
  const filterBar = document.getElementById("filters");
  const searchInput = document.getElementById("search");
  const statusEl = document.getElementById("status");
  const countLabel = document.getElementById("count");

  let TOOLS = [];
  let activeCategory = "Todas";
  let query = "";

  function categoryInfo(slug) {
    return CATEGORIES[slug] || { name: prettify(slug), color: "#8b96a6" };
  }

  function prettify(slug) {
    return slug
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  }

  async function discoverTools() {
    const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/git/trees/${REPO_BRANCH}?recursive=1`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("No se pudo leer el árbol del repositorio.");
    const data = await res.json();
    return data.tree
      .filter((item) => item.type === "blob" && TOOLS_PATTERN.test(item.path))
      .map((item) => {
        const match = item.path.match(TOOLS_PATTERN);
        return { categorySlug: match[1], slug: match[2], path: item.path };
      });
  }

  async function loadToolMeta(path) {
    try {
      const res = await fetch(path);
      const text = await res.text();
      const doc = new DOMParser().parseFromString(text, "text/html");
      const descTag = doc.querySelector('meta[name="description"]');
      return {
        title: doc.title && doc.title.trim() ? doc.title.trim() : prettify(path.split("/").pop().replace(/\.html$/i, "")),
        description: descTag ? descTag.getAttribute("content") || "" : "",
      };
    } catch (err) {
      const fallbackSlug = path.split("/").pop().replace(/\.html$/i, "");
      return { title: prettify(fallbackSlug), description: "" };
    }
  }

  function renderFilters() {
    const slugsPresent = [...new Set(TOOLS.map((t) => t.categorySlug))];
    const known = Object.keys(CATEGORIES).filter((s) => slugsPresent.includes(s));
    const unknown = slugsPresent.filter((s) => !CATEGORIES[s]).sort();
    const orderedSlugs = [...known, ...unknown];

    filterBar.innerHTML = "";
    const allBtn = makePill("Todas", null);
    filterBar.appendChild(allBtn);
    orderedSlugs.forEach((slug) => filterBar.appendChild(makePill(categoryInfo(slug).name, slug, categoryInfo(slug).color)));
  }

  function makePill(label, categorySlug, color) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "pill";
    btn.textContent = label;
    const isActive = categorySlug === activeCategory || (categorySlug === null && activeCategory === "Todas");
    btn.setAttribute("aria-pressed", String(isActive));
    if (isActive) btn.classList.add("is-active");
    if (color) btn.style.setProperty("--pill-color", color);
    btn.addEventListener("click", () => {
      activeCategory = categorySlug === null ? "Todas" : categorySlug;
      renderFilters();
      renderGrid();
    });
    return btn;
  }

  function matches(tool) {
    const inCategory = activeCategory === "Todas" || tool.categorySlug === activeCategory;
    const q = query.trim().toLowerCase();
    const inQuery =
      q === "" ||
      tool.title.toLowerCase().includes(q) ||
      tool.description.toLowerCase().includes(q) ||
      categoryInfo(tool.categorySlug).name.toLowerCase().includes(q);
    return inCategory && inQuery;
  }

  function renderGrid() {
    const visible = TOOLS.filter(matches).sort((a, b) => a.title.localeCompare(b.title, "es"));
    grid.innerHTML = "";

    visible.forEach((tool) => {
      const info = categoryInfo(tool.categorySlug);
      const card = document.createElement("a");
      card.className = "card";
      card.href = tool.path;
      card.style.setProperty("--accent", info.color);

      const category = document.createElement("span");
      category.className = "card-category";
      category.textContent = info.name;

      const title = document.createElement("h3");
      title.className = "card-title";
      title.textContent = tool.title;

      card.append(category, title);

      if (tool.description) {
        const desc = document.createElement("p");
        desc.className = "card-description";
        desc.textContent = tool.description;
        card.appendChild(desc);
      }

      const cta = document.createElement("span");
      cta.className = "card-cta";
      cta.textContent = "Abrir herramienta";
      card.appendChild(cta);

      grid.appendChild(card);
    });

    countLabel.hidden = false;
    countLabel.textContent = visible.length + (visible.length === 1 ? " herramienta" : " herramientas");
    statusEl.hidden = visible.length !== 0;
    if (visible.length === 0) {
      statusEl.textContent = TOOLS.length === 0
        ? "Todavía no hay ninguna herramienta publicada en /tools/."
        : "No hay ninguna herramienta que coincida con esa búsqueda.";
    }
  }

  searchInput.addEventListener("input", (e) => {
    query = e.target.value;
    renderGrid();
  });

  async function init() {
    statusEl.hidden = false;
    statusEl.textContent = "Cargando herramientas desde el repositorio…";
    countLabel.hidden = true;

    let entries;
    try {
      entries = await discoverTools();
    } catch (err) {
      statusEl.textContent = "No se pudieron cargar las herramientas automáticamente. Revisa tu conexión e inténtalo de nuevo.";
      return;
    }

    TOOLS = await Promise.all(
      entries.map(async (entry) => ({ ...entry, ...(await loadToolMeta(entry.path)) }))
    );

    renderFilters();
    renderGrid();
  }

  function initHeroAnimation() {
    const canvas = document.getElementById("hero-canvas");
    if (!canvas || !canvas.getContext) return;
    const ctx = canvas.getContext("2d");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function resize() {
      const rect = canvas.getBoundingClientRect();
      const ratio = window.devicePixelRatio || 1;
      canvas.width = rect.width * ratio;
      canvas.height = rect.height * ratio;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    }
    resize();
    window.addEventListener("resize", resize);

    let t = 0;
    function frame() {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      ctx.clearRect(0, 0, w, h);

      ctx.strokeStyle = "#e8b94f";
      ctx.lineWidth = 2;
      ctx.beginPath();
      const points = 220;
      for (let i = 0; i <= points; i++) {
        const p = i / points;
        const x = p * w;
        const y = h / 2 + Math.sin(p * Math.PI * 4 + t) * (h * 0.26) * Math.sin(t * 0.3 + p * Math.PI);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      ctx.strokeStyle = "#6fb8ae";
      ctx.lineWidth = 1.5;
      ctx.globalAlpha = 0.55;
      ctx.beginPath();
      for (let i = 0; i <= points; i++) {
        const p = i / points;
        const x = p * w;
        const y = h / 2 + Math.sin(p * Math.PI * 3 - t * 1.3) * (h * 0.16);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.globalAlpha = 1;

      t += 0.012;
      if (!reduceMotion) requestAnimationFrame(frame);
    }
    frame();
  }

  init();
  initHeroAnimation();
})();
