const { test, expect } = require('@playwright/test');

const TARGET_BASE_URL = process.env.TARGET_BASE_URL || process.env.BASE_URL || 'https://wp.hperkins.com';
const SOURCE_BASE_URL = process.env.SOURCE_BASE_URL || TARGET_BASE_URL;

// One BEM section root per child block. These class roots MUST be emitted
// by the child render.php files for parity to hold.
const SECTIONS = [
	{ name: 'shell', sourceSelector: '.hdc-home-page__shell', targetSelector: '.hdc-home-page__shell' },
	{ name: 'hero', sourceSelector: '.hdc-home-page__hero', targetSelector: '.hdc-home-page__hero' },
	{
		name: 'selected-work',
		sourceSelector: '#selected-work.hdc-home-page__section',
		targetSelector: '[data-hdc-home-selected-work].hdc-home-page__section',
	},
	{
		name: 'throughline',
		sourceSelector: '#throughline.hdc-home-page__section',
		targetSelector: '.hdc-home-page__section--throughline',
	},
	{
		name: 'resume-snapshot',
		sourceSelector: '#resume-snapshot.hdc-home-page__section',
		targetSelector: '[data-hdc-home-resume-snapshot].hdc-home-page__section',
	},
	{
		name: 'recent-writing',
		sourceSelector: '#recent-writing.hdc-home-page__section',
		targetSelector: '[data-hdc-home-recent-writing].hdc-home-page__section',
	},
	{ name: 'contact-cta', sourceSelector: '.hdc-home-page__cta-card', targetSelector: '.hdc-home-page__cta-card' },
];

const COMPUTED_PROPS = [
	'padding-top',
	'padding-right',
	'padding-bottom',
	'padding-left',
	'margin-top',
	'margin-bottom',
	'border-top-width',
	'border-radius',
	'background-color',
	'color',
	'font-size',
	'line-height',
	'text-align',
	'display',
	'background-image',
	'background-size',
	'background-position',
	'background-repeat',
	'background-blend-mode',
];

const WORDPRESS_WRAPPER_CLASS_PATTERN = /^wp-block-henrys-digital-canvas-home-/;
const MIGRATION_MARKER_CLASS_PATTERN = /^hdc-home-page__section--/;

function normalizeClassList(classList) {
	return classList
		.filter((className) => !WORDPRESS_WRAPPER_CLASS_PATTERN.test(className))
		.filter((className) => !MIGRATION_MARKER_CLASS_PATTERN.test(className))
		.filter((className) => className !== 'hdc-reveal' && className !== 'hdc-reveal--fade-in')
		.sort();
}

async function describeSection(page, selector) {
	const node = await page.$(selector);
	if (!node) {
		return { exists: false };
	}
	return node.evaluate((element, props) => {
		const style = window.getComputedStyle(element);
		const computed = {};
		for (const prop of props) {
			computed[prop] = style.getPropertyValue(prop);
		}
		return {
			exists: true,
			tagName: element.tagName.toLowerCase(),
			classList: Array.from(element.classList).sort(),
			text: (element.textContent || '').replace(/\s+/g, ' ').trim(),
			computed,
		};
	}, COMPUTED_PROPS);
}

test.describe('home page structural parity', () => {
	test.beforeAll(async () => {
		test.info().annotations.push({
			type: 'source',
			description: `source=${SOURCE_BASE_URL} target=${TARGET_BASE_URL}`,
		});
	});

	for (const section of SECTIONS) {
		test(`section "${section.name}" matches source DOM + computed styles`, async ({ browser }) => {
			const sourceContext = await browser.newContext({ viewport: { width: 1280, height: 900 } });
			const targetContext = await browser.newContext({ viewport: { width: 1280, height: 900 } });
			const sourcePage = await sourceContext.newPage();
			const targetPage = await targetContext.newPage();

			await sourcePage.goto(`${SOURCE_BASE_URL}/`, { waitUntil: 'networkidle' });
			await targetPage.goto(`${TARGET_BASE_URL}/`, { waitUntil: 'networkidle' });

			const sourceInfo = await describeSection(sourcePage, section.sourceSelector);
			const targetInfo = await describeSection(targetPage, section.targetSelector);

			expect(targetInfo.exists, `target ${section.targetSelector} must exist`).toBe(true);
			expect(sourceInfo.exists, `source ${section.sourceSelector} must exist`).toBe(true);
			expect(targetInfo.tagName).toBe(sourceInfo.tagName);
			expect(normalizeClassList(targetInfo.classList)).toEqual(normalizeClassList(sourceInfo.classList));

			for (const prop of COMPUTED_PROPS) {
				expect(targetInfo.computed[prop], `section ${section.name} property ${prop} (target vs source)`).toBe(
					sourceInfo.computed[prop]
				);
			}

			await sourceContext.close();
			await targetContext.close();
		});
	}
});
