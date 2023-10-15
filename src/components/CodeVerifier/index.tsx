import { Component, ComponentChild, h } from 'preact';
import { Link, route } from 'preact-router';
import { signInWithEmailLink } from 'firebase/auth';
import { withVisitorCheck } from '../../hocs/withLoginCheck';
import Alert from '../Alert';
import { auth } from '../../config/firebase';
import API, { FirebaseError, decodeErrorResponse, decodeFirebaseError } from '../../api';

interface OwnProps {
    link: string;
    email: string;
}

interface MappedProps {
    worker?: Worker;
}

type Props = OwnProps & MappedProps;

interface State {
    email: string;
    error: string;
    busy: boolean;
    emailValid: boolean;
}

class CodeVerifier extends Component<Props, State> {
    public state: Readonly<State> = {
        email: this.props.email,
        error: '',
        busy: this.props.email.length > 0,
        emailValid: this.props.email.length > 0,
    };

    public componentDidMount(): void {
        if (this.state.email) {
            void this._signIn();
        }
    }

    private readonly _onEmailUpdate = ({ currentTarget }: h.JSX.TargetedEvent<HTMLInputElement>): void => {
        const { value } = currentTarget;
        this.setState({
            email: value,
            emailValid: currentTarget.checkValidity(),
        });
    };

    private readonly _onFormSubmit = (e: h.JSX.TargetedEvent<HTMLFormElement>): void => {
        e.preventDefault();
        void this._signIn();
    };

    private async _signIn(): Promise<void> {
        const { link } = this.props;
        const { email } = this.state;

        this.setState({ busy: true });

        try {
            await signInWithEmailLink(auth, email, link);
            window.localStorage.removeItem('email');

            const idToken = await auth.currentUser?.getIdToken();
            const r = await API.login(idToken!);
            if (r.success) {
                route('/search');
            } else {
                this.setState({
                    error: decodeErrorResponse(r),
                    busy: false,
                });
            }
        } catch (e) {
            this.setState({
                error: decodeFirebaseError((e as FirebaseError).code, (e as FirebaseError).message),
                busy: false,
            });
        }
    }

    public render(): ComponentChild {
        const { busy, email, emailValid, error } = this.state;

        if (error) {
            return (
                <Alert>
                    <p>{error}</p>
                    <p>
                        <Link href="/">Повернутись</Link>
                    </p>
                </Alert>
            );
        }

        return (
            <form className="block block--centered" onSubmit={this._onFormSubmit}>
                <header className="block__header">Перевірка електронної адреси</header>

                <label htmlFor="email" className="required">
                    Електронна адреса:
                </label>
                <input
                    type="email"
                    id="email"
                    required
                    value={email}
                    onInput={this._onEmailUpdate}
                    disabled={this.props.email.length > 0}
                />

                <div className="button-container">
                    <button type="submit" disabled={busy || !emailValid}>
                        {busy ? 'Перевірка…' : 'Перевірити'}
                    </button>
                </div>
            </form>
        );
    }
}

export default withVisitorCheck(CodeVerifier);
