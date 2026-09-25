/* Main Street Woodworks — shared scroll/reveal motion (GSAP + ScrollTrigger).
   Streaming safe: rescans for newly added elements. Fail safe: html.anim-off reveals all. */
(function () {
  var EASE = 'expo.out';
  var api = {};
  var S = { ran: false, safety: null, triggers: [], introDone: false, scanTimer: null, scans: 0 };

  function reveal() { document.documentElement.classList.add('anim-off'); }

  // Header veil: fades the gradient blur in once the page leaves the top.
  function veil() {
    if (S.veilBound) return;
    S.veilBound = true;
    var last = null;
    var apply = function () {
      var on = window.scrollY > 18 ? '1' : '0';
      if (on === last) return;
      last = on;
      var nodes = document.querySelectorAll('[data-veil]');
      for (var i = 0; i < nodes.length; i++) nodes[i].style.opacity = on;
    };
    window.addEventListener('scroll', apply, { passive: true });
    window.addEventListener('resize', apply);
    // Poll as well: some embedded views never dispatch scroll events.
    setInterval(apply, 150);
    apply();
  }
  function done(el) { if (el.dataset.mswDone) return true; el.dataset.mswDone = '1'; return false; }
  function track(tw) { if (tw && tw.scrollTrigger) S.triggers.push(tw.scrollTrigger); return tw; }

  api.init = function (opts) {
    opts = opts || {};
    veil();
    if (opts.motion === false || window.matchMedia('(prefers-reduced-motion: reduce)').matches) { reveal(); return; }
    clearTimeout(S.safety);
    S.ran = false;
    S.safety = setTimeout(function () { if (!S.ran) reveal(); }, 4000);
    var tries = 0;
    (function poll() {
      if (window.gsap && window.ScrollTrigger) {
        try { start(); } catch (e) { console.warn('motion failed', e); reveal(); }
        return;
      }
      if (++tries > 50) { reveal(); return; }
      setTimeout(poll, 60);
    })();
  };

  api.kill = function () {
    S.triggers.forEach(function (t) { try { t.kill(); } catch (e) {} });
    S.triggers = [];
    clearTimeout(S.safety);
    clearInterval(S.scanTimer);
  };

  function start() {
    clearTimeout(S.safety);
    S.ran = true;
    // A hidden tab does not tick rAF, so tweens would sit at their from-state.
    if (document.hidden) {
      document.addEventListener('visibilitychange', function onVis() {
        if (document.hidden) return;
        document.removeEventListener('visibilitychange', onVis);
        start();
      });
      reveal();
      return;
    }
    document.documentElement.classList.remove('anim-off');
    window.gsap.registerPlugin(window.ScrollTrigger);
    scan();
    clearInterval(S.scanTimer);
    S.scans = 0;
    S.scanTimer = setInterval(function () {
      scan();
      if (++S.scans > 30) clearInterval(S.scanTimer);
    }, 300);
    window.addEventListener('load', function () { scan(); window.ScrollTrigger.refresh(); }, { once: true });
  }

  function scan() {
    var gsap = window.gsap;
    var fresh = false;

    // Intro: hero clip reveal + headline lines + intro block
    var lines = gsap.utils.toArray('[data-anim="line"]').filter(function (el) { return !el.dataset.mswDone; });
    var intro = gsap.utils.toArray('[data-intro]').filter(function (el) { return !el.dataset.mswDone; });
    var revealEl = document.querySelector('[data-anim="reveal"]:not([data-msw-done])');
    var heroImg = document.querySelector('[data-anim="heroimg"]:not([data-msw-done])');

    if (lines.length || intro.length || revealEl || heroImg) {
      var tl = gsap.timeline({ defaults: { ease: EASE } });
      if (revealEl) { done(revealEl); tl.to(revealEl, { clipPath: 'inset(0 0 0% 0)', duration: 1.8, ease: 'expo.inOut' }, 0); }
      if (heroImg) { done(heroImg); tl.fromTo(heroImg, { scale: 1.16 }, { scale: 1, duration: 2.8, ease: 'power2.out' }, 0); }
      if (lines.length) { lines.forEach(done); tl.fromTo(lines, { yPercent: 112, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 1.55, stagger: 0.13 }, 0.1); }
      if (intro.length) { intro.forEach(done); tl.fromTo(intro, { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: 1.35, stagger: 0.1 }, 0.42); }
      fresh = true;
    }

    gsap.utils.toArray('[data-anim="fade"]').forEach(function (el) {
      if (done(el)) return;
      fresh = true;
      track(gsap.fromTo(el, { y: 30, opacity: 0 }, {
        y: 0, opacity: 1, duration: 1.5, ease: EASE, overwrite: 'auto',
        scrollTrigger: { trigger: el, start: 'top 96%', once: true }
      }));
    });

    gsap.utils.toArray('[data-anim="tile"]').forEach(function (el) {
      if (done(el)) return;
      fresh = true;
      track(gsap.fromTo(el, { y: 62, opacity: 0 }, {
        y: 0, opacity: 1, duration: 1.7, ease: EASE, overwrite: 'auto',
        scrollTrigger: { trigger: el, start: 'top 97%', once: true }
      }));
    });

    gsap.utils.toArray('[data-anim="rule"]').forEach(function (el) {
      if (done(el)) return;
      fresh = true;
      track(gsap.fromTo(el, { scaleX: 0 }, {
        scaleX: 1, duration: 1.8, ease: 'expo.inOut', transformOrigin: 'left center',
        scrollTrigger: { trigger: el, start: 'top 97%', once: true }
      }));
    });

    gsap.utils.toArray('[data-anim="parallax"]').forEach(function (el) {
      if (done(el)) return;
      fresh = true;
      track(gsap.fromTo(el, { yPercent: -7, scale: 1.1 }, {
        yPercent: 7, ease: 'none',
        scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: 1.1 }
      }));
    });

    if (fresh) window.ScrollTrigger.refresh();
  }

  window.MSWMotion = api;
})();
