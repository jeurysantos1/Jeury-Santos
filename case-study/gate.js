/* ============================================================
   jeury.gate — a cheeky client-side password screen for the
   case studies. NOTE: this is a soft gate (deterrent), not real
   security — the page + images still live in the repo.
   Change PASS below to set the password.
   Optionally set window.GATE_CO = "Google" before this script.
   ============================================================ */
(function () {
  "use strict";

  var PASS = "letmein";              // <-- CHANGE ME (the password)
  var KEY  = "jeury_cs_unlock";

  try { if (sessionStorage.getItem(KEY) === "1") return; } catch (e) {}

  var CO = (window.GATE_CO || "a very serious company");

  var css =
    '#jgate{position:fixed;inset:0;z-index:99999;display:grid;place-items:center;padding:24px;' +
    'background:radial-gradient(800px 520px at 50% 0%,rgba(29,233,182,.16),transparent 60%),rgba(6,8,11,.93);' +
    '-webkit-backdrop-filter:blur(16px);backdrop-filter:blur(16px);opacity:1;transition:opacity .45s ease;' +
    'font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;}' +
    '#jgate.jg-open{opacity:0;}' +
    '.jg-card{max-width:460px;width:100%;background:rgba(18,22,28,.72);border:1px solid rgba(255,255,255,.12);' +
    'border-radius:24px;padding:40px 36px;text-align:center;color:#f3f6f8;box-shadow:0 44px 100px -34px rgba(0,0,0,.85),inset 0 1px 0 rgba(255,255,255,.08);}' +
    '.jg-emoji{font-size:46px;line-height:1;}' +
    '.jg-title{font-family:"Space Grotesk",-apple-system,sans-serif;font-size:27px;font-weight:700;letter-spacing:-.02em;margin:14px 0 0;color:#fff;}' +
    '.jg-sub{font-size:15px;line-height:1.6;color:#aab4bd;margin:12px auto 0;max-width:38ch;}' +
    '.jg-sub em{color:#1de9b6;font-style:normal;}' +
    '.jg-form{display:flex;gap:10px;margin:26px 0 0;flex-wrap:wrap;}' +
    '.jg-input{flex:1 1 180px;min-width:0;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.16);' +
    'border-radius:12px;padding:14px 15px;color:#fff;font-size:15px;outline:none;transition:border-color .2s,box-shadow .2s;}' +
    '.jg-input:focus{border-color:#1de9b6;box-shadow:0 0 0 3px rgba(29,233,182,.2);}' +
    '.jg-input::placeholder{color:#6b7682;}' +
    '.jg-btn{background:linear-gradient(100deg,#1de9b6,#7d5cff);color:#04110d;font-weight:700;border:none;' +
    'border-radius:12px;padding:14px 20px;font-size:15px;cursor:pointer;transition:transform .2s,box-shadow .2s;}' +
    '.jg-btn:hover{transform:translateY(-2px);box-shadow:0 12px 32px -10px rgba(29,233,182,.55);}' +
    '.jg-err{color:#ff8f8f;font-size:13.5px;margin:14px 0 0;font-weight:600;min-height:1.2em;}' +
    '.jg-hint{font-size:13px;color:#6b7682;margin:18px 0 0;}' +
    '.jg-hint a{color:#1de9b6;text-decoration:none;}' +
    '.jg-card.jg-shake{animation:jgshake .42s;}' +
    '@keyframes jgshake{10%,90%{transform:translateX(-2px);}20%,80%{transform:translateX(4px);}30%,50%,70%{transform:translateX(-9px);}40%,60%{transform:translateX(9px);}}' +
    '@media(prefers-reduced-motion:reduce){.jg-card.jg-shake{animation:none;}#jgate{transition:none;}}';

  var st = document.createElement("style");
  st.textContent = css;
  document.head.appendChild(st);

  var ov = document.createElement("div");
  ov.id = "jgate";
  ov.innerHTML =
    '<div class="jg-card" role="dialog" aria-modal="true" aria-label="Password required">' +
      '<div class="jg-emoji" aria-hidden="true">🤫</div>' +
      '<h2 class="jg-title">Shhh — this one’s under wraps</h2>' +
      '<p class="jg-sub">' + CO + '’s legal team would <em>really</em> like you to have the password first. I’d rather you just enjoy the work — but, you know, lawyers gonna lawyer.</p>' +
      '<form class="jg-form" autocomplete="off">' +
        '<input class="jg-input" type="password" placeholder="the magic word…" aria-label="Password"/>' +
        '<button class="jg-btn" type="submit">Unlock the goods →</button>' +
      '</form>' +
      '<p class="jg-err" role="alert"></p>' +
      '<p class="jg-hint">No password? <a href="https://mail.google.com/mail/?view=cm&fs=1&to=jeurysantos1@gmail.com" target="_blank" rel="noopener">Email Jeury</a> and say something nice.</p>' +
    '</div>';

  function mount() {
    document.body.appendChild(ov);
    document.documentElement.style.overflow = "hidden";
    var form = ov.querySelector(".jg-form"),
        input = ov.querySelector(".jg-input"),
        err = ov.querySelector(".jg-err"),
        card = ov.querySelector(".jg-card");
    input.focus();
    var quips = ["That’s a hard no from Legal. 🚫", "Nope. The lawyers are watching. 👀", "Close! (No it wasn’t.) Try again.", "Access denied — but I admire the confidence."];
    var miss = 0;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (input.value.trim().toLowerCase() === PASS.toLowerCase()) {
        try { sessionStorage.setItem(KEY, "1"); } catch (e) {}
        ov.classList.add("jg-open");
        document.documentElement.style.overflow = "";
        setTimeout(function () { ov.remove(); }, 480);
      } else {
        err.textContent = quips[miss % quips.length]; miss++;
        card.classList.remove("jg-shake"); void card.offsetWidth; card.classList.add("jg-shake");
        input.select();
      }
    });
  }

  if (document.body) mount();
  else document.addEventListener("DOMContentLoaded", mount);
})();
