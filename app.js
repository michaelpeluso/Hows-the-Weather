/*
 * INITIATION
 */

const { Console } = require("console");
const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const fs = require("fs");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

var weatherData = {};
var query = "";

/*
 * FILE SHARING
 */

// send index.html file
app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html");
});

// send index.css file
app.get("/index.css", (req, res) => {
    res.setHeader("Content-Type", "text/css");
    res.sendFile(__dirname + "/index.css");
});

// send script.js file
app.get("/script.js", (req, res) => {
    res.setHeader("Content-Type", "text/javascript");
    res.sendFile(__dirname + "/script.js");
});

// send cloud.png file
app.get("/cloud.png", (req, res) => {
    res.sendFile(__dirname + "/cloud.png");
});

//return to home
app.get("/return", function (req, res) {
    res.sendFile(__dirname + "/index.html");
});

/*
 * REQUESTS
 */

// Client requests weather data
app.get("/data", (req, res) => {
    var data = {};
    if (weatherData != {}) {
        data = weatherData;
        data.city_name = query;
    }

    res.send(JSON.stringify(data));
});

// Server requests weather data
app.post("/", function (req, res) {
    query = req.body.cityName;

    const apiKey_fileName = "apiKey.txt"; //location of .txt file containing api key
    const apiKey = fs.readFileSync(apiKey_fileName, "utf8");
    const units = "imperial";
    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&units=" + units + "&appid=" + apiKey;

    if (query.trim() == "") {
        res.sendFile(__dirname + req.path);
        return;
    }

    https.get(url, function (response) {
        response.on("data", function (data) {
            weatherData = JSON.parse(data);

            if (weatherData.cod != "200") {
                res.sendFile(__dirname + "/error.html");
                return;
            }

            const temp = weatherData.main.temp;
            const description = weatherData.weather[0].description;
            const icon = weatherData.weather[0].icon;

            var htmlResponse = "<h1>The temperature in " + query + " is " + temp + " degrees.</h1>";
            htmlResponse += "<h2>The weather is currently " + description + ".</h2>";
            htmlResponse += "<img src='https://openweathermap.org/img/wn/" + icon + "@2x.png' />";

            res.sendFile(__dirname + "/response.html");
        });
    });
});

/*
 * LISTEN
 */

app.listen(3000, function () {
    console.log("Server running on port 3000.");
});
