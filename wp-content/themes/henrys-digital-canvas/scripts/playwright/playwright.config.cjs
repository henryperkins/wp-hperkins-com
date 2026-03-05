const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
	testDir: __dirname,
	timeout: 90000,
	retries: 0,
	workers: 1,
	reporter: 'line',
	use: {
		baseURL: process.env.BASE_URL || 'https://wp.hperkins.com',
		headless: true,
		viewport: {
			width: 1280,
			height: 900,
		},
		ignoreHTTPSErrors: true,
	},
});
