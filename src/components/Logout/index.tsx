import { h } from 'preact';
import { ActionBinder, connect } from 'unistore/preact';
import { ActionMap } from 'unistore';
import { route } from 'preact-router';
import { getAuth } from 'firebase/auth';
import Bugsnag from '@bugsnag/js';
import { setUser } from '../../redux/actions';
import { AppState } from '../../redux/store';
import Loader from '../../components/Loader';

type OwnProps = unknown;
type MappedProps = unknown;

interface ActionProps extends ActionMap<AppState> {
    setUser: typeof setUser;
}

type Props = OwnProps & MappedProps & ActionBinder<AppState, ActionProps>;

function LogoutRoute(props: Props): h.JSX.Element {
    const { setUser } = props; // NOSONAR

    getAuth()
        .signOut()
        .then(() => {
            setUser(null);
            return route('/');
        })
        .catch((e: Error) => {
            Bugsnag.notify(e);
            route('/');
        });

    return <Loader />;
}

export default connect<OwnProps, unknown, AppState, MappedProps, ActionProps>('', { setUser })(LogoutRoute);
