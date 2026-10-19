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
    window.__route = JSON.parse(a.getAttribute("data-route"));
    render();
    window.scrollTo(0, 0);
  });

  function routeAttr(r) { return bundle ? " data-route='" + esc(JSON.stringify(r)) + "'" : ""; }

  /* ---------- rendering ---------- */

  var app = document.getElementById("app");

  function render() {
    var r = currentRoute();
    var job = r.page === "case" ? renderCase(r) : renderView(r.view);
    job.catch(function (err) {
      app.innerHTML = '<main class="wrap error"><h1>This page could not load</h1><p>' + esc(err.message) +
        '</p><p><a href="' + viewHref("design") + '">Go to the portfolio</a></p></main>';
    });
  }

  function header(site, view, onCase) {
    var tabs = Object.keys(VIEWS).map(function (v) {
      var current = v === view;
      return '<a class="switch-opt" href="' + viewHref(v) + '"' + routeAttr({ page: "view", view: v }) +
        (current ? ' aria-current="page"' : "") + ">" + VIEWS[v].label + "</a>";
    }).join("");
    return '<header class="site-head"><div class="wrap head-row">' +
      '<a class="wordmark" href="' + viewHref(view) + '"' + routeAttr({ page: "view", view: view }) + ">" + esc(site.meta.name) + "</a>" +
      '<nav class="switch" aria-label="Portfolio view">' + tabs + "</nav>" +
      '<a class="head-link" href="' + (onCase ? viewHref(view) : "") + '#contact"' +
      (bundle && onCase ? " data-route='" + esc(JSON.stringify({ page: "view", view: view })) + "'" : "") + ">Contact</a>" +
      "</div></header>";
  }

  function contact(site, view) {
    var m = site.meta, rows = [];
    if (m.email) rows.push(["Email", '<a href="mailto:' + esc(m.email) + '">' + esc(m.email) + "</a>"]);
    if (m.phone) rows.push(["Phone", esc(m.phone)]);
    if (m.linkedin) rows.push(["LinkedIn", '<a href="' + esc(m.linkedin) + '" target="_blank" rel="noopener">' + esc(m.linkedin.replace(/^https?:\/\/(www\.)?/, "")) + "</a>"]);
    if (!rows.length) rows.push(["", '<mark class="todo">Email, phone and LinkedIn go here</mark>']);
    var cv = m["cv_" + view];
    return '<footer class="site-foot" id="contact"><div class="wrap foot-grid">' +
      '<div><h2 class="foot-title">Get in touch</h2><p class="foot-note">' + esc(m.location || "") + "</p></div>" +
      '<dl class="contact-list">' + rows.map(function (r) { return "<div><dt>" + r[0] + "</dt><dd>" + r[1] + "</dd></div>"; }).join("") + "</dl>" +
      (cv ? '<a class="button" href="' + assetUrl(cv) + '" target="_blank" rel="noopener">Download CV (PDF)</a>' : "") +
      "</div></footer>";
  }

  function card(doc, view, size) {
    var m = doc.meta, linked = !!doc.body;
    var title = m.card_title || m.title;
    var summary = m["summary_" + view] || "";
    var visual = m.image
      ? '<img src="' + assetUrl(m.image) + '" alt="" loading="lazy">'
      : '<span class="ph-title" aria-hidden="true">' + esc(title) + "</span>";
    var inner =
      '<div class="card-visual' + (m.image ? "" : " is-placeholder") + '">' + visual + "</div>" +
      '<div class="card-text"><p class="card-meta">' + esc(m.kind || "") + (m.year ? " <span>" + esc(m.year) + "</span>" : "") + "</p>" +
      '<h3 class="card-title">' + esc(title) + "</h3>" +
      '<p class="card-summary">' + inline(summary) + "</p>" +
      (m.status === "draft" ? '<p class="card-flag">Draft</p>' : "") + "</div>";
    return linked
      ? '<a class="card card-' + size + '" href="' + caseHref(doc.id, view) + '"' + routeAttr({ page: "case", id: doc.id, view: view }) + ">" + inner + "</a>"
      : '<div class="card card-' + size + ' card-static">' + inner + "</div>";
  }

  function group(title, note, docs, view, size) {
    if (!docs.length) return "";
    return '<section class="group"><div class="group-head"><h2 class="group-title">' + title + "</h2>" +
      (note ? '<p class="group-note">' + note + "</p>" : "") + "</div>" +
      '<div class="grid grid-' + size + '">' + docs.map(function (d) { return card(d, view, size); }).join("") + "</div></section>";
  }

  function renderView(view) {
    return load("content/site.md").then(function (site) {
      var m = site.meta;
      var groups = view === "design"
        ? [["Studies", "Projects from my MA in Visual & Experience Design", list(m.design_studies), "lg"],
           ["Design in practice", "Screens and flows I designed in my payments work", list(m.design_practice), "md"],
           ["More work", "", list(m.design_more), "sm"]]
        : [["Case studies", "", list(m.product_cases), "lg"],
           ["Short reads", "", list(m.product_short), "sm"]];
      var ids = [].concat.apply([], groups.map(function (g) { return g[2]; }));
      return Promise.all(ids.map(loadCase)).then(function (docs) {
        var byId = {};
        docs.forEach(function (d) { byId[d.id] = d; });
        document.title = m.name + " — " + VIEWS[view].label;
        app.innerHTML = header(site, view, false) +
          '<main><section class="hero wrap"><h1 class="hero-line">' + inline(m[view + "_intro"] || "") + "</h1></section>" +
          '<div class="wrap">' + groups.map(function (g) {
            return group(g[0], g[1], g[2].map(function (id) { return byId[id]; }), view, g[3]);
          }).join("") + "</div>" +
          '<section class="about wrap" id="about"><h2 class="group-title">About</h2><div class="about-body">' + markdown(site.body) + "</div></section>" +
          "</main>" + contact(site, view);
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
