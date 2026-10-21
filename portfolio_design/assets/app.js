/* Portfolio site — reads content/site.md and content/cases/*.md and renders the page.
   No build step and no external libraries. Content lives in /content; this file is code only. */
(function () {
  "use strict";

  var VIEWS = {
    design: { label: "Design", path: "design/" },
    product: { label: "Product", path: "product/" }
  };

  var META_FIELDS = [
    ["role", "Role"],
    ["team", "Team"],
    ["timeline", "Timeline"],
    ["platform", "Platform"],
    ["users", "Users"],
    ["scope", "Scope"],
    ["grade", "Grade"]
  ];

  var root = document.documentElement;
  var BASE = root.getAttribute("data-base") || "./";
  var bundle = window.__PORTFOLIO_BUNDLE || null; // single-file preview build
  var cache = {};

  /* ---------- loading ---------- */

  function load(path) {
    if (cache[path]) return Promise.resolve(cache[path]);
    var done = function (text) { cache[path] = parseDoc(text); return cache[path]; };
    if (bundle) {
      if (!(path in bundle)) return Promise.reject(new Error("Missing file: " + path));
      return Promise.resolve(done(bundle[path]));
    }
    return fetch(BASE + path, { cache: "no-cache" }).then(function (r) {
      if (!r.ok) throw new Error("Could not load " + path + " (" + r.status + ")");
      return r.text();
    }).then(done);
  }

  function loadCase(id) { return load("content/cases/" + id + ".md").then(function (d) { d.id = id; return d; }); }

  /* A case can have a view-specific body: content/cases/<id>.<view>.md.
     Its front matter overrides the base file; without it, the base body is used. */
  function loadCaseFor(id, view) {
    var path = "content/cases/" + id + "." + view + ".md";
    var extra = (bundle && !(path in bundle)) ? Promise.resolve(null) : load(path).catch(function () { return null; });
    return Promise.all([loadCase(id), extra]).then(function (res) {
      var base = res[0], v = res[1];
      if (!v) return base;
      var meta = {}; Object.keys(base.meta).forEach(function (k) { meta[k] = base.meta[k]; });
      Object.keys(v.meta).forEach(function (k) { meta[k] = v.meta[k]; });
      return { id: id, meta: meta, body: v.body || base.body };
    });
  }

  /* ---------- front matter + markdown ---------- */

  function parseDoc(text) {
    text = text.replace(/\r\n?/g, "\n");
    var meta = {}, body = text;
    var m = /^---\n([\s\S]*?)\n---\n?/.exec(text);
    if (m) {
      body = text.slice(m[0].length);
      m[1].split("\n").forEach(function (line) {
        var i = line.indexOf(":");
        if (i < 1 || /^\s*#/.test(line)) return;
        meta[line.slice(0, i).trim()] = line.slice(i + 1).trim();
      });
    }
    return { meta: meta, body: body.trim() };
  }

  function list(value) {
    return (value || "").split(",").map(function (s) { return s.trim(); }).filter(Boolean);
  }

  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  function inline(s) {
    s = esc(s);
    s = s.replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, function (_, alt, src) {
      return '<img src="' + assetUrl(src) + '" alt="' + alt + '" loading="lazy">';
    });
    s = s.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, function (_, t, href) {
      var ext = /^https?:/.test(href);
      return '<a href="' + href + '"' + (ext ? ' target="_blank" rel="noopener"' : "") + ">" + t + "</a>";
    });
    // [text] without a link = something still to fill in
    s = s.replace(/\[([^\]]+)\](?!\()/g, '<mark class="todo">$1</mark>');
    s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    s = s.replace(/(^|[^*\w])\*([^*\n]+)\*(?!\w)/g, "$1<em>$2</em>");
    return s;
  }

  function assetUrl(src) {
    if (/^(https?:|data:|\/)/.test(src)) return src;
    if (bundle && bundle["content/" + src]) return bundle["content/" + src];
    return BASE + "content/" + src;
  }

  function markdown(md) {
    var lines = md.split("\n"), out = [], i = 0;
    function isBlockStart(l) {
      return /^(#{2,3} |- |\d+\. |\||!\[)/.test(l) || l.trim() === "";
    }
    while (i < lines.length) {
      var l = lines[i];
      if (l.trim() === "") { i++; continue; }
      var h = /^(#{2,3}) (.*)$/.exec(l);
      if (h) { out.push("<h" + h[1].length + ">" + inline(h[2]) + "</h" + h[1].length + ">"); i++; continue; }
      if (/^!\[[^\]]*\]\([^)]+\)\s*$/.test(l)) { out.push('<figure class="figure">' + inline(l.trim()) + "</figure>"); i++; continue; }
      if (/^- /.test(l) || /^\d+\. /.test(l)) {
        var ordered = /^\d+\. /.test(l), re = ordered ? /^\d+\. / : /^- /, items = [];
        while (i < lines.length && re.test(lines[i])) {
          var item = lines[i].replace(re, ""); i++;
          while (i < lines.length && /^\s{2,}\S/.test(lines[i])) { item += " " + lines[i].trim(); i++; }
          items.push("<li>" + inline(item) + "</li>");
        }
        out.push((ordered ? "<ol>" : "<ul>") + items.join("") + (ordered ? "</ol>" : "</ul>"));
        continue;
      }
      if (/^\|/.test(l)) {
        var rows = [];
        while (i < lines.length && /^\|/.test(lines[i])) { rows.push(lines[i]); i++; }
        out.push(table(rows));
        continue;
      }
      var para = [l.trim()]; i++;
      while (i < lines.length && !isBlockStart(lines[i])) { para.push(lines[i].trim()); i++; }
      out.push("<p>" + inline(para.join(" ")) + "</p>");
    }
    return out.join("\n");
  }

  function table(rows) {
    var cells = function (r) { return r.replace(/^\||\|\s*$/g, "").split("|").map(function (c) { return c.trim(); }); };
    var head = cells(rows[0]);
    var body = rows.slice(/^\|[\s:|-]+\|?\s*$/.test(rows[1] || "") ? 2 : 1);
    var html = '<div class="table-wrap"><table><thead><tr>' +
      head.map(function (c) { return "<th>" + inline(c) + "</th>"; }).join("") + "</tr></thead><tbody>";
    body.forEach(function (r) {
      html += "<tr>" + cells(r).map(function (c) { return "<td>" + inline(c) + "</td>"; }).join("") + "</tr>";
    });
    return html + "</tbody></table></div>";
  }

  // Wrap each "## Heading" and what follows into a section with a side label.
  function sections(html) {
    var parts = html.split(/(?=<h2>)/), n = 0;
    return parts.map(function (part) {
      var m = /^<h2>([\s\S]*?)<\/h2>/.exec(part);
      if (!m) return part.trim() ? '<section class="cs-section"><div class="cs-body">' + part + "</div></section>" : "";
      var id = m[1].replace(/<[^>]+>/g, "").toLowerCase().replace(/&amp;/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      return '<section class="cs-section" id="' + id + '"><h2 class="cs-label"><span class="micro">' + (++n < 10 ? "0" + n : n) + "</span>" + m[1] + '</h2><div class="cs-body">' +
        part.slice(m[0].length) + "</div></section>";
    }).join("\n");
  }

  /* ---------- navigation ---------- */

  function viewHref(view) { return BASE + VIEWS[view].path; }
  function caseHref(id, view) { return BASE + "case/?p=" + encodeURIComponent(id) + "&v=" + view; }

  function currentRoute() {
    if (bundle) return window.__route || { page: "view", view: "design" };
    var page = root.getAttribute("data-page");
    var q = new URLSearchParams(location.search);
    if (page === "case") return { page: "case", id: q.get("p"), view: VIEWS[q.get("v")] ? q.get("v") : "product" };
    return { page: "view", view: root.getAttribute("data-view") || "design" };
  }

  // In the single-file preview, links are handled in the page instead of by URL.
  document.addEventListener("click", function (e) {
    if (!bundle) return;
    var a = e.target.closest("a[data-route]");
    if (!a) return;
    e.preventDefault();
    var r = JSON.parse(a.getAttribute("data-route"));
    var cur = currentRoute();
    if (r.anchor && cur.page === "view" && r.page === "view" && cur.view === r.view) { jumpTo(r.anchor); return; }
    window.__route = r;
    render().then(function () { r.anchor ? jumpTo(r.anchor) : window.scrollTo(0, 0); });
  });

  function jumpTo(id) {
    var el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  }

  function routeAttr(r) { return bundle ? " data-route='" + esc(JSON.stringify(r)) + "'" : ""; }

  /* ---------- rendering ---------- */

  var app = document.getElementById("app");

  function render() {
    var r = currentRoute();
    var job = r.page === "case" ? renderCase(r) : renderView(r.view);
    return job.then(after).catch(function (err) {
      app.innerHTML = '<main class="wrap error"><h1>This page could not load</h1><p>' + esc(err.message) +
        '</p><p><a href="' + viewHref("design") + '">Go to the portfolio</a></p></main>';
    });
  }

  // Highlight the menu item for the section in view; reveal sections once as they scroll in.
  var observer = null, revealer = null;
  function after() {
    var r = currentRoute();
    root.setAttribute("data-page", r.page);
    if (observer) observer.disconnect();
    if (revealer) revealer.disconnect();
    if (!bundle && location.hash) { var t = document.getElementById(location.hash.slice(1)); if (t) t.scrollIntoView(); }
    setupFilters();
    if (!("IntersectionObserver" in window)) return;
    var links = [].slice.call(document.querySelectorAll(".menu a[data-sec]"));
    var screens = [].slice.call(document.querySelectorAll(".screen"));
    var dots = [].slice.call(document.querySelectorAll(".screen-dots a"));
    function mark() {
      if (!screens.length) return;
      var head = document.querySelector(".site-head"), top = head ? head.getBoundingClientRect().bottom : 0, cur = screens[0];
      screens.forEach(function (el) { if (el.getBoundingClientRect().top - top <= window.innerHeight * 0.35) cur = el; });
      var sec = cur.getAttribute("data-sec") || cur.id;
      links.forEach(function (l) { l.classList.toggle("is-current", l.getAttribute("data-sec") === sec); });
      dots.forEach(function (d) { d.classList.toggle("is-current", d.getAttribute("data-dot") === cur.id); });
    }
    if (window.__markScroll) window.removeEventListener("scroll", window.__markScroll);
    var ticking = false;
    window.__markScroll = function () { if (!ticking) { ticking = true; requestAnimationFrame(function () { ticking = false; mark(); }); } };
    window.addEventListener("scroll", window.__markScroll, { passive: true });
    mark();
    observer = { disconnect: function () {} };
    revealer = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("is-in"); revealer.unobserve(en.target); } });
    }, { rootMargin: "0px 0px -10% 0px" });
    [].slice.call(document.querySelectorAll(".section")).forEach(function (el) { revealer.observe(el); });
  }

  function setupFilters() {
    var chips = [].slice.call(document.querySelectorAll(".chip"));
    var cards = [].slice.call(document.querySelectorAll(".work-grid .card"));
    var track = document.querySelector(".projects .work-grid");
    var count = document.querySelector(".slide-count");
    var btns = [].slice.call(document.querySelectorAll(".slide-btn"));
    function step() { var c = cards.filter(function (x) { return !x.hidden; })[0]; return c ? c.getBoundingClientRect().width + parseFloat(getComputedStyle(track).columnGap || 0) : 0; }
    function update() {
      if (!track || !count) return;
      var vis = cards.filter(function (x) { return !x.hidden; }).length, st = step() || 1;
      var per = Math.max(1, Math.round((track.clientWidth + parseFloat(getComputedStyle(track).columnGap || 0)) / st));
      var first = Math.round(track.scrollLeft / st) + 1, last = Math.min(vis, first + per - 1);
      count.textContent = vis ? (first === last ? first : first + "–" + last) + " / " + vis : "";
      btns[0].disabled = track.scrollLeft <= 2;
      btns[1].disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 2;
      document.querySelector(".slide-nav").classList.toggle("is-static", vis <= per);
    }
    btns.forEach(function (b) { b.addEventListener("click", function () { track.scrollBy({ left: step() * +b.getAttribute("data-dir"), behavior: "smooth" }); }); });
    if (track) { track.addEventListener("scroll", function () { requestAnimationFrame(update); }, { passive: true }); window.addEventListener("resize", update); setTimeout(update, 50); }
    chips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        var f = chip.getAttribute("data-filter");
        chips.forEach(function (c) { c.setAttribute("aria-pressed", String(c === chip)); });
        cards.forEach(function (c) { c.hidden = f !== "all" && c.getAttribute("data-group") !== f; });
        if (track) { track.scrollLeft = 0; update(); }
      });
    });
  }

  function header(site, view, onCase) {
    var tabs = Object.keys(VIEWS).map(function (v) {
      return '<a class="switch-opt" href="' + viewHref(v) + '"' + routeAttr({ page: "view", view: v }) +
        (v === view ? ' aria-current="page"' : "") + ">" + VIEWS[v].label + "</a>";
    }).join("");
    var menu = [["about", "About"], ["projects", "Projects"], ["contact", "Contact"]].map(function (it) {
      var href = (onCase ? viewHref(view) : "") + "#" + it[0];
      return '<a href="' + href + '" data-sec="' + it[0] + '"' + routeAttr({ page: "view", view: view, anchor: it[0] }) + ">" + it[1] + "</a>";
    }).join("");
    return '<header class="site-head"><div class="wrap head-row">' +
      '<a class="wordmark" href="' + (onCase ? viewHref(view) : "#top") + '"' + routeAttr({ page: "view", view: view, anchor: "top" }) + ">" + esc(site.meta.name) + "</a>" +
      '<nav class="menu" aria-label="Sections">' + menu + "</nav>" +
      "</div></header>" +
      // The live site has no view switch: each job application gets its own link (/design/ or /product/).
      // The single-file preview shows one so both views can be checked.
      (bundle ? '<nav class="preview-switch" aria-label="Preview view">Preview <span class="switch">' + tabs + "</span></nav>" : "");
  }

  function contactRows(m) {
    var rows = [];
    if (m.email) rows.push(["Email", '<a href="mailto:' + esc(m.email) + '">' + esc(m.email) + "</a>"]);
    if (m.linkedin) rows.push(["LinkedIn", '<a href="' + esc(m.linkedin) + '" target="_blank" rel="noopener">' + esc(m.linkedin.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")) + "</a>"]);
    if (!rows.length) rows.push(["", '<mark class="todo">Email and LinkedIn go here</mark>']);
    return '<dl class="contact-list">' + rows.map(function (r) { return "<div><dt>" + r[0] + "</dt><dd>" + r[1] + "</dd></div>"; }).join("") + "</dl>";
  }

  function cvButton(m, view) {
    var cv = m["cv_" + view];
    return cv ? '<a class="button" href="' + assetUrl(cv) + '" target="_blank" rel="noopener">Download CV (PDF)</a>' : "";
  }

  function contact(site, view) {
    var m = site.meta;
    return '<footer class="site-foot"><div class="wrap foot-grid">' +
      '<div><h2 class="foot-title">Get in touch</h2><p class="foot-note">' + esc(m.location || "") + "</p></div>" +
      contactRows(m) + cvButton(m, view) + "</div></footer>";
  }

  function card(doc, view, size, groupLabel) {
    var m = doc.meta, linked = !!doc.body;
    var title = m.card_title || m.title;
    var summary = m["summary_" + view] || "";
    var img = m["image_" + view] || m.image;
    var visual = img
      ? '<img src="' + assetUrl(img) + '" alt="" loading="lazy">'
      : '<span class="ph-title" aria-hidden="true">' + esc(title) + "</span>";
    var inner =
      '<div class="card-visual' + (img ? "" : " is-placeholder") + '">' + visual + "</div>" +
      '<div class="card-text"><p class="card-meta">' + (groupLabel ? '<span class="tag tag-accent">' + esc(groupLabel) + "</span>" : "") + (m.kind && m.kind !== groupLabel ? '<span class="tag">' + esc(m.kind) + "</span>" : "") + (m.year ? '<span class="tag tag-plain">' + esc(m.year) + "</span>" : "") + "</p>" +
      '<h3 class="card-title">' + esc(title) + "</h3>" +
      '<p class="card-summary">' + inline(summary) + "</p>" +
      (m.status === "draft" ? '<p class="card-flag">Draft</p>' : "") + "</div>";
    return linked
      ? '<a class="card card-' + size + '" href="' + caseHref(doc.id, view) + '"' + routeAttr({ page: "case", id: doc.id, view: view }) + ">" + inner + "</a>"
      : '<div class="card card-' + size + ' card-static">' + inner + "</div>";
  }

  function split(v) { return (v || "").split("|").map(function (x) { return x.trim(); }); }
  function numbered(m, prefix) {
    var out = [];
    for (var n = 1; n <= 9; n++) if (m[prefix + n]) out.push(split(m[prefix + n]));
    return out;
  }

  function dotline(items) {
    return '<ul class="tl">' + items.map(function (it) {
      return "<li><h4>" + inline(it[0]) + "</h4>" + (it[1] ? "<p>" + inline(it[1]) + "</p>" : "") +
        (it[2] ? '<p class="when">' + inline(it[2]) + "</p>" : "") + "</li>";
    }).join("") + "</ul>";
  }
  // Experience grouped by company: "Role | Company, City · note | years"
  function experience(items) {
    var orgs = [];
    items.forEach(function (it) {
      var parts = (it[1] || "").split(" · "), org = parts[0], note = parts.slice(1).join(" · ");
      var last = orgs[orgs.length - 1];
      if (!last || last.org !== org) { last = { org: org, roles: [] }; orgs.push(last); }
      last.roles.push([it[0], note, it[2]]);
    });
    return orgs.map(function (o) {
      var yrs = [];
      o.roles.forEach(function (r) { (r[2] || "").replace(/\d{4}/g, function (y) { yrs.push(+y); }); });
      var span = yrs.length ? Math.min.apply(null, yrs) + " – " + Math.max.apply(null, yrs) : "";
      var name = o.org.split(", ");
      return '<div class="org"><h4 class="org-name">' + inline(name[0]) + "</h4>" +
        '<p class="org-meta">' + inline(name.slice(1).join(", ")) + (span ? " · " + span : "") + "</p>" +
        dotline(o.roles) + "</div>";
    }).join("");
  }

  function timeline(items) {
    return '<ul class="timeline">' + items.map(function (it) {
      return "<li><h4>" + inline(it[0]) + "</h4>" + (it[1] ? "<p>" + inline(it[1]) + "</p>" : "") +
        (it[2] ? '<p class="when">' + inline(it[2]) + "</p>" : "") + "</li>";
    }).join("") + "</ul>";
  }

  function renderView(view) {
    return load("content/site.md").then(function (site) {
      var m = site.meta;
      var groups = view === "design"
        ? [["studies", "Studies", list(m.design_studies).concat(list(m.design_more)), "Study"],
           ["work", "Work", list(m.design_practice), "Work"]]
        : [["cases", "Case studies", list(m.product_cases), "Case study"],
           ["short", "Short reads", list(m.product_short), "Short read"]];
      groups = groups.filter(function (g) { return g[2].length; });
      var ids = [].concat.apply([], groups.map(function (g) { return g[2]; }));
      return Promise.all(ids.map(loadCase)).then(function (docs) {
        var byId = {};
        docs.forEach(function (d) { byId[d.id] = d; });
        document.title = m.name + " — " + (m[view + "_role"] || VIEWS[view].label);

        var photo = m.photo
          ? '<img src="' + assetUrl(m.photo) + '" alt="Portrait of ' + esc(m.name) + '">'
          : '<span class="photo-empty">Photo<br><small>content/images/photo.jpg · 4:5</small></span>';

        var nm = esc(m.name).split(" ");
        var avatar = m.photo ? '<span class="avatar"><img src="' + assetUrl(m.photo) + '" alt="Portrait of ' + esc(m.name) + '"></span>' : "";
        var feed = [];
        var label = {}; groups.forEach(function (g) { g[2].forEach(function (id) { label[id] = g[3]; }); });
        var featured = list(m[view + "_featured"]).filter(function (id) { return byId[id]; });
        if (!featured.length) featured = ids.slice(0, 4);
        featured.forEach(function (id) { feed.push([byId[id], label[id]]); });
        var feedHtml = feed.slice(0, 4).map(function (f, i) {
          var d = f[0], fm = d.meta, img = fm["image_" + view] || fm.image;
          return '<a class="feed-item" href="' + caseHref(d.id, view) + '"' + routeAttr({ page: "case", id: d.id, view: view }) + ">" +
            (img ? '<span class="feed-thumb"><img src="' + assetUrl(img) + '" alt=""></span>' : '<span class="feed-thumb"></span>') +
            '<span class="feed-text"><span class="micro">' + esc(f[1]) + (fm.year ? " · " + esc(fm.year) : "") + "</span>" +
            '<span class="feed-title">' + esc(fm.card_title || fm.title) + "</span></span>" +
            '<span class="feed-num">0' + (i + 1) + "</span></a>";
        }).join("");
        var cvH = m["cv_" + view];
        var hero = '<section class="hero screen wrap" id="top">' +
          '<div class="hero-text">' +
            '<p class="micro dot">' + esc(m[view + "_role"] || "") + " · " + esc(m.location || "") + "</p>" +
            '<h1 class="hero-name">' + nm[0] + " " + avatar + " " + nm.slice(1).join(" ") + "</h1>" +
            '<p class="hero-intro">' + inline(m[view + "_intro"] || "") + "</p>" +
          "</div>" +
          '<aside class="hero-feed" aria-label="Selected projects"><p class="micro dot">Selected work</p>' + feedHtml + "</aside></section>";

        var strengths = numbered(m, view + "_strength_");
        var about = '<section class="section screen about wrap" id="about">' +
          '<p class="micro dot">01 — About</p><h2 class="section-title">' + inline(m["about_title_" + view] || m.about_title || "About") + "</h2>" +
          '<div class="about-cols">' +
            '<div class="about-col"><h3 class="col-label">Profile</h3><div class="prose">' + markdown(site.body) + "</div></div>" +
            '<div class="about-col"><h3 class="col-label">Experience</h3>' + experience(numbered(m, "experience_")) + "</div>" +
            '<div class="about-col"><h3 class="col-label">Education</h3>' + dotline(numbered(m, "education_")) + "</div>" +
            '<div class="about-col"><h3 class="col-label">Languages</h3><ul class="langs">' + list(m.languages).map(function (l) {
                var mm = /^(.*?)\s*\((.*)\)$/.exec(l); return "<li><b>" + esc(mm ? mm[1] : l) + "</b>" + (mm ? "<span>" + esc(mm[2]) + "</span>" : "") + "</li>"; }).join("") + "</ul></div>" +
          "</div>" +
          (strengths.length ? '<div class="how"><h3 class="col-label">How I work</h3><ul class="strengths">' + strengths.map(function (s2) {
            return "<li><span class=\"micro\">0" + (strengths.indexOf(s2) + 1) + "</span><h4>" + inline(s2[0]) + "</h4><p>" + inline(s2[1] || "") + "</p></li>";
          }).join("") + "</ul></div>" : "") +
          "</section>";

        var tabs = []; groups.forEach(function (g) { if (!tabs.some(function (t) { return t[0] === g[0]; })) tabs.push([g[0], g[1], 0]); });
        groups.forEach(function (g) { tabs.forEach(function (t) { if (t[0] === g[0]) t[2] += g[2].length; }); });
        var chips = '<div class="chips" role="group" aria-label="Filter projects"><button class="chip" type="button" data-filter="all" aria-pressed="true">All <span>' + ids.length + "</span></button>" +
          tabs.map(function (t) { return '<button class="chip" type="button" data-filter="' + t[0] + '" aria-pressed="false">' + esc(t[1]) + " <span>" + t[2] + "</span></button>"; }).join("") + "</div>";
        var cards = groups.map(function (g) {
          return g[2].map(function (id) { return card(byId[id], view, "grid", g[3]).replace(/^<(a|div) class="card/, '<$1 data-group="' + g[0] + '" class="card'); }).join("");
        }).join("");
        var projects = '<section class="section screen projects wrap" id="projects">' +
          '<div class="screen-head"><div><p class="micro dot">02 — Projects</p><h2 class="section-title">Selected projects</h2></div>' + chips + "</div>" +
          '<div class="work-grid">' + cards + "</div>" +
          '<div class="slide-nav"><span class="slide-count" aria-live="polite"></span>' +
          '<button class="slide-btn" type="button" data-dir="-1" aria-label="Previous projects">←</button>' +
          '<button class="slide-btn" type="button" data-dir="1" aria-label="Next projects">→</button></div></section>';

        var cv = m["cv_" + view];
        var rows = [];
        if (m.email) rows.push(["Email", '<a href="mailto:' + esc(m.email) + '">' + esc(m.email) + "</a>", "mail"]);
        if (m.linkedin) rows.push(["LinkedIn", '<a href="' + esc(m.linkedin) + '" target="_blank" rel="noopener">' + esc(m.linkedin.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")) + "</a>", "out"]);
        if (cv) rows.push(["CV", '<a href="' + assetUrl(cv) + '" target="_blank" rel="noopener">Download CV (PDF)</a>', "down"]);
        if (!rows.length) rows.push(["", '<mark class="todo">Email and LinkedIn go here</mark>', ""]);
        var lk = m.linkedin ? m.linkedin.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "") : "";
        var boxes = [];
        if (m.email) boxes.push(["Email", esc(m.email), "mailto:" + esc(m.email), "↗", ""]);
        if (m.linkedin) boxes.push(["LinkedIn", esc(lk), esc(m.linkedin), "↗", ' target="_blank" rel="noopener"']);
        if (cv) boxes.push(["CV", "Download CV · PDF", assetUrl(cv), "↓", ' target="_blank" rel="noopener"']);
        var contactSec = '<section class="section screen contact" id="contact"><div class="wrap c-grid">' +
          '<div class="c-intro"><p class="micro dot">03 — Contact</p><h2 class="section-title">Let’s talk.</h2>' +
          '<p class="contact-lede">I’m looking for ' + (view === "design" ? "UX and product design" : "product management") + " roles in Berlin and across Germany.</p>" +
          '<p class="c-where">' + esc(m.location || "") + "</p></div>" +
          '<div class="c-boxes">' + boxes.map(function (b2) {
            return '<a class="c-box" href="' + b2[2] + '"' + b2[4] + '><span class="micro">' + b2[0] + '</span><span class="c-val">' + b2[1] + '</span><i aria-hidden="true">' + b2[3] + "</i></a>";
          }).join("") + "</div></div></section>";
        var foot = '<footer class="site-foot"><div class="wrap foot-row"><span>' + esc(m.name) + "</span><span>" + esc(m.location || "") + "</span></div></footer>";
        var dots = '<nav class="screen-dots" aria-label="Screens">' + ["top", "about", "projects", "contact"].map(function (id) {
          return '<a href="#' + id + '" data-dot="' + id + '"' + routeAttr({ page: "view", view: view, anchor: id }) + '><span class="sr">' + id + "</span></a>";
        }).join("") + "</nav>";
        app.innerHTML = header(site, view, false) + dots + "<main>" + hero + about + projects + contactSec.replace(/<\/section>$/, foot + "</section>") + "</main>";
      });
    });
  }

  function renderCase(r) {
    if (!r.id) return Promise.reject(new Error("No project was given in the link."));
    return Promise.all([load("content/site.md"), loadCaseFor(r.id, r.view)]).then(function (res) {
      var site = res[0], doc = res[1], m = doc.meta;
      document.title = (m.card_title || m.title) + " — " + site.meta.name;
      var meta = META_FIELDS.filter(function (f) { return m[f[0]]; }).map(function (f) {
        return "<div><dt>" + f[1] + "</dt><dd>" + inline(m[f[0]]) + "</dd></div>";
      }).join("");
      var back = '<a class="back" href="' + viewHref(r.view) + '"' + routeAttr({ page: "view", view: r.view }) + ">All projects</a>";
      app.innerHTML = header(site, r.view, true) +
        '<main class="case">' +
        '<section class="cs-hero wrap">' + back +
        (m.status === "draft" ? '<p class="draft-note">Draft. Highlighted text still needs to be filled in.</p>' : "") +
        '<p class="cs-kicker micro dot">' + esc(m.kind || "") + (m.year ? " · " + esc(m.year) : "") + "</p>" +
        '<h1 class="cs-title">' + inline(m.title || "") + "</h1>" +
        (m["summary_" + r.view] ? '<p class="cs-lede">' + inline(m["summary_" + r.view]) + "</p>" : "") +
        ((m["image_" + r.view] || m.image) ? '<figure class="cs-cover"><img src="' + assetUrl(m["image_" + r.view] || m.image) + '" alt=""></figure>' : "") +
        '<dl class="cs-meta">' + meta + "</dl>" +
        (m.note ? '<p class="cs-note">' + inline(m.note) + "</p>" : "") + "</section>" +
        '<article class="wrap cs-article">' + sections(markdown(doc.body)) + "</article>" +
        '<nav class="wrap cs-end">' + back + "</nav></main>" + contact(site, r.view);
    });
  }

  window.__renderPortfolio = render;
  render();
})();
