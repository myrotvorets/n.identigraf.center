import { type ComponentType, type RenderableProps, h } from 'preact';
import { Suspense } from 'preact/compat';
import { Loader } from '../components/Loader';

export function suspenseWrapper<T>(C: ComponentType<T>): (props: RenderableProps<T>) => h.JSX.Element {
    if (process.env.BUILD_SSR) {
        return function SuspenseWrapper(props: RenderableProps<T>): h.JSX.Element {
            return <C {...props} />;
        };
    }

    return function SuspenseWrapper(props: RenderableProps<T>): h.JSX.Element {
        return (
            <Suspense fallback={<Loader />}>
                <C {...props} />
            </Suspense>
        );
    };
}
