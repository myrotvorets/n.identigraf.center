/* eslint-disable @typescript-eslint/ban-types */
import { ComponentConstructor, ComponentType, h } from 'preact';
import { connect } from 'unistore/preact';
import { route } from 'preact-router';
import type { AppState } from '../redux/store';
import Loader from '../components/Loader';

type UserState = 'unknown' | 'visitor' | 'user';

interface MappedProps {
    state: UserState;
    user: string | null | undefined;
}

function mapStateToProps({ user }: AppState): MappedProps {
    let s: UserState;
    if (user === undefined) {
        s = 'unknown';
    } else if (user === null) {
        s = 'visitor';
    } else {
        s = 'user';
    }

    return {
        state: s,
        user,
    };
}

export const withLoginCheck = <P extends object>(
    WrappedComponent: ComponentType<P>,
): ComponentConstructor<P, unknown> =>
    connect<P, unknown, AppState, MappedProps>(mapStateToProps)(
        ({ state, ...props }: P & MappedProps): h.JSX.Element | null => {
            switch (state) {
                case 'unknown':
                    return <Loader />;

                case 'user':
                    return <WrappedComponent {...(props as P)} />;

                default:
                    route('/');
                    return null;
            }
        },
    );

export const withVisitorCheck = <P extends object>(
    WrappedComponent: ComponentType<P>,
): ComponentConstructor<P, unknown> =>
    connect<P, unknown, AppState, MappedProps>(mapStateToProps)(
        ({ state, ...props }: P & MappedProps): h.JSX.Element | null => {
            switch (state) {
                case 'unknown':
                    return <Loader />;

                case 'visitor':
                    return <WrappedComponent {...(props as P)} />;

                default:
                    route('/search');
                    return null;
            }
        },
    );
