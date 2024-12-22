import { useEffect, useRef } from 'preact/hooks';
import { useIsomorphicLayoutEffect } from './useisomorphiclayouteffect';

export const useTimer = (callback: () => void, delay: number | undefined, trigger: unknown): void => {
    const savedCallback = useRef(callback);

    useIsomorphicLayoutEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    useEffect(() => {
        if (delay === undefined) {
            return undefined;
        }

        const timerId = self.setTimeout(savedCallback.current, delay);
        return (): void => {
            self.clearTimeout(timerId);
        };
    }, [delay, trigger]);
};
