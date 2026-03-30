(function () {
  'use strict';

  const stage = document.querySelector('.hcf-fusion-stage');
  if (!stage) return;

  const isMobile = window.innerWidth <= 768;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Desktop: GSAP ScrollTrigger */
  if (!isMobile && typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    const mm = gsap.matchMedia();
    mm.add('(min-width: 769px)', () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: '.hcf-fusion-stage',
          start: 'top top',
          end: '+=2200',
          scrub: 1,
          pin: '.hcf-fusion-sticky',
          anticipatePin: 1,
          invalidateOnRefresh: true,
          fastScrollEnd: true
        }
      });

      gsap.set('.hcf-piece--triangle', { xPercent: 0, yPercent: 0, scale: 0.72, opacity: 0.08, filter: 'blur(10px)' });
      gsap.set('.hcf-piece--anchor', { xPercent: 0, yPercent: 0, y: -320, scale: 0.92, opacity: 0, filter: 'blur(3px)' });
      gsap.set('.hcf-piece--shark', { x: -520, y: 60, rotation: -12, scale: 1.12, opacity: 0, filter: 'blur(10px)' });
      gsap.set('.hcf-piece__label', { opacity: 0, y: 20 });
      gsap.set('.hcf-energy-ring--1', { scale: 0.85, opacity: 0.2 });
      gsap.set('.hcf-energy-ring--2', { scale: 1.15, opacity: 0.08 });
      gsap.set('.hcf-final-logo-wrap', { opacity: 0, scale: 0.84 });
      gsap.set('.hcf-final-burst', { opacity: 0, scale: 0.2 });
      gsap.set('.hcf-impact-flash', { opacity: 0, scale: 0.2 });

      tl.to('.hcf-piece--triangle', { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 0.9, ease: 'power2.out' })
        .to('.hcf-piece--triangle .hcf-piece__label', { opacity: 1, y: 0, duration: 0.35 }, '<0.1')
        .to('.hcf-energy-ring--1', { scale: 1, opacity: 0.34, duration: 0.8, ease: 'power2.out' }, '<')
        .to('.hcf-piece--anchor', { opacity: 1, y: -40, filter: 'blur(0px)', duration: 0.9, ease: 'power3.out' }, '+=0.15')
        .to('.hcf-piece--anchor .hcf-piece__label', { opacity: 1, y: 0, duration: 0.35 }, '<0.05')
        .to('.hcf-piece--anchor', { y: 0, duration: 0.55, ease: 'bounce.out' })
        .to('.hcf-energy-ring--2', { opacity: 0.28, scale: 1, duration: 0.8, ease: 'power2.out' }, '<')
        .to('.hcf-piece--shark', { x: -60, y: 10, rotation: -5, opacity: 1, filter: 'blur(2px)', duration: 0.85, ease: 'power4.out' }, '+=0.15')
        .to('.hcf-piece--shark .hcf-piece__label', { opacity: 1, y: 0, duration: 0.3 }, '<0.1')
        .to('.hcf-piece--shark', { x: 0, y: 0, rotation: 0, scale: 1, filter: 'blur(0px)', duration: 0.42, ease: 'power2.out' })
        .to('.hcf-piece--shark', { x: '+=6', duration: 0.05, repeat: 3, yoyo: true, ease: 'none' })
        .to('.hcf-impact-flash', { opacity: 1, scale: 3.6, duration: 0.22, ease: 'power2.out' })
        .to('.hcf-impact-flash', { opacity: 0, duration: 0.2 })
        .to('.hcf-piece--triangle', { scale: 0.98, opacity: 0.68, duration: 0.55, ease: 'power2.inOut' }, '-=0.05')
        .to('.hcf-piece--anchor', { scale: 0.96, opacity: 0.74, duration: 0.55, ease: 'power2.inOut' }, '<')
        .to('.hcf-piece--shark', { scale: 0.95, opacity: 0.78, duration: 0.55, ease: 'power2.inOut' }, '<')
        .to('.hcf-piece__label', { opacity: 0, duration: 0.22 }, '<')
        .to('.hcf-final-burst', { opacity: 1, scale: 4.8, duration: 0.3, ease: 'power3.out' })
        .to('.hcf-final-logo-wrap', { opacity: 1, scale: 1, duration: 0.42, ease: 'power3.out' }, '<0.05')
        .to('.hcf-piece--triangle', { opacity: 0, scale: 1.05, duration: 0.28 }, '<')
        .to('.hcf-piece--anchor', { opacity: 0, y: 20, duration: 0.28 }, '<')
        .to('.hcf-piece--shark', { opacity: 0, x: 30, duration: 0.28 }, '<')
        .to('.hcf-final-logo-wrap', { y: -8, repeat: 1, yoyo: true, duration: 0.7, ease: 'sine.inOut' });
    });
    return;
  }

  /* Mobile immersive experience */
  if (!isMobile || prefersReducedMotion) return;

  // Full-screen intro
  const section = document.querySelector('.hcf-philosophy-cinematic');
  if (section) {
    let introShown = false;
    const introObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !introShown) {
        introShown = true;
        const overlay = document.createElement('div');
        overlay.id = 'hcf-mobile-intro';
        overlay.style.cssText = 'position:fixed;inset:0;z-index:9999;background:#03070e;display:flex;flex-direction:column;align-items:center;justify-content:center;opacity:1;transition:opacity 0.8s ease;pointer-events:all;';
        overlay.innerHTML = '<img src="assets/final-logo.png" alt="HCF" style="width:60vw;max-width:300px;animation:hcfIntroLogoIn 1.5s cubic-bezier(.16,1,.3,1) both;" /><p style="color:var(--hcf-cyan);margin-top:20px;font-size:12px;letter-spacing:0.2em;animation:hcfIntroLogoIn 1.5s cubic-bezier(.16,1,.3,1) 0.3s both;">HONOR × COURAGE × FAITH</p>';

        const style = document.createElement('style');
        style.textContent = '@keyframes hcfIntroLogoIn { 0% { opacity:0; transform:scale(0.7) translateY(30px); filter:blur(12px); } 100% { opacity:1; transform:scale(1) translateY(0); filter:blur(0); } }';
        document.head.appendChild(style);
        document.body.appendChild(overlay);
        document.body.style.overflow = 'hidden';

        setTimeout(() => {
          overlay.style.opacity = '0';
          document.body.style.overflow = '';
          setTimeout(() => overlay.remove(), 800);
        }, 2800);

        introObserver.disconnect();
      }
    }, { threshold: 0.3 });
    introObserver.observe(section);
  }

  // Scroll reveal
  const pieces = document.querySelectorAll('.hcf-piece, .hcf-final-logo-wrap');
  pieces.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(60px)';
    el.style.filter = 'blur(8px)';
    el.style.transition = 'opacity 0.8s cubic-bezier(.16,1,.3,1) ' + (i * 0.12) + 's, transform 0.8s cubic-bezier(.16,1,.3,1) ' + (i * 0.12) + 's, filter 0.8s ease ' + (i * 0.12) + 's';
  });

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        entry.target.style.filter = 'blur(0px)';
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2, rootMargin: '0px 0px -8% 0px' });
  pieces.forEach(el => revealObserver.observe(el));

  // Lightweight parallax
  const parallaxItems = [
    { selector: '.hcf-piece--triangle', speed: 0.03 },
    { selector: '.hcf-piece--anchor',   speed: 0.06 },
    { selector: '.hcf-piece--shark',    speed: 0.09 },
  ];
  const pItems = parallaxItems.map(p => ({
    el: document.querySelector(p.selector), speed: p.speed
  })).filter(p => p.el);

  let pTicking = false;
  if (pItems.length) {
    window.addEventListener('scroll', () => {
      if (!pTicking) {
        requestAnimationFrame(() => {
          pItems.forEach(({ el, speed }) => {
            const rect = el.getBoundingClientRect();
            const offset = (rect.top + rect.height / 2 - window.innerHeight / 2) * speed;
            el.style.transform = 'translateY(' + offset + 'px)';
          });
          pTicking = false;
        });
        pTicking = true;
      }
    }, { passive: true });
  }

  // Gyroscope tilt
  const canvas = document.querySelector('.hcf-fusion-canvas');
  if (canvas) {
    const gyroLayers = [
      { el: canvas.querySelector('.hcf-energy-ring--1'), depth: 0.3 },
      { el: canvas.querySelector('.hcf-energy-ring--2'), depth: 0.5 },
      { el: canvas.querySelector('.hcf-piece--triangle'), depth: 0.8 },
      { el: canvas.querySelector('.hcf-piece--anchor'),   depth: 1.2 },
      { el: canvas.querySelector('.hcf-piece--shark'),    depth: 1.0 },
      { el: canvas.querySelector('.hcf-final-logo-wrap'), depth: 1.5 },
    ].filter(l => l.el);

    let gyroEnabled = false;

    function handleOrientation(e) {
      if (!gyroEnabled) return;
      const gamma = Math.max(-25, Math.min(25, e.gamma || 0));
      const beta  = Math.max(-25, Math.min(25, (e.beta || 0) - 45));
      gyroLayers.forEach(({ el, depth }) => {
        const x = gamma * depth * 0.6;
        const y = beta  * depth * 0.4;
        el.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
        el.style.transition = 'transform 0.15s ease-out';
      });
    }

    const hint = document.createElement('div');
    hint.className = 'hcf-gyro-hint';
    hint.textContent = '👆 點擊啟動體感互動';
    canvas.appendChild(hint);

    canvas.addEventListener('click', async () => {
      if (gyroEnabled) return;
      try {
        if (typeof DeviceOrientationEvent !== 'undefined'
            && typeof DeviceOrientationEvent.requestPermission === 'function') {
          const perm = await DeviceOrientationEvent.requestPermission();
          if (perm === 'granted') { gyroEnabled = true; window.addEventListener('deviceorientation', handleOrientation); }
        } else {
          gyroEnabled = true;
          window.addEventListener('deviceorientation', handleOrientation);
        }
      } catch (err) { /* silent degradation */ }
      if (gyroEnabled) { hint.style.display = 'none'; }
    }, { once: true });
  }
})();
