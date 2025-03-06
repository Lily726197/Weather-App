function updateWeatherInfo(response) {
    var temperatureElement = document.querySelector("#temperature");
    var temperature = response.data.temperature.current;
    temperatureElement.innerHTML = Math.round(temperature);
    
    var cityElement = document.querySelector("#selected-city");
    cityElement.innerHTML = response.data.city;
    
    var descriptionElement = document.querySelector("#description");
    var description = response.data.condition.description;
    description = description.split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
    descriptionElement.innerHTML = description;
    console.log(description);
    
    var humidityElement = document.querySelector("#humid");
    humidityElement.innerHTML = `${response.data.temperature.humidity}%`;
    
    var windElement = document.querySelector("#wind");
    windElement.innerHTML = `${response.data.wind.speed} km/h`;
    
    var iconElement = document.querySelector("#icon");
    iconElement.innerHTML = `<img src="${response.data.condition.icon_url}" class="weather-app-icon"/>`;
    
    var timeElement = document.querySelector("#time");
    timeElement.innerHTML = formatDate(response.data.time); // Pass the correct time
    getForecast(response.data.city);
}


function formatDate(timestamp) {
    var date = new Date(timestamp * 1000); // Use the timestamp directly
    var days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    var day = days[date.getDay()];
    var hours = date.getHours();
    var minutes = date.getMinutes();
    if (minutes < 10) {
        minutes = `0${minutes}`;
    }
    return `${day}, ${hours}:${minutes}`;
}


function searchCity(city){
    var apiKey = "a3o950fc274379347b6a44aft08a3cb0";
    var apiURL = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=metric`;
    axios.get(apiURL).then(updateWeatherInfo);
}

function displayForecast(response) {
    var forecastElement = document.querySelector("#forecast");
    var forecast = response.data.daily;
    var days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    var forecastHTML = "";

    // Validate response data
    forecast.forEach(function(day, index) {
        // Check if day.time and day.condition exist


            if (index < 5) {
                var date = new Date(day.time * 1000);
            var dayName = days[date.getDay()];
                forecastHTML += 
                `<div class="WeatherForecastPreview">
                        <div class="forecast-time">${dayName}</div>
                    <div class="icon">
                        <img src="${day.condition.icon_url}" alt="${day.condition.description}" class="weather-forecast-icon-img"/>
                    </div>
                        <canvas width="38" height="38"></canvas>
                        <div class="forecast-temperature">
                             <span class="forecast-temperature-max">${Math.round(day.temperature.maximum)}°C</span>
                             <span class="forecast-temperature-min">${Math.round(day.temperature.minimum)}°C</span>
                        </div>
                    </div>`;
        } else {
            console.error("Invalid data for day:", day); // Log invalid day data
        }
    });
    forecastElement.innerHTML = forecastHTML;
}

function getForecast(city){
    var apiKey = "a3o950fc274379347b6a44aft08a3cb0";
    var apiURL = `https://api.shecodes.io/weather/v1/forecast?query=${city}&key=${apiKey}&units=metric`; // Updated endpoint
    axios.get(apiURL).then(displayForecast);
}

function handleSearchSubmit(event){
    event.preventDefault();
    var searchInput = document.querySelector("#search-form-input");
    var cityElement = document.querySelector("#selected-city");
    cityElement.innerHTML = searchInput.value;
    searchCity(searchInput.value);
    getForecast(searchInput.value);
}
var searchFormElement = document.querySelector("#search-form");
searchFormElement.addEventListener("submit", handleSearchSubmit);
searchCity("London");
getForecast("London");
