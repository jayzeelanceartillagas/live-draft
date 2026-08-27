export function initMilestones() {
  const links = [...document.querySelectorAll('.milestone-nav__link')];
  const sections = links.map((link) => document.querySelector(link.getAttribute('href'))).filter(Boolean);
  if (!links.length || !sections.length) return;

  const update = () => {
    const marker = window.scrollY + window.innerHeight * 0.42;
    let active = 0;
    sections.forEach((section, index) => {
      if (section.offsetTop <= marker) active = index;
    });
    links.forEach((link, index) => {
      link.classList.toggle('is-active', index === active);
      if (index === active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
    document.documentElement.style.setProperty('--scroll-progress', `${(active / (links.length - 1)) * 100}%`);
  };
  update();
  window.addEventListener('scroll', update, { passive: true });
}
