

export function initProjectDrawers() {
  const workItems = document.querySelectorAll('.work-item');

  workItems.forEach((item) => {
    const summary = item.querySelector('.work-item__summary');
    const toggleBtn = item.querySelector('.work-item__toggle-btn');

    function toggleDrawer(e) {
      if (e.target.tagName.toLowerCase() === 'a') return;

      const isExpanded = item.classList.toggle('expanded');
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
