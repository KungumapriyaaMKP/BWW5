/* Raj & Priya — wedding invitation (vanilla JS port of the original React app) */
(function () {
  "use strict";

  /* ------------------------------------------------------------------ */
  /* CONFIG                                                              */
  /* ------------------------------------------------------------------ */
  var CONFIG = {
    dateISO: "2026-12-12T18:00:00+05:30",
    scratchPrompt: "SCRATCH TO REVEAL THE DATE",
    music: "assets/media/music.mp3",
    story: [
      { date: "14 February 2023", title: "How We Met", text: "Two cups of chai, one long conversation, and a friendship that refused to end.", src: "assets/media/story-1.png", alt: "Illustration of the couple meeting over chai" },
      { date: "09 September 2023", title: "Our First Trip", text: "A scooter, a coastal road, and the moment we knew this was going somewhere.", src: "assets/media/story-2.png", alt: "Illustration of the couple riding a scooter together" },
      { date: "21 June 2025", title: "The Proposal", text: "Fairy lights, a shaky knee, and a yes that arrived before the question finished.", src: "assets/media/story-3.png", alt: "Illustration of the proposal under fairy lights" },
      { date: "12 December 2026", title: "Forever Begins", text: "Hands held under the mandap, surrounded by everyone we love.", src: "assets/media/story-4.png", alt: "Illustration of the couple under a floral mandap" }
    ],
    events: [
      { name: "Ganesh Puja", glyph: "❦", date: "10 December 2026", time: "10:00 AM" },
      { name: "Mehendi", glyph: "✿", date: "10 December 2026", time: "04:00 PM" },
      { name: "Haldi", glyph: "❈", date: "11 December 2026", time: "11:00 AM" },
      { name: "Sangeet", glyph: "♪", date: "11 December 2026", time: "07:00 PM" },
      { name: "Baraat", glyph: "✦", date: "12 December 2026", time: "05:00 PM" },
      { name: "Wedding Ceremony", glyph: "❦", date: "12 December 2026", time: "07:30 PM" },
      { name: "Reception", glyph: "✽", date: "13 December 2026", time: "07:00 PM" }
    ]
  };

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = function (s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  };
  var emit = function (name) { window.dispatchEvent(new CustomEvent(name)); };

  /* ------------------------------------------------------------------ */
  /* HERO (always "awake")                                               */
  /* ------------------------------------------------------------------ */
  $$("[data-awake]").forEach(function (el) {
    var d = Number(el.getAttribute("data-awake")) * 0.22;
    el.style.opacity = "1";
    el.style.transform = "translateY(0)";
    el.style.transition = "opacity 1.1s ease " + d + "s, transform 1.2s cubic-bezier(.16,1,.3,1) " + d + "s";
  });

  /* ------------------------------------------------------------------ */
  /* STORY (flip cards — one open at a time)                             */
  /* ------------------------------------------------------------------ */
  var storyGrid = $("#story-grid");
  var BTN_GHOST = "inline-flex items-center justify-center gap-2 text-sm font-medium cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:text-accent-foreground absolute inset-0 h-full w-full whitespace-normal rounded-2xl p-0 text-left hover:bg-transparent";
  storyGrid.innerHTML = CONFIG.story.map(function (s, i) {
    return '<div class="reveal" style="transition-delay:' + i * 100 + 'ms">' +
      '<div class="story-card-wrap relative w-full aspect-[4/5]">' +
      '<button class="' + BTN_GHOST + '" type="button" aria-pressed="false" data-story="' + i + '">' +
      '<span class="story-flip-card ">' +
      '<span class="story-flip-face story-flip-front border border-gold/35 paper" style="box-shadow:var(--shadow-luxe)">' +
      '<img src="' + s.src + '" alt="' + esc(s.alt) + '" width="640" height="780" loading="lazy" decoding="async" class="h-full w-full object-contain p-5 transition-transform duration-700 group-hover:scale-[1.03]"/>' +
      '<span class="pointer-events-none absolute inset-x-4 bottom-4 rounded-full border border-gold/40 bg-ivory/85 px-4 py-2 text-center text-[0.62rem] tracking-[0.22em] text-gold-deep uppercase whitespace-normal">Tap to flip</span>' +
      '</span>' +
      '<span class="story-flip-face story-flip-back border border-gold/45 paper" style="box-shadow:var(--shadow-luxe)">' +
      '<span class="flex h-full w-full flex-col items-center justify-center whitespace-normal px-6 py-6 text-center sm:px-8 sm:py-7">' +
      '<span class="font-display text-3xl text-gold">❦</span>' +
      '<span class="mt-3 whitespace-normal text-[0.62rem] leading-5 tracking-[0.22em] text-gold-deep uppercase sm:mt-4 sm:text-[0.66rem] sm:tracking-[0.28em]">' + esc(s.date) + '</span>' +
      '<span class="mt-3 block w-full whitespace-normal font-display text-[clamp(1.25rem,5.5vw,1.75rem)] leading-tight text-ink sm:mt-4">' + esc(s.title) + '</span>' +
      '<span class="mt-4 block w-full max-w-[90%] whitespace-normal break-words text-xs leading-5 font-light text-muted-foreground sm:mt-5 sm:text-sm sm:leading-6">' + esc(s.text) + '</span>' +
      '<span class="mt-5 whitespace-normal text-[0.58rem] tracking-[0.2em] text-gold-deep uppercase opacity-70">Tap to flip back</span>' +
      '</span></span></span></button></div></div>';
  }).join("");

  var openStory = null;
  storyGrid.addEventListener("click", function (e) {
    var btn = e.target.closest("[data-story]");
    if (!btn) return;
    var idx = btn.getAttribute("data-story");
    openStory = openStory === idx ? null : idx;
    $$("[data-story]", storyGrid).forEach(function (b) {
      var on = b.getAttribute("data-story") === openStory;
      b.setAttribute("aria-pressed", String(on));
      $(".story-flip-card", b).classList.toggle("is-flipped", on);
    });
  });

  /* ------------------------------------------------------------------ */
  /* EVENTS (alternating timeline)                                       */
  /* ------------------------------------------------------------------ */
  var evBody = function (e, left) {
    return '<div class="relative z-10 bg-ivory ' + (left ? "pr-3 sm:pr-6 md:pr-10" : "pl-3 sm:pl-6 md:pl-10") + '">' +
      '<span class="mb-2 block font-display text-xl leading-none text-gold sm:text-2xl">' + e.glyph + '</span>' +
      '<h3 class="font-display text-[clamp(1.35rem,4vw,2.25rem)] leading-tight text-ink">' + esc(e.name) + '</h3>' +
      '<p class="mt-2 text-[0.58rem] font-medium uppercase leading-5 tracking-[0.16em] text-gold-deep sm:text-xs sm:tracking-[0.22em]">' + esc(e.date) + '</p>' +
      '<p class="mt-1 text-[0.6rem] uppercase leading-5 tracking-[0.14em] text-muted-foreground sm:text-sm sm:tracking-[0.18em]">' + esc(e.time) + '</p>' +
      '</div>';
  };
  $("#events-list").innerHTML = CONFIG.events.map(function (e, t) {
    var left = t % 2 === 0;
    return '<div class="reveal relative grid grid-cols-[1fr_auto_1fr] items-center gap-5 md:gap-10 ' + (t > 0 ? "mt-16 sm:mt-20 md:mt-24" : "") + '" style="transition-delay:' + t * 90 + 'ms">' +
      '<div class="row-start-1 min-w-0 ' + (left ? "col-start-1 text-right" : "col-start-1") + '">' + (left ? evBody(e, true) : "") + '</div>' +
      '<span aria-hidden="true" class="relative z-20 col-start-2 row-start-1 flex h-8 w-8 rotate-45 items-center justify-center border border-gold bg-ivory" style="box-shadow:0 0 0 7px var(--ivory)">' +
      '<span class="-rotate-45 font-display text-sm leading-none text-gold sm:text-base">' + e.glyph + '</span></span>' +
      '<div class="row-start-1 min-w-0 ' + (left ? "col-start-3" : "col-start-3 text-left") + '">' + (!left ? evBody(e, false) : "") + '</div>' +
      '</div>';
  }).join("");

  /* ------------------------------------------------------------------ */
  /* SCROLL REVEAL                                                       */
  /* ------------------------------------------------------------------ */
  var revealIO = new IntersectionObserver(function (entries) {
    entries.forEach(function (n) {
      if (n.isIntersecting) { n.target.classList.add("is-visible"); revealIO.unobserve(n.target); }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
  var observeReveals = function () { $$(".reveal:not(.is-visible)").forEach(function (el) { revealIO.observe(el); }); };
  observeReveals();
  requestAnimationFrame(observeReveals);

  /* ------------------------------------------------------------------ */
  /* COUNTDOWN                                                           */
  /* ------------------------------------------------------------------ */
  var target = new Date(CONFIG.dateISO).getTime();
  var cdEls = {};
  $$("[data-cd]").forEach(function (el) { cdEls[el.getAttribute("data-cd")] = el; });
  var tick = function () {
    var ms = Math.max(0, target - Date.now()), s = Math.floor(ms / 1000);
    var v = { days: Math.floor(s / 86400), hours: Math.floor((s % 86400) / 3600), minutes: Math.floor((s % 3600) / 60), seconds: s % 60 };
    Object.keys(v).forEach(function (k) { if (cdEls[k]) cdEls[k].textContent = String(v[k]).padStart(2, "0"); });
  };
  tick();
  setInterval(tick, 1000);

  /* ------------------------------------------------------------------ */
  /* FALLING PETALS + SPARKLES                                           */
  /* ------------------------------------------------------------------ */
  var rnd = function (e, t) { var n = Math.sin((e + 1) * t) * 1e4; return n - Math.floor(n); };
  var petalsMounted = false;
  function mountPetals(petals, sparkles) {
    if (petalsMounted) return;
    petalsMounted = true;
    var wrap = document.createElement("div");
    wrap.setAttribute("aria-hidden", "true");
    wrap.className = "pointer-events-none fixed inset-0 z-30 overflow-hidden";
    var html = "";
    for (var t = 0; t < petals; t++) {
      var dur = 16 + rnd(t, 43.12) * 14, delay = -rnd(t, 78.233) * dur, size = 9 + rnd(t, 91.7) * 12;
      var drift = (rnd(t, 27.4) - 0.5) * 240, op = 0.35 + rnd(t, 55.1) * 0.4, rose = rnd(t, 31.7) > 0.55;
      html += '<span class="absolute top-0 block" style="left:' + rnd(t, 12.9898) * 100 + '%;width:' + size + 'px;height:' + size * 0.72 + 'px;border-radius:100% 0 100% 0;background:' +
        (rose ? "linear-gradient(140deg, oklch(0.88 0.055 25), oklch(0.74 0.09 20))" : "linear-gradient(140deg, oklch(0.94 0.03 80), oklch(0.8 0.075 60))") +
        ';will-change:transform, opacity;backface-visibility:hidden;animation:petal-fall ' + dur + 's linear ' + delay + 's infinite;--petal-drift:' + drift + 'px;--petal-opacity:' + op + '"></span>';
    }
    for (var k = 0; k < sparkles; k++) {
      var sz = 2 + rnd(k, 88.2) * 3;
      html += '<span class="absolute rounded-full bg-gold" style="left:' + rnd(k, 5.11) * 100 + '%;top:' + rnd(k, 17.31) * 100 + '%;width:' + sz + 'px;height:' + sz +
        'px;box-shadow:0 0 10px 2px oklch(0.86 0.09 85 / 0.8);animation:sparkle-pulse ' + (4 + rnd(k, 22.9) * 5) + 's ease-in-out ' + (-rnd(k, 63.7) * 9) + 's infinite"></span>';
    }
    wrap.innerHTML = html;
    $("#hero-wrap").appendChild(wrap);
  }

  /* ------------------------------------------------------------------ */
  /* FIREWORKS / CONFETTI / HEARTS (after scratch reveal)                */
  /* ------------------------------------------------------------------ */
  var fired = false;
  function fireCelebration() {
    if (fired) return;
    fired = true;
    var cv = document.createElement("canvas");
    cv.setAttribute("aria-hidden", "true");
    cv.className = "pointer-events-none fixed inset-0 z-40 h-full w-full";
    var main = $("main");
    main.insertBefore(cv, main.firstChild);
    var ctx = cv.getContext("2d");
    if (!ctx) return;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var size = function () { cv.width = window.innerWidth * dpr; cv.height = window.innerHeight * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
    size();
    window.addEventListener("resize", size);
    var W = function () { return window.innerWidth; }, H = function () { return window.innerHeight; };
    var P = [], u = function (a, b) { return a + Math.random() * (b - a); };
    var COL = { gold: "oklch(0.8 0.11 85)", rose: "oklch(0.75 0.1 25)", ivory: "oklch(0.96 0.02 85)" };
    var hues = ["gold", "rose", "ivory"];
    var burst = function (x, y) {
      for (var n = 0; n < 60; n++) {
        var a = Math.PI * 2 * n / 60 + u(-0.05, 0.05), sp = u(1.6, 5.2);
        P.push({ x: x, y: y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life: 0, max: u(60, 110), size: u(1.4, 3), hue: hues[n % 3], kind: "spark", spin: 0 });
      }
    };
    var confetti = function (c) {
      for (var t = 0; t < c; t++) P.push({ x: u(0, W()), y: u(-H() * 0.3, -10), vx: u(-0.7, 0.7), vy: u(1.4, 3.4), life: 0, max: u(180, 320), size: u(4, 9), hue: hues[t % 3], kind: "confetti", spin: u(-0.14, 0.14) });
    };
    var hearts = function (c) {
      for (var t = 0; t < c; t++) P.push({ x: u(0, W()), y: H() + u(0, 200), vx: u(-0.35, 0.35), vy: u(-1.5, -0.6), life: 0, max: u(220, 360), size: u(8, 18), hue: "rose", kind: "heart", spin: 0 });
    };
    var raf = 0, running = false;
    var heart = function (p) {
      var t = p.size;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y + t * 0.35);
      ctx.bezierCurveTo(p.x + t, p.y - t * 0.5, p.x + t * 0.55, p.y - t, p.x, p.y - t * 0.35);
      ctx.bezierCurveTo(p.x - t * 0.55, p.y - t, p.x - t, p.y - t * 0.5, p.x, p.y + t * 0.35);
      ctx.fill();
    };
    var loop = function () {
      ctx.clearRect(0, 0, W(), H());
      for (var e = P.length - 1; e >= 0; e--) {
        var t = P[e];
        t.life++; t.x += t.vx; t.y += t.vy;
        if (t.kind === "spark") { t.vy += 0.045; t.vx *= 0.985; t.vy *= 0.985; }
        else if (t.kind === "confetti") { t.vy += 0.012; t.x += Math.sin((t.life + t.size) / 18) * 0.7; }
        else t.x += Math.sin(t.life / 26) * 0.5;
        ctx.globalAlpha = Math.max(0, 1 - t.life / t.max);
        ctx.fillStyle = COL[t.hue];
        if (t.kind === "confetti") {
          ctx.save(); ctx.translate(t.x, t.y); ctx.rotate(t.life * t.spin);
          ctx.fillRect(-t.size / 2, -t.size / 4, t.size, t.size / 2); ctx.restore();
        } else if (t.kind === "heart") heart(t);
        else { ctx.beginPath(); ctx.arc(t.x, t.y, t.size, 0, Math.PI * 2); ctx.fill(); }
        if (t.life > t.max || t.y > H() + 80) P.splice(e, 1);
      }
      ctx.globalAlpha = 1;
      if (P.length) raf = requestAnimationFrame(loop); else running = false;
    };
    var kick = function () { if (!running) { running = true; raf = requestAnimationFrame(loop); } };
    for (var i = 0; i < 6; i++) setTimeout(function () { burst(u(W() * 0.15, W() * 0.85), u(H() * 0.15, H() * 0.5)); kick(); }, i * 480);
    confetti(140);
    hearts(22);
    setTimeout(function () { hearts(18); kick(); }, 1400);
    kick();
  }

  /* ------------------------------------------------------------------ */
  /* MUSIC                                                               */
  /* ------------------------------------------------------------------ */
  var audio = new Audio(CONFIG.music);
  audio.loop = true;
  audio.volume = 0.45;
  audio.preload = "auto";
  audio.setAttribute("playsinline", "");
  var playing = false, musicBtn = null;

  function renderMusicBtn() {
    if (!musicBtn) return;
    musicBtn.setAttribute("aria-pressed", String(playing));
    musicBtn.setAttribute("aria-label", playing ? "Turn music off" : "Turn music on");
    musicBtn.innerHTML = '<span aria-hidden="true" class="text-sm leading-none">' + (playing ? "♫" : "♪") + "</span>" + (playing ? "Music On" : "Music Off");
  }
  function setPlaying(v) { playing = v; renderMusicBtn(); }
  function tryPlay() { audio.muted = false; audio.play().then(function () { setPlaying(true); }).catch(function () { setPlaying(false); }); }
  function stopMusic() { audio.pause(); setPlaying(false); }
  function showMusicBtn() {
    if (musicBtn) return;
    musicBtn = document.createElement("button");
    musicBtn.type = "button";
    musicBtn.className = "fixed right-3 bottom-3 z-[60] flex items-center gap-2 rounded-full border border-gold/60 px-3 py-2 text-[0.6rem] tracking-[0.22em] text-gold-deep uppercase backdrop-blur transition-all duration-500 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold sm:right-5 sm:bottom-5 sm:px-4 sm:text-[0.65rem]";
    musicBtn.style.cssText = "background:oklch(0.99 0.008 88 / .8);box-shadow:var(--shadow-lift);margin-bottom:env(safe-area-inset-bottom);margin-right:env(safe-area-inset-right)";
    musicBtn.addEventListener("click", function () { if (playing) stopMusic(); else tryPlay(); });
    var main = $("main");
    main.insertBefore(musicBtn, $("#opening"));
    renderMusicBtn();
  }
  window.addEventListener("wedding:open", function () { showMusicBtn(); tryPlay(); });
  window.addEventListener("wedding:close", stopMusic);
  window.addEventListener("pagehide", stopMusic);
  document.addEventListener("visibilitychange", function () { if (document.hidden) stopMusic(); });

  /* ------------------------------------------------------------------ */
  /* OPEN / CLOSE LOGIC                                                  */
  /* ------------------------------------------------------------------ */
  var openInvite = function () { emit("wedding:open"); mountPetals(18, 12); };
  var royal = $("#royal-vows");
  new IntersectionObserver(function (entries) {
    var e = entries[0];
    if (e && e.isIntersecting) { openInvite(); return; }
    if (window.scrollY < window.innerHeight * 0.5) emit("wedding:close");
  }, { threshold: 0.01 }).observe(royal);

  /* ------------------------------------------------------------------ */
  /* OPENING VIDEO                                                       */
  /* ------------------------------------------------------------------ */
  var video = $("#opening-video"), tapBtn = $("#tap-to-begin"), scrollBtn = $("#opening-scroll");
  var begun = false, ended = false;
  video.addEventListener("ended", function () { ended = true; });
  function begin() {
    if (!begun) {
      begun = true;
      tapBtn.style.opacity = "0";
      tapBtn.style.pointerEvents = "none";
      openInvite();
      setTimeout(function () { scrollBtn.style.opacity = "1"; scrollBtn.style.pointerEvents = "auto"; }, 4500);
    }
    if (video.paused && !ended) video.play().catch(function () {});
  }
  tapBtn.addEventListener("click", begin);
  scrollBtn.addEventListener("click", function () {
    begin();
    setTimeout(function () { royal.scrollIntoView({ behavior: "smooth", block: "start" }); }, 80);
  });

  /* ------------------------------------------------------------------ */
  /* SCRATCH CARD                                                        */
  /* ------------------------------------------------------------------ */
  (function () {
    var cv = $("#scratch-canvas"), box = $("#scratch-box"), inner = $("#scratch-inner"), hint = $("#scratch-hint");
    var drawing = false, last = null, dist = 0, revealed = false;

    var days = Math.max(0, Math.ceil((target - Date.now()) / 864e5));
    var dEl = $("#days-to-go");
    dEl.textContent = days > 0 ? days + " " + (days === 1 ? "day" : "days") + " to go" : "Today is the day";
    dEl.hidden = false;

    function paint() {
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      var r = box.getBoundingClientRect(), w = r.width, h = r.height;
      cv.width = Math.max(1, w * dpr);
      cv.height = Math.max(1, h * dpr);
      var c = cv.getContext("2d");
      if (!c) return;
      c.setTransform(dpr, 0, 0, dpr, 0, 0);
      c.globalCompositeOperation = "source-over";
      var g = c.createLinearGradient(0, 0, w, h);
      g.addColorStop(0, "#B8933F"); g.addColorStop(0.3, "#E4C97F"); g.addColorStop(0.5, "#F7ECC9"); g.addColorStop(0.7, "#DCBB6C"); g.addColorStop(1, "#A9822F");
      c.fillStyle = g; c.fillRect(0, 0, w, h);
      var s = c.createLinearGradient(0, h, w, 0);
      s.addColorStop(0, "rgba(255,255,255,0)"); s.addColorStop(0.5, "rgba(255,255,255,0.22)"); s.addColorStop(1, "rgba(255,255,255,0)");
      c.fillStyle = s; c.fillRect(0, 0, w, h);
      c.fillStyle = "rgba(66,42,12,0.8)";
      c.font = "500 " + Math.max(11, Math.min(14, w / 26)) + "px Poppins, sans-serif";
      c.textAlign = "center"; c.textBaseline = "middle"; c.letterSpacing = "3px";
      c.fillText(CONFIG.scratchPrompt, w / 2, h / 2);
    }
    paint();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { if (!revealed && dist === 0) paint(); });
    window.addEventListener("resize", function () { if (!revealed) paint(); });

    function cleared() {
      var c = cv.getContext("2d", { willReadFrequently: true });
      if (!c) return 0;
      var d = c.getImageData(0, 0, cv.width, cv.height).data, n = 0;
      for (var i = 3; i < d.length; i += 64) if (d[i] < 40) n++;
      return n / (d.length / 64);
    }
    function reveal() {
      if (revealed) return;
      revealed = true;
      cv.style.opacity = "0";
      cv.style.pointerEvents = "none";
      inner.style.transform = "scale(1)";
      hint.textContent = "With all our love";
      emit("wedding:open");
      fireCelebration();
    }
    function scratch(x, y) {
      if (revealed) return;
      var r = cv.getBoundingClientRect(), a = x - r.left, b = y - r.top, c = cv.getContext("2d");
      if (!c) return;
      c.globalCompositeOperation = "destination-out";
      c.lineWidth = 46; c.lineCap = "round"; c.lineJoin = "round";
      c.beginPath();
      if (last) { dist += Math.hypot(a - last.x, b - last.y); c.moveTo(last.x, last.y); c.lineTo(a, b); c.stroke(); }
      c.arc(a, b, 23, 0, Math.PI * 2); c.fill();
      last = { x: a, y: b };
    }
    function check() {
      if (revealed) return;
      var lim = Math.min(box.clientWidth, box.clientHeight) * 0.85;
      if (cleared() >= 0.15 || dist >= lim) reveal();
    }
    var start = function (x, y) { drawing = true; last = null; scratch(x, y); };
    var move = function (x, y) { if (drawing) { scratch(x, y); check(); } };
    var end = function () { if (drawing) { drawing = false; last = null; check(); } };

    cv.addEventListener("pointerdown", function (e) { if (cv.setPointerCapture) cv.setPointerCapture(e.pointerId); start(e.clientX, e.clientY); });
    cv.addEventListener("pointermove", function (e) { e.preventDefault(); move(e.clientX, e.clientY); }, { passive: false });
    ["pointerup", "pointercancel", "pointerleave", "mouseup", "mouseleave", "touchend", "touchcancel"].forEach(function (n) { cv.addEventListener(n, end); });
    cv.addEventListener("mousedown", function (e) { start(e.clientX, e.clientY); });
    cv.addEventListener("mousemove", function (e) { move(e.clientX, e.clientY); });
    cv.addEventListener("touchstart", function (e) { var t = e.touches[0]; if (t) start(t.clientX, t.clientY); }, { passive: false });
    cv.addEventListener("touchmove", function (e) { var t = e.touches[0]; if (t) { e.preventDefault(); move(t.clientX, t.clientY); } }, { passive: false });
  })();

  /* ------------------------------------------------------------------ */
  /* BLESSING WALL (stored locally in the browser)                       */
  /* ------------------------------------------------------------------ */
  (function () {
    var KEY = "blessing_messages";
    var DEFAULTS = [
      { id: "a987d742-1138-4667-b460-0cbd13d9ef28", message: "I am so excited!!!", created_at: "2026-09-04T11:45:42.53697+00:00" },
      { id: "c075c85b-2899-4947-a0e5-709b7b25c84d", message: "Wowww! Super excited for your journey.", created_at: "2026-08-25T18:55:39.814164+00:00" },
      { id: "c1efca60-4270-48ee-8bc8-ae2a16204082", message: "We love you both, god bless you.", created_at: "2026-09-04T11:44:28.408136+00:00" },
      { id: "c9c895b4-ce5e-4b10-b9d3-6ade5942c911", message: "May god bless you!!!!", created_at: "2026-09-04T11:45:34.859924+00:00" },
      { id: "a051de87-a2d0-4637-954f-dda7cedcee50", message: "Wow!!! Super excited.", created_at: "2026-09-04T11:44:13.965542+00:00" },
      { id: "58d5e68e-d808-4ff8-8060-b738c432edbb", message: "So happy for you!", created_at: "2026-08-25T18:48:05.051821+00:00" },
      { id: "127e00f4-7c0e-44c9-bacf-064baa46b898", message: "super excitedddddd", created_at: "2026-08-30T15:15:52.414831+00:00" },
      { id: "9718d2b7-bf3b-4ab9-8a0a-ed498ba61fa1", message: "Nice", created_at: "2026-10-18T05:52:36.586627+00:00" }
    ];
    var form = $("#blessing-form"), ta = $("#blessing-message"), count = $("#blessing-count"),
      status = $("#blessing-status"), submit = $("#blessing-submit"), wall = $("#blessing-wall");
    var words = function (s) { return s.trim().split(/\s+/).filter(Boolean).length; };
    var hash = function (m) { return m.id.split("").reduce(function (a, c) { return a + c.charCodeAt(0); }, 0); };
    var load = function () {
      try {
        var raw = localStorage.getItem(KEY);
        return raw === null ? DEFAULTS.slice() : JSON.parse(raw || "[]");
      } catch (e) { return DEFAULTS.slice(); }
    };
    var save = function (l) { try { localStorage.setItem(KEY, JSON.stringify(l.slice(0, 24))); } catch (e) {} };
    var list = load();

    function render() {
      var shown = list.slice(0, 8).sort(function (a, b) { return hash(a) - hash(b); });
      wall.innerHTML = shown.map(function (m, t) {
        return '<article class="rounded-2xl border border-gold/35 px-4 py-5 text-center paper ' + (t % 3 === 1 ? "mt-8" : "") + '" style="box-shadow:var(--shadow-luxe);transform:rotate(' + (t % 2 === 0 ? -1.2 : 1.1) + 'deg)">' +
          '<span class="font-display text-2xl text-gold">❦</span>' +
          '<p class="mt-3 font-display text-xl leading-snug text-ink sm:text-2xl">“' + esc(m.message) + '”</p></article>';
      }).join("");
    }
    function updateCount() { count.textContent = ta.value.length + "/50 characters · " + words(ta.value) + "/10 words"; }
    function say(msg) { status.textContent = msg; status.hidden = !msg; }

    ta.addEventListener("input", function () { if (ta.value.length > 50) ta.value = ta.value.slice(0, 50); updateCount(); });
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var msg = ta.value.trim().replace(/\s+/g, " ");
      if (!msg) return say("Please write a short blessing.");
      if (msg.length > 50 || words(msg) > 10) return say("Keep it to 10 words and under 50 characters.");
      submit.disabled = true; submit.textContent = "Adding";
      var item = { id: (crypto.randomUUID ? crypto.randomUUID() : String(Date.now()) + Math.random().toString(16).slice(2)), message: msg, created_at: new Date().toISOString() };
      list = [item].concat(list).slice(0, 24);
      save(list);
      submit.disabled = false; submit.textContent = "Add Blessing";
      ta.value = ""; updateCount(); render();
      say("Your blessing has been added anonymously.");
    });
    render();
  })();
})();
