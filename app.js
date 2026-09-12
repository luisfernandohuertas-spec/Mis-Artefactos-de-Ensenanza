// app.js — Renderiza la galería a partir de TOOLS y CATEGORIES (definidos en tools.js).
(function () {
  const grid = document.getElementById("gallery");
  const filterBar = document.getElementById("filters");
  const searchInput = document.getElementById("search");
  const emptyState = document.getElementById("empty-state");
  const countLabel = document.getElementById("count");

  const colorByCategory = Object.fromEntries(CATEGORIES.map((c) => [c.name, c.color]));

  let activeCategory = "Todas";
  let query = "";

  function renderFilters() {
    const names = ["Todas", ...CATEGORIES.map((c) => c.name)];
    filterBar.innerHTML = "";
    names.forEach((name) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "pill";
      btn.textContent = name;
      btn.setAttribute("aria-pressed", String(name === activeCategory));
      if (name === activeCategory) btn.classList.add("is-active");
      if (name !== "Todas") btn.style.setProperty("--pill-color", colorByCategory[name]);
      btn.addEventListener("click", () => {
        activeCategory = name;
        renderFilters();
        renderGrid();
      });
      filterBar.appendChild(btn);
    });
  }

  function matches(tool) {
    const inCategory = activeCategory === "Todas" || tool.category === activeCategory;
    const q = query.trim().toLowerCase();
    const inQuery =
      q === "" ||
      tool.title.toLowerCase().includes(q) ||
      tool.description.toLowerCase().includes(q) ||
      tool.category.toLowerCase().includes(q);
    return inCategory && inQuery;
  }

  function renderGrid() {
    const visible = TOOLS.filter(matches);
    grid.innerHTML = "";

    visible.forEach((tool) => {
      const card = document.createElement("a");
      card.className = "card";
      card.href = tool.path;
      card.style.setProperty("--accent", colorByCategory[tool.category] || "#8b96a6");

      const category = document.createElement("span");
      category.className = "card-category";
      category.textContent = tool.category;

      const title = document.createElement("h3");
      title.className = "card-title";
      title.textContent = tool.title;

      const desc = document.createElement("p");
      desc.className = "card-description";
      desc.textContent = tool.description;

      const cta = document.createElement("span");
      cta.className = "card-cta";
      cta.textContent = "Abrir herramienta";

      card.append(category, title, desc, cta);
      grid.appendChild(card);
    });

    emptyState.hidden = visible.length !== 0;
    countLabel.textContent = visible.length + (visible.length === 1 ? " herramienta" : " herramientas");
  }

  searchInput.addEventListener("input", (e) => {
    query = e.target.value;
    renderGrid();
  });

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

  renderFilters();
  renderGrid();
  initHeroAnimation();
})();
