const { chromium } = require('@playwright/test');

const TARGETS = [
  { name: 'source', base: 'http://127.0.0.1:8081', blogSlug: 'wordpress-ai-use-cases-developers-admins' },
  { name: 'wp', base: 'https://wp.hperkins.com', blogSlug: 'wordpress-ai-use-cases-developers-admins' },
];

async function openCommandPalette(page, targetName) {
  await page.keyboard.down(process.platform === 'darwin' ? 'Meta' : 'Control');
  await page.keyboard.press('k');
  await page.keyboard.up(process.platform === 'darwin' ? 'Meta' : 'Control');
  const input = targetName === 'wp'
    ? page.locator('[data-hdc-command-input]')
    : page.locator('input[placeholder*="Search pages"]');
  await input.waitFor({ state: 'visible', timeout: 5000 });
  return input;
}

async function checkShell(target) {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  await page.goto(`${target.base}/`, { waitUntil: 'networkidle' });

  const navTexts = await page.evaluate((targetName) => {
    if (targetName === 'wp') {
      return Array.from(document.querySelectorAll('.hdc-site-shell__desktop-nav a')).map((a) => a.textContent?.trim()).filter(Boolean);
    }
    return Array.from(document.querySelectorAll('header nav a')).map((a) => a.textContent?.trim()).filter(Boolean);
  }, target.name);

  const cmdInput = await openCommandPalette(page, target.name);
  await cmdInput.fill('4hosts');
  await page.waitForTimeout(250);

  const commandProbe = await page.evaluate((targetName) => {
    if (targetName === 'wp') {
      const emptyVisible = !document.querySelector('[data-hdc-command-empty]')?.hasAttribute('hidden');
      const projectCount = document.querySelectorAll('[data-hdc-command-projects] .hdc-site-shell__command-item').length;
      const projectLabels = Array.from(document.querySelectorAll('[data-hdc-command-projects] .hdc-site-shell__command-label')).map((n) => n.textContent?.trim()).filter(Boolean);
      return { emptyVisible, projectCount, projectLabels };
    }
    const items = Array.from(document.querySelectorAll('[cmdk-item], [data-cmdk-item]'));
    const labels = items.map((n) => n.textContent?.trim()).filter(Boolean);
    const emptyVisible = !!document.querySelector('[cmdk-empty]:not([hidden]), [data-cmdk-empty]:not([hidden])');
    return { emptyVisible, resultCount: items.length, labels: labels.slice(0, 20) };
  }, target.name);

  await page.keyboard.press('Escape');

  if (target.name === 'wp') {
    await page.click('[data-hdc-theme-trigger]');
    await page.click('[data-hdc-theme-option="dark"]');
  } else {
    await page.click('button[aria-label="Change theme"]');
    await page.click('[role="menuitemradio"]:has-text("Dark")');
  }
  await page.waitForTimeout(200);

  const darkState = await page.evaluate(() => {
    const root = document.documentElement;
    const body = document.body;
    const styles = getComputedStyle(body);
    return {
      htmlClass: root.className,
      htmlDataTheme: root.getAttribute('data-theme'),
      bodyClass: body.className,
      bodyBg: styles.backgroundColor,
      bodyColor: styles.color,
    };
  });

  const focusSelector = target.name === 'wp'
    ? '.hdc-site-shell__desktop-nav a[href*="/work/"]'
    : 'header nav a[href="/work"]';
  const focusStyles = await page.evaluate((selector) => {
    const el = document.querySelector(selector);
    if (!el) return null;
    el.focus();
    const s = getComputedStyle(el);
    return {
      boxShadow: s.boxShadow,
      outline: s.outline,
      outlineStyle: s.outlineStyle,
      outlineWidth: s.outlineWidth,
    };
  }, focusSelector);

  const mContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const mPage = await mContext.newPage();
  await mPage.goto(`${target.base}/`, { waitUntil: 'networkidle' });
  let mobileVisible = false;
  if (target.name === 'wp') {
    await mPage.click('[data-hdc-menu-trigger]');
    mobileVisible = await mPage.evaluate(() => {
      const menu = document.querySelector('[data-hdc-mobile-menu]');
      if (!menu) return false;
      const styles = window.getComputedStyle(menu);
      return styles.visibility !== 'hidden' && styles.pointerEvents !== 'none' && menu.getClientRects().length > 0;
    });
  } else {
    await mPage.click('button[aria-label="Open menu"]');
    mobileVisible = await mPage.evaluate(() => {
      const menu = document.querySelector('#mobile-navigation-menu');
      if (!menu) return false;
      return menu.clientHeight > 0;
    });
  }

  await mContext.close();
  await context.close();
  await browser.close();
  return { navTexts, commandProbe, darkState, focusStyles, mobileVisible };
}

