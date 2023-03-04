// HTML Element Selectors
var city = $("#city-name");
var date = $("#date");
var temperature = $("#temp")

// Fetch request for Charlotte NC
var lat = 35.227085;
var lon = -80.843124;

// Arrays to store the data for 5-day forecast for the day, temperature, humidity, and wind
var next5days = [];
var icons = [];
var temps = [];
var winds = [];
var humidities = [];

var key = "dfc53a3a9ff97d77b6af068616b52dc8&units";
var currentDate = dayjs().format("MMM DD, YYYY");;
console.log(currentDate);

// Fetch request for the weather data of the selected city

function returnUserWeather (lat,lon) {
    fetch("https://api.openweathermap.org/data/2.5/forecast/?lat=" + lat + "&lon=" + lon + "&appid=" + key + "=imperial&cnt=40")
    .then(function (response) {
        return response.json()
    })
    .then(function (data) {
        // console.log(data);

        // city.text("Weather for: " + data.city.name +", " +data.city.country);
        // console.log(city);

        temperature.text("Current Temperature: " + data.list[0].main.temp);
        console.log(data.list[0].main.temp);

        // Figure out the date situation
        // This for loop increased the i index by 8 each time - since we have 40 objects then we will get the 5 days like we were needing
        for (var i = 0; i < data.list.length; i += 8) {
            // Date
            var date = dayjs.unix(data.list[i].dt).format("MMM DD, YYYY");
            next5days.push(date);

            // Icon
            var icon = data.list[i].weather[0].icon;
            icons.push(icon);

            // Temperature
            var temp = data.list[i].main.temp;
            temps.push(temp);

            //Wind
            var wind = data.list[i].wind.speed;
            winds.push(wind);

            //Humidity
            var humidity = data.list[i].main.humidity;
            humidities.push(humidity);
        }

        // One for loop which can iterate through all of the IDs and use this for all of the details needed in the cards
        for (var i = 0; i < next5days.length; i++) {
            $("#fcst-day-" + i).children(".day-header").text(next5days[i]);
            $("#fcst-day-" + i).children(".icon").attr("src", "http://openweathermap.org/img/wn/" + icons[i] + "@2x.png");
            $("#fcst-day-" + i).children(".temp").text("Temp: " + temps[i]);
            $("#fcst-day-" + i).children(".wind").text("Wind Speed: " + winds[i]);
            $("#fcst-day-" + i).children(".humidity").text("Humidity: " + humidities[i]);
        }
    })
}


var cityArr = [];

function createButtons (){
    $("#buttonList").text("");
    for (var i = 0; i < cityArr.length; i++) {
        // console.log(cityArr[i]);
        var cityListEl = $("<button>").text(cityArr[i]).attr("class", "btn cityButton");
        localStorage.setItem("cities", JSON.stringify(cityArr));
        $("#buttonList").append(cityListEl);
    }
}


$(function (){
    var storedCities = JSON.parse(localStorage.getItem("cities"));
    console.log(storedCities.length);

    // Reinitialize the cityArray so that the buttons generate on load and do not get replaced with an empty array
    cityArr = JSON.parse(localStorage.getItem("cities"));

    for(var i = 0; i < storedCities.length; i++) {
        var buttonEl = $("<button>").text(storedCities[i]).attr("class", "btn cityButton");
        $("#buttonList").append(buttonEl);
    }
})

function handleCitySearch(e) {
    e.preventDefault();
    // Take the user value and place that into an array - so that we can eventually use the array to create a list of buttons of recent searches
    
    userCity = $("#city-input").val();
    cityArr.push(userCity);
    createButtons();
    
    fetch("http://api.openweathermap.org/geo/1.0/direct?q=" + userCity + "&limit=1&appid=" + key)
    .then(function (response) {
        return response.json()
    })
    .then(function (data) {
        console.log(data);
        city.text(data[0].name +", "+data[0].state+" - "+data[0].country);
        var userLat = data[0].lat;
        console.log("User Latitute: " + userLat);
        
        var userLon = data[0].lon;
        console.log("User Longitude: " + userLon);
        
        console.log("City: " +userCity+"\nLatitude: "+userLat+"\nLongitude: "+userLon);
        returnUserWeather(userLat, userLon);
    })
}



var form = $("#city-search-form");
form.on("submit", handleCitySearch);


var corpBuzzWord = $("#motivation");
function corpBuzzWordGenerate() {
    fetch('https://corporatebs-generator.sameerkumar.website/')
        .then(function (response) {
            return response.json()
        })
        .then(function (data) {
            var test = data;
            // $("#motivation").text("Today's Corporate Buzzword: " + data.phrase);
            corpBuzzWord.text(data.phrase);
        })
}
corpBuzzWordGenerate();

var chuckQuote = $("#chuckQuote");
function chuck(){
    fetch("https://api.chucknorris.io/jokes/random")
        .then(function (response) {
            return response.json()
        })
        .then(function (data) {
            // console.log(data.value);
            chuckQuote.text(data.value)
        })
}
chuck();

// template for a fetch request:

// fetch("")
//     .then(function (response) {
//         return response.json()
//     })
//     .then(function (data) {
//         console.log(data)
//     })



