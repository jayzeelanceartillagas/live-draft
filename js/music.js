const melody = [293.66, 369.99, 440, 369.99, 329.63, 293.66, 246.94, 293.66];

export function initMusic() {
  const widget = document.getElementById('music-widget');
  const button = document.getElementById('music-play-btn');
  if (!widget || !button) return;

  let context;
  let timer;
  let note = 0;

  const stop = () => {
    clearInterval(timer);
    timer = null;
    widget.classList.remove('is-playing');
    button.textContent = '▶';
    button.setAttribute('aria-label', 'Play synthesized 8-bit preview');
  };

  const playNote = () => {
    if (!context) return;
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = 'square';
    oscillator.frequency.value = melody[note++ % melody.length];
    gain.gain.setValueAtTime(0.035, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.16);
    oscillator.connect(gain).connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + 0.16);
  };

  button.addEventListener('click', () => {
    if (timer) return stop();
    const soundToggle = document.getElementById('sound-toggle-btn');
    if (!soundToggle?.classList.contains('active')) soundToggle?.click();
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    context ||= new AudioContextClass();
    context.resume();
    widget.classList.add('is-playing');
    button.textContent = '■';
    button.setAttribute('aria-label', 'Stop synthesized 8-bit preview');
    playNote();
    timer = setInterval(playNote, 210);
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden && timer) stop();
  });
}
