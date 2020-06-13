import { ComponentChild, RefObject, createRef, h } from 'preact';
import { PureComponent } from 'preact/compat';
import { route } from 'preact-router';
import { ActionBinder, connect } from 'unistore/preact';
import { ActionMap } from 'unistore';
import firebase from 'firebase/app';
import 'firebase/auth';
import firebaseConfig from '../../config/firebase';
import Alert from '../Alert';
import Loader from '../Loader';
import { AppState } from '../../redux/store';
import { setLoggedIn } from '../../redux/actions';
import API from '../../api';

import './login.scss';

type OwnProps = {};
interface MappedProps {
    loggedIn: boolean | null;
}

interface ActionProps extends ActionMap<AppState> {
    setLoggedIn: typeof setLoggedIn;
}

type Props = OwnProps & MappedProps & ActionBinder<AppState, ActionProps>;

interface State {
    agreed: boolean;
    phone: string;
    code: string;
    state: 'idle' | 'busy' | 'disabled';
    confirmation: firebase.auth.ConfirmationResult | null;
    error: string | null;
}

function isCodeValid(code: string): boolean {
    return /^[0-9]{6}$/.test(code);
}

function isPhoneValid(phone: string): boolean {
    return phone.replace(/[^0-9]/g, '').match(/^[0-9]{9}$/) !== null;
}

class Login extends PureComponent<Props, State> {
    public state: Readonly<State> = {
        agreed: false,
        phone: '',
        code: '',
        state: 'idle',
        confirmation: null,
        error: null,
    };

    private _inputRef: RefObject<HTMLInputElement> = createRef();
    private _buttonRef: RefObject<HTMLButtonElement> = createRef();
    private _verifier?: firebase.auth.RecaptchaVerifier;

