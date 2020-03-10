class Main {
    constructor() {
        this.load();
        this.eventHandlers();
    }

    async load() {
        this.localWeather = new Weather();
        await this.localWeather.getLocalWeather();
        this.searchedWeatherList = [];
        this.getFromLocalStorage();
        this.displayLocalWeather();
    }

    displayLocalWeather() {
        document.querySelector(".local-weather__header").innerHTML = `
            <h2 class="local-weather__heading">${this.localWeather.localWeather.list[0].name}</h2>
            <img src=\"http://openweathermap.org/img/wn/${this.localWeather.localWeather.list[0].weather[0].icon}@2x.png\" alt=\"\"> 
            <p>${this.localWeather.localWeather.list[0].weather[0].description}</p>
        `;
        document.querySelector(".local-weather__temp").innerHTML =
            this.localWeather.localWeather.list[0].main.temp.toFixed(0) + "&#8451;";
        document.querySelector(".local-weather__temp--estimated").innerHTML =
            this.localWeather.localWeather.list[0].main.temp_min.toFixed(0)+ "&#8451; - " +
            this.localWeather.localWeather.list[0].main.temp_max.toFixed(0)+ "&#8451;";

    }
    displaySearchedWeather() {
        let weatherSection = document.querySelector(".weather");
        weatherSection.innerHTML = "";
        for (let i = 0; i < this.searchedWeatherList.length; i++) {
            if (this.searchedWeatherList[i] == null) continue;
            let weatherBlock = `
                <div class="searched-weather">
                    <div class="weather__header">
                        <h2 class="weather__heading">${this.searchedWeatherList[i].name}</h2>
                        <img src=\"http://openweathermap.org/img/wn/${this.searchedWeatherList[i].weather[0].icon}@2x.png\" alt=\"\"> 
                        <p>${this.searchedWeatherList[i].weather[0].description}</p>
                    </div>
                    <p class="weather__temp">${this.searchedWeatherList[i].main.temp.toFixed(0)}&#8451;</p>
                    <p class="local-weather__temp--estimated">
                        ${this.searchedWeatherList[i].main.temp_min.toFixed(0)}&#8451; 
                        - ${this.searchedWeatherList[i].main.temp_max.toFixed(0)}&#8451;
                    </p>
                    <button class="weather__delete" onclick="a.removeWeather(${this.searchedWeatherList[i].id});">DEL</button>
                </div>
            `;
            weatherSection.insertAdjacentHTML('beforeend', weatherBlock);
        }
    }

    removeWeather(id) {
        for (let i = 0; i < this.searchedWeatherList.length; i++) {
            if (this.searchedWeatherList[i] == null) continue;
            else if (this.searchedWeatherList[i].id == id) {
                this.searchedWeatherList.splice(i, 1);
            }
        }
        this.saveToLocalStorage();
        this.displaySearchedWeather();
    }

    getFromLocalStorage() {
        if (JSON.parse(localStorage.getItem("searchedWeather"))) {
            this.searchedWeatherList = JSON.parse(localStorage.getItem("searchedWeather"));
            console.log(this.searchedWeatherList);
            this.displaySearchedWeather();
        }
    }

    saveToLocalStorage(item) {
        let exist = false;
        console.log(item);
        if (item) {
            this.searchedWeatherList.filter(weather => {
                if (weather == null) return false;
                if (weather.name === item.name) {
                    console.log('duplicate');
                    exist = weather.name === item.name;
                    console.log(weather.name === item.name)
                }
            });
        }
        if (!exist) {
            this.searchedWeatherList.push(item);
            localStorage.setItem("searchedWeather", JSON.stringify(this.searchedWeatherList))
        }
    }


    eventHandlers() {
        document.querySelector(".search").addEventListener('submit', async (e) => {
            e.preventDefault();
            let weather = new Weather();
            let query = document.querySelector(".search__input").value;
            let result = await weather.fetchSearchedData(query.trim());
            if (result.cod == 200) {
                this.saveToLocalStorage(result);
                this.displaySearchedWeather();
                document.querySelector(".search__input").value = "";
            }
        });

        // let weather = document.querySelector('.button__delete');
        // for (var i = 0; i < weather.length; i++) {
        //     weather[i].addEventListener('click', function(event) {
        //         this.removeWeather()
        //     });
        // }
    }

}

let a = new Main();
