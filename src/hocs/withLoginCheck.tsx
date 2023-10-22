import { type ComponentType, h } from 'preact';
import { useContext } from 'preact/hooks';
import { route } from 'preact-router';
import { Loader } from '../components/Loader';
import { AppContext } from '../context';

export const withLoginCheck = <P extends object>(WrappedComponent: ComponentType<P>): ComponentType<P> =>
    function Wrapped({ ...props }: P): h.JSX.Element | null {
        const { token } = useContext(AppContext)!;
        switch (true) {
            case token === undefined:
                return <Loader />;

            case typeof token === 'string':
                return <WrappedComponent {...props} token={token} />;

            default:
                route('/');
                return null;
        }
    };

export const withVisitorCheck = <P extends object>(WrappedComponent: ComponentType<P>): ComponentType<P> =>
    function Wrapped({ ...props }: P): h.JSX.Element | null {
        const { token, setToken, setUserLogin } = useContext(AppContext)!;
        switch (true) {
            case token === undefined:
                return <Loader />;

            case token === null:
                return <WrappedComponent {...props} setToken={setToken} setLogin={setUserLogin} />;

            default:
                route('/search');
                return null;
        }
    };
