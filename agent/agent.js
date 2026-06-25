/* ============================================================
   jeury.agent — a tiny dock-summoned AI-persona widget
   Author: Jeury Santos · jeurysantos1.com

   Usage:
     <link rel="stylesheet" href="agent.css">
     <script src="agent.js"></script>
     <script>
       JeuryAgent.init({ ...optional config overrides... });
     </script>

   Everything is configurable: name, tooltip, greeting, Q&A
   chips, typing speed, and whether to render its own dock.
   ============================================================ */

(function (global) {
  'use strict';

  // ---------- Default configuration ----------
  var DEFAULTS = {
    // Identity
    name: 'jeury.agent',
    badge: 'live prototype',
    footer: 'yes, I prototyped this \u2726',
    tooltip: "Hi! I'm Jeury \u2014 well, his AI version \u2726",

    // First message typed when the panel opens
    greeting: 'Hey \u2014 I\u2019m Jeury\u2019s AI version, prototyped by the real one. Ask me something \u2193',

    // Q&A chips: { q: label shown on chip, a: answer typed out }
    qa: [
      {
        q: 'What does Jeury ship?',
        a: 'Dashboards that saved Google sellers 12,000 hrs/yr, a 491-component design system, and Pixel Tablet settings UX. Receipts below \u2193'
      },
      {
        q: 'Prototyping skills?',
        a: 'ProtoPie, Figma, code \u2014 high-fidelity prototypes from discovery through usability testing. You\u2019re literally inside one right now.'
      },
      {
        q: 'Fun fact',
        a: 'Former flight attendant. Jeury ran usability tests on hospitality at 35,000 feet before ever opening Figma.'
      },
      {
        q: 'Is he nice?',
        a: '\u201CActually care\u201D is one of his four non-negotiables. So yes \u2014 dangerously nice.'
      }
    ],

    // Behavior
    typingSpeedMs: 18,        // ms per character
    nudgeAfterMs: 5000,       // attention bounce delay; 0 disables
    renderDock: true,         // false = you provide your own trigger
    dockLinks: [              // extra dock icons (set [] to show sparkle only)
      { label: 'LinkedIn', href: 'https://www.linkedin.com/in/jeury-santos-b44721103/', icon: 'linkedin' },
      { label: 'Email', href: 'mailto:jeurysantos1@gmail.com', icon: 'mail' }
    ],
    // If renderDock is false, pass a selector for your own button:
    triggerSelector: null
  };

  // ---------- Tiny icon set ----------
  var ICONS = {
    sparkle: '<path d="M12 3l1.9 5.7a2 2 0 0 0 1.3 1.3l5.7 1.9-5.7 1.9a2 2 0 0 0-1.3 1.3L12 21l-1.9-5.7a2 2 0 0 0-1.3-1.3L3 12l5.7-1.9a2 2 0 0 0 1.3-1.3L12 3z"/>',
    linkedin: '<path d="M4 4m0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z"/><path d="M8 11v5"/><path d="M8 8v.01"/><path d="M12 16v-5"/><path d="M16 16v-3a2 2 0 0 0-4 0"/>',
    mail: '<path d="M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z"/><path d="M3 7l9 6l9-6"/>'
  };

  function svg(iconKey) {
    return '<svg viewBox="0 0 24 24" aria-hidden="true">' + (ICONS[iconKey] || ICONS.sparkle) + '</svg>';
  }

  function el(tag, className, html) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (html != null) node.innerHTML = html;
    return node;
  }

  // ---------- The widget ----------
  var JeuryAgent = {
    _cfg: null,
    _panel: null,
    _msgEl: null,
    _trigger: null,
    _typeTimer: null,
    _greeted: false,

    init: function (userConfig) {
      var cfg = Object.assign({}, DEFAULTS, userConfig || {});
      this._cfg = cfg;

      this._buildPanel(cfg);

      if (cfg.renderDock) {
        this._buildDock(cfg);
      } else if (cfg.triggerSelector) {
        this._trigger = document.querySelector(cfg.triggerSelector);
        if (this._trigger) {
          this._trigger.addEventListener('click', this.toggle.bind(this));
        }
      }

      // Close on outside click
      document.addEventListener('click', this._onOutsideClick.bind(this));

      // One gentle attention bounce
      if (cfg.nudgeAfterMs > 0 && this._trigger) {
        var trigger = this._trigger;
        setTimeout(function () {
          trigger.classList.add('ja-nudge');
          setTimeout(function () { trigger.classList.remove('ja-nudge'); }, 1000);
        }, cfg.nudgeAfterMs);
      }

      return this;
    },

    _buildDock: function (cfg) {
      var dock = el('div', 'ja-dock');

      // Sparkle trigger with tooltip
      var btn = el('button', 'ja-dock-btn ja-sparkle',
        svg('sparkle') + '<span class="ja-tip">' + cfg.tooltip + '</span>');
      btn.setAttribute('aria-label', 'Chat with ' + cfg.name);
      btn.addEventListener('click', this.toggle.bind(this));
      dock.appendChild(btn);
      this._trigger = btn;

      // Optional extra links
      (cfg.dockLinks || []).forEach(function (link) {
        var a = el('a', 'ja-dock-btn', svg(link.icon));
        a.href = link.href;
        a.setAttribute('aria-label', link.label);
        if (/^https?:/.test(link.href)) {
          a.target = '_blank';
          a.rel = 'noopener noreferrer';
        }
        dock.appendChild(a);
      });

      document.body.appendChild(dock);
    },

    _buildPanel: function (cfg) {
      var panel = el('div', 'ja-panel');
      panel.setAttribute('role', 'dialog');
      panel.setAttribute('aria-label', cfg.name);

      panel.innerHTML =
        '<div class="ja-head">' +
          '<span class="ja-dot"></span>' +
          '<span class="ja-title">' + cfg.name + '</span>' +
          '<span class="ja-badge">' + cfg.badge + '</span>' +
        '</div>' +
        '<div class="ja-body"><p class="ja-msg"></p></div>' +
        '<div class="ja-chips"></div>' +
        '<div class="ja-foot">' + cfg.footer + '</div>';

      this._msgEl = panel.querySelector('.ja-msg');

      var chips = panel.querySelector('.ja-chips');
      var self = this;
      (cfg.qa || []).forEach(function (item) {
        var chip = el('button', 'ja-chip', item.q);
        chip.addEventListener('click', function () { self._type(item.a); });
        chips.appendChild(chip);
      });

      document.body.appendChild(panel);
      this._panel = panel;
    },

    _type: function (text, done) {
      clearInterval(this._typeTimer);
      var msgEl = this._msgEl;
      var speed = this._cfg.typingSpeedMs;
      var i = 0;
      msgEl.innerHTML = '<span class="ja-cursor"></span>';
      this._typeTimer = setInterval(function () {
        i++;
        msgEl.innerHTML = text.slice(0, i) + '<span class="ja-cursor"></span>';
        if (i >= text.length) {
          clearInterval(this._typeTimer);
          if (done) done();
        }
      }.bind(this), speed);
    },

    _onOutsideClick: function (e) {
      if (!this._panel.classList.contains('ja-open')) return;
      if (this._panel.contains(e.target)) return;
      if (this._trigger && this._trigger.contains(e.target)) return;
      this.close();
    },

    open: function () {
      this._panel.classList.add('ja-open');
      if (this._trigger) this._trigger.classList.add('ja-active');
      if (!this._greeted) {
        this._greeted = true;
        setTimeout(this._type.bind(this, this._cfg.greeting), 250);
      }
    },

    close: function () {
      this._panel.classList.remove('ja-open');
      if (this._trigger) this._trigger.classList.remove('ja-active');
    },

    toggle: function () {
      this._panel.classList.contains('ja-open') ? this.close() : this.open();
    },

    // Programmatically make the agent say something
    say: function (text) { this._type(text); }
  };

  global.JeuryAgent = JeuryAgent;

})(window);
