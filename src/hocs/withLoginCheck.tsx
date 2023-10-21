import { type ComponentType, h } from 'preact';
import { useContext } from 'preact/hooks';
import { route } from 'preact-router';
import { Loader } from '../components/Loader';
import { AppContext } from '../context';

interface Token {
    token: string;
}

export const withLoginCheck = <P extends object>(WrappedComponent: ComponentType<P>): ComponentType<P & Token> =>
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

interface SetToken {
    setToken: (token: string) => void;
}

export const withVisitorCheck = <P extends object>(WrappedComponent: ComponentType<P>): ComponentType<P & SetToken> =>
    function Wrapped({ ...props }: P): h.JSX.Element | null {
        const { user, setUser } = useContext(AppContext)!;
        switch (true) {
            case user === undefined:
                return <Loader />;

            case user === null:
                return <WrappedComponent {...props} setToken={setUser} />;

            default:
                route('/search');
                return null;
        }
    };
