// Replace 'YOUR_API_KEY' with your actual API key
const apiKey = 'YOUR_API_KEY';

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
 
  errorContainer.innerHTML = ''; // Clear the content
  errorContainer.classList.add('hidden');

  
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



function displaySunriseSunsetInfo(data) {
  const resultContainer = document.getElementById('resultContainer');
  resultContainer.innerHTML = `
    <h2>Today</h2>
    <p>🌅Sunrise: ${data.results.sunrise || 'Not available'}</p>
    <p>Sunset: ${data.results.sunset || 'Not available'}</p>
    <p>Dawn: ${data.results.dawn || 'Not available'}</p>
    <p>Dusk: ${data.results.dusk || 'Not available'}</p>
    <p>Day Length: ${data.results.day_length || 'Not available'}</p>
    <p>Solar Noon: ${data.results.solar_noon || 'Not available'}</p>
    <p>Time Zone: ${data.results.timezone}</p>
    `;
    resultContainer.classList.remove('hidden');
}


function showError(message) {
  const errorContainer = document.getElementById('errorContainer');
  errorContainer.innerHTML = `<p>${message}</p>`;
  errorContainer.classList.remove('hidden');
  document.getElementById('resultContainer').classList.add('hidden');
}
