

let audioCtx = null;
let soundEnabled = false;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function initSound() {
  const toggleBtn = document.getElementById('sound-toggle-btn');
  const savedState = localStorage.getItem('jayzee-sound-enabled');
  
  soundEnabled = savedState === 'true';
  updateSoundUI();

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      soundEnabled = !soundEnabled;
      localStorage.setItem('jayzee-sound-enabled', soundEnabled);
      updateSoundUI();

      if (soundEnabled) {
        getAudioContext();
        playChime();
      }
    });
  }

  document.addEventListener('mouseover', (e) => {
    if (!soundEnabled) return;
    const target = e.target.closest('a, button, .work-item__summary, .badge-stamp');
    if (target && !target.dataset.soundAttached) {
      playBlip();
    }
  });

  document.addEventListener('click', (e) => {
    if (!soundEnabled) return;
    const target = e.target.closest('button, .work-item__summary, .btn');
    if (target && target.id !== 'sound-toggle-btn') {
      playClick();
    }
  });
}

function updateSoundUI() {
  const toggleBtn = document.getElementById('sound-toggle-btn');
  if (!toggleBtn) return;
  
  const textSpan = toggleBtn.querySelector('.sound-toggle-text');
  const iconSpan = toggleBtn.querySelector('.sound-toggle-icon');

  if (soundEnabled) {
    toggleBtn.classList.add('active');
    if (textSpan) textSpan.textContent = 'SOUND: ON';
    if (iconSpan) iconSpan.textContent = '🔊';
  } else {
    toggleBtn.classList.remove('active');
    if (textSpan) textSpan.textContent = 'SOUND: OFF';
    if (iconSpan) iconSpan.textContent = '🔈';
  }
}

export function playClick() {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'triangle';
  osc.frequency.setValueAtTime(480, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.04);

  gain.gain.setValueAtTime(0.12, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.04);
}

export function playBlip() {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(740, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(980, ctx.currentTime + 0.03);

  gain.gain.setValueAtTime(0.04, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.03);
}

export function playChime() {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const notes = [523.25, 659.25, 783.99, 1046.5];
  notes.forEach((freq, index) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const startTime = ctx.currentTime + index * 0.045;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, startTime);

    gain.gain.setValueAtTime(0.08, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.28);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + 0.28);
  });
}

export function playDrop() {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(320, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + 0.08);

  gain.gain.setValueAtTime(0.1, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.08);
}

export function playStickerPop() {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();
  oscillator.type = 'square';
  oscillator.frequency.setValueAtTime(190, now);
  oscillator.frequency.exponentialRampToValueAtTime(760, now + 0.07);
  gain.gain.setValueAtTime(0.09, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.11);
  oscillator.connect(gain).connect(ctx.destination);
  oscillator.start(now);
  oscillator.stop(now + 0.11);

  [920, 1240].forEach((frequency, index) => {
    const sparkle = ctx.createOscillator();
    const sparkleGain = ctx.createGain();
    const start = now + 0.045 + index * 0.025;
    sparkle.type = 'triangle';
    sparkle.frequency.value = frequency;
    sparkleGain.gain.setValueAtTime(0.035, start);
    sparkleGain.gain.exponentialRampToValueAtTime(0.001, start + 0.07);
    sparkle.connect(sparkleGain).connect(ctx.destination);
    sparkle.start(start);
    sparkle.stop(start + 0.07);
  });
}
