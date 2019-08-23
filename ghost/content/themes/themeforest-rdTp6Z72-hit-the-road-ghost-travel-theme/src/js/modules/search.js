import lunr from 'lunr';
import * as ImagePreload from './imagePreload';
import { getQueryStringParam } from '../utils/url';

const baseUrl = (() => {
	const urlElement = document.querySelector( 'meta[property="blog:url"],meta[name="blog:url"]' );
	if (urlElement != null) {
		return urlElement.getAttribute('content');
	}
	return window.baseUrl;
})();

const storage = window.sessionStorage;

const postsKey = 'hit-the-road-posts';
const postsIndexKey = 'hit-the-road-posts-index';

const searchButton = document.getElementById( 'header-search-button' );
const results = document.querySelector( '.render-search-results' );
const resultsLoading = document.querySelector( '.render-search-results-indicator' );
const resultsEmpty = document.querySelector( '.render-search-results-not-found' );

function searchButtonClicked() {
	if ( searchButton.classList.contains( 'inactive' ) ) {
		searchButton.classList.remove( 'inactive' );
		searchButton.attributes[ 'type' ] = 'submit';
		searchButton.parentNode.classList.add( 'active' );
		const inputWrap = searchButton.parentNode.querySelector( '.input-wrap' );
		inputWrap.classList.add( 'active' );
		document.getElementById( 'header-search-input' ).focus();
	} else {
		document.getElementById( 'header-search-form' ).submit();
	}
}

function getPosts() {
	return new Promise( ( resolve ) => {
		const posts = JSON.parse( storage.getItem( postsKey ) );

		if ( posts == null ) {
			const url = (() => {
				if (typeof window['ghost'] !== 'undefined') {
					return window['ghost'].url.api( 'posts', { 'formats': [ 'plaintext' ], 'include': [ 'tags' ], 'limit': 'all' } );
				}
				const contentApiAccessKey = document.querySelector( 'meta[property="content-api:access-key"],meta[name="content-api:access-key"]' );
				if (contentApiAccessKey != null) {
					const accessKey = contentApiAccessKey.getAttribute('content');
					return `${baseUrl}/ghost/api/v2/content/posts/?key=${accessKey}&formats=plaintext&include=tags&limit=all`;
				}
				throw Error('Turn on Public API or provide Content API access key.');
			})();


			fetch( url ).then( ( resp ) => {
				if ( resp.ok ) {
					return resp.json();
				} else {
					throw new Error( `Unknown error occurred (HTTP ${resp.status})` );
				}
			} ).then( ( resp ) => {
				try {
					storage.setItem( postsKey, JSON.stringify( resp.posts ) );
				} catch ( e ) {
					/* do nothing */
				}
				resolve( resp.posts );
			} );
		} else {
			resolve( posts );
		}
	} );
}

function getIndex( posts ) {
	return new Promise( ( resolve ) => {
		let index = JSON.parse( storage.getItem( postsIndexKey ) );

		if ( index == null || 1 > 0 ) {
			index = lunr( ( builder ) => {
				builder.ref( 'id' );
				builder.field( 'title' );
				builder.field( 'plaintext' );
				posts.forEach( ( post ) => {
					builder.add( post );
				} );
			} );
			try {
				storage.setItem( postsIndexKey, JSON.stringify( index ) );
			} catch ( e ) {
				/* do nothing */
			}
			resolve( [ posts, index ] );
		} else {
			resolve( [ posts, lunr.Index.load( index ) ] );
		}
	} );
}

function getPostUrl( url ) {
	if (/^https?:\/\//i.test(url)) {
		return url;
	}
	return `${baseUrl}${url}`;
}

function search( query ) {
	getPosts().then( getIndex ).then( ( x ) => {
		const [ posts, index ] = x;
		const matched = index.search( query );

		if ( matched.length > 0 ) {
			matched.forEach( ( match ) => {
				const post = posts.find( ( post ) => match.ref === post.id );

				const template = `
                <article class="post preload-background" data-image="${post.feature_image}" data-resize="true">
                    <a href="${getPostUrl(post.url)}" class="post-image">
                        <span class="preload-background-image"></span>
                        <span class="preload-background-spinner spinner" style="display: none;">
                            <span class="double-bounce1"></span>
                            <span class="double-bounce2"></span>
                        </span>
                        <header class="post-header">
                            <h2 class="post-title">${post.title}</h2>
                        </header>
                    </a>
                    <div class="post-category-wrap">
                        ${post.primary_tag != null
					? `<a href="${baseUrl}/tag/${post.primary_tag.slug}" class="post-category">${post.primary_tag.name}</a>`
					: ''}
                    </div>
                </article>`;
				results.insertAdjacentHTML( 'beforeend', template );
				ImagePreload.init();
			} );

			resultsLoading.classList.add( 'hidden' );
		} else {
			resultsLoading.classList.add( 'hidden' );
			resultsEmpty.classList.remove( 'hidden' );
			const input = resultsEmpty.querySelector( 'input[type=text]' );
			if ( input != null ) {
				input.focus();
				input.setAttribute( 'value', query );
			}
		}
	} );
}

export function init() {
	searchButton.addEventListener( 'click', searchButtonClicked );

	if ( results == null ) {
		return;
	}

	search( getQueryStringParam( 'q' ) );
}
