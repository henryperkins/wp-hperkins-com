const { test, expect } = require( '@playwright/test' );

async function expectWideSection( locator, label ) {
	const box = await locator.boundingBox();
	expect(
		box && box.width,
		`${ label } should be page-wide`
	).toBeGreaterThanOrEqual( 1260 );
	expect(
		box && box.x,
		`${ label } should start at the viewport edge`
	).toBeLessThanOrEqual( 20 );
}

async function expectCardsInDesktopRow( locator, label ) {
	const boxes = await locator.evaluateAll( ( cards ) =>
		cards.map( ( card ) => {
			const rect = card.getBoundingClientRect();
			return {
				top: Math.round( rect.top ),
			};
		} )
	);
	expect( boxes, `${ label } card count` ).toHaveLength( 3 );
	const tops = boxes.map( ( box ) => box.top );
	expect(
		Math.max( ...tops ) - Math.min( ...tops ),
		`${ label } cards should share a row`
	).toBeLessThanOrEqual( 20 );
}

async function expectHeroContentColumn( hero ) {
	const boxes = await hero.evaluate( ( element ) =>
		[
			'.hdc-home-page__hero-title',
			'.hdc-home-page__hero-description',
			'.hdc-home-page__hero-actions',
		].map( ( selector ) => {
			const rect = element
				.querySelector( selector )
				.getBoundingClientRect();
			return {
				left: Math.round( rect.left ),
				top: Math.round( rect.top ),
			};
		} )
	);
	const [ title, description, actions ] = boxes;
	expect(
		Math.abs( description.left - title.left ),
		'Hero lede should align with title'
	).toBeLessThanOrEqual( 4 );
	expect(
		Math.abs( actions.left - title.left ),
		'Hero actions should align with title'
	).toBeLessThanOrEqual( 4 );
	expect( description.top, 'Hero lede should follow title' ).toBeGreaterThan(
		title.top
	);
	expect( actions.top, 'Hero actions should follow lede' ).toBeGreaterThan(
		description.top
	);
}

test.describe( 'home page core-block structure', () => {
	test( 'renders the Phase 2 homepage sections server-side', async ( {
		page,
	} ) => {
		const response = await page.goto( '/', {
			waitUntil: 'domcontentloaded',
		} );
		expect( response && response.status() ).toBe( 200 );

		const hero = page.locator( '.hdc-home-page__hero.is-style-home-hero' );
		await expect( hero ).toHaveCount( 1, { timeout: 10000 } );
		await expect( hero.locator( 'h1' ) ).toContainText(
			'Retail floors. WordPress themes. Cloud platforms. Agentic AI.'
		);

		const heroBox = await hero.boundingBox();
		expect( heroBox && heroBox.width ).toBeGreaterThanOrEqual( 1260 );
		await expectHeroContentColumn( hero );

		const selectedWork = page.locator(
			'#selected-work.hdc-home-page__section'
		);
		await expect( selectedWork ).toHaveCount( 1 );
		await expectWideSection( selectedWork, 'Selected Work' );
		await expect( selectedWork ).not.toContainText(
			/Syncing selected work|Loading selected work/i
		);
		await expect(
			selectedWork.locator( '.is-style-hdc-repo-card' )
		).toHaveCount( 3 );
		await expectCardsInDesktopRow(
			selectedWork.locator( '.is-style-hdc-repo-card' ),
			'Selected Work'
		);

		await expect(
			page.locator( '#throughline.hdc-home-page__section' )
		).toContainText( 'From the floor to the frontier.' );
		await expectWideSection(
			page.locator( '#throughline.hdc-home-page__section' ),
			'Throughline'
		);
		await expect(
			page.locator( '#resume-snapshot.hdc-home-page__section' )
		).toContainText( 'Where I contribute fastest' );
		await expectWideSection(
			page.locator( '#resume-snapshot.hdc-home-page__section' ),
			'Resume Snapshot'
		);
		await expect(
			page.locator( '[data-hdc-home-recent-writing]' )
		).toHaveCount( 0 );
		const recentWriting = page.locator(
			'#recent-writing.hdc-home-page__section--writing'
		);
		await expect( recentWriting ).toHaveCount( 1 );
		await expectWideSection( recentWriting, 'Recent Writing' );
		await expect( recentWriting ).not.toContainText(
			/Loading recent writing/i
		);
		const articleRows = recentWriting.locator(
			'.is-style-hdc-article-row'
		);
		const articleRowCount = await articleRows.count();
		if ( articleRowCount > 0 ) {
			await expect(
				articleRows.first().locator( '.hdc-home-page__reading-time' )
			).toContainText( /\d+\s+min read/i );
		} else {
			await expect( recentWriting ).toContainText(
				'Recent writing is updating'
			);
		}
		await expect( page.locator( '#contact-cta' ) ).toContainText(
			'Need a technical partner?'
		);
		await expectWideSection(
			page.locator( '#contact-cta' ),
			'Contact CTA'
		);
	} );
} );
