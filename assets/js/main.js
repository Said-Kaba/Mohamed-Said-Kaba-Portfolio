/* Portfolio : Mohamed Said Kaba
 * Tout le contenu vit dans /content/*.js (textes bilingues {fr, en}).
 * Ce fichier ne fait que l'afficher. Voir README.md pour ajouter un projet ou un outil.
 * Le titre de l'onglet se change dans la balise <title> de index.html.
 */
(function () {
  'use strict';

  var FILES = ['site', 'profile', 'projects', 'tools', 'skills', 'education', 'videos'];
  var D = {};
  var lang = 'fr';
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Icônes (traits fins, couleur = currentColor) ---------- */
  var ICONS = {
    plant: '<path d="M4 40V22l8 5v-5l8 5V10h6v30M2 40h44M30 18h8v22"/><path d="M14 40v-6M22 40v-6"/>',
    doc: '<path d="M12 4h16l8 8v32H12z"/><path d="M28 4v8h8M17 22h14M17 28h14M17 34h9"/>',
    building: '<path d="M10 44V10l14-6 14 6v34M6 44h36"/><path d="M17 16h4M27 16h4M17 23h4M27 23h4M17 30h4M27 30h4M21 44v-7h6v7"/>',
    gear: '<circle cx="24" cy="24" r="6"/><path d="M24 4v6M24 38v6M4 24h6M38 24h6M9.9 9.9l4.2 4.2M33.9 33.9l4.2 4.2M9.9 38.1l4.2-4.2M33.9 14.1l4.2-4.2"/>',
    calc: '<path d="M6 40 24 8l18 32z"/><path d="M6 40h36M24 8v32M15 24h18"/>',
    cube: '<path d="M24 4 42 14v20L24 44 6 34V14z"/><path d="M6 14l18 10 18-10M24 24v20"/>',
    code: '<path d="M16 14 6 24l10 10M32 14l10 10-10 10M27 10 21 38"/>',
    people: '<circle cx="17" cy="15" r="6"/><circle cx="33" cy="17" r="5"/><path d="M5 40c0-8 5-13 12-13s12 5 12 13M30 28c7 0 13 4 13 12"/>',
    pin: '<path d="M24 44S10 30 10 20a14 14 0 0 1 28 0c0 10-14 24-14 24z"/><circle cx="24" cy="20" r="5"/>',
    arrow: '<path d="M6 24h34M28 12l12 12-12 12"/>'
  };
  function icon(name, cls) {
    var s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    s.setAttribute('viewBox', '0 0 48 48');
    s.setAttribute('fill', 'none');
    s.setAttribute('stroke', 'currentColor');
    s.setAttribute('stroke-width', '2');
    s.setAttribute('stroke-linecap', 'round');
    s.setAttribute('stroke-linejoin', 'round');
    s.setAttribute('aria-hidden', 'true');
    s.setAttribute('class', 'ico ' + (cls || ''));
    s.innerHTML = ICONS[name] || '';
    return s;
  }

  // Treillis décoratif (dessin technique générique, sans rapport avec un projet réel)
  function trussSVG() {
    var ns = 'http://www.w3.org/2000/svg';
    var s = document.createElementNS(ns, 'svg');
    s.setAttribute('viewBox', '0 0 600 260');
    s.setAttribute('class', 'truss');
    s.setAttribute('aria-hidden', 'true');
    var d = '', n = 8, w = 560, x0 = 20, top = 40, bot = 200, i;
    d += 'M' + x0 + ' ' + bot + 'H' + (x0 + w) + 'M' + x0 + ' ' + top + 'H' + (x0 + w);
    for (i = 0; i <= n; i++) {
      var x = x0 + (w / n) * i;
      d += 'M' + x + ' ' + top + 'V' + bot;
      if (i < n) d += 'M' + x + ' ' + (i % 2 ? top : bot) + 'L' + (x + w / n) + ' ' + (i % 2 ? bot : top);
    }
    d += 'M' + x0 + ' 232H' + (x0 + w) + 'M' + x0 + ' 224V240M' + (x0 + w) + ' 224V240';
    var p = document.createElementNS(ns, 'path');
    p.setAttribute('d', d);
    s.appendChild(p);
    return s;
  }

  /* ---------- Utilitaires ---------- */
  function pickInitialLang() {
    try {
      var q = new URLSearchParams(location.search).get('lang');
      if (q === 'fr' || q === 'en') return q;
      var s = localStorage.getItem('lang');
      if (s === 'fr' || s === 'en') return s;
    } catch (e) {}
    return 'fr';
  }
  function t(v) {
    if (v == null) return '';
    if (typeof v === 'string') return v;
    return v[lang] != null ? v[lang] : (v.fr || '');
  }
  function list(v) {
    if (!v) return [];
    return Array.isArray(v) ? v : (v[lang] || v.fr || []);
  }
  function el(tag, attrs, children) {
    var n = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      if (k === 'class') n.className = attrs[k];
      else if (k === 'text') n.textContent = attrs[k];
      else if (attrs[k] !== false && attrs[k] != null) n.setAttribute(k, attrs[k]);
    });
    (children || []).forEach(function (c) { if (c) n.appendChild(typeof c === 'string' ? document.createTextNode(c) : c); });
    return n;
  }
  function ul(items) { return el('ul', null, items.map(function (i) { return el('li', { text: i }); })); }
  function tags(items) { return el('div', { class: 'tags' }, (items || []).map(function (i) { return el('span', { class: 'tag', text: i }); })); }

  // Titre de section : le dernier mot est mis en valeur (or)
  function accentTitle(text) {
    var i = text.lastIndexOf(' ');
    if (i < 0) return el('h2', { text: text });
    return el('h2', null, [text.slice(0, i + 1), el('em', { class: 'accent', text: text.slice(i + 1) })]);
  }
  function head(eyebrow, title, lead) {
    return [el('p', { class: 'eyebrow', text: eyebrow }), accentTitle(title), lead ? el('p', { class: 'lead', text: lead }) : null];
  }
  function section(id, cls, kids) {
    return el('section', { id: id, class: cls || '' }, [el('div', { class: 'wrap' }, kids)]);
  }

  /* ---------- Sections ---------- */
  function renderHero() {
    var S = D.site, P = D.profile, H = P.hero || {};
    var nameParts = S.name.split(' ');
    var last = nameParts.pop();
    var first = nameParts.join(' ');

    var btns = el('div', { class: 'btns' }, [
      el('a', { class: 'btn primary', href: '#contact' }, [t(S.ui.contactCta), icon('arrow', 'btn-ico')]),
      el('a', { class: 'btn ghost', href: '#projets', text: t(S.ui.seeWork) }),
      el('a', { class: 'btn ghost hidden', id: 'cv-btn', href: '#', text: t(S.ui.cv), download: '' })
    ]);

    var text = el('div', { class: 'hero-text' }, [
      el('p', { class: 'eyebrow', text: t(S.ui.heroEyebrow) }),
      el('h1', null, [el('span', { class: 'n1', text: first }), el('span', { class: 'n2', text: last })]),
      el('div', { class: 'role', text: t(P.role) }),
      el('div', { class: 'rule' }),
      el('p', { class: 'tagline', text: t(P.tagline) }),
      btns
    ]);

    var chips = el('ul', { class: 'chips' }, (H.chips || []).map(function (c) {
      return el('li', null, [el('b', { text: t(c.title) }), el('span', { text: t(c.sub) })]);
    }));
    var visual = el('div', { class: 'hero-visual' }, [
      el('div', { class: 'panel' }, [trussSVG()]),
      el('svg', { class: 'diag', viewBox: '0 0 100 100', preserveAspectRatio: 'none', 'aria-hidden': 'true' }),
      el('img', { class: 'cutout', src: 'assets/img/hero-cutout.webp', alt: S.name, width: 662, height: 1100 }),
      chips
    ]);
    // le trait diagonal doré (SVG : créé avec le bon espace de noms)
    var diag = visual.querySelector('.diag');
    var repl = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    repl.setAttribute('class', 'diag'); repl.setAttribute('viewBox', '0 0 100 100'); repl.setAttribute('preserveAspectRatio', 'none'); repl.setAttribute('aria-hidden', 'true');
    repl.innerHTML = '<line x1="22" y1="0" x2="0" y2="100" vector-effect="non-scaling-stroke"/>';
    visual.replaceChild(repl, diag);

    var stats = el('div', { class: 'stats' }, P.stats.map(function (s) {
      return el('div', { class: 'stat' }, [
        icon(s.icon || 'gear', 'stat-ico'),
        el('b', { text: s.value, 'data-count': s.value }),
        el('span', { text: t(s.label) })
      ]);
    }));

    var sig = list(H.signature);
    var band = el('div', { class: 'band' }, [el('div', { class: 'wrap band-inner' }, (H.band || []).map(function (b) {
      return el('div', { class: 'band-item' }, [icon(b.icon, 'band-ico'), el('div', null, [el('b', { text: t(b.title) }), el('span', { text: t(b.sub) })])]);
    }).concat(sig.length ? [el('div', { class: 'signature' }, sig.map(function (l) { return el('span', { text: l }); }))] : []))]);

    return el('section', { id: 'accueil', class: 'hero' }, [
      el('div', { class: 'hero-bg', 'aria-hidden': 'true' }),
      el('div', { class: 'wrap' }, [el('div', { class: 'hero-grid' }, [text, visual]), stats]),
      band
    ]);
  }

  function renderAbout() {
    var P = D.profile, S = D.site;
    var left = el('div', null, list(P.about).map(function (p) { return el('p', { text: p }); }));
    var tl = el('ol', { class: 'timeline' }, P.timeline.map(function (i) {
      return el('li', null, [
        el('div', { class: 'when', text: t(i.when) }),
        el('div', { class: 'what', text: t(i.what) }),
        el('div', { class: 'where', text: t(i.where) })
      ]);
    }));
    return section('apropos', '', head(t(S.ui.n_apropos), t(S.ui.h_apropos)).concat([el('div', { class: 'about-grid' }, [left, tl])]));
  }

  function renderProjects() {
    var S = D.site;
    var cards = D.projects.items.map(function (p) {
      return el('article', { class: 'card' + (p.featured ? ' wide' : '') }, [
        el('div', { class: 'meta', text: [t(p.period), t(p.place)].filter(Boolean).join(' · ') }),
        el('h3', { text: t(p.title) }),
        el('div', { class: 'org', text: t(p.org) }),
        p.summary ? el('p', { text: t(p.summary) }) : null,
        p.points ? ul(list(p.points)) : null,
        p.image ? el('img', { src: p.image, alt: t(p.title), loading: 'lazy' }) : null,
        tags(p.tags)
      ]);
    });
    return section('projets', 'alt', head(t(S.ui.n_projets), t(S.ui.h_projets), t(D.projects.intro)).concat([el('div', { class: 'cards' }, cards)]));
  }

  function renderTools() {
    var S = D.site;
    var cards = D.tools.items.map(function (x) {
      var m = x.media, demo;
      if (m && m.type === 'video') demo = el('div', { class: 'demo' }, [el('video', { src: m.src, controls: '', preload: 'metadata', poster: m.poster || false })]);
      else if (m && m.src) demo = el('div', { class: 'demo' }, [el('img', { src: m.src, alt: t(m.alt) || t(x.name), loading: 'lazy' })]);
      else demo = el('div', { class: 'demo', text: t(S.ui.demoSoon) });
      return el('article', { class: 'card' }, [
        el('div', { class: 'meta', text: t(x.org) }),
        el('h3', { text: t(x.name) }),
        x.badge ? el('span', { class: 'badge', text: t(x.badge) }) : null,
        el('p', { text: t(x.summary) }),
        x.points ? ul(list(x.points)) : null,
        demo,
        tags(x.stack)
      ]);
    });
    return section('outils', 'dark', head(t(S.ui.n_outils), t(S.ui.h_outils), t(D.tools.intro)).concat([el('div', { class: 'cards' }, cards)]));
  }

  function renderSkills() {
    var S = D.site;
    var g = D.skills.groups.map(function (x) {
      return el('div', { class: 'skill' }, [el('h3', { text: t(x.title) }), tags(x.items)]);
    });
    return section('competences', '', head(t(S.ui.n_competences), t(S.ui.h_competences)).concat([el('div', { class: 'skills' }, g)]));
  }

  function renderEducation() {
    var S = D.site, E = D.education;
    var deg = E.degrees.map(function (d) {
      return el('div', { class: 'edu-item' }, [
        el('b', { text: t(d.title) }),
        el('div', { class: 'sub', text: [t(d.school), t(d.year)].filter(Boolean).join(' · ') }),
        d.detail ? el('p', { text: t(d.detail) }) : null
      ]);
    });
    var certs = E.certifications.map(function (c) {
      return el('div', { class: 'cert-group' }, [
        el('h3', { text: t(c.group) }),
        el('ul', null, c.items.map(function (i) {
          return el('li', null, [t(i.title), i.meta ? el('em', { text: ' : ' + t(i.meta) }) : null]);
        }))
      ]);
    });
    return section('formation', 'alt', head(t(S.ui.n_formation), t(S.ui.h_formation)).concat([
      el('div', { class: 'edu-grid' }, [
        el('div', null, [el('h3', { text: t(S.ui.h_diplomes), style: 'margin-bottom:18px' })].concat(deg)),
        el('div', null, [el('h3', { text: t(S.ui.h_certs), style: 'margin-bottom:18px' })].concat(certs))
      ])
    ]));
  }

  // Phase 2 : section vidéos/chaîne, masquée tant que videos.js a "enabled": false
  function renderVideos() {
    var V = D.videos, S = D.site;
    if (!V.enabled) return null;
    var kids = head(t(S.ui.n_videos), t(V.title), t(V.intro));
    if (V.channelUrl) kids.push(el('p', null, [el('a', { class: 'btn primary', href: V.channelUrl, target: '_blank', rel: 'noopener', text: t(S.ui.channel) })]));
    kids.push(el('div', { class: 'cards' }, (V.items || []).map(function (v) {
      return el('article', { class: 'card' }, [el('h3', { text: t(v.title) }), el('a', { href: v.url, target: '_blank', rel: 'noopener', text: t(S.ui.watch) })]);
    })));
    return section('videos', '', kids);
  }

  function renderContact() {
    var S = D.site, C = S.contact;
    function item(label, text, href, ext) {
      return el('a', { href: href, target: ext ? '_blank' : false, rel: ext ? 'noopener' : false }, [el('small', { text: label }), text]);
    }
    var items = [
      item('Email', C.email, 'mailto:' + C.email),
      item(t(S.ui.phone), C.phone, 'tel:' + C.phone.replace(/\s/g, '')),
      item('LinkedIn', C.linkedinLabel, C.linkedin, true)
    ];
    if (C.github) items.push(item('GitHub', C.githubLabel, C.github, true));
    return section('contact', 'dark', head(t(S.ui.n_contact), t(S.ui.h_contact), t(S.ui.contactLead)).concat([
      el('div', { class: 'contact-list' }, items),
      el('a', { class: 'btn primary', href: 'mailto:' + C.email + '?subject=' + encodeURIComponent(t(S.ui.mailSubject)) }, [t(S.ui.writeMe), icon('arrow', 'btn-ico')])
    ]));
  }

  /* ---------- Assemblage ---------- */
  var RENDER = { accueil: renderHero, apropos: renderAbout, projets: renderProjects, outils: renderTools, competences: renderSkills, formation: renderEducation, videos: renderVideos, contact: renderContact };

  var io = null;
  function reveal() {
    var els = document.querySelectorAll('.card, .skill, .edu-item, .cert-group, .timeline li, .contact-list a, .about-grid p');
    if (reduce || !('IntersectionObserver' in window)) return;
    if (io) io.disconnect();
    io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    els.forEach(function (n, i) { n.classList.add('reveal'); n.style.setProperty('--d', (i % 4) * 70 + 'ms'); io.observe(n); });
  }

  function countUp() {
    document.querySelectorAll('[data-count]').forEach(function (n) {
      var raw = n.getAttribute('data-count'), m = raw.match(/^(\d+)(.*)$/);
      if (!m || reduce) return;
      var target = +m[1], suffix = m[2], t0 = null;
      function step(ts) {
        if (t0 === null) t0 = ts;
        var p = Math.min((ts - t0) / 1100, 1), v = Math.round(target * (1 - Math.pow(1 - p, 3)));
        n.textContent = v + suffix;
        if (p < 1) requestAnimationFrame(step);
      }
      n.textContent = '0' + suffix;
      requestAnimationFrame(step);
    });
  }

  function render() {
    document.documentElement.lang = lang;
    var S = D.site, app = document.getElementById('app');
    app.textContent = '';
    var nav = document.getElementById('nav');
    nav.textContent = '';
    S.sections.forEach(function (s) {
      if (s.enabled === false) return;
      var node = RENDER[s.id] && RENDER[s.id]();
      if (!node) return;
      app.appendChild(node);
      if (s.id !== 'accueil') nav.appendChild(el('a', { href: '#' + s.id, text: t(s.label) }));
    });
    var place = document.getElementById('place');
    place.textContent = '';
    place.appendChild(icon('pin', 'place-ico'));
    place.appendChild(el('span', { text: t(S.location) }));
    document.querySelectorAll('.lang button').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.lang === lang)); });
    document.getElementById('footer-text').textContent = '© ' + new Date().getFullYear() + ' ' + S.name + ' · ' + t(S.ui.footer);
    document.getElementById('footer-top').textContent = t(S.ui.top) + ' ↑';
    checkCv();
    reveal();
    countUp();
    observeNav();
  }

  // Le bouton CV n'apparait que si le PDF existe dans /cv/
  function checkCv() {
    var btn = document.getElementById('cv-btn');
    if (!btn) return;
    var path = D.site.cv[lang] || D.site.cv.fr;
    fetch(path, { method: 'HEAD' }).then(function (r) {
      if (r.ok) { btn.href = path; btn.classList.remove('hidden'); }
    }).catch(function () {});
  }

  function setLang(l) {
    lang = l;
    try { localStorage.setItem('lang', l); } catch (e) {}
    render();
  }

  var navIO = null;
  function observeNav() {
    var links = document.querySelectorAll('.nav a');
    if (!('IntersectionObserver' in window)) return;
    if (navIO) navIO.disconnect();
    navIO = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) links.forEach(function (a) { a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id); });
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    document.querySelectorAll('main section[id]').forEach(function (s) { navIO.observe(s); });
  }

  function init() {
    lang = pickInitialLang();
    try {
      FILES.forEach(function (f) { if (!window.SITE || !window.SITE[f]) throw new Error('content/' + f + '.js'); D[f] = window.SITE[f]; });
      render();
      if (location.hash) { var h = document.querySelector(location.hash); if (h) h.scrollIntoView(); }
    } catch (e) {
      document.getElementById('app').innerHTML = '<p class="wrap" style="padding:4rem 0">Impossible de charger le contenu (' + e.message + ').</p>';
    }
    document.querySelectorAll('.lang button').forEach(function (b) { b.addEventListener('click', function () { setLang(b.dataset.lang); }); });
    var burger = document.getElementById('burger'), nav = document.getElementById('nav');
    burger.addEventListener('click', function () { var o = nav.classList.toggle('open'); burger.setAttribute('aria-expanded', String(o)); });
    nav.addEventListener('click', function (e) { if (e.target.tagName === 'A') { nav.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); } });
    var bar = document.getElementById('top');
    function onScroll() { bar.classList.toggle('scrolled', window.scrollY > 24); }
    window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  }
  init();
})();
