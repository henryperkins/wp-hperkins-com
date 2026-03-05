( function () {
	'use strict';

	function ensureString( value, fallback ) {
		if ( typeof value !== 'string' ) {
			return fallback;
		}
		var trimmed = value.trim();
		return trimmed || fallback;
	}

	function ensureArray( value ) {
		return Array.isArray( value ) ? value : [];
	}

	function mountResumeSnapshot( section ) {
		var root = section.querySelector( '[data-hdc-resume-snapshot-root]' );
		if ( ! root ) {
			return;
		}

		var endpoint = section.getAttribute( 'data-resume-endpoint' );
		if ( ! endpoint ) {
			return;
		}

		fetch( endpoint, { headers: { Accept: 'application/json' } } )
			.then( function ( response ) {
				if ( ! response.ok ) {
					throw new Error( 'Resume request failed with status ' + response.status );
				}
				return response.json();
			} )
			.then( function ( payload ) {
				var data = payload && payload.data ? payload.data : payload;
				if ( ! data || typeof data !== 'object' ) {
					return;
				}

				var positioningEl = section.querySelector( '.hdc-home-resume-snapshot__positioning' );
				var impactEl = section.querySelector( '.hdc-home-resume-snapshot__impact' );

				if ( positioningEl ) {
					var headline = ensureString( data.headline, '' );
					var subheadline = ensureString( data.subheadline, '' );
					var targetRoles = ensureArray( data.targetRoles );
					var experience = ensureArray( data.experience );
					var latestExp = experience.length > 0 ? experience[0] : null;

					var html = '<p class="hdc-home-resume-snapshot__eyebrow">Positioning</p>';
					if ( headline ) {
						html += '<h3 class="hdc-home-resume-snapshot__headline">' + escapeHtml( headline ) + '</h3>';
					}
					if ( subheadline ) {
						html += '<p class="hdc-home-resume-snapshot__subheadline">' + escapeHtml( subheadline ) + '</p>';
					}
					if ( latestExp ) {
						html += '<p class="hdc-home-resume-snapshot__latest-title">' + escapeHtml( ensureString( latestExp.title, '' ) ) + '</p>';
						html += '<p class="hdc-home-resume-snapshot__latest-meta">' + escapeHtml( ensureString( latestExp.company, '' ) ) + ' · ' + escapeHtml( ensureString( latestExp.period, '' ) ) + '</p>';
					}
					if ( targetRoles.length > 0 ) {
						html += '<div class="hdc-home-resume-snapshot__roles">';
						targetRoles.forEach( function ( role ) {
							html += '<span class="hdc-home-resume-snapshot__role-badge">' + escapeHtml( String( role ) ) + '</span>';
						} );
						html += '</div>';
					}

					positioningEl.innerHTML = html;
				}

				if ( impactEl ) {
					var impactStrip = ensureArray( data.impactStrip ).slice( 0, 4 );
					var impactHtml = '<p class="hdc-home-resume-snapshot__eyebrow">Results</p>';
					impactHtml += '<h3 class="hdc-home-resume-snapshot__impact-title">Proof of Impact</h3>';

					if ( impactStrip.length > 0 ) {
						impactHtml += '<div class="hdc-home-resume-snapshot__metrics">';
						impactStrip.forEach( function ( metric ) {
							impactHtml += '<div class="hdc-home-resume-snapshot__metric">';
							impactHtml += '<span class="hdc-home-resume-snapshot__metric-value">' + escapeHtml( ensureString( metric && metric.value, '' ) ) + '</span>';
							impactHtml += '<span class="hdc-home-resume-snapshot__metric-label">' + escapeHtml( ensureString( metric && metric.label, '' ) ) + '</span>';
							impactHtml += '</div>';
						} );
						impactHtml += '</div>';
					}

					impactEl.innerHTML = impactHtml;
				}
			} )
			.catch( function () {
				// Silently fall back to static content
			} );
	}

	function escapeHtml( text ) {
		var div = document.createElement( 'div' );
		div.appendChild( document.createTextNode( text ) );
		return div.innerHTML;
	}

	document.querySelectorAll( '[data-hdc-resume-snapshot]' ).forEach( mountResumeSnapshot );
} )();
