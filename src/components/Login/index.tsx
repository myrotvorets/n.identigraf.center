import { h } from 'preact';
import { route } from 'preact-router';
import { ActionBinder, connect } from 'unistore/preact';
import { ActionMap } from 'unistore';
import Loader from '../Loader';
import { AppState } from '../../redux/store';
import { setUser } from '../../redux/actions';
import EmailForm from './EmailForm';

import './login.scss';

interface MappedProps {
    user: string | null | undefined;
}

interface ActionProps extends ActionMap<AppState> {
    setUser: typeof setUser;
}

type Props = MappedProps & ActionBinder<AppState, ActionProps>;

function Login({ user }: Props): h.JSX.Element | null {
    if (user === undefined) {
        return <Loader />;
    }

    if (user !== null) {
        route('/search');
        return null;
    }

    return (
        <section className="loginform">
            <EmailForm />
        </section>
    );
}

function mapStateToProps(state: AppState): MappedProps {
    return {
        user: state.user,
    };
}

export default connect<unknown, unknown, AppState, MappedProps, ActionProps>(mapStateToProps, {
    setUser,
})(Login);
