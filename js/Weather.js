class Weather {

    constructor(){
        this.city = null;
        this.searchedWeather = null;
    }

     async getLocalWeather(){
        let localWeather = null;
        await navigator.geolocation.getCurrentPosition(  async function ( position) {
            await fetch("http://api.openweathermap.org/data/2.5/find?lat="+position.coords.latitude+"&lon="+position.coords.longitude+"&cnt=1&APPID=108066b3aff84a56374aeb9d77b4b56f").then((response) => {
                    return response.json();
                }).then((data) => {
                    localWeather = data;
                })
            },
            function (error) {
                alert("The Locator was denied")
            });
        this.localWeather = localWeather;
        console.log(this.localWeather);
        return localWeather;
    }

    displayLocalWeather(){
        console.log(this.localWeather);
        document.querySelector(".local-weather__heading").innerHTML = this.localWeather.list[0].name;

    }

     async fetchSearchedData(city) {
         this.city = city;
       await fetch("http://api.openweathermap.org/data/2.5/weather?q="+this.city+"&APPID=108066b3aff84a56374aeb9d77b4b56f").then(async(response) => {
            return await response.json();
        }).then((data) => {
            this.searchedWeather = data;
        })
    }
}

