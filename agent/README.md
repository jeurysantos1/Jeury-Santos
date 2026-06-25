# jeury.agent ✦

A tiny, dock-summoned AI-persona widget. Frosted-glass panel, character-by-character typing, configurable Q&A chips. Built by [Jeury Santos](https://jeurysantos1.com) as a live prototype for his portfolio — packaged here as a drop-in feature for any site.

![demo](https://img.shields.io/badge/dependencies-zero-3D6BBF) ![size](https://img.shields.io/badge/size-~6kb%20js%20%2B%20~5kb%20css-3D6BBF)

## What it does

- A floating **glass dock** with a sparkle ✦ trigger (plus optional social links)
- **Hover tooltip**: "Hi! I'm Jeury — well, his AI version ✦"
- **Click** → the agent panel springs open above the dock
- The agent **types** its greeting, then offers tappable Q&A chips
- Click outside or tap the sparkle again to dismiss
- One gentle attention bounce after page load (configurable / disableable)
- Respects `prefers-reduced-motion`

No frameworks. No dependencies. Two files.

## Quick start

```html
<!-- 1. Fonts the widget uses -->
<link href="https://fonts.googleapis.com/css2?family=Caveat:wght@600&family=Inter:wght@300;400;500&display=swap" rel="stylesheet">

<!-- 2. The feature -->
<link rel="stylesheet" href="agent.css">
<script src="agent.js"></script>

<!-- 3. Boot it -->
<script>
  JeuryAgent.init();
</script>
```

Open `index.html` for a working demo.

## Configuration

Everything is overridable via `JeuryAgent.init({ ... })`:

| Option | Default | What it does |
|---|---|---|
| `name` | `'jeury.agent'` | Header label in the panel |
| `badge` | `'live prototype'` | Handwritten badge, top-right of panel |
| `tooltip` | `"Hi! I'm Jeury — well, his AI version ✦"` | Hover tooltip on the sparkle |
| `greeting` | *(see source)* | First message typed when opened |
| `qa` | 4 chips about Jeury | Array of `{ q, a }` — chip label + typed answer |
| `footer` | `'yes, I prototyped this ✦'` | Handwritten sign-off |
| `typingSpeedMs` | `18` | Milliseconds per character |
| `nudgeAfterMs` | `5000` | Attention bounce delay; `0` disables |
| `renderDock` | `true` | `false` = bring your own trigger button |
| `dockLinks` | LinkedIn + Email | Extra dock icons; `[]` = sparkle only |
| `triggerSelector` | `null` | CSS selector for your own trigger (with `renderDock: false`) |

### Example: custom persona

```js
JeuryAgent.init({
  name: 'ada.agent',
  tooltip: "Hi! I'm Ada — well, the AI version ✦",
  greeting: 'Hello! Ask me about Ada\'s work ↓',
  qa: [
    { q: 'Best project?', a: 'The analytical engine, obviously.' },
    { q: 'Fun fact', a: 'Wrote the first algorithm before computers existed.' }
  ],
  dockLinks: []  // sparkle only
});
```

### Example: attach to your own button

```js
JeuryAgent.init({
  renderDock: false,
  triggerSelector: '#talk-to-me'
});
```

### Programmatic API

```js
JeuryAgent.open();          // open the panel
JeuryAgent.close();         // close it
JeuryAgent.toggle();        // toggle
JeuryAgent.say('Hi there'); // make the agent type anything
```

## Theming

All colors live in CSS custom properties at the top of `agent.css`:

```css
:root {
  --ja-blue: #3D6BBF;        /* accent — "altitude blue" */
  --ja-blue-light: #5A8AE0;
  --ja-ink: #1A1A18;
  --ja-paper: #F6F4F0;
  --ja-green: #5AE08F;       /* the "live" dot */
}
```

## Files

```
jeury-agent/
├── index.html   ← demo page
├── agent.css    ← all styles (prefixed .ja-*)
├── agent.js     ← the widget (window.JeuryAgent)
└── README.md
```

## Browser support

Modern evergreen browsers. `backdrop-filter` (the frosted glass) degrades gracefully where unsupported — the panel just renders more opaque.

## License

MIT — use it, remix it, ship it. A link back to [jeurysantos1.com](https://jeurysantos1.com) is appreciated but not required.

---

*Designed & prototyped by Jeury Santos — hospitality learned at 35,000 ft, brought to pixels.*
