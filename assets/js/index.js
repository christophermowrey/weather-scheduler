var APIKey = "f3a00081687783cb68fc557dcfbb5cc0";
var cityFormEl = document.querySelector("#city-form");
var cityInputEl = document.querySelector("#cityname");
var cityInfoEl = document.querySelector("#cityInfo");
var temp = document.querySelector(".temp");
var wind = document.querySelector(".wind");
var humidity = document.querySelector(".humidity");
var uv = document.querySelector(".uv");
var icon = document.querySelector(".weather-icon");
var searches = document.querySelector("#search-container");
var forecast = $(".forecast");


var formSubmitHandler = function (event) {
  event.preventDefault();

  var cityName = cityInputEl.value.trim();

  if (cityName) {
    getWeather(cityName);
    saveCity(cityName);
    requestForecast(cityName);

    cityInputEl.value = "";
  } else {
    alert("Please enter the name of a city");
  }
};

var getWeather = function (city) {
    var apiUrl = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;

    fetch(apiUrl)
    .then(function (response) {
      if (response.ok) {
        console.log(response);
        response.json().then(function (data) {
          console.log(data);

          displayWeather(data, city);

        });
      } else {
        alert('Error: ' + response.statusText);
      }
    })
    .catch(function (error) {
      alert('Unable to connect to OpenWeather');
    });

}


var displayWeather = function (data) {
  cityInfoEl.textContent =
    data.name + " (" + moment().format("MMM Do YY") + ")";
  temp.textContent =
    "Temp: " + Math.round((data.main.temp * 9) / 5 - 459.67) + "°F";
  wind.textContent = "Wind: " + data.wind.speed + " MPH";
  humidity.textContent = "Humidity: " + data.main.humidity + "%";
  uv.textContent = "UV Index: " + "4.5";
  console.log(data.main);
  //where is the uv???
};


var requestForecast = function (cityName) {
  var cityInputVal = cityName;
  var forecastUrl = "http://api.openweathermap.org/data/2.5/weather?q=" + cityInputVal + "&appid=f3a00081687783cb68fc557dcfbb5cc0&units=imperial";

  fetch(forecastUrl)
      .then(function (response) {
          return response.json()
      })
      .then(function (data) {
        console.log(data.coord.lat);
          fetch("http://api.openweathermap.org/data/2.5/onecall?lat=" + data.coord.lat + "&lon=" + data.coord.lon + "&exclude=minutely,hourly,alerts&appid=c3724c60a3fb224ac5bc841e274c0689&units=imperial")
              .then(function (response) {
                  return response.json();
              })
              .then(function (data) {
                  displayForecast(data);
              })
      })
}

function displayForecast(weather) {

  if (forecast.text("")) {
    console.log(forecast.text(""));
      for (i = 0; i < 5; i++) {
          var forecastDays = $("<div>");
          forecastDays.addClass("card col-2 m-3")
          var dayXDate = $("<h3>");
          dayXDate.text("(" + moment().add((i+1), "days").format("MM/DD/YYYY") + ")");
          forecastDays.append(dayXDate);
          var dayXTemp = $("<p>");
          dayXTemp.text("Temp: " + ((weather.daily[i+1].temp.max + weather.daily[i+1].temp.min) / 2).toFixed(2) + " °F");
          forecastDays.append(dayXTemp);
          var dayXWind = $("<p>");
          dayXWind.text("Wind: " + (weather.daily[i+1].wind_speed).toFixed(2) + " MPH");
          forecastDays.append(dayXWind);
          var dayXHumid = $("<p>");
          dayXHumid.text("Humidity: " + weather.daily[i+1].humidity + "%");
          forecastDays.append(dayXHumid);
          forecast.append(forecastDays);
      }
  }
}

var saveCity = function (city) {
  localStorage.setItem(city, JSON.stringify(city));
  var button = document.createElement("button");
  button.classList.add("btn");
  var storedCity = JSON.parse(localStorage.getItem(city));
  button.textContent = storedCity;
  console.log(button.textContent);
  searches.appendChild(button);
};

cityFormEl.addEventListener("submit", formSubmitHandler);
