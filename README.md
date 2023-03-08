# 06 Server-Side APIs: Weather Dashboard

## Description

- What was your motivation?
    - To create a weather app which accepts in a user city, and then pulls the forecast for the current and next 5 days through the openweather API.

- Why did you build this project?
    - This project was built to better understand the use of APIs and how versatile they can be in web development projects. It allows us to access a great amount of information for free/little cost

- What problem does it solve?
    - We are able to see the forecast for any city selected for the current and next 5 days.

- What did you learn?
    - JavaScript / JQuery:
        - Better understanding of traversiting through the fetched data from the API. 
        - Pulling unique values from data and storing those in an array in order to capture all of the unique data values.
        - More practice creating and appending buttons
        - Event Delegation - since the buttons are dynamically created, I was not able to put an event listener directly onto them. Instead, I had to put an event listener on the parent container (#buttonList) so that each of the created buttons would then have an event listener.
        - More practice with local storage. Very easy to create and store an array into local storage which allows us to only have 1 key value, and then those values are all in the array and accessed by an index.
        - localStorage.clear() - very easy to clear local storage

## Installation / Live Site

[Github Pages Live Site](https://cjmoye30.github.io/06Challenge-Weather-Dashboard/)

## Usage / Screenshot

![Desktop](/assets/06Challenge%20-Weather-Dash-Desktop.png)
![Mobile](/assets/06Challenge%20-Weather-Dash-Mobile.png)
