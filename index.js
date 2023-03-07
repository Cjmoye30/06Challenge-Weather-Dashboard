// HTML Element Selectors
var city = $("#city-name");
var date = $("#date");
var temperature = $("#temp")

var cityArr = [];
var key = "dfc53a3a9ff97d77b6af068616b52dc8&units";


function returnUserWeather(lat, lon) {

    // Refactored the code so that there are no additional arrays.
    // The data is filtered based on the dates, and then the filtered data is then put into an array which is better/more sensible than increasing the index by 8 each time like I had the data before. This new refactor greatly reduces the amound of code and not that much harder to understand
    // Each index of the array represents a new day
    fetch("https://api.openweathermap.org/data/2.5/forecast/?lat=" + lat + "&lon=" + lon + "&appid=" + key + "=imperial&cnt=40")
        .then(function (response) {
            return response.json()
        })
        .then(function (data) {
            // console.log(data);
            
            var datesArray = [];
            var dataArr = [];

            // Formatting the date text and putting into an array so that we can pull all of the unique values
            for (var i = 0; i < data.cnt; i++) {
                datesArray.push(dayjs(data.list[i].dt_txt).format("YYYY-MM-DD"))
            }
            // console.log(datesArray);

            // Method to pull all of the unique values from the dates we get
            var uniqueDatesArray = [...new Set(datesArray)];
            console.log("Unique values:",uniqueDatesArray);

            for(var i = 0; i < uniqueDatesArray.length; i++) {
                var dayData2 = data.list.filter(function(day) {
                    return day.dt_txt.includes(uniqueDatesArray[i])
                })
                console.log(dayData2);
                dataArr.push(dayData2);
            }
            
            // Get data for all 6 days individually and put the data into a for loop
            // for (var i = 0; i <=5; i++) {
            //     var dayAdd = dayjs().add(i, "day").format("YYYY-MM-DD");
            //     var dayData = data.list.filter(function(day) {
            //         return day.dt_txt.includes(dayAdd);
            //     })
            //     // console.log(dayData);
            //     dataArr.push(dayData);
            // }

            // The issue is that after a certain time - the data is not pulling correctly and it is reading undefined. I could go back to the MVP code and paste that back in if necessary, but I will try to keep things as is

            // Looping through the next 5 days
            // Pulling data from the first index of each of the arrays so that the data is consistent
            // There is a potential to expand and include all of the information from these arrays, but that is not required at this moment.
            for (var i = 0; i <dataArr.length; i++) {
                $("#fcst-day-" + i).children(".day-header").text(dayjs(dataArr[i][0].dt_txt).format("ddd MMM DD, YYYY"));
                $("#fcst-day-" + i).children(".temp").text("Temperature: "+dataArr[i][0].main.temp);
                $("#fcst-day-" + i).children(".wind").text("Wind Speed"+dataArr[i][0].wind.speed);
                $("#fcst-day-" + i).children(".humidity").text("Humidity: "+dataArr[i][0].main.humidity);
                $("#fcst-day-" + i).children(".icon").attr("src", "http://openweathermap.org/img/wn/" + dataArr[i][0].weather[0].icon + "@2x.png");
            }
        })
}

function createButtons() {
    $("#buttonList").text("");
    for (var i = 0; i < cityArr.length; i++) {
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
        // run the function on default for Charlotte if no data exists already
        searchCity("Charlotte")
        console.log("Local storae is empty!")
    } else {
        $("#clearStorage").attr("style", "display: block");

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

// Running OpenWeather Geolocation
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
            
            city.text(data[0].name + ", " + data[0].state + " - " + data[0].country);

            // Pushing user data into an array which then goes to local storage for retrival
            cityArr.push(userCity);

            createButtons();
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