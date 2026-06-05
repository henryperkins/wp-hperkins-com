const { test, expect } = require( '@playwright/test' );

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

		const selectedWork = page.locator(
			'#selected-work.hdc-home-page__section'
		);
		await expect( selectedWork ).toHaveCount( 1 );
		await expect( selectedWork ).not.toContainText(
			/Syncing selected work|Loading selected work/i
		);
		await expect(
			selectedWork.locator( '.is-style-hdc-repo-card' )
		).toHaveCount( 3 );

		await expect(
			page.locator( '#throughline.hdc-home-page__section' )
		).toContainText( 'From the floor to the frontier.' );
		await expect(
			page.locator( '#resume-snapshot.hdc-home-page__section' )
		).toContainText( 'Where I contribute fastest' );
		await expect(
			page.locator( '[data-hdc-home-recent-writing]' )
		).toHaveCount( 1 );
		await expect( page.locator( '#contact-cta' ) ).toContainText(
			'Need a technical partner?'
		);
	} );
} );
