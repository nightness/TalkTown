import { useEffect, useRef } from 'react';

export const useRenderCount = () => {
    const count = useRef(0);
    useEffect(() => { count.current++ });
    return count.current;
};
