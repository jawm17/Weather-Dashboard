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
                $("#index").text(uv);

                // color UV index appropriately
                if(uv<3){
                    $("#index").attr("style","background-color:#00CACD");
                }
                else if(uv<5){
                    $("#index").attr("style","background-color:#008F00");
                }
                else if(uv<7){
                    $("#index").attr("style","background-color:#CD5600");
                }
                else if(uv<10){
                    $("#index").attr("style","background-color:#D01E00");
                }
                else{
                    $("#index").attr("style","background-color:#E361B4");
                }
            });

            // forecastURL used for the 5 day forecast data
            var forecastURL = 'https://api.openweathermap.org/data/2.5/forecast?q=' + search + '&appid=931672d40ebb1249a8a9be40dcd47e09';
            $.ajax({
                url: forecastURL,
                method: "GET"
            }).then(function (response) {
                console.log(response);

                var date1 = response.list[2].dt_txt.slice(5, 7) + "/" + response.list[2].dt_txt.slice(8, 10) + "/" + response.list[2].dt_txt.slice(0, 4);
                var date2 = response.list[9].dt_txt.slice(5, 7) + "/" + response.list[9].dt_txt.slice(8, 10) + "/" + response.list[9].dt_txt.slice(0, 4);
                var date3 = response.list[17].dt_txt.slice(5, 7) + "/" + response.list[17].dt_txt.slice(8, 10) + "/" + response.list[17].dt_txt.slice(0, 4);
                var date4 = response.list[25].dt_txt.slice(5, 7) + "/" + response.list[25].dt_txt.slice(8, 10) + "/" + response.list[25].dt_txt.slice(0, 4);
                var date5 = response.list[33].dt_txt.slice(5, 7) + "/" + response.list[33].dt_txt.slice(8, 10) + "/" + response.list[33].dt_txt.slice(0, 4);
                var dates = [date1,date2,date3,date4,date5];
                console.log(dates[0]);

                var totalTemp1 = average(0,7,"temperature",response) + "F";
                var totalTemp2 = average(7,15,"temperature",response) + "F";
                var totalTemp3 = average(15,23,"temperature",response) + "F";
                var totalTemp4 = average(23,31,"temperature",response) + "F";
                var totalTemp5 = average(31,39,"temperature",response) + "F";
                var temps = [totalTemp1,totalTemp2,totalTemp3,totalTemp4,totalTemp5];

                var humidity1 = average(0,7,"humidity",response);
                var humidity2 = average(7,15,"humidity",response);
                var humidity3 = average(15,23,"humidity",response);
                var humidity4 = average(23,31,"humidity",response);
                var humidity5 = average(31,39,"humidity",response);
                var humidities = [humidity1,humidity2,humidity3,humidity4,humidity5];

                for(var i = 0; i<5;i++){
                    var dispDate = $("<p2>");
                    dispDate.text(dates[i]);
                    $("."+i).append(dispDate);

                    var dispTemp = $("<p2>");
                    dispTemp.text("Temp: " + temps[i]);
                    $("."+i).append(dispTemp);

                    var dispHumidity = $("<p2>");
                    dispHumidity.text("Humidity: " + humidities[i]);
                    $("."+i).append(dispHumidity);
                }
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