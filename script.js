(function () {
  const stage = document.getElementById('stage');
  const introEl = document.getElementById('intro');
  const roseBtn = document.getElementById('rose-wrap');
  const plane = document.getElementById('plane');
  const surprise = document.getElementById('surprise');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let played = false;

  function unlockScroll() {
    introEl.style.display = 'none';
    surprise.setAttribute('aria-hidden', 'false');
    surprise.classList.add('unlocked');
    stage.classList.add('unlocked');
    document.body.classList.add('unlocked');
  }

  function flyAndReveal() {
    if (played) return;
    played = true;
    roseBtn.disabled = true;

    if (reduceMotion) {
      unlockScroll();
      return;
    }

    plane.style.opacity = '1';
    const duration = 2600; // ms
    const start = performance.now();

    function frame(now) {
      let t = (now - start) / duration;
      if (t > 1) t = 1;

      // ease in-out
      const eased = t < 0.5
        ? 2 * t * t
        : 1 - Math.pow(-2 * t + 2, 2) / 2;

      // plane travels from -18vw to 118vw
      const planeX = -18 + eased * 136;
      plane.style.left = planeX + 'vw';

      // gentle vertical bob
      const bob = Math.sin(t * Math.PI * 3) * 10;
      plane.style.top = 'calc(38% + ' + bob + 'px)';

      // curtain trails slightly behind the plane's nose
      const curtainP = Math.min(100, Math.max(0, eased * 118 - 12));
      introEl.style.clipPath = 'inset(0 0 0 ' + curtainP + '%)';

      if (t < 1) {
        requestAnimationFrame(frame);
      } else {
        unlockScroll();
      }
    }
    requestAnimationFrame(frame);
  }

  roseBtn.addEventListener('click', flyAndReveal);
  roseBtn.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      flyAndReveal();
    }
  });
})();
