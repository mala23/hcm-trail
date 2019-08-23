export default class OpenWeatherMap {
    constructor(settings) {
        this.key = settings['provider-key'];
        this.units = settings.units === 'c' ? 'metric' : 'imperial';
    }

    get attribution() {
        return {
            text: 'Powered by OpenWeatherMap',
            link: 'http://openweathermap.org/',
        };
    }

    load(location) {
        return new Promise((resolve, reject) => {
            const url = `${window.location.protocol}//api.openweathermap.org/data/2.5/forecast/daily?q=${location}&mode=json&units=${this.units}&cnt=5&appid=${this.key}`;
            fetch(url).then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    reject(`Unknown error occurred (HTTP ${response.status})`);
                }
            }).then((response) => {
                const weather = {
                    success: true,
                    title: response.city.name,
                    city: response.city.name,
                    current: {
                        temp: Math.round(response.list[0].temp.day),
                        code: `wi-owm-${response.list[0].weather[0].id}`,
                    },
                    forecast: response.list.slice(1, 4).map((f) => {
                        return {
                            code: `wi-owm-${f.weather[0].id}`,
                            date: f.dt * 1000,
                            high: Math.round(f.temp.max),
                            low: Math.round(f.temp.min),
                        };
                    }),
                };

                return resolve(weather);
            });
        });
    }
}
