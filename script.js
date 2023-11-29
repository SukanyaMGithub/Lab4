function getCurrentLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
  } else {
    showError('Geolocation is not supported by this browser.');
  }
}

function successCallback(position) {
  hideError();
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;
  getSunriseSunsetData(latitude, longitude);
  getTomorowSunriseSunsetData(latitude, longitude);
}

function errorCallback(error) {
  showError(`Geolocation error: ${error.message}`);
}

function searchLocation() {
  const locationInput = document.getElementById('locationInput');
  
  const location = locationInput.value;

  // Hide error message container
  hideError();

  if (location.trim() !== '') {
    getGeocodeData(location);
  } else {
    showError('Please enter a location.');
  }

   
}

function hideError() {
  const errorContainer = document.getElementById('errorContainer');
  const resultContainer = document.getElementById('resultContainer');
  const tomorrowResultContainer = document.getElementById('tomorrowResultContainer');

  errorContainer.innerHTML = ''; // Clear the content
  errorContainer.classList.add('hidden');

  // Clear the result container
  resultContainer.innerHTML = '';
  tomorrowResultContainer.innerHTML = '';
  resultContainer.classList.add('hidden');
  tomorrowResultContainer.classList.add('hidden');
}



function getGeocodeData(location) {
    $.ajax({
        url: `https://geocode.maps.co/search?q=${location}&format=json`,
      method: 'GET',
      success: function (data) {
        if (data && data.length > 0) {
          const result = data[0];
          const match = result.display_name
          .toLowerCase()
          .split(',')
          .some(word => word.trim() === location.toLowerCase());
          if(match) {
            const latitude = result.lat;
          const longitude = result.lon;
          getSunriseSunsetData(latitude, longitude);
          getTomorowSunriseSunsetData(latitude, longitude);  
          } else {
            showError('Location not found.');  
          }
          
        } else {
          showError('Location not found.');
        }
      },
      error: function () {
        showError('Error fetching geocode data.');
      }
    });
  }
  

function getSunriseSunsetData(latitude, longitude) {
  $.ajax({
    url: `https://api.sunrisesunset.io/json?lat=${latitude}&lng=${longitude}&date=today`,
    method: 'GET',
    success: function (data) {
      displaySunriseSunsetInfo(data);
    },
    error: function () {
      showError('Error fetching sunrise sunset data.');
    }
  });
}

function getTomorowSunriseSunsetData(latitude, longitude) {
  $.ajax({
    url: `https://api.sunrisesunset.io/json?lat=${latitude}&lng=${longitude}&date=tomorrow`,
    method: 'GET',
    success: function (data) {
      displayTomorrowSunriseSunsetInfo(data);
    },
    error: function () {
      showError('Error fetching sunrise sunset data.');
    }
  });
}

function displaySunriseSunsetInfo(data) {
  const resultContainer = document.getElementById('resultContainer');
  
  // Get the current date
  const currentDate = new Date();
  const options = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
  const formattedDate = currentDate.toLocaleDateString('en-US', options);


  resultContainer.innerHTML = `
    <div class="day-info">
      <h4>Today</h4>
      <p>${formattedDate}</p>
      <div class="sun-info">
        <span> 🌅<b> Sunrise:</b> ${data.results.sunrise || 'Not available'} <br>
        🌇 <b>Sunset:</b> ${data.results.sunset || 'Not available'}</span>
      </div>
      <div class="sun-info">
        <span>🌄 <b>Dawn:</b> ${data.results.dawn || 'Not available'}<br> 
        🌆 <b>Dusk:</b> ${data.results.dusk || 'Not available'}</span>
      </div>
      <div class="sun-info">
        <span>🌞🕒<b> Day Length:</b> ${data.results.day_length || 'Not available'} <br>
        ☀️🕛 <b>Solar Noon:</b> ${data.results.solar_noon || 'Not available'}</span>   
      </div>
      <div class="sun-info">
        <span>🌐⌚ <b>Time Zone:</b> ${data.results.timezone}</span>
      </div>
    </div>
  `;
  resultContainer.classList.remove('hidden');


}

function displayTomorrowSunriseSunsetInfo(data) {

  const tomorrowResultContainer = document.getElementById('tomorrowResultContainer');

  // Get the date for tomorrow
  const currentDate = new Date();
  const options = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
  const tomorrowDate = new Date(currentDate);
  tomorrowDate.setDate(currentDate.getDate() + 1);
  const formattedTomorrowDate = tomorrowDate.toLocaleDateString('en-US', options);


  tomorrowResultContainer.innerHTML = `
  <div class="day-info">
    <h4>Tomorrow</h4>
    <p>${formattedTomorrowDate}</p>
    <div class="sun-info">
      <span>🌅 <b>Sunrise:</b> ${data.results.sunrise || 'Not available'}<br>
      🌇<b> Sunset:</b> ${data.results.sunset || 'Not available'}</span>
    </div>
    <div class="sun-info">
      <span>🌄 <b>Dawn:</b> ${data.results.dawn || 'Not available'}<br>
      🌆<b> Dusk:</b> ${data.results.dusk || 'Not available'}</span>
    </div>
    <div class="sun-info">
      <span>🌞🕒 <b>Day Length:</b> ${data.results.day_length || 'Not available'}<br>
      ☀️🕛 <b>Solar Noon:</b> ${data.results.solar_noon || 'Not available'}</span>
    </div>
    <div class="sun-info">
      <span>🌐⌚ <b>Time Zone:</b> ${data.results.timezone}</span>
    </div>
  </div>
`;
tomorrowResultContainer.classList.remove('hidden');
}

function showError(message) {
  const errorContainer = document.getElementById('errorContainer');
  errorContainer.innerHTML = `<p>${message}</p>`;
  errorContainer.classList.remove('hidden');
  document.getElementById('resultContainer').classList.add('hidden');
}
