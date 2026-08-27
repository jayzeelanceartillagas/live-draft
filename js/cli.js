export function initCli() {
  const drawer = document.getElementById('cli-drawer');
  const input = document.getElementById('cli-input');
  const output = document.getElementById('cli-output');
  const triggers = document.querySelectorAll('[data-cli-toggle]');
  if (!drawer || !input || !output) return;

  const write = (message) => {
    output.textContent = message;
    output.scrollTop = output.scrollHeight;
  };
  const toggle = (force) => {
    const open = force ?? !drawer.classList.contains('is-open');
    drawer.classList.toggle('is-open', open);
    drawer.setAttribute('aria-hidden', String(!open));
    if (open) setTimeout(() => input.focus(), 80);
  };
  triggers.forEach((trigger) => trigger.addEventListener('click', () => toggle()));

  document.addEventListener('keydown', (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      toggle();
    } else if (event.key === 'Escape') toggle(false);
  });

  input.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter') return;
    const command = input.value.trim().toLowerCase();
    input.value = '';
    const targets = { home: 'hero', cover: 'hero', notes: 'about', works: 'works', world: 'sandbox', arsenal: 'craft', dispatch: 'contact', contact: 'contact' };
    if (targets[command]) {
      document.getElementById(targets[command])?.scrollIntoView({ behavior: 'smooth' });
      write(`> ${command}\nNavigating to ${targets[command].toUpperCase()}…`);
      setTimeout(() => toggle(false), 450);
    } else if (command === 'help') {
      write('> help\nhelp · works · notes · world · arsenal · dispatch · theme · sound · clear');
    } else if (command === 'theme') {
      const themes = [...document.querySelectorAll('[data-theme-choice]')];
      const current = themes.findIndex((button) => button.classList.contains('active'));
      themes[(current + 1) % themes.length]?.click();
      write('> theme\nPalette rotated.');
    } else if (command === 'sound') {
      document.getElementById('sound-toggle-btn')?.click();
      write('> sound\nSound setting toggled.');
    } else if (command === 'clear') {
      write('Ready. Type “help” for commands.');
    } else if (command) {
      write(`> ${command}\nCommand not found. Try “help”.`);
    }
  });
}
