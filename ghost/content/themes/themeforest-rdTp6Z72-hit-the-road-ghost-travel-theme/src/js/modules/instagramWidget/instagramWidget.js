const postsKey = 'hit-the-road-instagram-posts';

function getSettings() {
	const defaults = {
		'user-id': '',
		'access-token': '',
		'count': '9',
	};

	Object.keys( defaults ).forEach( ( key ) => {
		const selector = `meta[property='instagram:${key}'],meta[name='instagram:${key}']`;
		const element = document.querySelector( selector );
		if ( element == null ) {
			return;
		}
		defaults[ key ] = element.getAttribute( 'content' );
	} );

	return defaults;
}

function getPosts( accessToken, userId, count ) {
	const storage = window.sessionStorage;

	return new Promise( ( resolve, reject ) => {
		let posts = null;
		try {
			posts = JSON.parse( storage.getItem( postsKey ) );
		} catch ( e ) {
			/* must be empty */
		}

		if ( posts == null ) {
			const url = `https://api.instagram.com/v1/users/${userId}/media/recent/?access_token=${accessToken}&count=${count}`;

			fetch( url ).then( ( resp ) => {
				if ( resp.ok ) {
					return resp.json();
				} else {
					reject( `Unknown error occurred (HTTP ${resp.status})` );
				}
			} ).then( ( resp ) => {
				posts = resp.data.map( ( x ) => {
					return {
						'image': x.images.low_resolution.url,
						'link': x.link,
					};
				} );

				storage.setItem( postsKey, JSON.stringify( posts ) );
				resolve( posts );
			} );
		} else {
			resolve( posts );
		}
	} );
}

function render( element, posts ) {
	const title = element.getAttribute( 'data-title' ) || '';

	const template = `
    <div class="widget widget-side render-component-instagram">
        <h2 class="widget-title">${title}</h2>
        <ul class="image-list">
        ${posts.map( ( post ) => {
		return `<li><a href="${post.link}" target="_blank"><img src="${post.image}" /></a></li>`;
	} ).join( '' )}  
        </ul>
    </div>`;

	element.insertAdjacentHTML( 'beforeend', template );
}

export function init() {
	const settings = getSettings();
	const element = document.querySelector( '.render-component-instagram' );

	if ( element == null || settings[ 'access-token' ].length === 0 ) {
		return;
	}

	getPosts( settings[ 'access-token' ], 'self', settings[ 'count' ] ).then( ( posts ) => {
		return render( element, posts );
	} );
}
