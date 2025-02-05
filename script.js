let WEATHER_API_URL
// Calls current weather data for Stockholm, Sweden using the api key: 96fe044f50a395c3e9ed78deeb27089f
let FORECAST_API_URL 
//Calls 5 day weather forecast data for Stockholm, Sweden using the api key: 96fe044f50a395c3e9ed78deeb27089f

const body = document.body
const inputCity = document.getElementById('choose-city')
const weatherContainer = document.getElementById('weather-container')
const messageContainer = document.getElementById('message-container')
const forecastContainer = document.getElementById('forecast-container')
const forecastTable = document.getElementById('forecast-table')

let city = 'stockholm'

//weather-data today
const fetchWeather = (city) => {
    WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&APPID=96fe044f50a395c3e9ed78deeb27089f`;
    body.classList.remove(...body.classList)
    
    fetch(WEATHER_API_URL)
    .then(res => res.json()) 
    .then(weatherData => {

        if (weatherData.message){
            weatherContainer.innerHTML = ':('
            messageContainer.innerHTML = 'Ups, no city with that name!'
        }
        
        else {
            // Create a new JavaScript Date object based on the timestamp for sunset and sunrise
            // multiplied by 1000 so that the argument is in milliseconds, not seconds.
            const timeSunrise = new Date((weatherData.sys.sunrise + weatherData.timezone + new Date().getTimezoneOffset() * 60 ) * 1000)
            const timeSunset = new Date((weatherData.sys.sunset + weatherData.timezone + new Date().getTimezoneOffset() * 60 ) * 1000)
            const weather = weatherData.weather[0].main

            // adds html to the section weather-container.
            // to get the time to display as 00:00 and not 0:0 we add a zero to the beginning of the time
            // and then we substract -2 (so we only display the two last characters)
            // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/substr
            // https://stackoverflow.com/questions/847185/convert-a-unix-timestamp-to-time-in-javascript
            weatherContainer.innerHTML = /*html*/ `
                <p>${weather} | ${Math.round(weatherData.main.temp)}°</p>
                <p>Sunrise ${('0' + timeSunrise.getHours()).substr(-2)}:${('0' + timeSunrise.getMinutes()).substr(-2)}</p>
                <p>Sunset ${('0' + timeSunset.getHours()).substr(-2)}:${('0' + timeSunset.getMinutes()).substr(-2)}</p>
            `
            // depending on weather different html and icons are added
            if(weather === 'Clouds'){
                body.classList.add('cloudy')
                messageContainer.innerHTML = /*html*/`
                    <img src="./Designs/Design-2/icons/noun_Cloud_1188486.svg" />
                    <h1>${weatherData.name} is looking grey today. Do something fun to lighten your day!</h1>
                `
            }
            else if (weather === 'Clear'){
                body.classList.add('sunny')
                messageContainer.innerHTML = /*html*/`
                    <img src="./Designs/Design-2/icons/noun_Sunglasses_2055147.svg" />
                    <h1>Get your sunnies on. ${weatherData.name} is looking rather great today!</h1>
                `
            }
            else if (weather === 'Snow'){
                body.classList.add('rainy')
                messageContainer.innerHTML = /*html*/`
                    <i class="far fa-snowflake fa-5x"></i>
                    <h1>${weatherData.name} is chilly today... Ho ho ho, here comes the ${weather.toLowerCase()}!</h1>
                `
            }
            else if (weather === 'Rain'){
                body.classList.add('rainy')
                messageContainer.innerHTML = /*html*/`
                    <img src="./Designs/Design-2/icons/noun_Umbrella_2030530.svg" />
                    <h1>Don't forget your umbrella. It's wet in ${weatherData.name} today.</h1>
                `
            }
            else if (weather === 'Drizzle'){
                body.classList.add('rainy')
                messageContainer.innerHTML = /*html*/`
                    <i class="fas fa-cloud-rain fa-5x"></i>
                    <h1>It's a ${weather.toLowerCase()} in ${weatherData.name} today, tricky weather for gremlins!</h1>
                `
            }
            else if (weather === 'Thunderstorm'){
                body.classList.add('rainy')
                messageContainer.innerHTML = /*html*/`
                    <i class="fas fa-poo-storm fa-5x"></i>
                    <h1>Oh no, there is a ${weather.toLowerCase()} in ${weatherData.name}! Don't stand next to a tall tree</h1>
                `
            }
            else {
                //adding else for weathers that we haven't made specific else if for, example mist
                body.classList.add('rainy')
                messageContainer.innerHTML = /*html*/`
                    <img src="./Designs/Design-2/icons/noun_Cloud_1188486.svg" />
                    <h1>Oh no, it is ${weather.toLowerCase()} in ${weatherData.name} today!</h1>
                `
            }
        }
    })
    .catch((error) => console.error('ERRORRR', error))
}

//Forecast data  
const fetchForecast = (city) => {  
    FORECAST_API_URL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&APPID=96fe044f50a395c3e9ed78deeb27089f`;   
    fetch(FORECAST_API_URL)
    .then(res => res.json())
    .then(forecastdata => {
        if (forecastdata.message){
            weatherContainer.innerHTML = ':('
        }

        forecastTable.innerHTML = `
        `
        const filteredForecast = forecastdata.list.filter(day => day.dt_txt.includes('12:00'))
        // filteredForecast is now an array with only the data from 12:00 each day.
        filteredForecast.forEach(day => {
            const date = new Date(day.dt * 1000)
            let dayName = date.toLocaleDateString("en-US", {weekday: "short"})
            forecastTable.innerHTML += `
                <tr>
                    <td class="weekday">${dayName}</td>
                    <td class="temperature">${Math.round(day.main.temp)} ºC</td>
                </tr>
            `
        })
    })
    .catch((error) => console.error('ERRORRR', error))
}

fetchWeather(city)
fetchForecast(city)

inputCity.addEventListener('keyup', () => {
    city = inputCity.value
    fetchWeather(city)
    fetchForecast(city)
})