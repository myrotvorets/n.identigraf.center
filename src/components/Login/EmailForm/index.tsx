import { Component, ComponentChild, RefObject, createRef, h } from 'preact';
import Alert from '../../Alert';
import CodeForm from '../CodeForm';
import API, { decodeErrorResponse } from '../../../api';
import EmailTroubles from '../EmailTroubles';

interface State {
    error: string | null;
    state: 'initial' | 'sending' | 'link_sent' | 'troubles';
    email: string;
    emailValid: boolean | undefined;
}

export default class EmailForm extends Component<unknown, State> {
    public state: Readonly<State> = {
        error: '',
        state: 'initial',
        email: '',
        emailValid: undefined,
    };

    private readonly _inputRef: RefObject<HTMLInputElement> = createRef();

    public componentDidMount(): void {
        this._inputRef.current?.focus();
    }

    public componentDidUpdate(): void {
        this._inputRef.current?.focus();
    }

    private readonly _onFormSubmit = (e: Event): void => {
        e.preventDefault();
        const { state, email, emailValid } = this.state;

        if (state !== 'sending' && emailValid) {
            void this._sendConfirmationLink(email);
        }
    };

    private readonly _emailUpdateHandler = ({ currentTarget }: h.JSX.TargetedEvent<HTMLInputElement>): void => {
        const { value } = currentTarget;
        this.setState({
            email: value,
            emailValid: currentTarget.checkValidity(),
        });
    };

    private readonly _backButtonClickHandler = (): void => {
        this.setState({ state: 'link_sent' });
    };

    private readonly _resetButtonClickHandler = (): void => {
        this.setState({ state: 'initial', email: '', emailValid: false });
    };

    private readonly _issuesButtonClickHandler = (): void => {
        this.setState({ state: 'troubles' });
    };

    private readonly _retryClickHandler = (): void => {
        const { email } = this.state;
        void this._sendConfirmationLink(email);
    };

    private async _sendConfirmationLink(email: string): Promise<void> {
        this.setState({ state: 'sending' });

        const response = await API.checkPhone(email);
        if (response.success) {
            const result = await API.sendCode(email);
            if (result === true) {
                this.setState({ state: 'link_sent' });
            } else {
                this.setState({
                    error: decodeErrorResponse(result),
                    state: 'initial',
                });
            }
        } else {
            this.setState({
                error: decodeErrorResponse(response),
                state: 'initial',
                email,
            });
        }
    }

    private _renderLoginForm(): ComponentChild {
        const { email, emailValid, error, state } = this.state;
        return (
            <form className="block" onSubmit={this._onFormSubmit}>
                <header className="block__header">Увійти</header>

                {error && <Alert message={error} />}

                <label htmlFor="email" className="required">
                    Електронна адреса<span className="sr-only"> (обов'язкове поле)</span>:
                </label>
                <input
                    type="email"
                    id="email"
                    required
                    value={email}
                    onChangeCapture={this._emailUpdateHandler}
                    aria-invalid={emailValid !== undefined ? `${!emailValid}` : undefined}
                    aria-describedby={emailValid !== false ? undefined : 'email-error'}
                    ref={this._inputRef}
                />
                {emailValid === false && <div id="email-error">Невірна адреса електронної пошти.</div>}

                <div className="button-container">
                    <button type="submit" aria-disabled={state === 'sending' || !emailValid ? 'true' : 'false'}>
                        {state !== 'sending' ? 'Далі…' : 'Відправлення посилання…'}
                    </button>
                </div>
            </form>
        );
    }

    public render(): ComponentChild {
        const { email, state } = this.state;

        switch (state) {
            case 'initial':
            case 'sending':
                return this._renderLoginForm();

            case 'troubles':
                return (
                    <EmailTroubles
                        onBackClicked={this._backButtonClickHandler}
                        onRetryClicked={this._retryClickHandler}
                    />
                );

            case 'link_sent':
                return (
                    <CodeForm
                        onIssues={this._issuesButtonClickHandler}
                        onReset={this._resetButtonClickHandler}
                        email={email}
                    />
                );

            default:
                return null;
        }
    }
}
