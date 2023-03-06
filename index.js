// HTML Element Selectors
var city = $("#city-name");
var date = $("#date");
var temperature = $("#temp")

// Fetch request for Charlotte NC
var lat = 35.227085;
var lon = -80.843124;

var cityArr = [];
var key = "dfc53a3a9ff97d77b6af068616b52dc8&units";
// var currentDate = dayjs().format("MMM DD, YYYY");
var currentDate = dayjs().format("YYYY-MM-DD");

console.log(currentDate);
console.log(dayjs().add(1, "day").format("YYYY-MM-DD"));

function returnUserWeather(lat, lon) {

    // Arrays to store the data for 5-day forecast for the day, temperature, humidity, and wind
    // Reset the arrays to blank so the info for the new city will be displayed
    var next5days = [];
    var icons = [];
    var temps = [];
    var winds = [];
    var humidities = [];


    fetch("https://api.openweathermap.org/data/2.5/forecast/?lat=" + lat + "&lon=" + lon + "&appid=" + key + "=imperial&cnt=40")
        .then(function (response) {
            return response.json()
        })
        .then(function (data) {
            console.log(data);
            console.log(dayjs.unix(data.list[0].dt));

            // Filters data down to only the current day and nothing else
            // same logic can be used for the next 5 days
            // var daysFilter = data.list.filter(function(day) {
            //     return day.dt_txt.includes(currentDate);
            // })
            // console.log(daysFilter);

            var myArr = [];
            // Get data for all 6 days individually and put the data into a for loop
            for (var i = 0; i <=5; i++) {
                var dayAdd = dayjs().add(i, "day").format("YYYY-MM-DD");
                var dayData = data.list.filter(function(day) {
                    return day.dt_txt.includes(dayAdd);
                })
                myArr.push(dayData);
            }
            console.log(myArr);

            // looping through the newly created array and displaying the content as HTML
            // console.log(dayjs.unix(myArr[1][1].dt).format("MMMM DD, YYYY"));

            // Displaying content only for the current day of the selected city
            // $(".curr-day-header").text(dayjs.unix(myArr[0][0].dt).format("MMMM DD, YYYY"));
            // $(".curr-icon").attr("src", "http://openweathermap.org/img/wn/" + myArr[0][0].weather[0].icon + "@2x.png");
            // $(".curr-temp").text("Current Temperature: "+myArr[0][0].main.temp);
            // $(".curr-wind").text("Current Wind Speed: "+myArr[0][0].wind.speed);
            // $(".curr-humidity").text("Current Humidity: "+myArr[0][0].main.humidity);

            // Looping through the next 5 days
            for (var i = 0; i <myArr.length; i++) {
                // console.log(myArr[1][0]);
                // $("#fcst-day-" + i).children(".day-header").text(dayjs.unix(myArr[i][0].dt).format("MMM DD, YYYY"));
                $("#fcst-day-" + i).children(".day-header").text(dayjs.unix(myArr[i][0].dt));
                $("#fcst-day-" + i).children(".temp").text("Temperature: "+myArr[i][0].main.temp);
                $("#fcst-day-" + i).children(".wind").text("Wind Speed"+myArr[i][0].wind.speed);
                $("#fcst-day-" + i).children(".humidity").text("Humidity: "+myArr[i][0].main.humidity);
                $("#fcst-day-" + i).children(".icon").attr("src", "http://openweathermap.org/img/wn/" + myArr[i][0].weather[0].icon + "@2x.png");
            }

            // Figure out the date situation
            // This for loop increased the i index by 8 each time - since we have 40 objects then we will get the 5 days like we were needing
            // for (var i = 0; i < data.list.length; i += 8) {
            //     // Date
            //     var date = dayjs.unix(data.list[i].dt).format("MMM DD, YYYY");
            //     next5days.push(date);

            //     // Icon
            //     var icon = data.list[i].weather[0].icon;
            //     icons.push(icon);

            //     // Temperature
            //     var temp = data.list[i].main.temp;
            //     temps.push(temp);

            //     //Wind
            //     var wind = data.list[i].wind.speed;
            //     winds.push(wind);

            //     //Humidity
            //     var humidity = data.list[i].main.humidity;
            //     humidities.push(humidity);
            // }

            // One for loop which can iterate through all of the IDs and use this for all of the details needed in the cards
            // for (var i = 0; i < next5days.length; i++) {
            //     $("#fcst-day-" + i).children(".day-header").text(next5days[i]);
            //     $("#fcst-day-" + i).children(".icon").attr("src", "http://openweathermap.org/img/wn/" + icons[i] + "@2x.png");
            //     $("#fcst-day-" + i).children(".temp").text("Temp: " + temps[i]);
            //     $("#fcst-day-" + i).children(".wind").text("Wind Speed: " + winds[i]);
            //     $("#fcst-day-" + i).children(".humidity").text("Humidity: " + humidities[i]);
            // }
        })
}

