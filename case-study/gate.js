/* ============================================================
   jeury.gate — a cheeky client-side password modal for the case
   studies. NOTE: soft gate (deterrent), not real security — the
   page + images still live in the repo.
   Change PASS below to set the password.
   Optionally set window.GATE_CO = "Google" before this script.
   ============================================================ */
(function () {
  "use strict";

  var PASS = "123456";               // <-- the password
  var KEY  = "jeury_cs_unlock";

  try { if (sessionStorage.getItem(KEY) === "1") return; } catch (e) {}

  var CO = (window.GATE_CO || "a very serious company");

  var css =
    '#jgate{position:fixed;inset:0;z-index:99999;display:grid;place-items:center;padding:24px;overflow:hidden;' +
    'background:radial-gradient(900px 560px at 50% -5%,rgba(29,233,182,.16),transparent 60%),rgba(6,8,11,.94);' +
    '-webkit-backdrop-filter:blur(18px);backdrop-filter:blur(18px);opacity:0;animation:jgfade .5s ease forwards;' +
    'font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;}' +
    '#jgate.jg-open{opacity:0;transition:opacity .45s ease;}' +
    '@keyframes jgfade{to{opacity:1;}}' +
    '.jg-blob{position:absolute;border-radius:50%;filter:blur(72px);opacity:.5;pointer-events:none;}' +
    '.jg-blob.b1{width:440px;height:440px;background:#1de9b6;top:-150px;left:50%;transform:translateX(-50%);animation:jgfloat 16s ease-in-out infinite alternate;}' +
    '.jg-blob.b2{width:380px;height:380px;background:#7d5cff;bottom:-160px;right:-90px;animation:jgfloat 21s -5s ease-in-out infinite alternate;}' +
    '.jg-blob.b3{width:340px;height:340px;background:#0a9bd6;top:35%;left:-110px;animation:jgfloat 25s -10s ease-in-out infinite alternate;}' +
    '@keyframes jgfloat{to{transform:translate(46px,-34px) scale(1.12);}}' +
    '.jg-card{position:relative;z-index:2;max-width:460px;width:100%;background:rgba(13,16,21,.9);' +
    'border:1px solid rgba(255,255,255,.1);border-radius:24px;padding:42px 36px;text-align:center;color:#f3f6f8;' +
    'box-shadow:0 50px 110px -40px rgba(0,0,0,.9),inset 0 1px 0 rgba(255,255,255,.08);' +
    'animation:jgcardIn .65s cubic-bezier(.2,.85,.25,1) both;}' +
    '.jg-card::before{content:"";position:absolute;inset:-2px;z-index:-1;border-radius:26px;' +
    'background:conic-gradient(from 0deg,#1de9b6,#7d5cff,#ffb454,#0a9bd6,#1de9b6);filter:blur(16px);opacity:.7;' +
    'animation:jgspin 7s linear infinite;}' +
    '@keyframes jgspin{to{transform:rotate(1turn);}}' +
    '@keyframes jgcardIn{from{opacity:0;transform:translateY(26px) scale(.93);}to{opacity:1;transform:none;}}' +
    '.jg-lock{width:62px;height:62px;margin:0 auto;border-radius:18px;display:grid;place-items:center;font-size:28px;' +
    'background:linear-gradient(135deg,rgba(29,233,182,.22),rgba(125,92,255,.22));border:1px solid rgba(255,255,255,.14);' +
    'box-shadow:0 0 30px rgba(29,233,182,.3);animation:jgbob 4s ease-in-out infinite;}' +
    '@keyframes jgbob{50%{transform:translateY(-6px);}}' +
    '.jg-title{font-family:"Space Grotesk",-apple-system,sans-serif;font-size:27px;font-weight:700;letter-spacing:-.02em;margin:18px 0 0;' +
    'background:linear-gradient(100deg,#fff 18%,#1de9b6 55%,#ffb454 86%);background-size:220% 100%;' +
    '-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:transparent;' +
    'animation:jgsheen 6s ease-in-out infinite alternate;}' +
    '@keyframes jgsheen{to{background-position:100% 0;}}' +
    '.jg-sub{font-size:15px;line-height:1.6;color:#aab4bd;margin:12px auto 0;max-width:38ch;}' +
    '.jg-sub em{color:#1de9b6;font-style:normal;}' +
    '.jg-form{display:flex;gap:10px;margin:26px 0 0;flex-wrap:wrap;}' +
    '.jg-input{flex:1 1 180px;min-width:0;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.16);' +
    'border-radius:12px;padding:14px 15px;color:#fff;font-size:15px;outline:none;transition:border-color .2s,box-shadow .2s;}' +
    '.jg-input:focus{border-color:#1de9b6;box-shadow:0 0 0 3px rgba(29,233,182,.2);}' +
    '.jg-input::placeholder{color:#6b7682;}' +
    '.jg-btn{position:relative;background:linear-gradient(100deg,#1de9b6,#7d5cff);color:#04110d;font-weight:700;border:none;' +
    'border-radius:12px;padding:14px 22px;font-size:15px;cursor:pointer;transition:transform .2s,box-shadow .2s;}' +
    '.jg-btn:hover{transform:translateY(-2px);box-shadow:0 14px 34px -10px rgba(29,233,182,.6);}' +
    '.jg-err{color:#ff8f8f;font-size:13.5px;margin:14px 0 0;font-weight:600;min-height:1.2em;}' +
    '.jg-hint{font-size:13px;color:#6b7682;margin:18px 0 0;}' +
    '.jg-hint a{color:#1de9b6;text-decoration:none;}' +
    '.jg-card.jg-shake{animation:jgshake .42s;}' +
    '@keyframes jgshake{10%,90%{transform:translateX(-2px);}20%,80%{transform:translateX(4px);}30%,50%,70%{transform:translateX(-9px);}40%,60%{transform:translateX(9px);}}' +
    '@media(prefers-reduced-motion:reduce){#jgate,.jg-card,.jg-blob,.jg-lock,.jg-title{animation:none!important;}#jgate{opacity:1;}.jg-card::before{animation:none;}}';

  var st = document.createElement("style");
  st.textContent = css;
  document.head.appendChild(st);

  var ov = document.createElement("div");
  ov.id = "jgate";
  ov.innerHTML =
    '<span class="jg-blob b1" aria-hidden="true"></span>' +
    '<span class="jg-blob b2" aria-hidden="true"></span>' +
    '<span class="jg-blob b3" aria-hidden="true"></span>' +
    '<div class="jg-card" role="dialog" aria-modal="true" aria-label="Password required">' +
      '<div class="jg-lock" aria-hidden="true">🔒</div>' +
      '<h2 class="jg-title">Shhh — this one’s under wraps</h2>' +
      '<p class="jg-sub">' + CO + '’s legal team would <em>really</em> like you to have the password first. I’d rather you just enjoy the work — but, you know, lawyers gonna lawyer.</p>' +
      '<form class="jg-form" autocomplete="off">' +
        '<input class="jg-input" type="password" inputmode="numeric" placeholder="the magic word…" aria-label="Password"/>' +
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
      if (input.value.trim() === PASS) {
        try { sessionStorage.setItem(KEY, "1"); } catch (e) {}
        ov.classList.add("jg-open");
        document.documentElement.style.overflow = "";
        setTimeout(function () { ov.remove(); }, 460);
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
