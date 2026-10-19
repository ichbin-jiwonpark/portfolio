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
    var parts = html.split(/(?=<h2>)/);
    return parts.map(function (part) {
      var m = /^<h2>([\s\S]*?)<\/h2>/.exec(part);
      if (!m) return part.trim() ? '<section class="cs-section"><div class="cs-body">' + part + "</div></section>" : "";
      var id = m[1].replace(/<[^>]+>/g, "").toLowerCase().replace(/&amp;/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      return '<section class="cs-section" id="' + id + '"><h2 class="cs-label">' + m[1] + '</h2><div class="cs-body">' +
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
    observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        links.forEach(function (l) { l.classList.toggle("is-current", l.getAttribute("data-sec") === en.target.id); });
      });
    }, { rootMargin: "-40% 0px -55% 0px" });
    ["top", "about", "projects", "contact"].forEach(function (id) { var el = document.getElementById(id); if (el) observer.observe(el); });
    revealer = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("is-in"); revealer.unobserve(en.target); } });
    }, { rootMargin: "0px 0px -10% 0px" });
    [].slice.call(document.querySelectorAll(".section")).forEach(function (el) { revealer.observe(el); });
  }

  function setupFilters() {
    var chips = [].slice.call(document.querySelectorAll(".chip"));
    var cards = [].slice.call(document.querySelectorAll(".work-grid .card"));
    chips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        var f = chip.getAttribute("data-filter");
        chips.forEach(function (c) { c.setAttribute("aria-pressed", String(c === chip)); });
        cards.forEach(function (c) { c.hidden = f !== "all" && c.getAttribute("data-group") !== f; });
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
    var visual = m.image
      ? '<img src="' + assetUrl(m.image) + '" alt="" loading="lazy">'
      : '<span class="ph-title" aria-hidden="true">' + esc(title) + "</span>";
    var inner =
      '<div class="card-visual' + (m.image ? "" : " is-placeholder") + '">' + visual + "</div>" +
      '<div class="card-text"><p class="card-meta">' + (groupLabel ? '<b>' + esc(groupLabel) + "</b>" : "") + esc(m.kind || "") + (m.year ? " <span>" + esc(m.year) + "</span>" : "") + "</p>" +
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
        ? [["studies", "Studies", list(m.design_studies)],
           ["practice", "Design in practice", list(m.design_practice)],
           ["more", "More work", list(m.design_more)]]
        : [["cases", "Case studies", list(m.product_cases)],
           ["short", "Short reads", list(m.product_short)]];
      groups = groups.filter(function (g) { return g[2].length; });
      var ids = [].concat.apply([], groups.map(function (g) { return g[2]; }));
      return Promise.all(ids.map(loadCase)).then(function (docs) {
        var byId = {};
        docs.forEach(function (d) { byId[d.id] = d; });
        document.title = m.name + " — " + (m[view + "_role"] || VIEWS[view].label);

        var photo = m.photo
          ? '<img src="' + assetUrl(m.photo) + '" alt="Portrait of ' + esc(m.name) + '">'
          : '<span class="photo-empty">Photo<br><small>content/images/photo.jpg · 4:5</small></span>';

        var hero = '<section class="hero wrap" id="top">' +
          '<div class="hero-text">' +
            '<h1 class="hero-name">' + esc(m.name) + "</h1>" +
            '<p class="hero-role">' + esc(m[view + "_role"] || "") + "</p>" +
            '<p class="hero-intro">' + inline(m[view + "_intro"] || "") + "</p>" +
            '<a class="button" href="#projects"' + routeAttr({ page: "view", view: view, anchor: "projects" }) + ">View projects</a>" +
          "</div>" +
          '<div class="hero-visual"><figure class="photo' + (m.photo ? "" : " is-empty") + '">' + photo + "</figure></div></section>";

        var strengths = numbered(m, view + "_strength_");
        var about = '<section class="section about wrap" id="about">' +
          '<h2 class="section-title">' + inline(m.about_title || "About") + "</h2>" +
          '<div class="about-cols">' +
            '<div class="about-col"><h3 class="col-label">Profile</h3><div class="prose">' + markdown(site.body) + "</div></div>" +
            '<div class="about-col"><h3 class="col-label">Experience</h3>' + timeline(numbered(m, "experience_")) +
              '<h3 class="col-label">Languages</h3><p class="langs">' + list(m.languages).map(esc).join('<span aria-hidden="true"> · </span>') + "</p></div>" +
            '<div class="about-col"><h3 class="col-label">Education</h3>' + timeline(numbered(m, "education_")) + "</div>" +
          "</div>" +
          (strengths.length ? '<div class="how"><h3 class="col-label">How I work</h3><ul class="strengths">' + strengths.map(function (s2) {
            return "<li><h4>" + inline(s2[0]) + "</h4><p>" + inline(s2[1] || "") + "</p></li>";
          }).join("") + "</ul></div>" : "") +
          "</section>";

        var chips = groups.length > 1
          ? '<div class="chips" role="group" aria-label="Filter projects"><button class="chip" type="button" data-filter="all" aria-pressed="true">All</button>' +
            groups.map(function (g) { return '<button class="chip" type="button" data-filter="' + g[0] + '" aria-pressed="false">' + esc(g[1]) + "</button>"; }).join("") + "</div>"
          : "";
        var cards = groups.map(function (g) {
          return g[2].map(function (id) { return card(byId[id], view, "grid", g[1]).replace(/^<(a|div) class="card/, '<$1 data-group="' + g[0] + '" class="card'); }).join("");
        }).join("");
        var projects = '<section class="section projects wrap" id="projects">' +
          '<h2 class="section-title">Projects</h2>' + chips + '<div class="work-grid">' + cards + "</div></section>";

        var cv = m["cv_" + view];
        var rows = [];
        if (m.email) rows.push(["Email", '<a href="mailto:' + esc(m.email) + '">' + esc(m.email) + "</a>", "mail"]);
        if (m.linkedin) rows.push(["LinkedIn", '<a href="' + esc(m.linkedin) + '" target="_blank" rel="noopener">' + esc(m.linkedin.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")) + "</a>", "out"]);
        if (cv) rows.push(["CV", '<a href="' + assetUrl(cv) + '" target="_blank" rel="noopener">Download CV (PDF)</a>', "down"]);
        if (!rows.length) rows.push(["", '<mark class="todo">Email and LinkedIn go here</mark>', ""]);
        var contactSec = '<section class="section contact" id="contact"><div class="wrap contact-grid">' +
          '<div><h2 class="section-title">Let’s talk.</h2><p class="contact-lede">I’m looking for ' +
          (view === "design" ? "UX and product design" : "product management") + " roles in Berlin and across Germany.</p></div>" +
          '<ul class="contact-rows">' + rows.map(function (r2) {
            return '<li class="icon-' + r2[2] + '"><span class="row-label">' + r2[0] + "</span>" + r2[1] + "</li>";
          }).join("") + "</ul></div></section>";

        app.innerHTML = header(site, view, false) + "<main>" + hero + about + projects + contactSec + "</main>" +
          '<footer class="site-foot"><div class="wrap foot-row"><span>' + esc(m.name) + "</span><span>" + esc(m.location || "") + "</span></div></footer>";
      });
    });
  }

  function renderCase(r) {
    if (!r.id) return Promise.reject(new Error("No project was given in the link."));
    return Promise.all([load("content/site.md"), loadCase(r.id)]).then(function (res) {
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
        '<p class="cs-kicker">' + esc(m.kind || "") + (m.year ? " <span>" + esc(m.year) + "</span>" : "") + "</p>" +
        '<h1 class="cs-title">' + inline(m.title || "") + "</h1>" +
        (m["summary_" + r.view] ? '<p class="cs-lede">' + inline(m["summary_" + r.view]) + "</p>" : "") +
        (m.image ? '<figure class="cs-cover"><img src="' + assetUrl(m.image) + '" alt=""></figure>' : "") +
        '<dl class="cs-meta">' + meta + "</dl></section>" +
        '<article class="wrap cs-article">' + sections(markdown(doc.body)) + "</article>" +
        '<nav class="wrap cs-end">' + back + "</nav></main>" + contact(site, r.view);
    });
  }

  window.__renderPortfolio = render;
  render();
})();
