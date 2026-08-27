export function initProjectDrawers() {
  const workItems = [...document.querySelectorAll('.work-item')];

  function updateItemState(item, isExpanded) {
    const summary = item.querySelector('.work-item__summary');
    const textSpan = item.querySelector('.work-item__toggle-btn .toggle-text');
    summary?.setAttribute('aria-expanded', String(isExpanded));
    if (textSpan) textSpan.textContent = isExpanded ? 'Close Project Details' : 'Read Case Study';
  }

  function loadPreviewImage(item) {
    const previewImage = item.querySelector('.work-item__preview-img[data-src]');
    const previewFrame = previewImage?.closest('.work-item__preview-frame');
    if (!previewImage || previewImage.getAttribute('src')) return;

    previewFrame?.classList.add('is-loading');
    previewImage.addEventListener('load', () => {
      previewFrame?.classList.remove('is-loading');
      previewFrame?.classList.add('is-loaded');
    }, { once: true });
    previewImage.addEventListener('error', () => {
      previewFrame?.classList.remove('is-loading');
      previewFrame?.classList.add('is-error');
    }, { once: true });
    previewImage.src = previewImage.dataset.src;
  }

  function setExpanded(item, shouldExpand) {
    const drawer = item.querySelector('.work-item__drawer');
    if (!drawer || item.classList.contains('expanded') === shouldExpand) return;

    if (shouldExpand) {
      loadPreviewImage(item);
      item.classList.add('expanded');
      drawer.style.height = '0px';
      drawer.getBoundingClientRect();
      drawer.style.height = `${drawer.scrollHeight}px`;
    } else {
      drawer.style.height = `${drawer.scrollHeight}px`;
      drawer.getBoundingClientRect();
      item.classList.remove('expanded');
      requestAnimationFrame(() => {
        drawer.style.height = '0px';
      });
    }

    updateItemState(item, shouldExpand);
  }

  workItems.forEach((item) => {
    const summary = item.querySelector('.work-item__summary');
    const drawer = item.querySelector('.work-item__drawer');

    drawer?.addEventListener('transitionend', (event) => {
      if (event.propertyName === 'height' && item.classList.contains('expanded')) {
        drawer.style.height = 'auto';
      }
    });

    function toggleDrawer(event) {
      if (event.target.closest('a')) return;
      const shouldExpand = !item.classList.contains('expanded');
      if (shouldExpand) {
        workItems.forEach((otherItem) => {
          if (otherItem !== item) setExpanded(otherItem, false);
        });
      }
      setExpanded(item, shouldExpand);
    }

    summary?.addEventListener('click', toggleDrawer);
    summary?.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      toggleDrawer(event);
    });
  });
}
