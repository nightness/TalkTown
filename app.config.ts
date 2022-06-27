require('dotenv').config();

export default ({ config }: any) => {
	let newConfig = {
		...config,
		extra: {
            androidClientId: process.env.ANDROID_CLIENT_ID,
            iosClientId: process.env.IOS_CLIENT_ID,
            webClientId: process.env.WEB_CLIENT_ID,
		}        
	};
	return newConfig;
};
