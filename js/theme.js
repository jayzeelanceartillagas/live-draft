

export function initThemeSwitcher() {
  const themeButtons = document.querySelectorAll('[data-theme-choice]');
  const savedTheme = localStorage.getItem('jayzee-theme-choice') || 'linen';

  applyTheme(savedTheme);

  themeButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const theme = btn.dataset.themeChoice;
      applyTheme(theme);
      localStorage.setItem('jayzee-theme-choice', theme);
    });
  });
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  window.updateSiteFavicon?.(theme);

  document.querySelectorAll('[data-theme-choice]').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.themeChoice === theme);
  });
}
