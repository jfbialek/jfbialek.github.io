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

// Function to fetch the next ISS pass times
async function getNextISSPassTimes(lat, lon) {
  const apiKey = 'DAHAPA-SUS6CL-CQPX9H-500G'; // Replace with your N2YO API key
  const response = await fetch(`https://api.n2yo.com/rest/v1/satellite/visualpasses/25544/${lat}/${lon}/0/10/300/&apiKey=${apiKey}`);
  const data = await response.json();
  return data;
}

// Function to calculate time difference and format countdown
function calculateCountdown(passTime) {
  const currentTime = new Date();
  const nextPassTime = new Date(passTime * 1000); // Convert UNIX timestamp to milliseconds
  const timeDiff = nextPassTime - currentTime;
  const seconds = Math.floor((timeDiff / 1000) % 60);
  const minutes = Math.floor((timeDiff / (1000 * 60)) % 60);
  const hours = Math.floor((timeDiff / (1000 * 60 * 60)) % 24);
  const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  return `${days}d ${hours}h ${minutes}m ${seconds}s`;
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

    // Step 4: Update the data bar with location, temperature, humidity, wind speed, and sunrise/sunset
    document.getElementById('location').textContent = city;
    document.getElementById('temperature').textContent = `${temperature}°C`;
    document.getElementById('humidity').textContent = `${relativeHumidity}%`;
    document.getElementById('wind-speed').textContent = `${windSpeed} km/h`;
    document.getElementById('sunrise').textContent = formatTime(sunriseTimeLocal);
    document.getElementById('sunset').textContent = formatTime(sunsetTimeLocal);

    // Step 5: Get the next ISS pass times
    const issPassTimes = await getNextISSPassTimes(latitude, longitude);
    const nextPassTime = issPassTimes.passes[0].startUTC; // Assuming the first pass time

    // Step 6: Calculate and display ISS pass time countdown
    const countdown = calculateCountdown(nextPassTime);
    document.getElementById('iss-countdown').textContent = countdown;

    // Log the fetched weather data and ISS pass times
    console.log('Weather Data:', weatherData);
    console.log('ISS Pass Times:', issPassTimes);
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the main function
main();

// Function to fetch the now-playing data
async function getNowPlaying() {
  const response = await fetch('https://widgets.spinitron.com/widget/now-playing?callback=_spinitron02549218178983923171994730400&station=wber&num=1&time=0&nolinks=1');
  const text = await response.text();

  // Extract the HTML string from the JSONP response
  const jsonpData = text.match(/_spinitron02549218178983923171994730400\("([\s\S]*)"\)/)[1];

  // Remove the escaped characters
  const cleanHtml = jsonpData.replace(/\\n/g, '').replace(/\\"/g, '"').replace(/\\t/g, '').replace(/\\/g, '');

  // Parse the HTML string
  const parser = new DOMParser();
  const doc = parser.parseFromString(cleanHtml, 'text/html');

  // Extract the song title and artist name using robust querying
  const songTitleElement = doc.querySelector('.songpart b');
  const artistNameElement = doc.querySelector('.artistpart b');

  if (songTitleElement && artistNameElement) {
    const songTitle = songTitleElement.textContent;
    const artistName = artistNameElement.textContent;

    // Log the extracted information
    console.log('Song title:', songTitle);
    console.log('Artist name:', artistName);

    // Update the data bar with the current song playing
    document.getElementById('current-song').textContent = `${songTitle} by ${artistName}`;
  } else {
    console.log('Could not find song title or artist name in the response.');
  }
}

// Run the function to get now playing data
getNowPlaying();
