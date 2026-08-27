

export function initProjectDrawers() {
  const workItems = document.querySelectorAll('.work-item');

  workItems.forEach((item) => {
    const summary = item.querySelector('.work-item__summary');
    const toggleBtn = item.querySelector('.work-item__toggle-btn');
    const previewImage = item.querySelector('.work-item__preview-img[data-src]');
    const previewFrame = previewImage?.closest('.work-item__preview-frame');

    function loadPreviewImage() {
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

    function toggleDrawer(e) {
      if (e.target.tagName.toLowerCase() === 'a') return;

      const isExpanded = item.classList.toggle('expanded');
      if (isExpanded) loadPreviewImage();
      summary?.setAttribute('aria-expanded', String(isExpanded));
      if (toggleBtn) {
        const textSpan = toggleBtn.querySelector('.toggle-text');
        if (textSpan) {
          textSpan.textContent = isExpanded ? 'Close Project Details' : 'Read Case Study';
        }
      }
    }

    summary?.addEventListener('click', toggleDrawer);
    summary?.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      toggleDrawer(event);
    });
  });
}
