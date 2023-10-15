import { Component, ComponentChild, RefObject, createRef, h } from 'preact';
import { RecaptchaVerifier } from 'firebase/auth';
import Alert from '../../Alert';
import { auth } from '../../../config/firebase';

interface Props {
    error: string | null;
    state: 'idle' | 'busy';
    onPhoneSubmit: (phone: string, verifier: RecaptchaVerifier, widgetId: number) => unknown;
}

interface State {
    agreed: boolean;
    phone: string;
}

export default class PhoneForm extends Component<Props, State> {
    private static isPhoneValid(phone: string): boolean {
        return /^\d{9}$/u.exec(phone.replace(/\D/gu, '')) !== null;
    }

    public state: Readonly<State> = {
        agreed: false,
        phone: '',
    };

    private readonly _buttonRef: RefObject<HTMLButtonElement> = createRef();
    private readonly _inputRef: RefObject<HTMLInputElement> = createRef();
    private _verifier?: RecaptchaVerifier;
    private _widgetId?: number;

    public async componentDidMount(): Promise<void> {
        this._inputRef.current?.focus();
        if (this._buttonRef.current) {
            this._verifier = new RecaptchaVerifier(auth, this._buttonRef.current, {
                size: 'invisible',
                callback: (): void => {
                    this._onPhoneFormSubmit();
                },
            });
            this._widgetId = await this._verifier.render();
        } else {
            throw new Error('_buttonRef.current is null');
        }
    }

    public componentDidUpdate(): void {
        this._inputRef.current?.focus();
    }

    private readonly _onAcceptClicked = (e: Event): void => {
        e.preventDefault();
        this.setState((prevState: Readonly<State>): Partial<State> => ({ agreed: !prevState.agreed }));
    };

    private readonly _onInputChanged = ({ currentTarget }: h.JSX.TargetedEvent<HTMLInputElement>): void => {
        const { value } = currentTarget;
        this.setState({ phone: value });
    };

    private readonly _onPhoneFormSubmit = (e?: Event): void => {
        e?.preventDefault();
        const { agreed, phone } = this.state;
        if (agreed && PhoneForm.isPhoneValid(phone)) {
            this.props.onPhoneSubmit(phone, this._verifier!, this._widgetId!);
        }
    };

    public render(): ComponentChild {
        const { error, state } = this.props;
        const { agreed, phone } = this.state;
        return (
            <form className="block" onSubmit={this._onPhoneFormSubmit}>
                <header className="block__header">Введіть свій номер телефону</header>

                {error && <Alert message={error} />}

                <label htmlFor="phone" for="phone">
                    Телефон:
                </label>
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
                    <input type="checkbox" checked={agreed} required onChange={this._onAcceptClicked} /> Я висловлюю
                    згоду з умовами використання сервису{' '}
                    <a href="https://identigraf.center/terms-of-service" target="_blank" rel="noopener noreferrer">
                        (читати)
                    </a>
                </label>

                <button
                    type="submit"
                    disabled={!agreed || !PhoneForm.isPhoneValid(phone) || state !== 'idle'}
                    id="signin"
                    ref={this._buttonRef}
                >
                    {state === 'busy' ? 'Перевірка триває…' : 'Підтвердити'}
                </button>
            </form>
        );
    }
}
