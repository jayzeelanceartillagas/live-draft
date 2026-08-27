(function () {
  const palettes = {
    linen: { background: '#fbf9f5', ink: '#161514', accent: '#c84b2c' },
    kyoto: { background: '#181715', ink: '#f4efe6', accent: '#e6532e' },
    '8bit': { background: '#d6dec2', ink: '#1e2917', accent: '#b85223' }
  };

  function faviconSvg(palette) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><path fill="${palette.ink}" d="M10 8h42a8 8 0 0 1 8 8v38a8 8 0 0 1-8 8H10a8 8 0 0 1-8-8V16a8 8 0 0 1 8-8Z"/><path fill="${palette.background}" stroke="${palette.ink}" stroke-width="3" d="M8 3h42a8 8 0 0 1 8 8v38a8 8 0 0 1-8 8H8a8 8 0 0 1-8-8V11a8 8 0 0 1 8-8Z"/><path fill="${palette.accent}" d="M0 11a8 8 0 0 1 8-8h15L0 26Z"/><path fill="none" stroke="${palette.ink}" stroke-linecap="square" stroke-width="7" d="M42 18v22c0 8-5 12-12 12-6 0-10-3-12-8"/><circle cx="48" cy="13" r="4" fill="${palette.accent}"/></svg>`;
  }

  window.updateSiteFavicon = function (theme) {
    const chosenTheme = palettes[theme] ? theme : 'linen';
    const palette = palettes[chosenTheme];
    let favicon = document.querySelector('link[rel="icon"]');
    if (!favicon) {
      favicon = document.createElement('link');
      favicon.rel = 'icon';
      favicon.type = 'image/svg+xml';
      document.head.appendChild(favicon);
    }
    favicon.href = `data:image/svg+xml,${encodeURIComponent(faviconSvg(palette))}`;
    const themeColor = document.querySelector('meta[name="theme-color"]');
    if (themeColor) themeColor.content = palette.background;
  };

  const savedTheme = localStorage.getItem('jayzee-theme-choice') || 'linen';
  document.documentElement.setAttribute('data-theme', palettes[savedTheme] ? savedTheme : 'linen');
  window.updateSiteFavicon(savedTheme);
}());
