(function () {
  const palettes = {
    linen: { background: '#fbf9f5', ink: '#161514', accent: '#c84b2c' },
    kyoto: { background: '#181715', ink: '#f4efe6', accent: '#e6532e' },
    '8bit': { background: '#d6dec2', ink: '#1e2917', accent: '#b85223' }
  };

  function faviconSvg(palette) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><path fill="${palette.ink}" d="M9 8h44a7 7 0 0 1 7 7v40a7 7 0 0 1-7 7H9a7 7 0 0 1-7-7V15a7 7 0 0 1 7-7Z"/><path fill="${palette.background}" stroke="${palette.ink}" stroke-width="3" d="M7 3h43l8 8v39a7 7 0 0 1-7 7H7a5 5 0 0 1-5-5V8a5 5 0 0 1 5-5Z"/><path fill="${palette.accent}" stroke="${palette.ink}" stroke-width="3" stroke-linejoin="round" d="M50 3v8h8Z"/><path fill="none" stroke="${palette.accent}" stroke-width="3" d="M9 13h24"/><path fill="none" stroke="${palette.ink}" stroke-width="6" stroke-linecap="square" stroke-linejoin="round" d="M15 22v23h11M33 22h6c8 0 12 4 12 11.5S47 45 39 45h-6Z"/><circle cx="12" cy="52" r="3" fill="${palette.accent}"/></svg>`;
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