function createButtons() {
    $("#buttonList").text("");
    for (var i = 0; i < cityArr.length; i++) {
        // console.log(cityArr[i]);
        var cityListEl = $("<button>").text(cityArr[i]).attr("class", "btn cityButton");


        localStorage.setItem("cities", JSON.stringify(cityArr));
        $("#buttonList").append(cityListEl);
    }
    $("#clearStorage").attr("style", "display: block");
 
}

$(function () {

    // Event Delegation - since the city buttons are created after the documents lods, then we have to use event delegation and put the event listered to the entire list since that is already created. Then, we can capture the value which is clicked for items created dynamically.
    $("#buttonList").click(function (e) {
        // Get the value of the previous city buttons and store that
        // On click - pass this back into the handleCitySearch function and fetch the data
        // console.log(e.target.innerHTML);
        userCity = e.target.innerHTML;
        console.log(userCity);
        searchCity(userCity);

    })

    if (localStorage.length === 0) {
        // run the function on default for Charlotte
        searchCity("Charlotte")
        console.log("Local storae is empty!")
    } else {
        var storedCities = JSON.parse(localStorage.getItem("cities"));

        // On document load - pulling the weather for the last searched city
        searchCity(storedCities[storedCities.length-1]);

        // Reinitialize the cityArray so that the buttons generate on load and do not get replaced with an empty array
        cityArr = JSON.parse(localStorage.getItem("cities"));

        for (var i = 0; i < storedCities.length; i++) {
            var buttonEl = $("<button>").text(storedCities[i]).attr("class", "btn cityButton");
            $("#buttonList").append(buttonEl);
        }
    }
})

function handleCitySearch(e) {
    e.preventDefault();
    // Take the user value and place that into an array - so that we can eventually use the array to create a list of buttons of recent searches

    userCity = $("#city-input").val();
    // Send the user an alert and end the function if a blank city was entered, or if the city already exisits
    // If none of these condtions returns true, then we proceed to fetch the request with the user city
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
            console.log(data);

            cityArr.push(userCity);
            createButtons();

            console.log(data);
            city.text(data[0].name + ", " + data[0].state + " - " + data[0].country);
            var userLat = data[0].lat;
            console.log("User Latitute: " + userLat);

            var userLon = data[0].lon;
            console.log("User Longitude: " + userLon);

            console.log("City: " + userCity + "\nLatitude: " + userLat + "\nLongitude: " + userLon);
            returnUserWeather(userLat, userLon);
        })
        .catch(function (err) {
            cityArr.pop();
            createButtons();
            alert("Please enter a valid name!");
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
function chuck() {
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
$("#clearStorage").click(function(){
    cityArr = [];
    console.log("Clear storage button was clicked");
    localStorage.clear();
    createButtons();
    $("#clearStorage").attr("style", "display: none");

})


// if user storage is zero, run for Charlotte
// if there is existing user storage, pull the last index