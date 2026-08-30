

export function initLiveClock() {
  const clockElements = document.querySelectorAll('.manila-clock-sync');
  if (clockElements.length === 0) return;

  function updateTime() {
    const options = {
      timeZone: 'Asia/Manila',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    };
    const formatter = new Intl.DateTimeFormat('en-US', options);
    const timeStr = formatter.format(new Date());

    clockElements.forEach((el) => {
      el.textContent = timeStr;
    });
  }

  updateTime();
  setInterval(updateTime, 1000);
}

export function initScrollReveals() {
  document.documentElement.classList.add('motion-ready');
  const elements = document.querySelectorAll(
    '.fade-in-up, .section-heading, .draft-log__manifesto'
  );

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -48px 0px' }
  );

  elements.forEach((el) => observer.observe(el));
}
