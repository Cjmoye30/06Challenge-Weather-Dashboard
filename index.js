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
fetch("https://api.openweathermap.org/data/2.5/forecast/?lat=" + lat + "&lon=" + lon + "&appid=" + key + "=imperial&cnt=40")
    .then(function (response) {
        return response.json()
    })
    .then(function (data) {
        console.log(data);

        city.text("Weather for: " + data.city.name);
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

// Create a fetch request to pull data based on the city selected, and then pass in the coordinates we received back into the URL to update the HTML accordingly
// Create a button list element after submission

$("#city-search-form").on("submit",handleCitySearch);

function handleCitySearch (e){
    e.preventDefault();

    var cityInputEl = $("city-input");
    console.log(cityInputEl);
}



var userCity = "San Diego";
var userCountry = "";

fetch("http://api.openweathermap.org/geo/1.0/direct?q=" + userCity + "&US&limit=1&appid=" + key)
    .then(function (response) {
        return response.json()
    })
    .then(function (data) {
        var userLat = data[0].lat;
        console.log("User Latitute: " + userLat);

        var userLon = data[0].lon;
        console.log("User Longitude: " + userLon);
    })

// Add event listener for submit button which will then update the city name
// Create an array for user values which are submitted
// Going to cap the max amount of stored items at 10 or some number that looks good for our webpage
// When we hit 10 or the limit, then we will pop or start removing items from the beginning or end of the array
// We will then use a for loop to go through all of the items in the array and generate them each time to append them to the blank UL we already have

// Bonus - bring in an API to autocomplete for the cities


var corpBuzzWord = $("#motivation");
function corpBuzzWordGenerate (){
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



