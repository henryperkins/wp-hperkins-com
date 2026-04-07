const { test, expect } = require('@playwright/test');

const SOURCE_BASE_URL = process.env.SOURCE_BASE_URL || 'https://hperkins.com';
const TARGET_BASE_URL = process.env.TARGET_BASE_URL || 'https://wp.hperkins.com';

const VIEWPORTS = {
	homeDesktop: { width: 1440, height: 2200 },
	homeMobile: { width: 390, height: 844 },
	workDesktop: { width: 1440, height: 2200 },
};

async function getVisibleTextList(page, selector) {
	return page.locator(selector).evaluateAll((nodes) =>
		nodes
			.filter((node) => {
				const style = window.getComputedStyle(node);
				const rect = node.getBoundingClientRect();
				return (
					style.display !== 'none' &&
					style.visibility !== 'hidden' &&
					style.opacity !== '0' &&
					rect.width > 1 &&
					rect.height > 1 &&
					style.clip !== 'rect(1px, 1px, 1px, 1px)' &&
					style.clipPath !== 'inset(50%)'
				);
			})
			.map((node) => (node.textContent || '').trim())
			.filter(Boolean)
	);
}

async function getSourceFeaturedCaseStudyTitles(page) {
	return page
		.locator(
			'xpath=//main//*[self::h2 or self::h3][normalize-space()="Featured Case Studies"]/parent::*[1]/following-sibling::*[1]//a[contains(@href,"/work")]//h3'
		)
		.evaluateAll((nodes) =>
			nodes
				.map((node) => (node.textContent || '').trim())
				.filter(Boolean)
		);
}

async function getTargetFeaturedCaseStudyTitles(page) {
	return page
		.locator('main .hdc-work-featured-grid .hdc-work-featured-title')
		.evaluateAll((nodes) =>
			nodes
				.map((node) => (node.textContent || '').trim())
				.filter(Boolean)
		);
}

async function getHomepageSummary(page) {
	const heroTitle = await page.locator('[data-contrast-probe="hero-title"], .hdc-home-page__hero-title').first().textContent();
	const heroActions = await getVisibleTextList(
		page,
		'[data-contrast-probe^="hero-action"], .hdc-home-page__hero-actions a, .hdc-home-page__hero-actions button'
	);
	const navItems = await getVisibleTextList(page, 'header nav[aria-label="Primary"] a, .hdc-site-shell__desktop-nav a');
	const featuredTitles = await getVisibleTextList(page, '#selected-work h3');

	return {
		heroTitle: (heroTitle || '').trim(),
		heroActions,
		navItems,
		featuredTitles: featuredTitles.slice(0, 3),
	};
}

async function getWorkSummary(page, siteType) {
	const sourceLabel = await page
		.locator('.hdc-work-source-label, [data-contrast-probe="hero-meta-work"]')
		.first()
		.textContent()
		.catch(() => '');
	const sectionTitles = await getVisibleTextList(
		page,
		'main .hdc-work-signals .hdc-work-section-title, main .hdc-work-section > .hdc-work-section-intro .hdc-work-section-title, main .hdc-work-library-head .hdc-work-section-title, main .hdc-work-pending .hdc-work-section-title, main h2[data-contrast-probe="ember-heading-work"], main section h2, main section h3'
	);
	const featuredTitles =
		siteType === 'target'
			? await getTargetFeaturedCaseStudyTitles(page)
			: await getSourceFeaturedCaseStudyTitles(page);
	const languageChips = await getVisibleTextList(
		page,
		'main .hdc-work-chip, main button, main [role="group"][aria-label="Choose repository view"] button, main [aria-label="Filter by language"] button'
	);

	return {
		sourceLabel: (sourceLabel || '').trim(),
		sectionTitles,
		featuredTitles,
		languageChips,
	};
}

test.describe('site parity snapshots', () => {
	test('homepage desktop parity summary', async ({ browser }) => {
		const sourceContext = await browser.newContext({ viewport: VIEWPORTS.homeDesktop });
		const targetContext = await browser.newContext({ viewport: VIEWPORTS.homeDesktop });
		const sourcePage = await sourceContext.newPage();
		const targetPage = await targetContext.newPage();

		await sourcePage.goto(`${ SOURCE_BASE_URL }/`, { waitUntil: 'networkidle' });
		await targetPage.goto(`${ TARGET_BASE_URL }/`, { waitUntil: 'networkidle' });

		const sourceSummary = await getHomepageSummary(sourcePage);
		const targetSummary = await getHomepageSummary(targetPage);

		expect(targetSummary.heroTitle).toBe(sourceSummary.heroTitle);
		expect(targetSummary.heroActions).toEqual(sourceSummary.heroActions);

		await sourceContext.close();
		await targetContext.close();
	});

	test('homepage mobile parity summary', async ({ browser }) => {
		const sourceContext = await browser.newContext({ viewport: VIEWPORTS.homeMobile });
		const targetContext = await browser.newContext({ viewport: VIEWPORTS.homeMobile });
		const sourcePage = await sourceContext.newPage();
		const targetPage = await targetContext.newPage();

		await sourcePage.goto(`${ SOURCE_BASE_URL }/`, { waitUntil: 'networkidle' });
		await targetPage.goto(`${ TARGET_BASE_URL }/`, { waitUntil: 'networkidle' });

		const sourceHeroTitle = await sourcePage.locator('[data-contrast-probe="hero-title"]').first().textContent();
		const targetHeroTitle = await targetPage.locator('.hdc-home-page__hero-title').first().textContent();

		expect((targetHeroTitle || '').trim()).toBe((sourceHeroTitle || '').trim());

		await sourceContext.close();
		await targetContext.close();
	});

	test('work desktop parity summary', async ({ browser }) => {
		const sourceContext = await browser.newContext({ viewport: VIEWPORTS.workDesktop, serviceWorkers: 'block' });
		const targetContext = await browser.newContext({ viewport: VIEWPORTS.workDesktop, serviceWorkers: 'block' });
		const sourcePage = await sourceContext.newPage();
		const targetPage = await targetContext.newPage();

		await sourcePage.goto(`${ SOURCE_BASE_URL }/work`, { waitUntil: 'domcontentloaded' });
		await targetPage.goto(`${ TARGET_BASE_URL }/work/`, { waitUntil: 'domcontentloaded' });
		await sourcePage.waitForTimeout(8000);
		await targetPage.waitForTimeout(8000);

		const sourceSummary = await getWorkSummary(sourcePage, 'source');
		const targetSummary = await getWorkSummary(targetPage, 'target');

		expect(targetSummary.featuredTitles.slice(0, 3)).toEqual(sourceSummary.featuredTitles.slice(0, 3));
		expect(targetSummary.languageChips.slice(0, 8)).toEqual(sourceSummary.languageChips.slice(0, 8));

		await sourceContext.close();
		await targetContext.close();
	});
});
