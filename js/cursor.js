

export function initCursorAndPreviews() {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const cursorDot = document.getElementById('custom-cursor-dot');
  const cursorRing = document.getElementById('custom-cursor-ring');
  const cursorBadge = document.getElementById('custom-cursor-badge');
  const floatingPreview = document.getElementById('floating-project-preview');
  const previewImg = floatingPreview?.querySelector('.floating-preview__img');
  const previewTitle = floatingPreview?.querySelector('.floating-preview__title');

  if (!cursorDot || !cursorRing) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;
  let previewX = mouseX;
  let previewY = mouseY;
  let previewTargetX = mouseX;
  let previewTargetY = mouseY;

  let isHoveringInteractive = false;
  let isHoveringProject = false;
  let currentBadgeText = '';

  const projectPreviews = {
    'work-item-1': {
      img: 'assets/images/project-greencab.png',
      title: 'GreenCab',
    },
    'work-item-2': {
      img: 'assets/images/project-alamo.png',
      title: 'Alamo Apartments',
    },
  };

  function hideProjectPreview() {
    floatingPreview?.classList.remove('visible');
    isHoveringProject = false;
    setCursorState('', false);
  }

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;

    previewTargetX = mouseX + 24;
    previewTargetY = mouseY - 120;
  });

  function render() {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;

    cursorRing.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;

    if (floatingPreview && isHoveringProject) {
      previewX += (previewTargetX - previewX) * 0.12;
      previewY += (previewTargetY - previewY) * 0.12;

      const tilt = (mouseX - ringX) * 0.4;
      floatingPreview.style.transform = `translate3d(${previewX}px, ${previewY}px, 0) rotate(${tilt}deg)`;
    }

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);

  function setCursorState(badgeText = '', scaleRing = false) {
    if (badgeText) {
      cursorBadge.textContent = badgeText;
      cursorRing.classList.add('has-badge');
    } else {
      cursorRing.classList.remove('has-badge');
    }

    if (scaleRing) {
      cursorRing.classList.add('scaled');
    } else {
      cursorRing.classList.remove('scaled');
    }
  }

  document.querySelectorAll('.work-item').forEach((item) => {
    item.addEventListener('mouseenter', () => {
      if (item.classList.contains('expanded')) {
        hideProjectPreview();
        return;
      }
      const id = item.id;
      const data = projectPreviews[id];

      if (data && previewImg && previewTitle && floatingPreview) {
        previewImg.src = data.img;
        previewTitle.textContent = data.title;
        floatingPreview.classList.add('visible');
        isHoveringProject = true;
      }
      setCursorState('READ', true);
    });

    item.addEventListener('mouseleave', () => {
      hideProjectPreview();
    });

    item.addEventListener('click', () => {
      requestAnimationFrame(() => {
        if (item.classList.contains('expanded')) hideProjectPreview();
      });
    });
  });

  document.querySelectorAll('a, button, .badge-stamp').forEach((el) => {
    el.addEventListener('mouseenter', () => {
      if (el.id === 'copy-email-btn') {
        setCursorState('COPY', true);
      } else if (el.closest('#playground-section')) {
        setCursorState('TOSS', true);
      } else if (!isHoveringProject) {
        setCursorState('', true);
      }
    });

    el.addEventListener('mouseleave', () => {
      if (!isHoveringProject) {
        setCursorState('', false);
      }
    });
  });

  const playground = document.getElementById('playground-canvas');
  if (playground) {
    playground.addEventListener('mouseenter', () => setCursorState('TOSS', true));
    playground.addEventListener('mouseleave', () => setCursorState('', false));
  }
}
