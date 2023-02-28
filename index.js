// HTML Element Selectors
var city = $("#city-name");
var date = $("#date");
var temperature = $("#temp")




// Fetch request for Charlotte NC
var lat = 35.227085;
var lon = -80.843124;
var next5days = [];

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
        console.log(data.list[0])


        city.text("City: "+data.city.name);
        // console.log(city);

        temperature.text("Current Temperature: "+data.list[0].main.temp);
        console.log(data.list[0].main.temp);

        // Figure out the date situation
        // This for loop increased the i index by 8 each time - since we have 40 objects then we will get the 5 days like we were needing
        for (var i = 0; i < data.list.length; i+=8) {

            var date = dayjs.unix(data.list[i].dt).format("MMM DD, YYYY");
            next5days.push(date);
            console.log(date);
        }

        // For loop which will the date for the next 5 days
        for (var i = 0; i < next5days.length; i++) {
            $("#fcst-day-"+i).text(next5days[i]);
        }
    })




    // Need to start pseudo coding so that we do not get lost
    // Tackle the project one piece at a time - you know how to do all of this, so let's be strategic about the process and start back with our HTML skeleton and then moving on to the JS when we are ready. It will bring everything back in line and you will not be overwhelmed when you reach an issue.
