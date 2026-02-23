// Bright bubble arrow custom cursor
(function () {
  if (typeof window === 'undefined') return;
  if (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) return; // don't run on touch

  const cursor = document.createElement('div');
  cursor.className = 'custom-cursor hide';
  // halo behind the pointer
  const halo = document.createElement('div');
  halo.className = 'cursor-halo';
  cursor.appendChild(halo);
  // use image element inside for crisp pointer and proper hitbox
  const img = document.createElement('img');
  // local filenames for the two attached images (place these in `assets/`):
  // - assets/cursor-arrow.png  (default arrow)
  // - assets/cursor-go.png     (link / go pointer)
  const arrowSrc = 'assets/cursor-arrow.png';
  const goSrc = 'assets/cursor-go.png';
  // preload both
  const _p1 = new Image(); _p1.src = arrowSrc;
  const _p2 = new Image(); _p2.src = goSrc;
  img.src = arrowSrc;
  img.alt = 'cursor';
  img.draggable = false;
  cursor.appendChild(img);
  document.body.appendChild(cursor);

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let posX = mouseX;
  let posY = mouseY;
  const speed = 0.18;

  function animate() {
    posX += (mouseX - posX) * speed;
    posY += (mouseY - posY) * speed;
    const dx = mouseX - posX;
    const dy = mouseY - posY;
    // angle for subtle rotation (pointing direction)
    const angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90; // adjust for image orientation
    cursor.style.left = posX + 'px';
    cursor.style.top = posY + 'px';
    cursor.style.setProperty('--angle', angle + 'deg');
    // halo offset for dynamic feel
    if (halo) {
      halo.style.transform = `translate(${ -dx * 0.12 }px, ${ -dy * 0.12 }px) scale(${1 + Math.min(Math.hypot(dx,dy) / 600, 0.18)})`;
    }
    requestAnimationFrame(animate);
  }
  animate();

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.classList.remove('hide');
  });

  document.addEventListener('mouseenter', () => cursor.classList.remove('hide'));
  document.addEventListener('mouseleave', () => cursor.classList.add('hide'));

  document.addEventListener('mousedown', () => {
    cursor.classList.add('grow');
    cursor.classList.add('pressed');
    setTimeout(() => cursor.classList.remove('grow'), 160);
  });

  document.addEventListener('mouseup', () => {
    cursor.classList.remove('grow');
    cursor.classList.remove('pressed');
  });

  // Also set native CSS cursor as fallback for precise pointer targeting
  try {
    // Attempt to set a native cursor fallback using local asset (hotspot coords may need tweaking)
    document.documentElement.style.cursor = "url('assets/cursor-arrow.png') 12 4, auto";
  } catch (e) {
    // ignore if browser rejects cursor setting
  }

  // Make cursor react to interactive elements
  const interactiveSelector = 'a, button, input, textarea, .btn, .nav-link, .project-btn, .project-btn-secondary';
  function attachHover(el) {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('small');
      cursor.classList.add('hover');
      // switch to "go" image for interactive elements
      try { img.src = goSrc; } catch (e) {}
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('small');
      cursor.classList.remove('hover');
      // revert to default arrow
      try { img.src = arrowSrc; } catch (e) {}
    });
  }

  function bindAll() {
    document.querySelectorAll(interactiveSelector).forEach(attachHover);
  }

  // Bind initial and on DOM changes
  bindAll();
  const mo = new MutationObserver(bindAll);
  mo.observe(document.body, { childList: true, subtree: true });
})();
