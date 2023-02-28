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

// Fetch request to grab the data in a json format
fetch("https://api.openweathermap.org/data/2.5/forecast/?lat="+lat+"&lon="+lon+"&appid="+key+"=imperial&cnt=40")
    .then(function (response) {
        return response.json()
    })
    .then(function (data) {
        console.log(data);
        
        city.text("City: "+data.city.name);
        // console.log(city);

        temperature.text("Current Temperature: "+data.list[0].main.temp);
        console.log(data.list[0].main.temp);

        // Figure out the date situation
        // This for loop increased the i index by 8 each time - since we have 40 objects then we will get the 5 days like we were needing
        for (var i = 0; i < data.list.length; i+=8) {
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
            $("#fcst-day-"+i).children(".day-header").text(next5days[i]);
            $("#fcst-day-"+i).children(".icon").attr("src", "http://openweathermap.org/img/wn/"+icons[i]+"@2x.png");
            $("#fcst-day-"+i).children(".temp").text("Temp: "+temps[i]);
            $("#fcst-day-"+i).children(".wind").text("Wind Speed: "+winds[i]);
            $("#fcst-day-"+i).children(".humidity").text("Humidity: "+humidities[i]);
        }
    })




    // Need to start pseudo coding so that we do not get lost
    // Tackle the project one piece at a time - you know how to do all of this, so let's be strategic about the process and start back with our HTML skeleton and then moving on to the JS when we are ready. It will bring everything back in line and you will not be overwhelmed when you reach an issue.
