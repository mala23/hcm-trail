import WeatherDataProvider from './WeatherDataProvider';
import WeatherWidgetComponent from './WeatherWidgetComponent';

function getSettings() {
	const defaults = {
		'location': null,
		'provider': '',
		'provider-key': '',
		'provider-client-id': '',
		'provider-app-id': '',
		'delay': 0,
		'title': 'Loading weather data...',
		'units': 'c',
	};

	Object.keys( defaults ).forEach( ( key ) => {
		const element = document.querySelector( `meta[property='weather-widget:${key}'],meta[name='weather-widget:${key}']` );
		if ( element == null ) {
			return;
		}

		defaults[ key ] = element.getAttribute( 'content' );
	} );

	return defaults;
}

function delay( duration ) {
	return new Promise( ( resolve ) => {
		setTimeout( () => resolve(), duration );
	} );
}

export function init() {
	const settings = getSettings();
	// const provider = WeatherDataProvider.resolve( settings.provider, settings.units, settings[ 'provider-key' ] );
	const provider = WeatherDataProvider.resolve( settings );
	const element = document.querySelector( '.render-component-weather' );

	if ( provider == null || settings[ 'location' ] == null ) {
		return;
	}

	const component = new WeatherWidgetComponent( element, provider );

	delay( settings.duration )
		.then( () => provider.load( settings.location ) )
		.then( ( response ) => component.update( response ) );
}
