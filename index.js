// HTML Element Selectors
var city = $("#city-name");
var date = $("#date");
var temperature = $("#temp");

var cityArr = [];
var key = "dfc53a3a9ff97d77b6af068616b52dc8&units";

// Fetch weather for lat/lon based on user city input
function returnUserWeather(lat, lon) {

    fetch("https://api.openweathermap.org/data/2.5/forecast/?lat=" + lat + "&lon=" + lon + "&appid=" + key + "=imperial&cnt=40")
        .then(function (response) {
            return response.json()
        })
        .then(function (data) {

            var datesArray = [];
            var dataArr = [];

            // Formatting the date text and putting into an array so that we can pull all of the unique values
            for (var i = 0; i < data.cnt; i++) {
                datesArray.push(dayjs(data.list[i].dt_txt).format("YYYY-MM-DD"))
            }

            // Method to pull all of the unique values from the dates we get
            var uniqueDatesArray = [...new Set(datesArray)];

            // If unique values = 5, hide the display of the last forecast card
            // The data pulled only shows 5 distinct days after a certain time - not sure if there is a possible workaround since we are limited to 40
            if (uniqueDatesArray.length === 5) {
                $("#fcst-day-5").attr("style", "display: none")
            }

            // Filtering all of the data given based on the unique dates, and placing them into a new data array
            for (var i = 0; i < uniqueDatesArray.length; i++) {
                var dayData2 = data.list.filter(function (day) {
                    return day.dt_txt.includes(uniqueDatesArray[i])
                })
                dataArr.push(dayData2);
            }

            // Looping through the data array and displaying the content in the HTML
            for (var i = 0; i < dataArr.length; i++) {
                $("#fcst-day-" + i).children(".day-header").text(dayjs(dataArr[i][0].dt_txt).format("ddd MMM DD, YYYY"));
                $("#fcst-day-" + i).children(".temp").text("Temperature: " + dataArr[i][0].main.temp);
                $("#fcst-day-" + i).children(".wind").text("Wind Speed: " + dataArr[i][0].wind.speed);
                $("#fcst-day-" + i).children(".humidity").text("Humidity: " + dataArr[i][0].main.humidity);
                $("#fcst-day-" + i).children(".icon").attr("src", "http://openweathermap.org/img/wn/" + dataArr[i][0].weather[0].icon + "@2x.png");
            }
        })
}

// Create buttons for a newly entered city
function createButtons() {
    $("#buttonList").text("");
    for (var i = 0; i < cityArr.length; i++) {
        var cityListEl = $("<button>").text(cityArr[i]).attr("class", "btn cityButton");
        localStorage.setItem("cities", JSON.stringify(cityArr));
        $("#buttonList").append(cityListEl);
    }
    $("#clearStorage").attr("style", "display: block");
}

// On document load - checking local storage for any data to create buttons and appending.
// If no data in local storage, weather defaults to Charlotte, NC
$(function () {
    // Event listener for city button clicks, which capture the city and run the searchCity function
    $("#buttonList").click(function (e) {
        userCity = e.target.innerHTML;
        searchCity(userCity);
    })

    if (localStorage.length === 0) {
        searchCity("Charlotte")
    } else {
        $("#clearStorage").attr("style", "display: block");
        var storedCities = JSON.parse(localStorage.getItem("cities"));

        // On document load - pulling the weather for the last searched city
        searchCity(storedCities[storedCities.length - 1]);

        // Reinitialize the cityArray so that the buttons generate on load and do not get replaced with an empty array
        cityArr = JSON.parse(localStorage.getItem("cities"));

        // Create and appending city buttons from local storage
        for (var i = 0; i < storedCities.length; i++) {
            var buttonEl = $("<button>").text(storedCities[i]).attr("class", "btn cityButton");
            $("#buttonList").append(buttonEl);
        }
    }
})

$("#city-search-form").on("submit", handleCitySearch);
// Fetching lat/lon based on user city before running function for weather forecasts
function handleCitySearch(e) {
    e.preventDefault();
    userCity = $("#city-input").val();

    // Alret and end function if blank/existing city in storage
    if (userCity === "") {
        alert("Please enter a city!")
        return
    } else if (cityArr.includes(userCity)) {
        alert("That city already exists!")
        return
    }

    fetch("http://api.openweathermap.org/geo/1.0/direct?q=" + userCity + "&limit=1&appid=" + key)
        .then(function (response) {
            return response.json()
        })
        .then(function (data) {

            // Store lat/lon variables to be used in weather fetch
            var userLat = data[0].lat;
            var userLon = data[0].lon;

            // Update the city text
            city.text(data[0].name + ", " + data[0].state + " - " + data[0].country);

            // Pushing user data into an array which then goes to local storage for retrival
            cityArr.push(userCity);

            // Create buttons and pull weather data with generated lan/lon
            createButtons();
            returnUserWeather(userLat, userLon);
        })
        .catch(function (err) {
            alert("Please enter a valid name!");
        })
}

// Function used for buttons clicked of existing cities
function searchCity(xCity) {
    userCity = xCity;
    city.text(userCity);
    fetch("http://api.openweathermap.org/geo/1.0/direct?q=" + userCity + "&limit=1&appid=" + key)
        .then(function (response) {
            return response.json()
        })
        .then(function (data) {
            city.text(data[0].name + ", " + data[0].state + " - " + data[0].country);
            var userLat = data[0].lat;
            var userLon = data[0].lon;
            returnUserWeather(userLat, userLon);
        })
        .catch(function (err) {
            alert(err);
        })
}

// Clear storage on button click
$("#clearStorage").click(function () {
    cityArr = [];
    localStorage.clear();
    createButtons();
    $("#clearStorage").attr("style", "display: none");
})