module.exports = {
	extends: [ 'plugin:@wordpress/eslint-plugin/recommended' ],
	settings: {
		'import/resolver': {
			node: {
				extensions: [ '.js', '.jsx' ],
			},
		},
	},
	rules: {
		'import/no-unresolved': [
			'error',
			{
				ignore: [ '^@wordpress/', '^hdc-shared-utils$' ],
			},
		],
		'import/no-extraneous-dependencies': 'off',
	},
};
