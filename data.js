// --- ORIGINAL WEATHER & LOCATION LOGIC ---

async function getClientIp() {
  const response = await fetch('https://api.ipify.org?format=json');
  const data = await response.json();
  return data.ip;
}

async function getLatLon(ip) {
  // Swapping to a different provider to bypass your current rate limit
  const response = await fetch(`https://demo.ip-api.com/json/${ip}`);
  const data = await response.json();
  
  // Note: different APIs use different keys (lat vs latitude)
  return { 
    latitude: data.lat, 
    longitude: data.lon, 
    city: data.city 
  };
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
  // Keeping your original rounding logic
  minutes = (Math.round(minutes / 1) * 1).toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

async function main() {
  try {
    // Step 1: Get IP
    const ip = await getClientIp();
    // Step 2: Get Lat/Lon using that IP (The way you had it)
    const { latitude, longitude, city } = await getLatLon(ip);
    // Step 3: Get Weather
    const weatherData = await getWeather(latitude, longitude);
    
    const { temperature, relativeHumidity, windSpeed, sunriseTimeLocal, sunsetTimeLocal } = weatherData;
    const fahrenheit = Math.round((temperature * 9/5) + 32);

    // Update UI
    document.getElementById('location').textContent = city;
    document.getElementById('temperature').textContent = `${temperature}ºC / ${fahrenheit}ºF`;
    document.getElementById('humidity').textContent = `${relativeHumidity}%`;
    document.getElementById('wind-speed').textContent = `${windSpeed} km/h`;
    document.getElementById('sunrise').textContent = formatTime(sunriseTimeLocal);
    document.getElementById('sunset').textContent = formatTime(sunsetTimeLocal);
  } catch (error) {
    console.error('Error in main weather loop:', error);
  }
}

// --- RADIO LOGIC ---

// WBER Logic (Spinitron Scrape)
async function getWberPlaying() {
  try {
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
  }
}

// FM4 Logic (ORF JSON API)
async function getFm4Playing() {
  try {
    const response = await fetch(`https://audioapi.orf.at/fm4/json/current/broadcast/onair?_=${Date.now()}`);
    const data = await response.json();

    if (data.item && data.item.title && data.item.interpreter) {
      document.getElementById('current-song').textContent = `${data.item.title} by ${data.item.interpreter}`;
    }
  } catch (error) {
    console.error('FM4 Error:', error);
  }
}

// --- RUN ON LOAD ---
main();
getWberPlaying();
