const urlTemplate = ( () => {
	const urlTemplateProperty = document.querySelector( 'meta[property="image-preload:url"],meta[name="image-preload:url"]' );
	return urlTemplateProperty != null
		? urlTemplateProperty.getAttribute( 'content' )
		: '{image}';
} )();

function getUrl( post ) {
	const resize = post.getAttribute( 'data-resize' ) || false;
	let url = post.getAttribute( 'data-image' );

	if ( url.startsWith( 'https' ) === false && url.startsWith( 'http' ) === false ) {
		url = window.location.protocol + '//' + window.location.host + url;
	}

	if ( resize === false || window.location.hostname === 'localhost'
		|| post.offsetWidth === 0 || post.offsetWidth === 0 ) {
		return url;
	}

	return urlTemplate
		.replace( '{image}', url )
		.replace( '{width}', post.offsetWidth.toString() )
		.replace( '{height}', post.offsetHeight.toString() );
}

export function init() {
	const posts = Array.from( document.querySelectorAll( '.preload-background' ) );

	posts.forEach( ( post ) => {
		const image = new Image();
		image.src = getUrl( post );

		image.addEventListener( 'load', () => {
			post.querySelector( '.spinner' ).style.display = 'none';
			const imageElement = post.querySelector( '.preload-background-image' );
			imageElement.style.backgroundImage = 'url(' + image.src + ')';
			imageElement.style.opacity = '1';
		} );
	} );
}
