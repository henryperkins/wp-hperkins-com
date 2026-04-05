const { test, expect } = require('@playwright/test');

const BLOG_SLUG = process.env.BLOG_SLUG || '';
const BLOG_CODE_SLUG = process.env.BLOG_CODE_SLUG || '';
const BLOG_MISSING_SLUG = process.env.BLOG_MISSING_SLUG || 'this-slug-should-not-exist';
const WORK_DETAIL_REPO = process.env.WORK_DETAIL_REPO || 'henry-s-digital-canvas';
const BLOG_LIST_LIMIT = 20;

let blogFixtures = null;

function ensureString(value, fallback = '') {
	return typeof value === 'string' && value.trim() ? value.trim() : fallback;
}

function escapeHtmlAttribute(value) {
	return String(value)
		.replace(/&/g, '&amp;')
		.replace(/"/g, '&quot;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;');
}

function buildExpectedBlogTitle(post) {
	const baseTitle = ensureString(post && post.seoTitle) || ensureString(post && post.title) || 'Post Not Found';
	return /henry perkins/i.test(baseTitle) ? baseTitle : `${ baseTitle } — Henry Perkins`;
}

function hasCodeBlocks(post) {
	return /<(pre|code)\b/i.test(ensureString(post && post.contentHtml));
}

async function fetchJson(request, path) {
	const response = await request.get(path);
	if (!response.ok()) {
		throw new Error(`Request failed for ${ path }: ${ response.status() }`);
	}

	return response.json();
}

async function resolveBlogFixtures(request) {
	const listPayload = await fetchJson(request, `/wp-json/henrys-digital-canvas/v1/blog?limit=${ BLOG_LIST_LIMIT }`);
	const posts = Array.isArray(listPayload && listPayload.posts)
		? listPayload.posts.filter((post) => post && ensureString(post.slug))
		: [];

	if (!posts.length) {
		throw new Error('Could not resolve a published blog post for browser smoke checks.');
	}

	const detailCache = new Map();

	async function getDetail(slug) {
		if (detailCache.has(slug)) {
			return detailCache.get(slug);
		}

		const detail = await fetchJson(request, `/wp-json/henrys-digital-canvas/v1/blog/${ slug }`);
		detailCache.set(slug, detail);
		return detail;
	}

	const blogSlug = BLOG_SLUG || posts[0].slug;
	const blogDetail = await getDetail(blogSlug);

	let codeSlug = BLOG_CODE_SLUG;
	if (!codeSlug) {
		for (const post of posts) {
			const detail = await getDetail(post.slug);
			if (hasCodeBlocks(detail)) {
				codeSlug = post.slug;
				break;
			}
		}
	}

	const resolvedCodeSlug = codeSlug || blogSlug;
	const codeDetail = resolvedCodeSlug === blogSlug ? blogDetail : await getDetail(resolvedCodeSlug);

	return {
		posts,
		blogSlug,
		blogDetail,
		codeSlug: resolvedCodeSlug,
		codeDetail,
	};
}

test.describe('Henrys Digital Canvas browser smoke', () => {
	test.beforeAll(async ({ request }) => {
		blogFixtures = await resolveBlogFixtures(request);
	});

	test('route matrix renders expected blocks', async ({ page }) => {
		const routes = [
			{ path: '/', selector: '.hdc-home-page', status: 200 },
			{ path: '/work/', selector: '.hdc-work-showcase', status: 200 },
			{ path: `/work/${ WORK_DETAIL_REPO }/`, selector: '.hdc-work-detail', status: 200 },
			{ path: '/resume/', selector: '.hdc-resume-overview', status: 200 },
			{ path: '/resume/ats/', selector: '.hdc-resume-ats', status: 200 },
			{ path: '/hobbies/', selector: '.hdc-hobbies-moments', status: 200 },
			{ path: '/blog/', selector: '.hdc-blog-index', status: 200 },
			{ path: `/blog/${ blogFixtures.blogSlug }/`, selector: '.hdc-blog-post', status: 200 },
			{ path: '/about/', selector: '.hdc-about-timeline', status: 200 },
			{ path: '/contact/', selector: '.hdc-contact-form', status: 200 },
			{ path: '/route-should-not-exist/', selector: '.hdc-not-found', status: 404 },
		];

		for ( const route of routes ) {
			const response = await page.goto(route.path, { waitUntil: 'domcontentloaded' });
			expect(response && response.status()).toBe(route.status);
			await expect(page.locator(route.selector)).toHaveCount(1, { timeout: 20000 });
		}
	});

	test('work signals panel renders stat cards and loads contributor metrics route', async ({ page }) => {
		const signalResponses = [];
		page.on('response', (response) => {
			const url = response.url();
			if (url.includes('/api/github/contributor-stats')) {
				signalResponses.push({
					status: response.status(),
					url,
				});
			}
		});

		await page.goto('/work/', { waitUntil: 'domcontentloaded' });

		const signalsSection = page.locator('.hdc-work-signals');
		await expect(signalsSection).toHaveCount(1, { timeout: 30000 });

		const statCards = signalsSection.locator('.hdc-work-stat-card');
		await expect
			.poll(async () => statCards.count(), { timeout: 30000 })
			.toBeGreaterThanOrEqual(1);

		await expect
			.poll(
				async () => signalResponses.some((response) => response.status !== 404),
				{ timeout: 30000 }
			)
			.toBeTruthy();
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
			.toContain('hdcCategory=');
	});

	test('contact validation and success states', async ({ page }) => {
		await page.goto('/contact/', { waitUntil: 'networkidle' });

		const submitButton = page.locator('.hdc-contact-form__submit');
		const verificationShell = page.locator('.hdc-contact-form__verification-shell');
		await expect(verificationShell).toHaveCount(1, { timeout: 10000 });
		if (await submitButton.isDisabled()) {
			await expect(page.locator('#contact-verification-error')).toContainText(/verification/i);
			await expect(submitButton).toBeDisabled();
		} else {
			await submitButton.click();
			await expect
				.poll(async () => page.locator('.hdc-contact-form__hint--error').count(), { timeout: 5000 })
				.toBeGreaterThan(0);

			await page.fill('.hdc-contact-form input[name="name"]', 'Phase 6 Bot');
			await page.fill('.hdc-contact-form input[name="email"]', 'phase6-bot@example.com');
			await page.fill('.hdc-contact-form textarea[name="message"]', 'Phase 6 browser smoke validation message.');
			await submitButton.click();
			await expect(page.locator('#contact-verification-error')).toContainText(/verification/i, { timeout: 10000 });
		}
	});

	test('blog progress and scroll-to-top behavior', async ({ page }) => {
		await page.goto(`/blog/${ blogFixtures.blogSlug }/`, { waitUntil: 'networkidle' });

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

	test('blog detail missing-post route renders the enhanced state card', async ({ page }) => {
		await page.goto(`/blog/${ BLOG_MISSING_SLUG }/`, { waitUntil: 'networkidle' });

		await expect(page.locator('.hdc-blog-post__state-card')).toHaveCount(1, { timeout: 10000 });
		await expect(page.getByRole('heading', { level: 2, name: 'Post not found' })).toBeVisible();
		await expect(page.getByRole('link', { name: 'Back to Blog' })).toBeVisible();
	});

	test('blog detail enhances HTML code blocks with a toolbar and copy affordance', async ({ page }) => {
		await page.goto(`/blog/${ blogFixtures.codeSlug }/`, { waitUntil: 'networkidle' });

		await expect
			.poll(async () => page.locator('.hdc-blog-post__code-toolbar').count(), { timeout: 10000 })
			.toBeGreaterThan(0);
		await expect(page.locator('.hdc-blog-post__code-copy').first()).toHaveCount(1);
		await expect(page.locator('.hdc-blog-post__code-language').first()).not.toHaveText('');
	});

	test('blog detail renders comments, share, related posts, and canonical route metadata', async ({ page }) => {
		const htmlResponse = await page.request.get(`/blog/${ blogFixtures.blogSlug }/`);
		expect(htmlResponse.ok()).toBeTruthy();
		const html = await htmlResponse.text();

		await page.goto(`/blog/${ blogFixtures.blogSlug }/`, { waitUntil: 'networkidle' });

		await expect(page.getByRole('heading', { level: 2, name: 'Comments' })).toBeVisible();
		await expect(page.locator('.hdc-blog-post__comments-card')).toHaveCount(1);
		await expect(page.getByRole('button', { name: 'Copy article link' })).toBeVisible();
		await expect(page.getByRole('link', { name: 'Share on LinkedIn' })).toBeVisible();
		await expect(page.getByRole('link', { name: /Comment on WordPress|Open original post/ })).toBeVisible();
		await expect(page.locator('.hdc-blog-post__related')).toHaveCount(blogFixtures.posts.length > 1 ? 1 : 0);

		expect(html).toContain(`<link rel="canonical" href="https://hperkins.com/blog/${ blogFixtures.blogSlug }" />`);
		expect(html).toContain('<meta property="og:type" content="article" />');
		expect(html).toContain(`<meta property="og:url" content="https://hperkins.com/blog/${ blogFixtures.blogSlug }" />`);
		expect(html).toContain(`<meta name="twitter:title" content="${ escapeHtmlAttribute(buildExpectedBlogTitle(blogFixtures.blogDetail)) }" />`);
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

		const detailResponse = await page.request.get(`/wp-json/henrys-digital-canvas/v1/blog/${ blogFixtures.blogSlug }`);
		expect(detailResponse.ok()).toBeTruthy();
		const detailPayload = await detailResponse.json();
		const detailHasImage =
			detailPayload &&
			typeof detailPayload.featuredImageUrl === 'string' &&
			detailPayload.featuredImageUrl.trim().length > 0;

		await page.goto(`/blog/${ blogFixtures.blogSlug }/`, { waitUntil: 'networkidle' });
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
		const commandDialog = page.locator('[data-hdc-command-dialog]');
		await page.keyboard.down('Control');
		await page.keyboard.press('k');
		await page.keyboard.up('Control');
		await expect(commandDialog).toBeVisible({ timeout: 5000 });
		const commandInput = page.locator('[data-hdc-command-input]');
		await expect(commandInput).toBeFocused();
		await page.keyboard.down('Control');
		await page.keyboard.press('k');
		await page.keyboard.up('Control');
		await expect(commandDialog).toBeVisible();
		await commandInput.fill('about');
		await page.keyboard.press('ArrowDown');
		await expect(page.locator('.hdc-site-shell__command-item.is-highlighted').first()).toContainText('About');
		await page.keyboard.press('Escape');
		await expect(commandDialog).toBeHidden({ timeout: 5000 });

		const mobileContext = await browser.newContext({
			baseURL: process.env.BASE_URL || 'https://wp.hperkins.com',
			viewport: { width: 390, height: 844 },
		});
		const mobilePage = await mobileContext.newPage();

		await mobilePage.goto('/', { waitUntil: 'networkidle' });
		const menuButton = mobilePage.locator('[data-hdc-menu-trigger]');
		const mobileMenu = mobilePage.locator('[data-hdc-mobile-menu]');
		await expect(menuButton).toHaveAttribute('aria-label', /open menu/i);
		await expect(menuButton).toHaveAttribute('aria-expanded', 'false');
		await menuButton.click();
		await expect(mobileMenu).toBeVisible({
			timeout: 8000,
		});
		await expect(menuButton).toHaveAttribute('aria-expanded', 'true');
		await expect(menuButton).toHaveAttribute('aria-label', /close menu/i);
		await mobilePage.keyboard.press('Escape');
		await expect(mobileMenu).toBeHidden({
			timeout: 8000,
		});

		await mobileContext.close();
	});
});
