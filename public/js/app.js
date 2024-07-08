const weatherAPI = "/weather"

const weatherForm = document.querySelector("form")
const search = document.querySelector("input")
const weatherIcon = document.querySelector(".weather-icon i")
const cloudcondition = document.querySelector(".cloud-condition")

const locationelement = document.querySelector(".place")
const dateElement = document.querySelector(".date span")
const tempretureElement = document.querySelector(".temprature")


const currentDate = new Date();

const options = { month: "long" }
const monthName = currentDate.toLocaleString("en-US", options)
dateElement.textContent = currentDate.getDate() + ". " + monthName


weatherForm.addEventListener("submit", (e) => {
    e.preventDefault();

    locationelement.textContent = "Loading...";
    showdata(search.value)
    weatherIcon.className = ""
    console.log(search.value)
})




if ("geolocation" in navigator) {
    locationelement.textContent = "Loading...";
    navigator.geolocation.getCurrentPosition(
        function (position) {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            const apiUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;

            fetch(apiUrl)
                .then((response) => response.json())
                .then((data) => {
                    if (data && data.address && data.address.city) {
                        const city = data.address.city;

                        showdata(city);
                    } else {
                        console.error("City not found in location data.");
                        locationelement.textContent = "City Not Found !"
                    }
                })
                .catch((error) => {
                    console.error("Error fetching location data:", error);
                });
        },
        function (error) {
            console.error("Error getting location:", error.message);
        }
    );
} else {
    console.error("Geolocation is not available in this browser.");
}




const showdata = (city) => {
    getWeatherData(city, (result) => {
        console.log("🚀 ~ getWeatherData ~ result:", result)

        if (result?.cod == 200) {
            if (
                result.weather[0].description == "rain" ||
                result.weather[0].description == "fog"
            ) {
                weatherIcon.className = "wi wi-day-" + result.description;
            } else {
                weatherIcon.className = "wi wi-day-cloudy";
            }

            locationelement.textContent = result?.name;
            tempretureElement.textContent = (result?.main?.temp - 273.5).toFixed(2) + String.fromCharCode(176);
            cloudcondition.textContent = result?.weather[0]?.description.toUpperCase();
        } else {
            locationelement.textContent = "City Not Found !";
        }
    })

}

const getWeatherData = (city, callback) => {
    const locationAPI = weatherAPI + "?address=" + city
    fetch(locationAPI).then((response) => {
        response.json().then((response) => {
            callback(response)
        })
    })
}