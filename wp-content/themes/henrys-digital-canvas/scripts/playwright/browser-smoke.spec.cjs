const { test, expect } = require('@playwright/test');

const BLOG_SLUG = process.env.BLOG_SLUG || 'wordpress-ai-use-cases-developers-admins';

const ROUTES = [
	{ path: '/', selector: '.hdc-digital-canvas-feed', status: 200 },
	{ path: '/work/', selector: '.hdc-work-app', status: 200 },
	{ path: '/work/lakefront-digital-portfolio/', selector: '.hdc-work-detail', status: 200 },
	{ path: '/resume/', selector: '.hdc-resume-overview', status: 200 },
	{ path: '/resume/ats/', selector: '.hdc-resume-ats', status: 200 },
	{ path: '/hobbies/', selector: '.hdc-hobbies-moments', status: 200 },
	{ path: '/blog/', selector: '.hdc-blog-index', status: 200 },
	{ path: `/blog/${ BLOG_SLUG }/`, selector: '.hdc-blog-post', status: 200 },
	{ path: '/about/', selector: '.hdc-about-timeline', status: 200 },
	{ path: '/contact/', selector: '.hdc-contact-form', status: 200 },
	{ path: '/route-should-not-exist/', selector: '.hdc-not-found', status: 404 },
];

