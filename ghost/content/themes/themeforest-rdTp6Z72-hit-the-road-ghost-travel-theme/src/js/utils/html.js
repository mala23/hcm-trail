export function loadScript( source ) {
	return new Promise( ( resolve, reject ) => {
		let script = document.createElement( 'script' );
		script.setAttribute( 'async', 'async' );
		script.setAttribute( 'defer', 'defer' );
		const prior = document.getElementsByTagName( 'script' )[ 0 ];
		script.async = 1;

		script.onload = script.onreadystatechange = ( _, isAbort ) => {
			if ( isAbort || !script.readyState || /loaded|complete/.test( script.readyState ) ) {
				script.onload = script.onreadystatechange = null;
				script = undefined;

				if ( !isAbort ) {
					resolve();
				} else {
					reject();
				}
			}
		};

		script.src = source;
		prior.parentNode.insertBefore( script, prior );
	} );
}
