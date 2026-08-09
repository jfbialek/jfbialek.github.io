// --- ORIGINAL WORKING WEATHER/LOCATION LOGIC ---

async function getClientIp() {
  const response = await fetch('https://api.ipify.org?format=json');
  const data = await response.json();
  return data.ip;
}

async function getLatLon(ip) {
  const response = await fetch(`https://ipapi.co/${ip}/json/`);
  const data = await response.json();
  // Restoring your exact original key names
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
