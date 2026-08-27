import { playStickerPop } from './sound.js?v=26.9';

const STORAGE_KEY = 'jayzee-sticker-positions-v2';

export function initStickers() {
  const board = document.getElementById('sticker-board');
  const stickers = [...document.querySelectorAll('[data-sticker]')];
  if (!board || !stickers.length) return;

  let saved = {};
  try { saved = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; } catch { saved = {}; }
  let moves = Number(localStorage.getItem('jayzee-sticker-moves')) || 0;
  const moveCounter = document.getElementById('sticker-move-count');
  const coords = document.getElementById('sticker-board-coords');
  const updateCounter = () => { if (moveCounter) moveCounter.textContent = String(moves).padStart(3, '0'); };
  updateCounter();

  const defaults = [
    [8, 18], [37, 9], [68, 18], [18, 63], [78, 58], [48, 68], [57, 36], [28, 39],
  ];
  const styleCustomSticker = (sticker, definition) => {
    const hex = definition.color.replace('#', '');
    const red = parseInt(hex.slice(0, 2), 16);
    const green = parseInt(hex.slice(2, 4), 16);
    const blue = parseInt(hex.slice(4, 6), 16);
    const luminance = (red * 299 + green * 587 + blue * 114) / 1000;
    sticker.style.setProperty('--custom-sticker-color', definition.color);
    sticker.style.setProperty('--custom-sticker-ink', luminance > 155 ? '#161514' : '#ffffff');
    sticker.style.setProperty('--custom-sticker-font', `${Math.max(7, Math.min(14, 125 / Math.sqrt(definition.text.length)))}px`);
  };

  localStorage.removeItem('jayzee-custom-stickers');

  const place = (sticker, xPercent, yPercent) => {
    const maxX = Math.max(0, board.clientWidth - sticker.offsetWidth - 10);
    const maxY = Math.max(0, board.clientHeight - sticker.offsetHeight - 10);
    sticker.style.left = `${Math.max(10, Math.min((xPercent / 100) * board.clientWidth, maxX))}px`;
    sticker.style.top = `${Math.max(10, Math.min((yPercent / 100) * board.clientHeight, maxY))}px`;
  };

  const saveAllPositions = () => {
    stickers.forEach((sticker) => {
      if (sticker.dataset.sessionOnly === 'true') return;
      saved[sticker.dataset.sticker] = {
        x: Math.round((parseFloat(sticker.style.left) / board.clientWidth) * 1000) / 10,
        y: Math.round((parseFloat(sticker.style.top) / board.clientHeight) * 1000) / 10,
      };
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
  };

  const arrangeStickers = (randomize = false) => {
    const padding = 16;
    const step = 22;
    const occupied = [];

    const ordered = [...stickers].sort((a, b) => (b.offsetWidth * b.offsetHeight) - (a.offsetWidth * a.offsetHeight));
    ordered.forEach((sticker, index) => {
      const width = sticker.offsetWidth;
      const height = sticker.offsetHeight;
      const candidates = [];

      for (let y = padding; y <= board.clientHeight - height - padding; y += step) {
        for (let x = padding; x <= board.clientWidth - width - padding; x += step) {
          const overlaps = occupied.some((box) =>
            x < box.x + box.width + padding && x + width + padding > box.x &&
            y < box.y + box.height + padding && y + height + padding > box.y
          );
          if (overlaps) continue;

          const centerX = x + width / 2;
          const centerY = y + height / 2;
          const nearest = occupied.length
            ? Math.min(...occupied.map((box) => Math.hypot(centerX - (box.x + box.width / 2), centerY - (box.y + box.height / 2))))
            : Math.hypot(centerX - board.clientWidth / 2, centerY - board.clientHeight / 2) * -1;
          candidates.push({ x, y, score: nearest });
        }
      }

      let selected;
      if (candidates.length) {
        if (randomize) {
          const roomy = candidates.sort((a, b) => b.score - a.score).slice(0, Math.max(1, Math.ceil(candidates.length * 0.25)));
          selected = roomy[Math.floor(Math.random() * roomy.length)];
        } else {
          selected = candidates.reduce((best, candidate) => candidate.score > best.score ? candidate : best);
        }
      } else {
        const columns = Math.max(1, Math.floor((board.clientWidth - padding * 2) / (width + padding)));
        selected = {
          x: padding + (index % columns) * (width + padding),
          y: padding + Math.floor(index / columns) * (height + padding),
        };
      }

      sticker.style.left = `${Math.min(selected.x, board.clientWidth - width - padding)}px`;
      sticker.style.top = `${Math.min(selected.y, board.clientHeight - height - padding)}px`;
      occupied.push({ x: selected.x, y: selected.y, width, height });
    });

    saveAllPositions();
  };

  const prepareSticker = (sticker, index, position) => {
    const id = sticker.dataset.sticker;
    const stored = position || saved[id];
    if (stored) {
      place(sticker, stored.x, stored.y);
    } else {
      place(sticker, defaults[index][0], defaults[index][1]);
    }

    const removeButton = document.createElement('button');
    removeButton.type = 'button';
    removeButton.className = 'sticker__remove';
    removeButton.setAttribute('aria-label', 'Remove this sticker');
    sticker.appendChild(removeButton);

    removeButton.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (sticker.classList.contains('is-removing')) return;
      const stickerRect = sticker.getBoundingClientRect();
      const boardRect = board.getBoundingClientRect();
      const stickerStyles = getComputedStyle(sticker);
      const particleColor = stickerStyles.getPropertyValue('--custom-sticker-color').trim()
        || stickerStyles.getPropertyValue('--sticker-face').trim()
        || stickerStyles.backgroundColor
        || '#c84b2c';

      for (let particleIndex = 0; particleIndex < 12; particleIndex += 1) {
        const particle = document.createElement('i');
        const angle = (Math.PI * 2 * particleIndex) / 12 + Math.random() * 0.2;
        const distance = 34 + Math.random() * 42;
        particle.className = 'sticker-pop-particle';
        particle.style.left = `${stickerRect.left - boardRect.left + stickerRect.width / 2}px`;
        particle.style.top = `${stickerRect.top - boardRect.top + stickerRect.height / 2}px`;
        particle.style.setProperty('--particle-color', particleColor);
        particle.style.setProperty('--particle-x', `${Math.cos(angle) * distance}px`);
        particle.style.setProperty('--particle-y', `${Math.sin(angle) * distance}px`);
        particle.style.setProperty('--particle-mid-x', `${Math.cos(angle) * distance * 0.55}px`);
        particle.style.setProperty('--particle-mid-y', `${Math.sin(angle) * distance * 0.55}px`);
        particle.style.setProperty('--particle-rotation', `${Math.round(Math.random() * 180)}deg`);
        board.appendChild(particle);
        window.setTimeout(() => particle.remove(), 650);
      }

      playStickerPop();
      sticker.classList.add('is-removing');
      delete saved[sticker.dataset.sticker];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));

      window.setTimeout(() => {
        const stickerIndex = stickers.indexOf(sticker);
        if (stickerIndex >= 0) {
          stickers.splice(stickerIndex, 1);
          defaults.splice(stickerIndex, 1);
        }
        sticker.remove();
      }, 320);
    });

    sticker.addEventListener('pointerdown', (event) => {
      if (event.target.closest('.sticker__remove')) return;
      if (event.button !== 0) return;
      event.preventDefault();
      const rect = sticker.getBoundingClientRect();
      const boardRect = board.getBoundingClientRect();
      const offsetX = event.clientX - rect.left;
      const offsetY = event.clientY - rect.top;
      sticker.classList.add('is-dragging');
      sticker.setPointerCapture(event.pointerId);

      const move = (moveEvent) => {
        const x = Math.max(8, Math.min(moveEvent.clientX - boardRect.left - offsetX, boardRect.width - rect.width - 8));
        const y = Math.max(8, Math.min(moveEvent.clientY - boardRect.top - offsetY, boardRect.height - rect.height - 8));
        sticker.style.left = `${x}px`;
        sticker.style.top = `${y}px`;
      };

      const end = () => {
        sticker.classList.remove('is-dragging');
        sticker.removeEventListener('pointermove', move);
        const finalRect = sticker.getBoundingClientRect();
        if (sticker.dataset.sessionOnly !== 'true') {
          saved[id] = {
            x: Math.round(((finalRect.left - boardRect.left) / boardRect.width) * 1000) / 10,
            y: Math.round(((finalRect.top - boardRect.top) / boardRect.height) * 1000) / 10,
          };
          localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
        }
        moves += 1;
        localStorage.setItem('jayzee-sticker-moves', moves);
        updateCounter();
      };

      sticker.addEventListener('pointermove', move);
      sticker.addEventListener('pointerup', end, { once: true });
      sticker.addEventListener('pointercancel', end, { once: true });
    });
  };

  stickers.forEach((sticker, index) => prepareSticker(sticker, index));

  board.addEventListener('pointermove', (event) => {
    if (!coords) return;
    const rect = board.getBoundingClientRect();
    coords.textContent = `X ${String(Math.max(0, Math.round(event.clientX - rect.left))).padStart(3, '0')} / Y ${String(Math.max(0, Math.round(event.clientY - rect.top))).padStart(3, '0')}`;
  });

  document.getElementById('sticker-shuffle-btn')?.addEventListener('click', () => {
    arrangeStickers(true);
  });

  document.getElementById('sticker-reset-btn')?.addEventListener('click', () => {
    arrangeStickers(false);
    moves = 0;
    localStorage.removeItem('jayzee-sticker-moves');
    updateCounter();
  });

  const maker = document.getElementById('sticker-maker');
  const makerToggle = document.getElementById('sticker-maker-toggle');
  makerToggle?.addEventListener('click', () => {
    const opening = maker.hasAttribute('hidden');
    maker.toggleAttribute('hidden', !opening);
    makerToggle.setAttribute('aria-expanded', String(opening));
    if (opening) document.getElementById('sticker-custom-text')?.focus();
  });

  maker?.addEventListener('submit', (event) => {
    event.preventDefault();
    const textInput = document.getElementById('sticker-custom-text');
    const shapeInput = document.getElementById('sticker-custom-shape');
    const colorInput = document.getElementById('sticker-custom-color');
    const text = textInput.value.trim();
    if (!text) return;

    const definition = {
      id: `custom-${Date.now()}`,
      text,
      shape: shapeInput.value,
      color: colorInput.value,
    };
    const sticker = document.createElement('div');
    sticker.className = `sticker sticker--custom sticker--shape-${definition.shape}`;
    sticker.dataset.sticker = definition.id;
    sticker.dataset.sessionOnly = 'true';
    sticker.textContent = definition.text;
    styleCustomSticker(sticker, definition);
    board.appendChild(sticker);
    stickers.push(sticker);
    defaults.push([45, 42]);
    prepareSticker(sticker, stickers.length - 1, { x: 45, y: 42 });
    textInput.value = '';
    maker.toggleAttribute('hidden', true);
    makerToggle.setAttribute('aria-expanded', 'false');
    arrangeStickers(false);
  });
}
