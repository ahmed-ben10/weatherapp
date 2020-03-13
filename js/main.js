class Main {
    constructor() {
        this.drop = null;
        this.dragover = null;
        this.dragstart = null;
        this.load();
        this.resume = true;
    }

    async load() {
        this.localWeather = new Weather();
        await this.localWeather.getLocalWeather();
        this.searchedWeatherList = [];
        this.getFromLocalStorage();
        this.displayLocalWeather();
        this.eventHandlers();
    }

    async eventHandlers() {
        document.querySelector('.button-up').addEventListener('click', () => {
            window.scrollTo({top: -10000, behavior: 'smooth'});
        });
        document.querySelector(".search").addEventListener('submit', async (e) => {
            e.preventDefault();
            const weather = new Weather();
            const query = document.querySelector(".search__input").value;
            const result = await weather.fetchSearchedData(query.trim());
            switch (result.cod) {
                case 200:
                    this.saveToLocalStorage(result);
                    this.displaySearchedWeather();
                    window.scrollTo({top: document.body.scrollHeight + 100000, behavior: 'smooth'});
                    document.querySelector(".search__input").value = "";
                    document.querySelector(".search__error").innerHTML = "";
                    break;
                case "400":
                    document.querySelector(".search__error").innerHTML = "Vult u alstublieft iets in";
                    break;
                case "404":
                    document.querySelector(".search__error").innerHTML = "Helaas, de stad die u probeerde te zoeken is niet gevonden.";
                    break;
                default:
                    document.querySelector(".search__error").innerHTML = "Sorry, Er is wat fout gegaan contacteer de beheerder.";
                    break;
            }
        });

        const buttons = await document.querySelectorAll('.weather__delete');
        for (const button of buttons){
            button.addEventListener('click', (e) =>{
                this.removeWeather(button.dataset.id);
            });
        }
    }

    async dragable(){
        const weatherDivs = await document.querySelectorAll('.searched-weather');
        for (const weatherDiv of weatherDivs) {
            weatherDiv.removeEventListener('drop', this.drop);
            weatherDiv.removeEventListener('dragover', this.dragover);
            weatherDiv.removeEventListener('dragstart', this.dragstart);
        }

        for (const weatherDiv of weatherDivs){
            weatherDiv.addEventListener('drop', this.drop = (ev)=>{
                event.preventDefault ();
                let src = null;
                for (const weatherDiv of weatherDivs) {
                    if(ev.dataTransfer.getData("src") === weatherDiv.dataset.id){
                        src  = weatherDiv
                    }
                }
                var tgt = ev.currentTarget.firstElementChild;
                var block = document.querySelector('.weather');
                var nodes = Array.prototype.slice.call(tgt.parentNode.parentNode.children);
                block.insertBefore(src,block.children[nodes.indexOf(tgt.parentNode)]);
                block.insertBefore(block.children[nodes.indexOf(tgt.parentNode)],src);
                console.log(src.dataset.id);
                console.log(src,'src');
                console.log(block,'block');
                console.log(tgt.parentNode,'tgt');
                console.log('-------------------');
                this.swapPositions(src,tgt)

            });
            weatherDiv.addEventListener('dragover', this.dragover = (ev)=>{
                ev.preventDefault ();
            });
            weatherDiv.addEventListener('dragstart', this.dragstart = (ev) =>{
                ev.dataTransfer.setData ("src", ev.target.dataset.id);
            });
        }
    }

    swapPositions(src, tgt){
        for (let i = tgt.dataset.id; i < this.searchedWeatherList.length; i++) {
            if(i = src.dataset.id){
                this.searchedWeatherList[tgt.dataset.id]
            }
        }
        localStorage.setItem("searchedWeather", JSON.stringify(this.searchedWeatherList))
    }

    displayLocalWeather() {
        let localWeather = this.localWeather.localWeather.list[0];
        document.querySelector(".local-weather__header").innerHTML = `
            <h2 class="local-weather__heading">
                ${localWeather.name} , ${localWeather.sys.country}
            </h2>
            <img src=\"http://openweathermap.org/img/wn/
                ${
                    localWeather.weather[0].icon
                }@2x.png\" alt=\"\"
            > 
            <p>
                ${localWeather.weather[0].description}
            </p>
        `;
        document.querySelector(".local-weather__temp").innerHTML =
            'Temp: ' + localWeather.main.temp.toFixed(0) + "&#8451;";
        document.querySelector(".local-weather__temp--min").innerHTML =
            'Min: ' + localWeather.main.temp_min.toFixed(0) + "&#8451;";
        document.querySelector(".local-weather__temp--max").innerHTML =
            'Max: ' + localWeather.main.temp_max.toFixed(0) + "&#8451;";
        document.querySelector(".local-weather__details").innerHTML =
            "<p>" +
            " Windkracht: " + (localWeather.wind.speed * 1.609344).toFixed(0) + " km/h" +
            "</p>" +
            "<p> " +
                "Gevoelstempratuur: " + localWeather.main.feels_like.toFixed(0) + "&#8451; " +
            "</p>";
    }

    displaySearchedWeather() {
        let weatherSection = document.querySelector(".weather");
        weatherSection.innerHTML = "";
        for (let i = 0; i < this.searchedWeatherList.length; i++) {
            if (this.searchedWeatherList[i] == null) continue;
            let weatherBlock = `
                <div class="searched-weather" draggable="true" data-id="${this.searchedWeatherList[i].id}">
                    <div class="weather__header">
                        <h2 class="weather__heading">${this.searchedWeatherList[i].name}, ${this.searchedWeatherList[i].sys.country}</h2>
                        <img src=\"http://openweathermap.org/img/wn/${this.searchedWeatherList[i].weather[0].icon}@2x.png\" alt=\"\"> 
                        <p>
                            ${this.searchedWeatherList[i].weather[0].description}
                        </p>
                    </div>
                    <p class="weather__temp"> Temp:
                        ${this.searchedWeatherList[i].main.temp.toFixed(0)}&#8451;
                    </p>
                    <div class="weather__temp--estimated">
                            <p class="weather__temp--min">
                                Min: ${this.searchedWeatherList[i].main.temp_min.toFixed(0)}&#8451;
                            </p>
                            <p class="weather__temp--max">
                                Max: ${this.searchedWeatherList[i].main.temp_max.toFixed(0)}&#8451;
                            </p>
                        </div>
                    <button class="weather__delete" data-id="${this.searchedWeatherList[i].id}"><i class="fa fa-remove"></i></button>
                    <div class="local-weather__details">
                        <p> Windkracht: 
                            ${(this.searchedWeatherList[i].wind.speed * 1.609344).toFixed(0)}
                            km/h
                        </p>
                        <p> Gevoelstempratuur: 
                            ${this.searchedWeatherList[i].main.feels_like.toFixed(0)}
                        </p>                    
                    </div>
                </div>
            `;
            weatherSection.insertAdjacentHTML('beforeend', weatherBlock);
        }
        this.dragable();
        this.eventHandlers();
    }

    getFromLocalStorage() {
        if (JSON.parse(localStorage.getItem("searchedWeather"))) {
            this.searchedWeatherList = JSON.parse(localStorage.getItem("searchedWeather"));
            this.displaySearchedWeather();
        }
    }

    saveToLocalStorage(item) {
        let exist = false;
        if (item) {
            this.searchedWeatherList.filter(weather => {
                if (weather == null) return false;
                if (weather.name === item.name) {
                    exist = weather.name === item.name;
                }
            });
        }
        if (!exist) {
            this.searchedWeatherList.push(item);
            localStorage.setItem("searchedWeather", JSON.stringify(this.searchedWeatherList))
        }
    }

    removeWeather(id) {
        for (let i = 0; i < this.searchedWeatherList.length; i++) {
            if (this.searchedWeatherList[i] == null) continue;
            if (this.searchedWeatherList[i].id == id) {
                this.searchedWeatherList.splice(i, 1);
            }
        }
        this.saveToLocalStorage();
        this.displaySearchedWeather();
    }
}

 new Main();
