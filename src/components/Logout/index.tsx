import { ActionBinder, connect } from 'unistore/preact';
import { ActionMap } from 'unistore';
import { route } from 'preact-router';
import { setUser } from '../../redux/actions';
import { AppState } from '../../redux/store';

type OwnProps = unknown;
type MappedProps = unknown;

interface ActionProps extends ActionMap<AppState> {
    setUser: typeof setUser;
}

type Props = OwnProps & MappedProps & ActionBinder<AppState, ActionProps>;

function LogoutRoute(props: Props): null {
    const { setUser } = props; // NOSONAR

    setUser(null);
    route('/');
    return null;
}

export default connect<OwnProps, unknown, AppState, MappedProps, ActionProps>('', { setUser })(LogoutRoute);
