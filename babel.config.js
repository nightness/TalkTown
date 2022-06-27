// module.exports = function(api) {
//     api.cache(true);
//     return {
//       presets: ['babel-preset-expo']
//     };
//   };

module.exports = function (api) {
	api.cache(true);
	return {
		presets: ['babel-preset-expo'],
		plugins: [
			'react-native-reanimated/plugin',
			[
				'module-resolver',
				{
					root: ['./src'],
					extensions: ['.ios.ts', '.android.ts', '.ts', '.ios.tsx', '.android.tsx', '.jsx', '.js', '.json'],
					alias: {
						'@app': './src/app',
						'@components': './src/components',						
						'@database': './src/database',
						'@hooks': './src/hooks',
						"@messenger": "./src/messenger",
						"@modals": "./src/modals",
						"@navigation": "./src/navigation",
						'@screens': './src/screens',
						'@shared': './src/shared',
						'@static': './src/static',
						"@webrtc": "./src/webrtc",
					},
				},
			],
		],
	};
};
