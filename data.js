// --- GEOLOCATION & WEATHER ---

// Step 1: Get the client's IP address
async function getClientIp() {
  const response = await fetch('https://api.ipify.org?format=json');
  const data = await response.json();
  return data.ip;
}

// Step 2: Updated Geolocation (Fixed CORS issue by switching to freeipapi.com)
async function getLatLon() {
  // We don't even need the IP for this one; it detects it automatically
  const response = await fetch('https://freeipapi.com/api/json');
  const data = await response.json();
  return { 
    latitude: data.latitude, 
    longitude: data.longitude, 
    city: data.cityName 
  };
}

// Step 3: Fetch weather data
async function getWeather(lat, lon) {
  const apiKey = 'e1f10a1e78da46f5b10a1e78da96f525';
  const response = await fetch(`https://api.weather.com/v3/wx/observations/current?apiKey=${apiKey}&geocode=${lat},${lon}&language=en-US&units=m&format=json`);
  if (!response.ok) throw new Error('Weather API limit reached');
  const data = await response.json();
  return data;
}

function formatTime(timeString) {
  const date = new Date(timeString);
  let hours = date.getHours().toString().padStart(2, '0');
  let minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

// --- RADIO LOGIC ---

// WBER Logic (Spinitron Scrape)
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

// FM4 Logic (ORF JSON API)
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

// --- MAIN INITIALIZATION ---

async function main() {
  try {
    // Get Location
    const { latitude, longitude, city } = await getLatLon();
    document.getElementById('location').textContent = city;

    // Get Weather
    const weatherData = await getWeather(latitude, longitude);
    const { temperature, relativeHumidity, windSpeed, sunriseTimeLocal, sunsetTimeLocal } = weatherData;
    const fahrenheit = Math.round((temperature * 9/5) + 32);

    // Update UI
    document.getElementById('temperature').textContent = `${temperature}ºC / ${fahrenheit}ºF`;
    document.getElementById('humidity').textContent = `${relativeHumidity}%`;
    document.getElementById('wind-speed').textContent = `${windSpeed} km/h`;
    document.getElementById('sunrise').textContent = formatTime(sunriseTimeLocal);
    document.getElementById('sunset').textContent = formatTime(sunsetTimeLocal);

  } catch (error) {
    console.error('Main Data Error:', error);
    // Setting defaults so the UI doesn't look broken
    document.getElementById('location').textContent = "Location Error";
  }
}

// Initialize
main();
getWberPlaying();
