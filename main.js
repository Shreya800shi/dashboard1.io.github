//video section


 // photos



//rukhbandi



//map

var view = new ol.View({
  projection: 'EPSG:4326',
  center: [77.40289000, 23.25469000],
  zoom: 4.5
});



var OSMBaseMap = new ol.layer.Tile({
  source: new ol.source.OSM()

})  

var layerArray = [OSMBaseMap]

//  define our map 

var map = new ol.Map({

  target: 'map',
  // layers: layerArray,

  visible: false,
  controls: [],
  view: view

});

const bingImage = new ol.layer.Tile({
  source: new ol.source.BingMaps({
    key: 'AvaK4rJVZVFv7Pi_k9dK3yQkx3CfW1m2S1NJ0StbPyNcrQCx5qRn8mguVkPsH3UZ ',
    imagerySet: 'AerialWithLabelsOnDemand'
  }),

  title: 'BingeMAPLayer',
  
})

map.addLayer(bingImage);






//mini map
const overViewMap = new ol.control.OverviewMap({
  collapsed: false,
  layers: [
    new ol.layer.Tile({
      source: new ol.source.OSM()
    })
  ]
})
map.addControl(overViewMap);





// home button 

var homeButton = document.createElement('button');
homeButton.innerHTML = '<img src="home.png" alt="" style="width:20px;height: 20px;filter:brightness(0) invert(1);vertical-align:middle"></img>';
homeButton.className = 'myButton';

// var homeElement = document.createElement('div');
// homeElement.className = 'homeButtonDiv';
// homeElement.appendChild(homeButton);

var homeControl = new ol.control.Control({
element: homeButton
})

homeButton.addEventListener("click", () => {



map.getView().fit([59.120198, 5.754256, 95.415161, 39.135643]);
})

map.addControl(homeControl);


//scaleline
const scaleLineControl = new ol.control.ScaleLine({
bar: true,
text: true,
steps: 4,
dpi: 200,
});
map.addControl(scaleLineControl);

//zoom slider
const zoomSlider = new ol.control.ZoomSlider();
map.addControl(zoomSlider);


//full screen
const fullScreenMap = new ol.control.FullScreen();
map.addControl(fullScreenMap);

// zoom extent
const zoomExtent = new ol.control.ZoomToExtent({
extent: [ 59.120198, 5.754256, 95.415161, 39.135643],
});
map.addControl(zoomExtent);

//pop up

// Define a popup overlay
var popup = new ol.Overlay({
element: document.getElementById('popup-container'),
autoPan: false,
autoPanAnimation: {
  duration: 250
}
});
map.addOverlay(popup);

// Function to display the popup
function displayPopup(coordinate, weatherData) {
var content = `
<div class="weather-popup">
<button id="popup-closer" class="popup-closer" onclick = "hidePopup">Close</button>
<h3>${weatherData.name}</h3>
<p>Temperature: ${Math.round(weatherData.main.temp)}°C</p>
<p>Humidity: ${weatherData.main.humidity}%</p>
<p>Wind Speed: ${weatherData.wind.speed} km/h</p>
<img src="${getWeatherIcon(weatherData.weather[0].main)}" alt="${weatherData.weather[0].main}">
</div>
`;
popup.setPosition(coordinate);
document.getElementById('popup-content').innerHTML = content;
popup.setPositioning('bottom-center');


}

function hidePopup() {
popup.setPosition(null);
}


// Function to get weather icon based on weather condition
function getWeatherIcon(weatherCondition) {
switch (weatherCondition) {
  case 'Clouds':
    return 'clouds.png';
  case 'Clear':
    return 'clear.png';
  case 'Rain':
    return 'rain.png';
  case 'Drizzle':
    return 'drizzle.png';
  case 'Mist':
    return 'mist.png';
    case 'Smoke':
    return 'smoke.png';
  case 'Haze':
    return 'haze.png';
  default:
    return '';
}
}

// Event listener to show popup with weather report on map click
map.on('click', async function (event) {
var coordinate = event.coordinate;
var city = searchBox.value;
const response = await fetch(apiUrl + city + `&appid=${apiKey}`);
if (response.status == 404) {
  displayPopup(coordinate, { name: "City not found", main: { temp: "N/A", humidity: "N/A" }, wind: { speed: "N/A" }, weather: [{ main: "N/A" }] });
} else {
  var weatherData = await response.json();
  displayPopup(coordinate, weatherData);
}
});

// Event delegation for the close button
document.addEventListener('click', function(event) {
if (event.target && event.target.id === 'popup-closer') {
  hidePopup();
}
});





// weather API

// const apiKey = "03f8c7aa4841f0c18f052307bd5928e6";
const apiKey = "9cb6aa37d27dbaf3d1b3ece2ae8bcaa1";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weatherIcon = document.querySelector(".weather-icon");

async function checkWeather(city) {
  const response = await fetch(apiUrl + city + `&appid=${apiKey}`);

  if(response.status == 404) {
      document.querySelector(".error").style.display = "block";
      document.querySelector(".weather-info").style.display = "none";
  }
  else {
      var data = await response.json();

  document.querySelector(".city").innerHTML = data.name; 
  document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°c";
  document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
  document.querySelector(".wind").innerHTML = data.wind.speed + " km/h";

  if(data.weather[0].main == "Clouds") {
      weatherIcon.src = "clouds.png";
  } 
  else if(data.weather[0].main == "Clear") {
      weatherIcon.src = "clear.png";
  }
  else if(data.weather[0].main == "Rain") {
      weatherIcon.src = "rain.png";
  }
  else if(data.weather[0].main == "Drizzle") {
      weatherIcon.src = "drizzle.png";
  }
  else if(data.weather[0].main == "Haze") {
    weatherIcon.src = "haze.png";
}
else if(data.weather[0].main == "Smoke") {
  weatherIcon.src = "smoke.png";
}
  else if(data.weather[0].main == "Mist") {
      weatherIcon.src = "mist.png";
  }

  document.querySelector(".weather-info").style.display = "block";
  document.querySelector(".error").style.display = "none";
  }   
}

searchBtn.addEventListener("click", () => {
  checkWeather(searchBox.value);
})



// search 
searchBtn.addEventListener("click", async () => {
  const city = searchBox.value;
  await checkWeather(city);

  // Geocoding to get the coordinates of the city
  const geocodeUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;
  const geocodeResponse = await fetch(geocodeUrl);
  const geocodeData = await geocodeResponse.json();

  if (geocodeData.length > 0) {
      const coordinates = [geocodeData[0].lon, geocodeData[0].lat];
      
      const zoomLevel = 11;

      // Fly to the location on the map with the specified zoom level
      map.getView().animate({ center: coordinates, zoom: zoomLevel, duration: 1000 });
  }
});



// Function to reset the weather dashboard
function resetWeatherDashboard() {
// Clear the search box value
searchBox.value = '';

// Hide weather information and error message
document.querySelector(".weather-info").style.display = "none";
document.querySelector(".error").style.display = "none";

// Reset weather icon
weatherIcon.src = "";
 // Hide the popup
 hidePopup();

 map.getView().fit([59.120198, 5.754256, 95.415161, 39.135643]);

 resetButton.style.display = 'none';

}

// Event listener for the reset button
document.getElementById("reset-btn").addEventListener("click", resetWeatherDashboard);

// bar graph

