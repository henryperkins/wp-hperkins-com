const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );
const DependencyExtractionWebpackPlugin = require( '@wordpress/dependency-extraction-webpack-plugin' );
const path = require( 'path' );
const glob = require( 'fast-glob' ); // transitive dep of @wordpress/scripts

// Discover all blocks that have a src/ directory.
const srcFiles = glob.sync( 'blocks/*/src/{index,view}.js', {
	cwd: __dirname,
} );

const entry = {};
for ( const file of srcFiles ) {
	// "blocks/contact-form/src/view.js" -> "blocks/contact-form/build/view"
	const parts = file.split( '/' );
	const blockName = parts[ 1 ];
	const baseName = path.basename( file, '.js' );
	entry[ `blocks/${ blockName }/build/${ baseName }` ] = path.resolve(
		__dirname,
		file
	);
}

// Replace the default DependencyExtractionWebpackPlugin with a custom instance
// that maps hdc-shared-utils imports to the globally enqueued script handle.
const plugins = defaultConfig.plugins.filter(
	( plugin ) => ! ( plugin instanceof DependencyExtractionWebpackPlugin )
);
plugins.push(
	new DependencyExtractionWebpackPlugin( {
		requestToExternal( request ) {
			if ( request === 'hdc-shared-utils' ) {
				return 'hdcSharedUtils';
			}
		},
		requestToHandle( request ) {
			if ( request === 'hdc-shared-utils' ) {
				return 'hdc-shared-utils';
			}
		},
	} )
);

module.exports = {
	...defaultConfig,
	entry,
	output: {
		path: path.resolve( __dirname ),
		filename: '[name].js',
	},
	plugins,
};
