// A hook that returns a ref to the component and the instantiated JSX.Element.
// It accepts one parameter, a function that returns an instantiated JSX.Element and is passed the ref.

// Example
// const [view, ref] = useComponentRef<View>(((ref) =>
//		<View ref={ref} style={{ backgroundColor: 'black', zIndex: 10000, width: '100%', height: '100%' }} />
// ))
// return <>{view}</>;

import React, { useRef } from 'react';

type InstantiateFunction<T> = (ref: React.MutableRefObject<T>) => JSX.Element;

export function useComponentRef<RefType>(
	instantiate: InstantiateFunction<RefType>,
): [JSX.Element, React.MutableRefObject<RefType>] {
	// Create a ref of type RefType
	const ref = useRef<RefType>();
	// Then pass that ref to the instantiate function
	const component = instantiate(ref as any);
	// Return the ref and the instantiated component
	return [component, ref as React.MutableRefObject<RefType>];
}
