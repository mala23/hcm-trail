import YahooWeather from './YahooWeather';
import OpenWeatherMap from './OpenWeatherMap';

export default class WeatherDataProvider {
	static resolve( settings ) {
		switch ( settings.provider ) {
			case 'yahoo':
				return new YahooWeather( settings );
			case 'openweathermap':
				return new OpenWeatherMap( settings );
			default:
				return null;
		}
	}
}