async function checkOfflineStates(target) {
  const browser = await chromium.launch({ headless: true });

  async function probe(routePath, interceptPatterns, successMatcher, errorMatcher) {
    const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const page = await context.newPage();
    for (const pattern of interceptPatterns) {
      await page.route(pattern, (route) => route.abort());
    }
    await page.goto(`${target.base}${routePath}`, { waitUntil: 'networkidle' });
    const bodyText = await page.locator('body').innerText();
    const result = {
      successMatched: successMatcher ? successMatcher.test(bodyText) : null,
      errorMatched: errorMatcher ? errorMatcher.test(bodyText) : null,
      snippet: bodyText.replace(/\s+/g, ' ').slice(0, 240),
    };
    await context.close();
    return result;
  }

  const out = {};

  if (target.name === 'source') {
    out.workDetailOffline = await probe(
      '/work/lakefront-digital-portfolio',
      ['**/api/github/repos**', '**/api/github/language-summary**'],
      /offline|cached project snapshot|GitHub rate limit|Live GitHub sync is unavailable/i,
      /Project not found/i,
    );
    out.resumeAtsOffline = await probe(
      '/resume/ats',
      ['**/api/**'],
      /ATS One-Page Resume|Professional Summary|Selected Impact/i,
      /Unable to load ATS resume data|ATS resume data is unavailable/i,
    );
    out.hobbiesOffline = await probe(
      '/hobbies',
      ['**/api/**'],
      /Hobbies|Key takeaway|Now|Recently|Next/i,
      /Unable to load hobby moments/i,
    );
    out.blogOffline = await probe(
      '/blog',
      ['**/api/wordpress/posts**'],
      /Featured|All Posts|Stay updated/i,
      /Unable to load blog posts/i,
    );
  } else {
    out.workDetailOffline = await probe(
      '/work/lakefront-digital-portfolio/',
      ['**/wp-json/henrys-digital-canvas/v1/work**'],
      /cached project snapshot|Detailed case-study data is temporarily unavailable|Why It Matters/i,
      /Project not found/i,
    );
    out.resumeAtsOffline = await probe(
      '/resume/ats/',
      ['**/wp-json/henrys-digital-canvas/v1/resume-ats**', '**/wp-content/themes/henrys-digital-canvas/data/resume-ats.json**'],
      /ATS One-Page Resume|Professional Summary|Selected Impact/i,
      /Unable to load ATS resume data/i,
    );
    out.hobbiesOffline = await probe(
      '/hobbies/',
      ['**/wp-json/henrys-digital-canvas/v1/moments**', '**/wp-content/themes/henrys-digital-canvas/data/moments.json**'],
      /Hobbies|Key takeaway|Now|Recently|Next/i,
      /Unable to load hobby moments/i,
    );
    out.blogOffline = await probe(
      '/blog/',
      ['**/wp-json/henrys-digital-canvas/v1/blog**', '**/wp-content/themes/henrys-digital-canvas/data/blog-posts-fallback.json**'],
      /Featured|All Posts|Stay updated/i,
      /Unable to load blog posts/i,
    );
  }

  await browser.close();
  return out;
}

