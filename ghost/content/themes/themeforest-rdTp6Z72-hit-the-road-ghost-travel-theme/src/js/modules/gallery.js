function itemClicked( item ) {
	item.classList.toggle( 'zoom' );
	document.body.classList.toggle( 'no-scroll' );
}

export function init() {
	const images = document.querySelectorAll( '.kg-gallery-image img' );
	images.forEach( ( image ) => {
		const container = image.closest( '.kg-gallery-image' );
		const width = image.attributes.width.value;
		const height = image.attributes.height.value;
		const ratio = width / height;
		container.style.flex = ratio + ' 1 0%';
		container.addEventListener( 'click', () => itemClicked( container ) );
	} );
}

