// --- WEATHER / LOCATION ---
// Free services that need no key and allow browser requests (2026-11-01). The old ones broke:
// ipapi.co rate-limits the shared campus IP, and the scraped weather.com key was throttled.
const FALLBACK = { latitude: 43.0481, longitude: -76.1474, city: 'Syracuse' };

async function getLocation() {
  try {
    const response = await fetch('https://ipwho.is/');
    const data = await response.json();
    if (data.success && data.latitude != null) {
      return { latitude: data.latitude, longitude: data.longitude, city: data.city };
    }
  } catch (e) { console.error('Location lookup failed, using Syracuse'); }
  return FALLBACK;
}

async function getWeather(lat, lon) {
  const url = 'https://api.open-meteo.com/v1/forecast?latitude=' + lat + '&longitude=' + lon +
    '&current=temperature_2m,relative_humidity_2m,wind_speed_10m&daily=sunrise,sunset&timezone=auto&forecast_days=1';
  const response = await fetch(url);
  return response.json();
}

// Open-Meteo gives local times like "2026-11-01T07:43"; show the HH:MM part.
function formatTime(timeString) {
  return (timeString || '').slice(11, 16) || '--:--';
}

async function main() {
  try {
    const { latitude, longitude, city } = await getLocation();
    const weather = await getWeather(latitude, longitude);
    const now = weather.current;
    const celsius = Math.round(now.temperature_2m);
    const fahrenheit = Math.round((now.temperature_2m * 9 / 5) + 32);

    document.getElementById('location').textContent = city;
    document.getElementById('temperature').textContent = `${celsius}ºC / ${fahrenheit}ºF`;
    document.getElementById('humidity').textContent = `${Math.round(now.relative_humidity_2m)}%`;
    document.getElementById('wind-speed').textContent = `${Math.round(now.wind_speed_10m)} km/h`;
    document.getElementById('sunrise').textContent = formatTime(weather.daily.sunrise[0]);
    document.getElementById('sunset').textContent = formatTime(weather.daily.sunset[0]);
  } catch (error) {
    console.error('Weather error:', error);
  }
}

// --- RADIO LOGIC ---

async function getWberPlaying() {
  try {
      const response = await fetch('https://widgets.spinitron.com/widget/now-playing?callback=_spinitron02549218178983923171994730400&station=wber&num=1&time=0&nolinks=1');
      const text = await response.text();
      const match = text.match(/_spinitron02549218178983923171994730400\("([\s\S]*)"\)/);
      if (!match) return;
      
      const cleanHtml = match[1].replace(/\\n/g, '').replace(/\\"/g, '"').replace(/\\t/g, '').replace(/\\/g, '');
      const parser = new DOMParser();
      const doc = parser.parseFromString(cleanHtml, 'text/html');
      const song = doc.querySelector('.songpart b');
      const artist = doc.querySelector('.artistpart b');

      if (song && artist) {
          document.getElementById('current-song').textContent = `${song.textContent} by ${artist.textContent}`;
      }
  } catch (e) { console.error('WBER fail'); }
}

async function getFm4Playing() {
  try {
    const response = await fetch(`https://audioapi.orf.at/fm4/json/current/broadcast/onair?_=${Date.now()}`);
    const data = await response.json();
    if (data.item) {
      document.getElementById('current-song').textContent = `${data.item.title} by ${data.item.interpreter}`;
    }
  } catch (e) { console.error('FM4 fail'); }
}

// --- 3. RUN EVERYTHING ---
main();
getWberPlaying();
