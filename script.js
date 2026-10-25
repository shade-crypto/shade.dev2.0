(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const preloader = $('.preloader');
  if (preloader) addEventListener('load', () => setTimeout(() => preloader.classList.add('done'), 350), { once: true });

  const menuButton = $('.menu-toggle');
  const menu = $('.nav-links');
  menuButton?.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Закрити меню' : 'Відкрити меню');
  });
  $$('.nav-links a').forEach(link => link.addEventListener('click', () => {
    menu?.classList.remove('open');
    menuButton?.setAttribute('aria-expanded', 'false');
  }));

  const themeButton = $('.theme-toggle');
  const savedTheme = localStorage.getItem('shade-theme');
  if (savedTheme === 'light') document.body.classList.add('light-theme');
  const updateThemeButton = () => {
    if (!themeButton) return;
    const light = document.body.classList.contains('light-theme');
    themeButton.textContent = light ? '☾' : '☼';
    themeButton.setAttribute('aria-label', light ? 'Увімкнути темну тему' : 'Увімкнути світлу тему');
  };
  updateThemeButton();
  themeButton?.addEventListener('click', () => {
    document.body.classList.toggle('light-theme');
    localStorage.setItem('shade-theme', document.body.classList.contains('light-theme') ? 'light' : 'dark');
    updateThemeButton();
  });

  const header = $('.site-header');
  const topButton = $('.back-top');
  const onScroll = () => {
    header?.classList.toggle('scrolled', scrollY > 12);
    topButton?.classList.toggle('visible', scrollY > 450);
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  topButton?.addEventListener('click', () => scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' }));

  const observer = 'IntersectionObserver' in window && !reducedMotion
    ? new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    }), { threshold: .12 }) : null;
  $$('.reveal').forEach(item => observer ? observer.observe(item) : item.classList.add('in-view'));

  const toast = $('.toast');
  let toastTimer;
  const showToast = message => {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('visible'), 2000);
  };
  $('.copy-button')?.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText('@ShadeDev');
      showToast('Нік @ShadeDev скопійовано');
    } catch {
      showToast('Напиши мені: @ShadeDev');
    }
  });
  $$('.year').forEach(el => el.textContent = new Date().getFullYear());

  const canvas = $('.star-canvas');
  if (canvas && !reducedMotion) {
    const context = canvas.getContext('2d');
    let width = 0, height = 0, stars = [];
    const resize = () => {
      const ratio = Math.min(devicePixelRatio || 1, 2);
      width = innerWidth; height = innerHeight;
      canvas.width = width * ratio; canvas.height = height * ratio;
      canvas.style.width = `${width}px`; canvas.style.height = `${height}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      stars = Array.from({ length: Math.min(190, Math.round(width * height / 7000)) }, () => ({
        x: Math.random() * width, y: Math.random() * height,
        r: Math.random() * 1.25 + .25, phase: Math.random() * Math.PI * 2,
        speed: Math.random() * .018 + .004, alpha: Math.random() * .55 + .2
      }));
    };
    let frame;
    const draw = time => {
      context.clearRect(0, 0, width, height);
      for (const star of stars) {
        const glow = (Math.sin(time * star.speed + star.phase) + 1) / 2;
        context.globalAlpha = star.alpha * (.55 + glow * .45);
        context.fillStyle = glow > .88 ? '#b7adff' : '#ffffff';
        context.beginPath(); context.arc(star.x, star.y, star.r * (glow > .9 ? 1.5 : 1), 0, Math.PI * 2); context.fill();
      }
      context.globalAlpha = 1;
      frame = requestAnimationFrame(draw);
    };
    resize(); frame = requestAnimationFrame(draw);
    addEventListener('resize', resize, { passive: true });
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) cancelAnimationFrame(frame);
      else frame = requestAnimationFrame(draw);
    });
  }
  const cometLayer = $('.comet-layer');
  if (cometLayer && !reducedMotion && innerWidth > 600) {
    for (let i = 0; i < 5; i++) {
      const comet = document.createElement('i');
      comet.className = 'comet';
      comet.style.setProperty('--top', `${8 + Math.random() * 76}%`);
      comet.style.setProperty('--left', `${35 + Math.random() * 78}%`);
      comet.style.setProperty('--duration', `${8 + Math.random() * 10}s`);
      comet.style.setProperty('--delay', `${Math.random() * -16}s`);
      cometLayer.append(comet);
    }
  }
})();
