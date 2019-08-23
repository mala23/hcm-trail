const selector = [
	'.kg-embed-card iframe[src*="player.vimeo.com"]',
	'.kg-embed-card iframe[src*="youtube.com"]',
	'.kg-embed-card iframe[src*="youtube-nocookie.com"]',
].join( ',' );

export function init() {
	const videos = document.querySelectorAll( selector );
	Array.from( videos ).forEach( ( video ) => {
		if ( video.parentNode.classList.contains( 'kg-embed-card' ) ) {
			video.parentNode.classList.add( 'kg-embed-video-card' );
		}
	} );
}