    public constructor() {
        super();

        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
            firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE);
            firebase.auth().useDeviceLanguage();
        }
    }

    public componentDidMount(): void {
        if (this._buttonRef.current) {
            this._verifier = new firebase.auth.RecaptchaVerifier(this._buttonRef.current, {
                size: 'invisible',
                callback: (): void => {
                    this._buttonRef.current?.setAttribute('disabled', '');
                },
            });
        }

        this._inputRef.current?.focus();
    }

    public componentDidUpdate(): void {
        this._inputRef.current?.focus();
    }

    private _onAcceptClicked = (e: Event): void => {
        e.preventDefault();
        this.setState(function (prevState: Readonly<State>): Partial<State> {
            return { agreed: !prevState.agreed };
        });
    };

    private _onInputChanged = ({ target }: Event): void => {
        if (target) {
            const { id, value } = target as HTMLInputElement;
            this.setState({ [id]: value });
        }
    };

    private _onCodeFormSubmit = (e: Event): void => {
        e.preventDefault();
        const { code, confirmation } = this.state;
        if (!isCodeValid(code) || !confirmation) {
            return;
        }

        this.setState({ state: 'busy' });
        confirmation
            .confirm(code)
            .then(({ user }: firebase.auth.UserCredential): void => {
                user?.getIdToken().then((idToken: string): void => {
                    API.startSession(idToken).then((res: string): void => {
                        if (res === '+') {
                            firebase
                                .auth()
                                .signOut()
                                .then(() => {
                                    self.location.href = '/search';
                                });
                        } else {
                            let error: string;
                            let state: 'idle' | 'busy' | 'disabled' = 'idle';
                            switch (res) {
                                case 'A':
                                    state = 'disabled';
                                    error =
                                        'Особам, які перебувають на території країни-агресора та окупованих нею територіях, країни, яка фінансує та постачає зброю терористам, доступ до сайту заборонено.';
                                    break;

                                case 'O':
                                    error = 'Вхід дозволено лише з території вільної України';
                                    break;

                                case 'Z':
                                    state = 'disabled';
                                    error =
                                        'Кількість безкоштовних спроб досягнуто. Будь ласка, спробуйте ще раз завтра.';
                                    break;

                                default:
                                    error = 'Не вдалось увійти в систему';
                                    break;
                            }

                            this.setState({
                                error,
                                state,
                                code: '',
                                confirmation: null,
                            });
                        }
                    });
                });
            })
            .catch((e: Error): void => {
                // TODO: use e.code to translate the message
                this.setState({ error: e.message, state: 'idle' });
            });
    };

    private _onPhoneFormSubmit = (e: Event): void => {
        e.preventDefault();
        const { agreed, phone } = this.state;
        if (!isPhoneValid(phone) || !agreed) {
            return;
        }

        const ph = '+380' + phone.replace(/[^0-9]/g, '');

        this.setState({ state: 'busy' });
        firebase
            .auth()
            .signInWithPhoneNumber(ph, this._verifier as firebase.auth.RecaptchaVerifier)
            .then((result: firebase.auth.ConfirmationResult): void => {
                this.setState({ confirmation: result, error: null, state: 'idle' });
            })
            .catch((e: Error): void => {
                this.setState({ state: 'idle', error: e.message });
                this._verifier?.render().then(function (widgetId) {
                    grecaptcha?.reset(widgetId);
                });
            });
    };

    private _onResetClicked = (e: Event): void => {
        e.preventDefault();
        this._verifier?.render().then(function (widgetId) {
            grecaptcha?.reset(widgetId);
        });

        this.setState({
            error: null,
            state: 'idle',
            confirmation: null,
        });
    };

    private _renderPhoneForm(): ComponentChild {
        const { agreed, error, phone, state } = this.state;
        return (
            <form className="block" onSubmit={this._onPhoneFormSubmit}>
                <header className="block__header">Введіть свій номер телефону</header>

                {error && <Alert message={error} />}

                <label for="phone">Телефон:</label>
                <div className="input-group">
                    <div className="input-group-prepend">
                        <span className="input-group-text">+380</span>
                    </div>
                    <input
                        type="tel"
                        placeholder="(XY) ABC-DE-FG"
                        required
                        value={phone}
                        id="phone"
                        className="form-control"
                        onInput={this._onInputChanged}
                        ref={this._inputRef}
                    />
                </div>

                <small>
                    Коли ви торкнетесь опції «Підтвердити», вам може надійти SMS-повідомлення. За SMS і використання
                    трафіку може стягуватися плата за тарифом оператора.
                </small>

                <label>
                    <input type="checkbox" checked={agreed} required onChange={this._onAcceptClicked} /> Я/ми
                    згоден/згодна/згодно/згодни з умовами використання сервису{' '}
                    <a href="https://identigraf.center/terms-of-service" target="_blank" rel="noopener noreferer">
                        (читати)
                    </a>
                </label>

                <button
                    type="submit"
                    disabled={!agreed || !isPhoneValid(phone) || state !== 'idle'}
                    id="signin"
                    ref={this._buttonRef}
                >
                    {state === 'busy' ? 'Перевірка триває…' : 'Підтвердити'}
                </button>
            </form>
        );
    }

    private _renderCodeForm(): ComponentChild {
        const { code, error, phone, state } = this.state;
        return (
            <form className="block" onSubmit={this._onCodeFormSubmit}>
                <header className="block__header">Підтвердьте номер телефону</header>

                {error && <div className="alert">{error}</div>}

                <p>
                    Будь ласка, введіть 6-значний код, який ми надіслали на номер{' '}
                    <a href="#" onClick={this._onResetClicked}>
                        +380{phone.replace(/[^0-9]/g, '')}
                    </a>
                </p>

                <label for="code">Код:</label>
                <input
                    type="number"
                    required
                    id="code"
                    placeholder="000000"
                    max={999999}
                    value={code}
                    onInput={this._onInputChanged}
                    autoComplete="off"
                    ref={this._inputRef}
                />

                <p>
                    <button type="submit" disabled={!isCodeValid(code) || state !== 'idle'}>
                        {state === 'busy' ? 'Перевірка триває…' : 'Продовжити'}
                    </button>{' '}
                    <button type="button" className="cancel" onClick={this._onResetClicked}>
                        Скасувати
                    </button>
                </p>
            </form>
        );
    }

    public render(): ComponentChild {
        const { confirmation } = this.state;

        if (this.props.loggedIn === null) {
            return <Loader />;
        }

        if (this.props.loggedIn === true) {
            route('/search');
        }

        return (
            <section className="loginform">{confirmation ? this._renderCodeForm() : this._renderPhoneForm()}</section>
        );
    }
}

function mapStateToProps(state: AppState): MappedProps {
    return {
        loggedIn: state.loggedIn,
    };
}

export default connect<OwnProps, {}, AppState, MappedProps, ActionProps>(mapStateToProps, { setLoggedIn })(Login);
