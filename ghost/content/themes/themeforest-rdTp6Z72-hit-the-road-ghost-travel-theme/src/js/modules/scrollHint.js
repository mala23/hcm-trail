const hint = document.getElementById( 'scroll-hint' );

function toggleHint() {
	const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

	if ( scrollTop > 0 ) {
		hint.classList.remove( 'visible' );
	} else {
		hint.classList.add( 'visible' );
	}
}

function scrollToContent() {
	if ( !hint.classList.contains( 'visible' ) ) {
		return;
	}

	window.scrollBy( {
		top: window.innerHeight,
		left: 0,
		behavior: 'smooth',
	} );
}

export function init() {
	if ( hint == null ) {
		return;
	}

	hint.addEventListener( 'click', scrollToContent );
	window.addEventListener( 'load', toggleHint );
	window.addEventListener( 'scroll', toggleHint );
}

