const createExpoWebpackConfigAsync = require('@expo/webpack-config');

// Expo CLI will await this method so you can optionally return a promise.
module.exports = async function (env, argv) {
	const config = await createExpoWebpackConfigAsync(env, argv);

	config.performance = {
		hints: false,
		maxEntrypointSize: 512000,
		maxAssetSize: 512000,
	};

	config.optimization = {
		splitChunks: {
			chunks: 'all',
			maxSize: 512000,
			maxAsyncRequests: 50,
			maxInitialRequests: 30,
			minChunks: 1,
			cacheGroups: {
				defaultVendors: {
					test: /[\\/]node_modules[\\/]/,
					priority: -10,
					reuseExistingChunk: true,
				},
				default: {
					minChunks: 2,
					priority: -20,
					reuseExistingChunk: true,
				},
			},
		},
	};

	if (config.mode === 'development') {
		config.devServer.compress = false;
	}

	if (config.mode === 'production') {
		config.optimization.minimize = true;
	}

	// Finally return the new config for the CLI to use.
	return config;
};
