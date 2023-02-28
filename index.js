// HTML Element Selectors
var city = $("#city-name");
var date = $("#date");
var temperature = $("#temp")

// Fetch request for Charlotte NC
var lat = 35.227085;
var lon = -80.843124;

var currentDate = dayjs().format("MMM DD, YYYY");;
console.log(currentDate);

var forecastUrl = "https://api.openweathermap.org/data/2.5/forecast/daily?lat="+lat+"&lon="+lon+"&appid=dfc53a3a9ff97d77b6af068616b52dc8&units=imperial&cnt=40"

// Fetch request to grab the data in a json format
fetch("https://api.openweathermap.org/data/2.5/forecast/?lat="+lat+"&lon="+lon+"&appid=dfc53a3a9ff97d77b6af068616b52dc8&units=imperial&cnt=40")
    .then(function (response) {
        return response.json()
    })
    .then(function (data) {
        console.log(data);
        console.log(data.list[0].dt)


        city.text("City: "+data.city.name);
        // console.log(city);

        temperature.text("Current Temperature: "+data.list[0].main.temp);
        console.log(data.list[0].main.temp);

        // Figure out the date situation
        for (var i = 0; i < data.list.length; i++) {

            // var date = dayjs.unix(data.list[i].dt).format("MMM DD, YYYY");
            // console.log(date);

            // console.log(dayjs.unix(data.list[i]));

        }
    })

    // Need to start pseudo coding so that we do not get lost
    // Tackle the project one piece at a time - you know how to do all of this, so let's be strategic about the process and start back with our HTML skeleton and then moving on to the JS when we are ready. It will bring everything back in line and you will not be overwhelmed when you reach an issue.
