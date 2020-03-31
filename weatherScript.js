// global variables
var historyList = [];

// search button clicked
$(".searchBtn").click(function () {
    event.preventDefault();
    // pass the search term to getInfo function
    getInfo($("#searchTerm").val());
    $("#searchTerm").val("");
});

// get data from API and display it
function getInfo(search) {
    // queryURL gets weather info from "search" for the day
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + search + "&appid=" + "931672d40ebb1249a8a9be40dcd47e09";
    $.ajax({
        url: queryURL,
        success: function (response) {
            console.log(response);
            var place = response.name;
            var temp = ((response.main.temp - 273.15) * 1.80 + 32).toFixed(2);
            var humidity = response.main.humidity;
            var windSpeed = response.wind.speed;

            // pass place to the updateHistory function and assign data to labels
            updateHistory(place);
            $(".place").text(place);
            $(".temperature").text("Temperature: " + temp + " F");
            $(".humidity").text("Humidity: " + humidity + "%");
            $(".wind").text("Wind Speed: " + windSpeed + " MPH");

            var lat = response.coord.lat;
            var lon = response.coord.lon;
            // coordinateURL and API call to get UV index
            var coordinateURL = 'https://api.openweathermap.org/data/2.5/uvi?appid=931672d40ebb1249a8a9be40dcd47e09&lat=' + lat + '&lon=' + lon + '';
            $.ajax({
                url: coordinateURL,
                method: "GET"
            }).then(function (response) {
                // display UV index data
                var uv = response.value;
                $(".index").text("UV Index: " + uv);
            });

            // forecastURL used for the 5 day forecast data
            var forecastURL = 'https://api.openweathermap.org/data/2.5/forecast?q=' + search + '&appid=931672d40ebb1249a8a9be40dcd47e09';
            $.ajax({
                url: forecastURL,
                method: "GET"
            }).then(function (response) {
                var forecastDate = "";
                console.log(response);
                for (var i = 0; i < 39; i += 8) {
                    forecastDate = response.list[i].dt_txt.slice(5, 7) + "/" + response.list[i].dt_txt.slice(8, 10) + "/" + response.list[i].dt_txt.slice(0, 4);
                }
                
                var totalTemp1 = average(0,7,"temperature",response);
                var totalTemp2 = average(7,15,"temperature",response);
                var totalTemp3 = average(15,23,"temperature",response);
                var totalTemp4 = average(23,31,"temperature",response);
                var totalTemp5 = average(31,39,"temperature",response);

                var humidity1 = average(0,7,"humidity",response);
                var humidity2 = average(7,15,"humidity",response);
                var humidity3 = average(15,23,"humidity",response);
                var humidity4 = average(23,31,"humidity",response);
                var humidity5 = average(31,39,"humidity",response);
                console.log(humidity1);
            });
        },
        error: function (xhr, status, error) {
        }
    });
}

function average(start,end,type,response){
    var total = 0;
    if(type==="temperature"){
        for (var i=start; i<end; i++){
            total += response.list[i].main.temp;
        }
        return (((total/(end-start)) - 273.15) * 1.80 + 32).toFixed(2);
    }
    else if (type==="humidity"){
        for (var i=start; i<end; i++){
            total += response.list[i].main.humidity;
        }
        return (total/(end-start)).toFixed(2);
    }
}

function updateHistory(place) {
    // if place is already in history
    if (historyList.indexOf(place) !== "-1") {
        // remove element from history
        var id = "#" + place;
        id = id.replace(/ /g,'')
        $(id).remove();
    }
    // if place is not in history
    else {
        // add place to historyList
        historyList.push(place);
    }

    // create new history element
    var newHistory = document.createElement("div");
    newHistory.innerHTML = '<li class="list-group-item hItem" id='+ place.replace(/ /g,'') + '>' + place + '</li>';
    newHistory.addEventListener("click", function () {
        getInfo(this.textContent);
    });
    // append history element to history list
    $(".history").prepend(newHistory);
}

getInfo("austin");