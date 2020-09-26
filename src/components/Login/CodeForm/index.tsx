import { Component, ComponentChild, RefObject, createRef, h } from 'preact';

interface Props {
    phone: string;
    error: string | null;
    state: 'idle' | 'busy';
    onReset: () => unknown;
    onCodeSubmit: (code: string) => unknown;
}

interface State {
    code: string;
}

export default class CodeForm extends Component<Props> {
    private static isCodeValid(code: string): boolean {
        return /^[0-9]{6}$/.test(code);
    }

    public state: Readonly<State> = {
        code: '',
    };

    private _inputRef: RefObject<HTMLInputElement> = createRef();

    public componentDidMount(): void {
        this._inputRef.current?.focus();
    }

    public componentDidUpdate(): void {
        this._inputRef.current?.focus();
    }

    private _onResetClicked = (e: Event): void => {
        e.preventDefault();
        this.props.onReset();
    };

    private _onCodeFormSubmit = (e: Event): void => {
        e.preventDefault();
        this.props.onCodeSubmit(this.state.code);
    };

    private _onInputChanged = ({ currentTarget }: h.JSX.TargetedEvent<HTMLInputElement>): void => {
        const { value } = currentTarget;
        this.setState({ code: value });
    };

    public render(): ComponentChild {
        const { error, phone, state } = this.props;
        const { code } = this.state;
        return (
            <form className="block" onSubmit={this._onCodeFormSubmit}>
                <header className="block__header">Підтвердьте номер телефону</header>

                {error && <div className="alert">{error}</div>}

                <p>
                    Будь ласка, введіть 6-значний код, який ми надіслали на номер{' '}
                    {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                    <a href="#" onClick={this._onResetClicked} role="button">
                        +380{phone.replace(/[^0-9]/g, '')}
                    </a>
                </p>

                <label htmlFor="code">Код:</label>
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
                    <button type="submit" disabled={!CodeForm.isCodeValid(code) || state !== 'idle'}>
                        {state === 'busy' ? 'Перевірка триває…' : 'Продовжити'}
                    </button>{' '}
                    <button type="button" className="cancel" onClick={this._onResetClicked}>
                        Скасувати
                    </button>
                </p>
            </form>
        );
    }
}
