function clicked( element, event ) {
	const target = document.getElementById( element.getAttribute( 'data-target' ) );
	const body = document.getElementById( 'body' );
	if ( target == null ) {
		return;
	}
	if ( target.classList.contains( 'in' ) ) {
		target.classList.remove( 'in' );
		body.classList.remove( 'menu-visible' );
		Array.from( document.querySelectorAll( '.hide-on-menu' ) ).forEach( ( item ) => {
			item.classList.remove( 'hidden-xs' );
			item.classList.remove( 'hidden-sm' );
		} );
	} else {
		target.classList.add( 'in' );
		body.classList.add( 'menu-visible' );
		Array.from( document.querySelectorAll( '.hide-on-menu' ) ).forEach( ( item ) => {
			item.classList.add( 'hidden-xs' );
			item.classList.add( 'hidden-sm' );
		} );
	}
}

export function init() {
	const elements = Array.from( document.querySelectorAll( 'button[data-toggle=collapse2]' ) );
	elements.map( ( element ) => element.addEventListener( 'click', ( event ) => clicked( element, event ) ) );
}

