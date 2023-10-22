import { type ComponentType, h } from 'preact';
import { useContext } from 'preact/hooks';
import { route } from 'preact-router';
import { Loader } from '../components/Loader';
import { AppContext } from '../context';

export const withLoginCheck = <P extends object>(WrappedComponent: ComponentType<P>): ComponentType<P> =>
    function Wrapped({ ...props }: P): h.JSX.Element | null {
        const { user } = useContext(AppContext)!;
        switch (true) {
            case user === undefined:
                return <Loader />;

            case typeof user === 'string':
                return <WrappedComponent {...props} token={user} />;

            default:
                route('/');
                return null;
        }
    };

export const withVisitorCheck = <P extends object>(WrappedComponent: ComponentType<P>): ComponentType<P> =>
    function Wrapped({ ...props }: P): h.JSX.Element | null {
        const { user, setUser, setUserLogin } = useContext(AppContext)!;
        switch (true) {
            case user === undefined:
                return <Loader />;

            case user === null:
                return <WrappedComponent {...props} setToken={setUser} setLogin={setUserLogin} />;

            default:
                route('/search');
                return null;
        }
    };
