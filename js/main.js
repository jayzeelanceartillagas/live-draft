

import { initNavigation } from './navigation.js';
import { initLiveClock, initScrollReveals } from './animations.js?v=26.1';
import { initProjectDrawers } from './projects.js?v=26.14';
import { initContact } from './contact.js?v=26.10';
import { initSound } from './sound.js?v=26.9';
import { initCursorAndPreviews } from './cursor.js?v=26.17';
import { initPlayground } from './playground.js';
import { initThemeSwitcher } from './theme.js';
import { initStickers } from './stickers.js?v=26.9';
import { initMusic } from './music.js';
import { initCli } from './cli.js';
import { initMilestones } from './milestones.js';
import { initWeather } from './weather.js';

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initScrollReveals();
  initLiveClock();

  initProjectDrawers();

  initContact();

  initSound();

  initCursorAndPreviews();

  initPlayground();

  initThemeSwitcher();

  initStickers();
  initMusic();
  initCli();
  initMilestones();
  initWeather();

  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  console.log(
    '%c✦ LIVE DRAFT — Release 26.2 active',
    'background: #161514; color: #c84b2c; font-family: monospace; font-size: 12px; padding: 4px 8px; border-radius: 3px;'
  );
});
