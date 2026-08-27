const MANILA_WEATHER_URL = 'https://api.open-meteo.com/v1/forecast?latitude=14.5833&longitude=120.9667&current=temperature_2m&temperature_unit=celsius';

export function initWeather() {
  const readouts = document.querySelectorAll('[data-weather-temp]');
  if (!readouts.length) return;

  fetch(MANILA_WEATHER_URL)
    .then((response) => {
      if (!response.ok) throw new Error('Weather unavailable');
      return response.json();
    })
    .then((data) => {
      const celsius = Math.round(data.current?.temperature_2m);
      if (!Number.isFinite(celsius)) return;
      const fahrenheit = Math.round((celsius * 9) / 5 + 32);
      readouts.forEach((readout) => {
        readout.textContent = `${fahrenheit}°F / ${celsius}°C`;
      });
    })
    .catch(() => {
    });
}
