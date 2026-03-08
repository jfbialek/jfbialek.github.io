// --- UTILITY FUNCTIONS ---
async function getClientIp() {
  const response = await fetch('https://api.ipify.org?format=json');
  const data = await response.json();
  return data.ip;
}

async function getLatLon(ip) {
  const response = await fetch(`https://ipapi.co/${ip}/json/`);
  const data = await response.json();
  return { latitude: data.latitude, longitude: data.longitude, city: data.city };
}

async function getWeather(lat, lon) {
  const apiKey = 'e1f10a1e78da46f5b10a1e78da96f525';
  const response = await fetch(`https://api.weather.com/v3/wx/observations/current?apiKey=${apiKey}&geocode=${lat},${lon}&language=en-US&units=m&format=json`);
  const data = await response.json();
  return data;
}

function formatTime(timeString) {
  const date = new Date(timeString);
  let hours = date.getHours().toString().padStart(2, '0');
  let minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

// --- RADIO FUNCTIONS ---

// Function 1: WBER (Your original logic)
async function getWberPlaying() {
  try {
      document.getElementById('current-song').textContent = "Loading WBER...";
      const response = await fetch('https://widgets.spinitron.com/widget/now-playing?callback=_spinitron02549218178983923171994730400&station=wber&num=1&time=0&nolinks=1');
      const text = await response.text();
      const jsonpData = text.match(/_spinitron02549218178983923171994730400\("([\s\S]*)"\)/)[1];
      const cleanHtml = jsonpData.replace(/\\n/g, '').replace(/\\"/g, '"').replace(/\\t/g, '').replace(/\\/g, '');
      const parser = new DOMParser();
      const doc = parser.parseFromString(cleanHtml, 'text/html');

      const songTitleElement = doc.querySelector('.songpart b');
      const artistNameElement = doc.querySelector('.artistpart b');

      if (songTitleElement && artistNameElement) {
          document.getElementById('current-song').textContent = `${songTitleElement.textContent} by ${artistNameElement.textContent}`;
      }
  } catch (error) {
      console.error('WBER Error:', error);
      document.getElementById('current-song').textContent = "WBER Unavailable";
  }
}

// Function 2: FM4 (The new logic)
async function getFm4Playing() {
  try {
    document.getElementById('current-song').textContent = "Loading FM4...";
    const response = await fetch(`https://audioapi.orf.at/fm4/json/current/broadcast/onair?_=${Date.now()}`);
    const data = await response.json();

    if (data.item && data.item.title && data.item.interpreter) {
      document.getElementById('current-song').textContent = `${data.item.title} by ${data.item.interpreter}`;
    } else {
      document.getElementById('current-song').textContent = "FM4: No track info";
    }
  } catch (error) {
    console.error('FM4 Error:', error);
    document.getElementById('current-song').textContent = "FM4 Unavailable";
  }
}

// --- INITIALIZATION ---

async function main() {
  try {
    const ip = await getClientIp();
    const { latitude, longitude, city } = await getLatLon(ip);
    const weatherData = await getWeather(latitude, longitude);
    const { temperature, relativeHumidity, windSpeed, sunriseTimeLocal, sunsetTimeLocal } = weatherData;
    const fahrenheit = Math.round((temperature * 9/5) + 32);

    document.getElementById('location').textContent = city;
    document.getElementById('temperature').textContent = `${temperature}ºC / ${fahrenheit}ºF`;
    document.getElementById('humidity').textContent = `${relativeHumidity}%`;
    document.getElementById('wind-speed').textContent = `${windSpeed} km/h`;
    document.getElementById('sunrise').textContent = formatTime(sunriseTimeLocal);
    document.getElementById('sunset').textContent = formatTime(sunsetTimeLocal);
  } catch (error) {
    console.error('Main Error:', error);
  }
}

// Run weather logic and default to WBER on load
main();
getWberPlaying();