test.describe('Henrys Digital Canvas browser smoke', () => {
	test('route matrix renders expected blocks', async ({ page }) => {
		for ( const route of ROUTES ) {
			const response = await page.goto(route.path, { waitUntil: 'networkidle' });
			expect(response && response.status()).toBe(route.status);
			await expect(page.locator(route.selector)).toHaveCount(1, { timeout: 20000 });
		}
	});

	test('work compare flow', async ({ page }) => {
		await page.goto('/work/', { waitUntil: 'networkidle' });

		const compareInputs = page.locator('.hdc-work-compare-check input[type="checkbox"]');
		await expect
			.poll(async () => compareInputs.count(), { timeout: 20000 })
			.toBeGreaterThan(1);

		await compareInputs.nth(0).click();
		await compareInputs.nth(1).click();

		await expect(page.locator('.hdc-work-compare-bar-text')).toContainText('2 repos selected', {
			timeout: 10000,
		});
	});

	test('hobbies filters update querystring', async ({ page }) => {
		await page.goto('/hobbies/', { waitUntil: 'networkidle' });

		const categoryButtons = page
			.locator('.hdc-hobbies-moments__filters > div')
			.first()
			.locator('button.hdc-hobbies-moments__chip');
		await expect
			.poll(async () => categoryButtons.count(), { timeout: 20000 })
			.toBeGreaterThan(1);

		await categoryButtons.nth(1).click();
		await expect
			.poll(async () => page.url(), { timeout: 8000 })
			.toContain('category=');
	});

	test('contact validation and success states', async ({ page }) => {
		await page.goto('/contact/', { waitUntil: 'networkidle' });

		await page.locator('.hdc-contact-form__submit').click();
		await expect
			.poll(async () => page.locator('.hdc-contact-form__hint--error').count(), { timeout: 5000 })
			.toBeGreaterThan(0);

		await page.fill('.hdc-contact-form input[name="name"]', 'Phase 6 Bot');
		await page.fill('.hdc-contact-form input[name="email"]', 'phase6-bot@example.com');
		await page.fill('.hdc-contact-form textarea[name="message"]', 'Phase 6 browser smoke validation message.');
		await page.locator('.hdc-contact-form__submit').click();

		await expect(page.locator('.hdc-contact-form__success-wrap')).toHaveCount(1, { timeout: 15000 });
	});

	test('blog progress and scroll-to-top behavior', async ({ page }) => {
		await page.goto(`/blog/${ BLOG_SLUG }/`, { waitUntil: 'networkidle' });

		const progressFill = page.locator('.hdc-blog-post__progress-fill').first();
		await expect(progressFill).toHaveCount(1, { timeout: 10000 });
		const before = await progressFill.getAttribute('style');

		await page.evaluate(() => window.scrollTo(0, 6000));
		await page.waitForTimeout(400);
		const after = await progressFill.getAttribute('style');
		expect(before).not.toBe(after);

		const scrollTop = page.locator('.hdc-blog-post__scroll-top').first();
		await expect(scrollTop).toHaveCount(1, { timeout: 10000 });
		await scrollTop.click();

		await expect
			.poll(async () => page.evaluate(() => Math.round(window.scrollY)), { timeout: 8000 })
			.toBeLessThan(40);
	});

	test('blog and home media surfaces follow blog media contract', async ({ page }) => {
		const listResponse = await page.request.get('/wp-json/henrys-digital-canvas/v1/blog?limit=3');
		expect(listResponse.ok()).toBeTruthy();
		const listPayload = await listResponse.json();
		const posts = Array.isArray(listPayload && listPayload.posts) ? listPayload.posts : [];
		const featuredPost = posts.find((post) => post && post.featured) || posts[0] || null;
		const featuredPostHasImage =
			featuredPost &&
			typeof featuredPost.featuredImageUrl === 'string' &&
			featuredPost.featuredImageUrl.trim().length > 0;
		const hasAnyListThumbnail = posts.some(
			(post) =>
				post &&
				typeof post.featuredImageUrl === 'string' &&
				post.featuredImageUrl.trim().length > 0
		);

		await page.goto('/blog/', { waitUntil: 'networkidle' });
		const blogFeaturedImage = page.locator('.hdc-blog-index__featured-image');
		const blogRowThumbs = page.locator('.hdc-blog-index__card-thumb');

		if (featuredPostHasImage) {
			await expect(blogFeaturedImage).toHaveCount(1, { timeout: 10000 });
		} else {
			await expect(blogFeaturedImage).toHaveCount(0);
		}

		if (hasAnyListThumbnail) {
			await expect.poll(async () => blogRowThumbs.count(), { timeout: 10000 }).toBeGreaterThan(0);
		} else {
			await expect(blogRowThumbs).toHaveCount(0);
		}

		const detailResponse = await page.request.get(`/wp-json/henrys-digital-canvas/v1/blog/${ BLOG_SLUG }`);
		expect(detailResponse.ok()).toBeTruthy();
		const detailPayload = await detailResponse.json();
		const detailHasImage =
			detailPayload &&
			typeof detailPayload.featuredImageUrl === 'string' &&
			detailPayload.featuredImageUrl.trim().length > 0;

		await page.goto(`/blog/${ BLOG_SLUG }/`, { waitUntil: 'networkidle' });
		const detailHeroImage = page.locator('.hdc-blog-post__hero-image');
		if (detailHasImage) {
			await expect(detailHeroImage).toHaveCount(1, { timeout: 10000 });
		} else {
			await expect(detailHeroImage).toHaveCount(0);
		}

		await page.goto('/', { waitUntil: 'networkidle' });
		const recentWritingSection = page.locator('.hdc-feed-section').filter({ hasText: 'Recent Writing' }).first();
		await expect(recentWritingSection).toHaveCount(1, { timeout: 10000 });
		const homePostThumbs = recentWritingSection.locator('.hdc-feed-card-thumb');
		if (hasAnyListThumbnail) {
			await expect.poll(async () => homePostThumbs.count(), { timeout: 10000 }).toBeGreaterThan(0);
		} else {
			await expect(homePostThumbs).toHaveCount(0);
		}
	});

	test('not-found recovery, command palette, and mobile menu', async ({ page, browser }) => {
		await page.goto('/about/', { waitUntil: 'networkidle' });
		await page.goto('/route-should-not-exist/', { waitUntil: 'networkidle' });
		await page.getByRole('button', { name: /go back/i }).click();
		await expect
			.poll(async () => page.url(), { timeout: 8000 })
			.toContain('/about/');

		await page.goto('/', { waitUntil: 'networkidle' });
		await page.keyboard.down('Control');
		await page.keyboard.press('k');
		await page.keyboard.up('Control');
		await expect(page.locator('[data-hdc-command-dialog]:not([hidden])')).toHaveCount(1, { timeout: 5000 });
		await page.keyboard.press('Escape');

		const mobileContext = await browser.newContext({
			baseURL: process.env.BASE_URL || 'https://wp.hperkins.com',
			viewport: { width: 390, height: 844 },
		});
		const mobilePage = await mobileContext.newPage();

		await mobilePage.goto('/', { waitUntil: 'networkidle' });
		await mobilePage.getByRole('button', { name: 'Menu' }).click();
		await expect(mobilePage.locator('[data-hdc-mobile-menu]:not([hidden])')).toHaveCount(1, {
			timeout: 8000,
		});

		await mobileContext.close();
	});
});
