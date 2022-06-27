import { Platform } from 'react-native';

export const getPlatform = () => {
	const isAndroid =
		Platform.OS === 'android' ||
		(Platform.OS === 'web' &&
			(/Android/i.test(navigator.userAgent) ||
				/Android/i.test(navigator.platform)));

	const isApple =
		Platform.OS === 'ios' ||
		(Platform.OS === 'web' &&
			(/iPhone|iPad|iPod/i.test(navigator.userAgent) ||
				/iPhone|iPad|iPod/i.test(navigator.platform)));

	const isMobile =
		isApple ||
		isAndroid ||
		(Platform.OS === 'web' &&
			(/webOS|BlackBerry/i.test(navigator.userAgent) ||
				/webOS|BlackBerry/i.test(navigator.platform)));

	return {
		isMobile,
		isAndroid,
		isApple,
        isDesktop: !isMobile
	};
};
