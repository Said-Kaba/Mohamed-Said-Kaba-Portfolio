/* Portfolio — Mohamed Said Kaba
 * Tout le contenu vit dans /content/*.js (textes bilingues {fr, en}).
 * Ce fichier ne fait que les afficher. Voir README.md pour ajouter un projet ou un outil.
 */
(function () {
  'use strict';

  var FILES = ['site', 'profile', 'projects', 'tools', 'skills', 'education', 'videos'];
  var D = {};
  var lang = 'fr';

  function pickInitialLang() {
    try {
      var q = new URLSearchParams(location.search).get('lang');
      if (q === 'fr' || q === 'en') return q;
      var s = localStorage.getItem('lang');
      if (s === 'fr' || s === 'en') return s;
    } catch (e) {}
    return 'fr';
  }

  // Texte bilingue -> chaine ; les valeurs simples passent telles quelles
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
  function head(id, eyebrow, title, lead) {
    return [el('p', { class: 'eyebrow', text: eyebrow }), el('h2', { text: title }), lead ? el('p', { class: 'lead', text: lead }) : null];
  }
  function section(id, cls, kids) {
    return el('section', { id: id, class: cls || '' }, [el('div', { class: 'wrap' }, kids)]);
  }

  /* ---------- Sections ---------- */
  function renderHero() {
    var S = D.site, P = D.profile;
    var btns = el('div', { class: 'btns' }, [
      el('a', { class: 'btn primary hidden', id: 'cv-btn', href: '#', text: t(S.ui.cv), download: '' }),
      el('a', { class: 'btn ghost', href: '#contact', text: t(S.ui.contactCta) })
    ]);
    var stats = el('div', { class: 'stats' }, P.stats.map(function (s) {
      return el('div', { class: 'stat' }, [el('b', { text: s.value }), el('span', { text: t(s.label) })]);
    }));
    return el('section', { id: 'accueil', class: 'hero' }, [el('div', { class: 'wrap' }, [
      el('div', { class: 'hero-grid' }, [
        el('div', null, [
          el('p', { class: 'eyebrow', text: t(S.ui.heroEyebrow) }),
          el('h1', { text: S.name }),
          el('div', { class: 'role', text: t(P.role) }),
          el('p', { class: 'tagline', text: t(P.tagline) }),
          btns,
          el('div', { class: 'place', text: t(S.location) })
        ]),
        el('div', { class: 'portrait' }, [el('img', { src: S.photo, alt: S.name, width: 897, height: 1200 })])
      ]),
      stats
    ])]);
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
    return section('apropos', '', head('apropos', t(S.ui.n_apropos), t(S.ui.h_apropos)).concat([el('div', { class: 'about-grid' }, [left, tl])]));
  }

  function renderProjects() {
    var S = D.site;
    var cards = D.projects.items.map(function (p) {
      return el('article', { class: 'card' + (p.featured ? ' wide' : '') }, [
        el('div', { class: 'meta', text: [t(p.period), t(p.place)].filter(Boolean).join(' · ') }),
        el('h3', { text: t(p.title) }),
        el('div', { class: 'meta', style: 'color:var(--muted)', text: t(p.org) }),
        p.summary ? el('p', { text: t(p.summary) }) : null,
        p.points ? ul(list(p.points)) : null,
        p.image ? el('img', { src: p.image, alt: t(p.title), loading: 'lazy' }) : null,
        tags(p.tags)
      ]);
    });
    return section('projets', 'alt', head('projets', t(S.ui.n_projets), t(S.ui.h_projets), t(D.projects.intro)).concat([el('div', { class: 'cards' }, cards)]));
  }

  function renderTools() {
    var S = D.site;
    var cards = D.tools.items.map(function (x) {
      var m = x.media;
      var demo;
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
    return section('outils', 'dark', head('outils', t(S.ui.n_outils), t(S.ui.h_outils), t(D.tools.intro)).concat([el('div', { class: 'cards' }, cards)]));
  }

  function renderSkills() {
    var S = D.site;
    var g = D.skills.groups.map(function (x) {
      return el('div', { class: 'skill' }, [el('h3', { text: t(x.title) }), tags(x.items)]);
    });
    return section('competences', '', head('competences', t(S.ui.n_competences), t(S.ui.h_competences)).concat([el('div', { class: 'skills' }, g)]));
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
          return el('li', null, [t(i.title), i.meta ? el('em', { text: ' — ' + t(i.meta) }) : null]);
        }))
      ]);
    });
    return section('formation', 'alt', head('formation', t(S.ui.n_formation), t(S.ui.h_formation)).concat([
      el('div', { class: 'edu-grid' }, [
        el('div', null, [el('h3', { text: t(S.ui.h_diplomes), style: 'margin-bottom:18px' })].concat(deg)),
        el('div', null, [el('h3', { text: t(S.ui.h_certs), style: 'margin-bottom:18px' })].concat(certs))
      ])
    ]));
  }

  // Phase 2 : section vidéos/chaîne, masquée tant que videos.json a "enabled": false
  function renderVideos() {
    var V = D.videos, S = D.site;
    if (!V.enabled) return null;
    var kids = head('videos', t(S.ui.n_videos), t(V.title), t(V.intro));
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
    return section('contact', 'dark', head('contact', t(S.ui.n_contact), t(S.ui.h_contact), t(S.ui.contactLead)).concat([
      el('div', { class: 'contact-list' }, items),
      el('a', { class: 'btn primary', href: 'mailto:' + C.email + '?subject=' + encodeURIComponent(t(S.ui.mailSubject)), text: t(S.ui.writeMe) })
    ]));
  }

  /* ---------- Assemblage ---------- */
  var RENDER = { accueil: renderHero, apropos: renderAbout, projets: renderProjects, outils: renderTools, competences: renderSkills, formation: renderEducation, videos: renderVideos, contact: renderContact };

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
    document.querySelectorAll('.lang button').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.lang === lang)); });
    document.getElementById('footer-text').textContent = '© ' + new Date().getFullYear() + ' ' + S.name + ' — ' + t(S.ui.footer);
    document.getElementById('footer-top').textContent = t(S.ui.top) + ' ↑';
    checkCv();
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

  function observeNav() {
    var links = document.querySelectorAll('.nav a');
    if (!('IntersectionObserver' in window)) return;
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) links.forEach(function (a) { a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id); });
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    document.querySelectorAll('main section[id]').forEach(function (s) { io.observe(s); });
  }

  function init() {
    lang = pickInitialLang();
    try {
      FILES.forEach(function (f) { if (!window.SITE || !window.SITE[f]) throw new Error('content/' + f + '.js'); D[f] = window.SITE[f]; });
      render();
      observeNav();
      if (location.hash) { var h = document.querySelector(location.hash); if (h) h.scrollIntoView(); }
    } catch (e) {
      document.getElementById('app').innerHTML = '<p class="wrap" style="padding:4rem 0">Impossible de charger le contenu (' + e.message + ').</p>';
    }
    document.querySelectorAll('.lang button').forEach(function (b) { b.addEventListener('click', function () { setLang(b.dataset.lang); }); });
    var burger = document.getElementById('burger'), nav = document.getElementById('nav');
    burger.addEventListener('click', function () { var o = nav.classList.toggle('open'); burger.setAttribute('aria-expanded', String(o)); });
    nav.addEventListener('click', function (e) { if (e.target.tagName === 'A') { nav.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); } });
  }
  init();
})();
