/* global google */
import { loadScript } from '../../utils/html';

function getGoogleApiKey( maps ) {
	const mapWithKey = maps.find( ( x ) => x.getAttribute( 'data-api-key' ) != null );
	if ( typeof mapWithKey === 'undefined' ) {
		return null;
	}

	return mapWithKey.getAttribute( 'data-api-key' );
}

function getProperties( map ) {
	return {
		title: map.getAttribute( 'data-title' ) || '',
		lat: parseFloat( map.getAttribute( 'data-lat' ) ),
		lng: parseFloat( map.getAttribute( 'data-lng' ) ),
		zoom: ( ( zoom ) => zoom ? parseInt( zoom ) : 10 )( map.getAttribute( 'data-zoom' ) ),
		location: map.getAttribute( 'data-location' ) || null,
		website: map.getAttribute( 'data-website' ) || null,
		phone: map.getAttribute( 'data-phone' ) || null,
		hours: map.getAttribute( 'data-hours' ) || null,
		desc: map.getAttribute( 'data-desc' ) || null,
		showMarker: map.getAttribute( 'data-show-marker' ) || false,
	};
}

function render( map ) {
	const props = getProperties( map );

	const infoTemplate = `
    <div class="info">
        <h2 class="widget-title">${props.title}</h2>
        ${props.desc != null ? `<p>${props.desc}</p>` : ''}
        <ul>
            ${props.location != null ? `<li><i class="fa fa-map-marker"></i>${props.location}</li>` : ''}
            ${props.website != null ? `<li><i class="fa fa-globe"></i><a href="${props.website}" target="_blank">${props.website}</a></li>` : ''}
            ${props.phone != null ? `<li><i class="fa fa-phone"></i>${props.phone}</li>` : ''}
            ${props.hours != null ? `<li><i class="fa fa-clock-o"></i>${props.hours}</li>` : ''}
        </ul>
    </div>
    `;

	const infoAvailable = true;

	const template = `
    <div class="location">
        <div class="row">
            ${infoAvailable ? infoTemplate : ''}
            <div class="map-container">
                <div class="map"></div>       
            </div>
        </div>
    </div>
    `;

	map.insertAdjacentHTML( 'beforeend', template );

	new google.maps.Map( map.querySelector( '.map' ), {
		center: { lat: props.lat, lng: props.lng },
		zoom: props.zoom,
	} );
}

export function init() {
	const maps = Array.from(
		window.document.querySelectorAll( '.render-component-map,.render-component-location' ) );

	const key = getGoogleApiKey( maps );
	const url = `//maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=${key}`;

	if ( maps.length === 0 || key == null ) {
		return;
	}

	loadScript( url ).then( () => {
		maps.forEach( render );
	} );
}
