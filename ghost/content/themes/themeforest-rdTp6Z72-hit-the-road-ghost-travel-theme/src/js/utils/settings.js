export function getSetting( name ) {
	const setting = document.querySelector( `meta[name="${name}"],meta[property="${name}"]` );
	if ( setting === null ) {
		return null;
	}
	return setting.getAttribute( 'content' );
}
