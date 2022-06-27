import React from 'react';
import { View, Text } from 'react-native';

import { useModal } from '@modals';

const getTitle = (view: any) => {
	let title = '';
	// switch (view) {
	// 	case ShowCreateModalView.CREATE_RECOMMEND:
	// 		title = 'Recommend';
	// 		break;
	// 	case ShowCreateModalView.CREATE_LIST:
	// 		title = 'Create List';
	// 		break;
	// 	case ShowCreateModalView.CREATE_REVIEW:
	// 		title = 'Review';
	// 		break;
	// 	case ShowCreateModalView.ADD_MEDIA:
	// 		title = 'Find Media';
	// 		break;
	// 	case ShowCreateModalView.ADD_FRIENDS:
	// 		title = 'Add Recipients';
	// 		break;
	// }
	return title;
};

export const ModalHeader = ({}) => {
	const { getParent, currentView, modalWidth, titleBarHeight } = useModal();

	let title = getTitle(getParent());
	let titleCurrentView = getTitle(currentView);

	return (
		<View
			// style={ss([
			// 	`h_${titleBarHeight}`,
			// 	`w_${modalWidth}`,
			// 	'bc_secondary',
			// 	'fullWidth',
			// 	'a_start',
			// 	'j_center',
			// 	'pt_5',
			// 	'pb_10',
			// 	'pl_10',
			// 	'pt_10',
			// 	'btlr_8',
			// 	'btrr_8',
			// ])}
		>
			{/* <View style={{ borderBottomWidth: 0.5, borderBottomColor: Colors.WHITE, height: '100%' }}> */}
			<Text
				// style={ss(['fs_16', 'c_theme'])}
			>
				{title}
				{title !== titleCurrentView ? `: ${titleCurrentView}` : ''}
			</Text>
			{/* </View> */}
		</View>
	);
};

export default ModalHeader;
