var historyList = ["Austin"];
$(".searchBtn").click(function () {
    event.preventDefault();
    var search = $("#searchTerm").val();
    $("#searchTerm").val("");
    getInfo(search);
});
$(".hItem").click(function(){
    getInfo(this.textContent);
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
    for (var i = 0; i < historyList.length; i++) {
        var newHistory = document.createElement("div");
        newHistory.innerHTML = '<li class="list-group-item hItem">' + place + '</li>';
        newHistory.addEventListener("click", function () {
            getInfo(this.textContent);
        })
        $(".history").append(newHistory);
    }
}

getInfo("austin");