async function checkRouteInteractions(target) {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();

  const hobbiesPath = target.name === 'wp' ? '/hobbies/?category=music&timeframe=next' : '/hobbies?category=music&timeframe=next';
  await page.goto(`${target.base}${hobbiesPath}`, { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: 'Dev' }).first().click();
  await page.getByRole('button', { name: 'Recently' }).first().click();
  await page.waitForTimeout(300);
  const hobbiesUrl = page.url();

  const detailPath = target.name === 'wp' ? `/blog/${target.blogSlug}/` : `/blog/${target.blogSlug}`;
  await page.goto(`${target.base}${detailPath}`, { waitUntil: 'networkidle' });
  const progressBefore = await page.evaluate((name) => {
    const sel = name === 'wp' ? '.hdc-blog-post__progress-fill' : '.fixed .bg-primary';
    const el = document.querySelector(sel);
    return el ? (el.getAttribute('style') || '') : '';
  }, target.name);
  await page.evaluate(() => window.scrollTo(0, 6000));
  await page.waitForTimeout(350);
  const progressAfter = await page.evaluate((name) => {
    const sel = name === 'wp' ? '.hdc-blog-post__progress-fill' : '.fixed .bg-primary';
    const el = document.querySelector(sel);
    return el ? (el.getAttribute('style') || '') : '';
  }, target.name);

  let scrollTopVisible = false;
  if (target.name === 'wp') {
    scrollTopVisible = await page.locator('.hdc-blog-post__scroll-top').count() > 0;
    if (scrollTopVisible) {
      await page.click('.hdc-blog-post__scroll-top');
    }
  } else {
    const btn = page.getByRole('button', { name: 'Scroll to top' });
    scrollTopVisible = await btn.count() > 0;
    if (scrollTopVisible) {
      await btn.click();
    }
  }

  await page.goto(`${target.base}${target.name === 'wp' ? '/about/' : '/about'}`, { waitUntil: 'networkidle' });
  const timelineCount = await page.evaluate((name) => {
    if (name === 'wp') return document.querySelectorAll('.hdc-about-timeline__row').length;
    return document.querySelectorAll('.text-year-label').length;
  }, target.name);

  await page.goto(`${target.base}${target.name === 'wp' ? '/about/' : '/about'}`, { waitUntil: 'networkidle' });
  await page.goto(`${target.base}${target.name === 'wp' ? '/route-should-not-exist/' : '/route-should-not-exist'}`, { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: /go back/i }).click();
  await page.waitForTimeout(500);
  const postBackUrl = page.url();
  const notFoundPathText = await page.evaluate((name) => {
    if (name === 'wp') {
      return document.querySelector('.hdc-not-found__path')?.textContent?.trim() || '';
    }
    return document.querySelector('code')?.textContent?.trim() || '';
  }, target.name);

  await page.goto(`${target.base}${target.name === 'wp' ? '/blog/not-a-real-post-slug-12345/' : '/blog/not-a-real-post-slug-12345'}`, { waitUntil: 'networkidle' });
  const missingBlogState = await page.locator('body').innerText();
  await page.goto(`${target.base}${target.name === 'wp' ? '/work/not-a-real-repo-12345/' : '/work/not-a-real-repo-12345'}`, { waitUntil: 'networkidle' });
  const missingWorkState = await page.locator('body').innerText();

  await context.close();
  await browser.close();

  return {
    hobbiesUrl,
    blogProgressChanged: progressBefore !== progressAfter,
    progressBefore,
    progressAfter,
    scrollTopVisible,
    timelineCount,
    postBackUrl,
    notFoundPathText,
    missingBlogHasNotFound: /post not found/i.test(missingBlogState),
    missingWorkHasNotFound: /project not found/i.test(missingWorkState),
  };
}

(async function main() {
  const report = {};
  for (const target of TARGETS) {
    report[target.name] = {
      shell: await checkShell(target),
      offline: await checkOfflineStates(target),
      interactions: await checkRouteInteractions(target),
    };
  }
  console.log(JSON.stringify(report, null, 2));
})();
