/*
	Purpose: A general purpose async hook
	Author: nightness (GitHub)
*/

/* Example:

	const [ status, error, result ] = useAsync(async () => {
		const result = await fetch('https://swapi.dev/api/people/-1');
		if (result.status !== 200 || result.ok === false) {
			console.log('error', result);
			throw new Error(`Status ${result.status}`);
		}
		return await result.json();
	}, [count]);

*/

import React, { DependencyList, useEffect, useRef, useState } from 'react';

export enum AsyncState {
	Pending = 'Pending',
	Rejected = 'Rejected',
	Fulfilled = 'Fulfilled',
}

type AsyncFunction<T> = () => Promise<T>;

export const useAsync = (
	asyncFunction: AsyncFunction<any>,
	dependenceList?: DependencyList
) => {
	const status = useRef<AsyncState>(AsyncState.Pending);
	const [result, setResult] = useState(null);
	const [error, setError] = useState<any>(null);

	useEffect(() => {
		status.current = AsyncState.Pending;
		setResult(null);
		setError(null);
		asyncFunction()
			.then((result) => {
				status.current = AsyncState.Fulfilled;
				setResult(result);
			})
			.catch((err) => {
				status.current = AsyncState.Rejected;
				setError(err);
			});
	}, dependenceList);

	return [ status.current, error, result ];
};

export default useAsync;
