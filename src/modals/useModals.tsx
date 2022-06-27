import { Dimensions } from 'react-native';
import { atom, useRecoilState } from 'recoil';

export enum ModalView {
	HIDDEN = 0,
    LOGOUT = 1,
}

// These two lines are global state but are not exported protecting them from being changed without using useModal
const ModalStack = atom<ModalView[]>({ key: 'ModalStack', default: [ModalView.HIDDEN] });
const CurrentModalView = atom<ModalView>({ key: 'CurrentModalView', default: ModalView.HIDDEN });

// This hook provides a consistent way to access the global state for managing the create modal's view stack
export const useModal = () => {
	const [modalStack, setModalStack] = useRecoilState(ModalStack);
	const [currentView, setCurrentView] = useRecoilState(CurrentModalView);
    const { width, height } = Dimensions.get('window')

    // TODO: Should be able to push props to the newly opening modal.
	const push = (view: ModalView) => {
		setCurrentView(view);
		setModalStack([...modalStack, view]);
	}

	// Returns the new current page after popping the last page off the stack
	const pop = () => {
		if (modalStack.length <= 1) return ModalView.HIDDEN;
		const newResults = modalStack.slice(0, modalStack.length - 1)
		setModalStack(newResults);
		setCurrentView(newResults[newResults.length - 1]);
		return newResults[newResults.length - 1];
	};

	const getParent = () => {
		return modalStack.length > 1 ? modalStack[1] : ModalView.HIDDEN;
	}

	// Replace the current page with the new page
	const replace = (view: ModalView) => {
        if (modalStack.length <= 1) return
		setCurrentView(view);
		setModalStack([...modalStack.slice(0, modalStack.length - 1), view]);
	}
	
	const hide = () => {
		setCurrentView(ModalView.HIDDEN);
		setModalStack([ModalView.HIDDEN]);
	}
	
	return {
		push,
		pop,
		hide,
		replace,
		getParent,
		currentView,
		depth: modalStack.length - 1,
		titleBarHeight: 35,
		modalWidth: Math.min(width * 0.8, 500),
		modalHeight: Math.min(height * 0.8, 700),
	};
};