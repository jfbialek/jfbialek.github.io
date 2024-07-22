document.addEventListener('DOMContentLoaded', () => {
  const ipTestButton = document.getElementById('ipTestButton');
  const geoTestButton = document.getElementById('geoTestButton');
  const ipResult = document.getElementById('ipResult');
  const geoResult = document.getElementById('geoResult');
  const linkButtons = document.getElementById('linkButtons');

  let ipInFlorida = false;
  let geoInFlorida = false;

  ipTestButton.addEventListener('click', () => {
      fetch('https://ipapi.co/json/')
          .then(response => response.json())
          .then(data => {
              if (data.region_code === "FL") {
                  ipInFlorida = true;
                  ipResult.textContent = "IP Address is in Florida";
                  ipResult.classList.add('green');
                  ipResult.classList.remove('red');
                  ipTestButton.classList.add('green');
                  ipTestButton.classList.remove('red');
              } else {
                  ipInFlorida = false;
                  ipResult.textContent = "IP Address is not in Florida";
                  ipResult.classList.add('red');
                  ipResult.classList.remove('green');
                  ipTestButton.classList.add('red');
                  ipTestButton.classList.remove('green');
              }
              enableLinkButtons();
          })
          .catch(error => {
              ipResult.textContent = "Failed to check IP";
              ipResult.classList.add('red');
              ipResult.classList.remove('green');
              ipTestButton.classList.add('red');
              ipTestButton.classList.remove('green');
          });
  });

  geoTestButton.addEventListener('click', () => {
      if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(position => {
              const { latitude, longitude } = position.coords;
              fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`)
                  .then(response => response.json())
                  .then(data => {
                      if (data.address.state === "Florida") {
                          geoInFlorida = true;
                          geoResult.textContent = "Geolocation is in Florida";
                          geoResult.classList.add('green');
                          geoResult.classList.remove('red');
                          geoTestButton.classList.add('green');
                          geoTestButton.classList.remove('red');
                      } else {
                          geoInFlorida = false;
                          geoResult.textContent = "Geolocation is not in Florida";
                          geoResult.classList.add('red');
                          geoResult.classList.remove('green');
                          geoTestButton.classList.add('red');
                          geoTestButton.classList.remove('green');
                      }
                      enableLinkButtons();
                  })
                  .catch(error => {
                      geoResult.textContent = "Failed to check geolocation";
                      geoResult.classList.add('red');
                      geoResult.classList.remove('green');
                      geoTestButton.classList.add('red');
                      geoTestButton.classList.remove('green');
                  });
          }, () => {
              geoResult.textContent = "Geolocation permission denied";
              geoResult.classList.add('red');
              geoResult.classList.remove('green');
              geoTestButton.classList.add('red');
              geoTestButton.classList.remove('green');
          });
      } else {
          geoResult.textContent = "Geolocation is not supported by this browser";
          geoResult.classList.add('red');
          geoResult.classList.remove('green');
          geoTestButton.classList.add('red');
          geoTestButton.classList.remove('green');
      }
  });

  function enableLinkButtons() {
      if (ipInFlorida && geoInFlorida) {
          linkButtons.style.display = "flex";
      } else {
          linkButtons.style.display = "none";
      }
  }
});

function openLink(url) {
  window.open(url, '_blank');
}
