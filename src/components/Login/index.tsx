import { Component, ComponentChild, h } from 'preact';
import { route } from 'preact-router';
import { ActionBinder, connect } from 'unistore/preact';
import firebase from 'firebase/app';
import { ActionMap } from 'unistore';
import Loader from '../Loader';
import { AppState } from '../../redux/store';
import { setUser } from '../../redux/actions';
import API, { decodeErrorResponse, decodeFirebaseError } from '../../api';
import CodeForm from './CodeForm';
import PhoneForm from './PhoneForm';

import './login.scss';

type OwnProps = unknown;
interface MappedProps {
    user: firebase.User | null | undefined;
}

interface ActionProps extends ActionMap<AppState> {
    setUser: typeof setUser;
}

type Props = OwnProps & MappedProps & ActionBinder<AppState, ActionProps>;

interface State {
    agreed: boolean;
    phone: string;
    code: string;
    state: 'idle' | 'busy';
    confirmation: firebase.auth.ConfirmationResult | null;
    error: string | null;
}

class Login extends Component<Props, State> {
    public state: Readonly<State> = {
        agreed: false,
        phone: '',
        code: '',
        state: 'idle',
        confirmation: null,
        error: null,
    };

    private _onCodeFormSubmit = async (code: string): Promise<void> => {
        const { confirmation } = this.state;
        if (!confirmation) {
            return;
        }

        this.setState({ state: 'busy' });
        try {
            const { user } = await confirmation.confirm(code);
            const idToken = (await user?.getIdToken()) || '';
            const r = await API.login(idToken);
            if (r.success) {
                route('/search');
            } else {
                this.setState({
                    error: decodeErrorResponse(r),
                    state: 'idle',
                    code: '',
                    confirmation: null,
                });
            }
        } catch (e) {
            this.setState({ error: decodeFirebaseError(e.code, e.message), state: 'idle' });
        }
    };

    private _onPhoneFormSubmit = async (phone: string, verifier: firebase.auth.RecaptchaVerifier): Promise<void> => {
        const ph = `+380${phone.replace(/[^0-9]/g, '')}`;

        this.setState({ state: 'busy', phone });
        const response = await API.checkPhone(ph);
        if (response.success) {
            try {
                const result = await firebase.auth().signInWithPhoneNumber(ph, verifier);
                this.setState({ confirmation: result, error: null, state: 'idle' });
            } catch (e) {
                this.setState({ state: 'idle', error: decodeFirebaseError(e.code, e.message) });
                // eslint-disable-next-line no-undef
                verifier.render().then((widgetId) => grecaptcha?.reset(widgetId));
            }
        } else {
            this.setState({
                error: decodeErrorResponse(response),
                state: 'idle',
            });
        }
    };

    private _onResetCodeForm = (): void => {
        this.setState({
            error: null,
            state: 'idle',
            confirmation: null,
        });
    };

    public render(): ComponentChild {
        const { confirmation, error, phone, state } = this.state;

        if (this.props.user === undefined) {
            return <Loader />;
        }

        if (this.props.user !== null) {
            route('/search');
            return null;
        }

        return (
            <section className="loginform">
                {confirmation ? (
                    <CodeForm
                        error={error}
                        phone={phone}
                        state={state}
                        onReset={this._onResetCodeForm}
                        onCodeSubmit={this._onCodeFormSubmit}
                    />
                ) : (
                    <PhoneForm error={error} state={state} onPhoneSubmit={this._onPhoneFormSubmit} />
                )}
            </section>
        );
    }
}

function mapStateToProps(state: AppState): MappedProps {
    return {
        user: state.user,
    };
}

export default connect<OwnProps, State, AppState, MappedProps, ActionProps>(mapStateToProps, {
    setUser,
})(Login);
