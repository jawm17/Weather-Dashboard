// global variables
var historyList = [];

// search button clicked
$(".searchBtn").click(function () {
    event.preventDefault();
    // pass the search term to getInfo function
    getInfo($("#searchTerm").val());
    $("#searchTerm").val("");
});

function getInfo(search){
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + search + "&appid=" + "931672d40ebb1249a8a9be40dcd47e09";

    $.ajax({
        url: queryURL,
        success: function (response) {
            console.log(response);
            var place = response.name;
            var temp = ((response.main.temp - 273.15) * 1.80 + 32).toFixed(2);
            var humidity = response.main.humidity;
            var windSpeed = response.wind.speed;

            updateHistory(place);
            $(".place").text(place);
            $(".temperature").text("Temperature: " + temp + " F");
            $(".humidity").text("Humidity: " + humidity + "%");
            $(".wind").text("Wind Speed: " + windSpeed + " MPH");

        },
        error: function (xhr, status, error) {
        }
    });
}

function updateHistory(place) {
    // if place is already in history
    console.log(historyList.indexOf(place));
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