class Weather {

    constructor() {
        this.searchedWeather = null;
        this.localWeather = null;
    }

    async getLocalWeather() {
        const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
        });
        const baseUrl = "http://api.openweathermap.org/data/2.5/find";
        const url = `${baseUrl}?lat=${position.coords.latitude}&lon=${
            position.coords.longitude
        }&units=metric&cnt=1&lang=nl&APPID=108066b3aff84a56374aeb9d77b4b56f`;
        this.localWeather = await fetch(url).then(async (resp) => {
            return await resp.json();
        });
    }

    async fetchSearchedData(city) {
        const baseUrl = "http://api.openweathermap.org/data/2.5/weather";
        const url = `${baseUrl}?q=${city}&units=metric&cnt=1&lang=nl&APPID=108066b3aff84a56374aeb9d77b4b56f`;
        return await fetch(url).then(async (resp) => {
            return await resp.json();
        });
    }
}

