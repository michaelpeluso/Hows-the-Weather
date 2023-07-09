// AJAX request
$.ajax({
    url: "/data",
    method: "GET",
    dataType: "json",
    success: function (data) {
        if (data?.main !== undefined) {
            destributeWeatherData(data);
        }
    },
    error: function (xhr, status, error) {},
});

// destribute weather data in results
function destributeWeatherData(d) {
    $("#city_name").html(capitalizeWords(d.city_name));
    $("#calc_time").html(calcTime(d.dt));

    $("#forecast").html(d.weather[0].main);
    $("#forecast_desc").html(d.weather[0].description);

    $("#temp").html(d.main.temp + " °F");
    $("#feels_like").html(d.main.feels_like + " °F");
    $("#min_temp").html(d.main.temp_min + " °F");
    $("#max_temp").html(d.main.temp_max + " °F");
    $("#clouds").html(d.clouds.all + " %");
    $("#pressure").html(d.main.pressure + " hPa");
    $("#humidity").html(d.main.humidity + " %");

    $("#wind_spd").html(d.wind.speed + " m/hr");
    $("#wind_dir").html(d.wind.deg + " °");

    const sr = new Date(d.sys.sunrise * 1000);
    const ss = new Date(d.sys.sunset * 1000);
    $("#sunrise").html(padZero(sr.getHours()) + ":" + padZero(sr.getMinutes()));
    $("#sunset").html(padZero(ss.getHours()) + ":" + padZero(ss.getMinutes()));

    const tz = d.timezone / 3600 + new Date().getTimezoneOffset() / 60;
    $("#timezone").html(tz + " hr");

    $("#lat").html(d.coord.lat + " °");
    $("#lon").html(d.coord.lon + " °");
}

//get calculation time
function calcTime(time) {
    const date = new Date(time * 1000);

    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    return `${year}-${padZero(month)}-${padZero(day)} ${padZero(hours)}:${padZero(minutes)}`;
}

function padZero(num) {
    return num.toString().padStart(2, "0");
}

//Underline effect
$(".form-field")
    .focus(function () {
        $("span").css("text-decoration-color", "#6eb5ae");
    })
    .blur(function () {
        $("span").css("text-decoration-color", "#ffffff00");
    });

// Capitalize the first letter of each word
function capitalizeWords(str) {
    const words = str.split(" ");

    const capitalizedWords = words.map((word) => {
        const firstLetter = word.charAt(0).toUpperCase();
        const restOfWord = word.slice(1);
        return firstLetter + restOfWord;
    });

    const capitalizedStr = capitalizedWords.join(" ");
    return capitalizedStr;
}
