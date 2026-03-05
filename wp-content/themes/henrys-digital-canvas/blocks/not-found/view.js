( function () {
	function mountNotFound( section ) {
		const button = section.querySelector( '[data-hdc-not-found-back]' );
		document.title = 'Page Not Found — Henry Perkins';

		if ( ! button ) {
			return;
		}

		button.addEventListener( 'click', function () {
			window.history.back();
		} );
	}

	document.querySelectorAll( '.hdc-not-found' ).forEach( mountNotFound );
} )();
