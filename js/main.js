class Main {
     constructor() {
         this.weather = new Weather();
         this.don();
     }

    async don() {
        this.weather = new Weather();
        await this.weather.getLocalWeather();
        this.weather.displayLocalWeather();
        await this.weather.fetchSearchedData("Den Haag");
        console.log(this.weather.weatherInfo)
    }

    async send() {
        this.weather = new Weather();
        await this.weather.fetchSearchedData("Den Haag");
        console.log(this.weather.weatherInfo)
    }

    eventHandlers(){
        document.querySelector()
    }

}

new Main();
