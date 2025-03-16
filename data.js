// Function to fetch the client's IP address
async function getClientIp() {
  const response = await fetch('https://api.ipify.org?format=json');
  const data = await response.json();
  return data.ip;
}

// Function to fetch latitude, longitude, and city based on the IP address
async function getLatLon(ip) {
  const response = await fetch(`https://ipapi.co/${ip}/json/`);
  const data = await response.json();
  return { latitude: data.latitude, longitude: data.longitude, city: data.city };
}

// Function to fetch weather data from weather.com
async function getWeather(lat, lon) {
  const apiKey = 'e1f10a1e78da46f5b10a1e78da96f525';
  const response = await fetch(`https://api.weather.com/v3/wx/observations/current?apiKey=${apiKey}&geocode=${lat},${lon}&language=en-US&units=m&format=json`);
  const data = await response.json();
  return data;
}

// Function to format time to 24-hour format and round to nearest minute
function formatTime(timeString) {
  const date = new Date(timeString);
  let hours = date.getHours();
  let minutes = date.getMinutes();
  // Round to the nearest minute
  minutes = Math.round(minutes / 1) * 1;
  // Ensure two digits for hours and minutes
  hours = hours.toString().padStart(2, '0');
  minutes = minutes.toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

// Main function to handle the process
async function main() {
  try {
    // Step 1: Get the client's IP address
    const ip = await getClientIp();
    console.log('IP Address:', ip);

    // Step 2: Get the latitude, longitude, and city based on the IP address
    const { latitude, longitude, city } = await getLatLon(ip);
    console.log('Latitude:', latitude, 'Longitude:', longitude, 'City:', city);

    // Step 3: Get the weather data based on the coordinates
    const weatherData = await getWeather(latitude, longitude);
    const { temperature, relativeHumidity, windSpeed, sunriseTimeLocal, sunsetTimeLocal } = weatherData;

    const fahrenheit = Math.round((temperature * 9/5) + 32);

    
    // Step 4: Update the data bar with location, temperature, humidity, wind speed, and sunrise/sunset
    document.getElementById('location').textContent = city;
    document.getElementById('temperature').textContent = `${temperature}ºC / ${fahrenheit}ºF`;
    document.getElementById('humidity').textContent = `${relativeHumidity}%`;
    document.getElementById('wind-speed').textContent = `${windSpeed} km/h`;
    document.getElementById('sunrise').textContent = formatTime(sunriseTimeLocal);
    document.getElementById('sunset').textContent = formatTime(sunsetTimeLocal);

    // Log the fetched weather data
    console.log('Weather Data:', weatherData);
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the main function
main();

// Function to fetch the now-playing data
async function getNowPlaying() {
  try {
      const response = await fetch('https://widgets.spinitron.com/widget/now-playing?callback=_spinitron02549218178983923171994730400&station=wber&num=1&time=0&nolinks=1');
      const text = await response.text();

      // Extract the HTML string from the JSONP response
      const jsonpData = text.match(/_spinitron02549218178983923171994730400\("([\s\S]*)"\)/)[1];

      // Remove escaped characters
      const cleanHtml = jsonpData.replace(/\\n/g, '').replace(/\\"/g, '"').replace(/\\t/g, '').replace(/\\/g, '');

      // Parse the HTML string
      const parser = new DOMParser();
      const doc = parser.parseFromString(cleanHtml, 'text/html');

      // Extract the song title and artist name
      const songTitleElement = doc.querySelector('.songpart b');
      const artistNameElement = doc.querySelector('.artistpart b');

      if (songTitleElement && artistNameElement) {
          const songTitle = songTitleElement.textContent;
          const artistName = artistNameElement.textContent;

          // Log the extracted info
          console.log('Updated Song:', songTitle);
          console.log('Updated Artist:', artistName);

          // Update the UI
          document.getElementById('current-song').textContent = `${songTitle} by ${artistName}`;
      } else {
          console.log('Could not find updated song info.');
      }
  } catch (error) {
      console.error('Error fetching updated song info:', error);
  }
}

// Run the function to get now playing data
getNowPlaying();
