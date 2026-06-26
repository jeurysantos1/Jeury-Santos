/* ============================================================
   jeury.agent — a tiny chat-style AI-persona widget
   Usage:
     <link rel="stylesheet" href="agent.css">
     <script src="agent.js"></script>
     <script>JeuryAgent.init({ renderDock:false, triggerSelector:'#dock-agent' });</script>
   API: JeuryAgent.open() / .close() / .toggle() / .say(text)
   ============================================================ */
(function (global) {
  'use strict';

  var DEFAULTS = {
    name: 'jeury.agent',
    tooltip: "Hi! I'm Jeury — well, his AI agent ✦",
    greeting: "Hey 👋 I'm Jeury's AI agent — a stand-in he prototyped. Ask me about his work, his process, his toolkit, or how to reach him. What do you need?",
    chips: [
      { q: 'What does Jeury ship?' },
      { q: 'His design process?' },
      { q: 'Skills & tools' },
      { label: '✉ Email Jeury', href: 'https://mail.google.com/mail/?view=cm&fs=1&to=jeurysantos1@gmail.com' }
    ],
    typingSpeedMs: 11,
    nudgeAfterMs: 6000,
    renderDock: true,
    dockLinks: [],
    triggerSelector: null
  };

  /* ---- knowledge base: first matching keyword wins (order = priority) ---- */
  var KB = [
    { k:['connect deal','reporting','dashboard'], a:"Connect Deals — Jeury redesigned Google's internal deal-reporting tab from a dense data table into an insight-driven dashboard. It saved the sales org an estimated 12,000 hours a year. 🔒 The full case study is password-gated — ask him for the code." },
    { k:['pixel','tablet'], a:"On the Google Pixel Tablet team he flattened a 300+ page settings hierarchy into a discoverable, two-pane experience — 25% less time on task and 20% higher task success — plus a notification-severity system." },
    { k:['royal','caribbean','cruise','design system','design-system'], a:"For Royal Caribbean he evolved a legacy design system into a modern, scalable, multi-brand system — owning core components end to end in Figma → Storybook, with governance and accessibility baked into the workflow." },
    { k:['google'], a:"Two things at Google: Connect Deals (reporting dashboards, ~12k hrs/yr saved) and the Pixel Tablet (settings UX). Want either in detail?" },
    { k:['ship','build','project','portfolio','case stud','work','experience','done'], a:"Recent work: Google Connect Deals (insight dashboards), Google Pixel Tablet (settings UX), and Royal Caribbean's e-commerce design system. They're all on this site — a couple are password-gated 🔒." },
    { k:['process','how do','how does','approach','method','workflow'], a:"His process: research accelerated by AI → many approaches pressure-tested against UX patterns → pixel-perfect craft → native-grade prototypes. Evidence first, prototypes early." },
    { k:['ai','agent','automat'], a:"Jeury leans on AI agents across the whole process — running discovery, generating multiple directions, even building prototypes. (Hi — that's literally me. 👋)" },
    { k:['prototyp','protopie','principle'], a:"Prototyping is his thing — ProtoPie, Figma, and code, from discovery through usability testing. You're inside one of his prototypes right now, actually." },
    { k:['skill','tool','figma','software','stack','tech'], a:"Toolkit: Figma, FigJam, Framer, Sketch, Adobe CS, ProtoPie, HTML/CSS, JavaScript, Python, and Claude Code. Methods: research, IA, journey mapping, design strategy, and prototyping." },
    { k:['contact','reach','hire','email','connect with','talk','get in touch','available','freelanc'], a:"Easiest way is email: <a href=\"https://mail.google.com/mail/?view=cm&fs=1&to=jeurysantos1@gmail.com\" target=\"_blank\" rel=\"noopener\">jeurysantos1@gmail.com</a> — or find him on LinkedIn. Tap “✉ Email Jeury” below to open a draft." },
    { k:['resume','cv','résumé'], a:"His résumé is one click away — there's a Résumé link in the nav up top (or on the homepage)." },
    { k:['fun','fact','hobby','interesting'], a:"Fun fact: Jeury was a flight attendant before design — he ran usability tests on hospitality at 35,000 ft before ever opening Figma. ✈️" },
    { k:['education','study','school','degree','college','university'], a:"He's got a B.S. in Computer Science (SNHU) and a B.S. in Business Administration, plus Google's UX Design certification." },
    { k:['where','based','location','live','nj','jersey'], a:"He's based in Union, NJ." },
    { k:['who','about you','about jeury','yourself','tell me about'], a:"I'm Jeury's AI agent — a stand-in he prototyped. He's a product designer who turns complex, high-stakes systems into experiences that feel obvious. Ask me about his work or process!" },
    { k:['hi','hey','hello','yo ','sup','howdy'], a:"Hey! 👋 Ask me about Jeury's work, his process, his toolkit, or how to reach him." },
    { k:['thank','thx','ty '], a:"Anytime! Anything else you want to know about Jeury?" },
    { k:['nice','cool','awesome','love','great','impressive','wow'], a:"Right? He'll be glad you think so. Want to see the work, or get in touch?" }
  ];
  var FALLBACK = "I can talk about Jeury's work (Google, Royal Caribbean), his design process, his toolkit, or how to reach him. What are you curious about?";

  function reply(t) {
    t = (' ' + (t || '').toLowerCase() + ' ');
    for (var i = 0; i < KB.length; i++)
      for (var j = 0; j < KB[i].k.length; j++)
        if (t.indexOf(KB[i].k[j]) >= 0) return KB[i].a;
    return FALLBACK;
  }

  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }
  function svg() {
    return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l1.9 5.7a2 2 0 0 0 1.3 1.3l5.7 1.9-5.7 1.9a2 2 0 0 0-1.3 1.3L12 21l-1.9-5.7a2 2 0 0 0-1.3-1.3L3 12l5.7-1.9a2 2 0 0 0 1.3-1.3L12 3z"/></svg>';
  }

  var JeuryAgent = {
    _cfg: null, _panel: null, _thread: null, _input: null, _trigger: null,
    _typeTimer: null, _greeted: false,

    init: function (userCfg) {
      var cfg = Object.assign({}, DEFAULTS, userCfg || {});
      this._cfg = cfg;
      this._buildPanel(cfg);
      if (cfg.renderDock) this._buildDock(cfg);
      else if (cfg.triggerSelector) {
        this._trigger = document.querySelector(cfg.triggerSelector);
        if (this._trigger) this._trigger.addEventListener('click', this.toggle.bind(this));
      }
      document.addEventListener('click', this._onOutside.bind(this));
      document.addEventListener('keydown', function (e) { if (e.key === 'Escape') JeuryAgent.close(); });
      if (cfg.nudgeAfterMs > 0 && this._trigger) {
        var t = this._trigger;
        setTimeout(function () { t.classList.add('ja-nudge'); setTimeout(function () { t.classList.remove('ja-nudge'); }, 1000); }, cfg.nudgeAfterMs);
      }
      return this;
    },

    _buildDock: function (cfg) {
      var dock = el('div', 'ja-dock');
      var btn = el('button', 'ja-dock-btn', svg() + '<span class="ja-tip">' + cfg.tooltip + '</span>');
      btn.setAttribute('aria-label', 'Chat with ' + cfg.name);
      btn.addEventListener('click', this.toggle.bind(this));
      dock.appendChild(btn);
      this._trigger = btn;
      document.body.appendChild(dock);
    },

    _buildPanel: function (cfg) {
      var p = el('div', 'ja-panel');
      p.setAttribute('role', 'dialog');
      p.setAttribute('aria-label', cfg.name);
      p.innerHTML =
        '<div class="ja-head">' +
          '<span class="ja-ava">✦</span>' +
          '<span class="ja-htext"><span class="ja-title">' + cfg.name + '</span><span class="ja-status">online · AI</span></span>' +
          '<button class="ja-close" aria-label="Close">×</button>' +
        '</div>' +
        '<div class="ja-thread"></div>' +
        '<div class="ja-chips"></div>' +
        '<form class="ja-input-row" autocomplete="off">' +
          '<input class="ja-input" type="text" placeholder="Ask me about Jeury…" aria-label="Message"/>' +
          '<button class="ja-send" type="submit" aria-label="Send">↑</button>' +
        '</form>';
      document.body.appendChild(p);
      this._panel = p;
      this._thread = p.querySelector('.ja-thread');
      this._input = p.querySelector('.ja-input');

      p.querySelector('.ja-close').addEventListener('click', this.close.bind(this));
      var self = this;
      p.querySelector('.ja-input-row').addEventListener('submit', function (e) {
        e.preventDefault();
        var v = self._input.value.trim();
        if (v) { self._send(v); self._input.value = ''; }
      });

      // suggestion chips
      var chips = p.querySelector('.ja-chips');
      (cfg.chips || []).forEach(function (c) {
        if (c.href) {
          var a = el('a', 'ja-chip', c.label);
          a.href = c.href; a.target = '_blank'; a.rel = 'noopener';
          chips.appendChild(a);
        } else {
          var b = el('button', 'ja-chip', c.q);
          b.type = 'button';
          b.addEventListener('click', function () { self._send(c.q); });
          chips.appendChild(b);
        }
      });
    },

    _addBubble: function (who, html) {
      var b = el('div', 'ja-bubble ' + who, html);
      this._thread.appendChild(b);
      this._thread.scrollTop = this._thread.scrollHeight;
      return b;
    },

    _send: function (text) {
      this._addBubble('user', text.replace(/</g, '&lt;'));
      var self = this;
      setTimeout(function () { self._typeBot(reply(text)); }, 240);
    },

    _typeBot: function (text) {
      clearInterval(this._typeTimer);
      var b = this._addBubble('bot', '<span class="ja-cursor"></span>');
      var hasHTML = /</.test(text);
      var self = this, i = 0;
      if (hasHTML) { // don't char-type HTML answers; brief delay then show
        setTimeout(function () { b.innerHTML = text; self._thread.scrollTop = self._thread.scrollHeight; }, 260);
        return;
      }
      this._typeTimer = setInterval(function () {
        i++;
        b.innerHTML = text.slice(0, i) + '<span class="ja-cursor"></span>';
        self._thread.scrollTop = self._thread.scrollHeight;
        if (i >= text.length) { clearInterval(self._typeTimer); b.innerHTML = text; }
      }, this._cfg.typingSpeedMs);
    },

    _onOutside: function (e) {
      if (!this._panel.classList.contains('ja-open')) return;
      if (this._panel.contains(e.target)) return;
      if (this._trigger && this._trigger.contains(e.target)) return;
      this.close();
    },

    open: function () {
      this._panel.classList.add('ja-open');
      if (this._trigger) this._trigger.classList.add('ja-active');
      if (!this._greeted) { this._greeted = true; var self = this; setTimeout(function () { self._typeBot(self._cfg.greeting); }, 260); }
      var inp = this._input; setTimeout(function () { inp.focus(); }, 320);
    },
    close: function () { this._panel.classList.remove('ja-open'); if (this._trigger) this._trigger.classList.remove('ja-active'); },
    toggle: function () { this._panel.classList.contains('ja-open') ? this.close() : this.open(); },
    say: function (t) { this._typeBot(t); }
  };

  global.JeuryAgent = JeuryAgent;
})(window);
