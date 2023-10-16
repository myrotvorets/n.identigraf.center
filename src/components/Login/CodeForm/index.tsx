import { Component, ComponentChild, RefObject, createRef, h } from 'preact';
import { route } from 'preact-router';
import type { ActionMap } from 'unistore';
import { ActionBinder, connect } from 'unistore/preact';
import API, { decodeErrorResponse } from '../../../api';
import { AppState } from '../../../redux/store';
import { setUser } from '../../../redux/actions';
import { lsSet } from '../../../utils/localstorage';

interface ActionProps extends ActionMap<AppState> {
    setUser: typeof setUser;
}

interface OwnProps {
    email: string;
    onReset: () => unknown;
    onIssues: () => unknown;
}

type Props = ActionBinder<AppState, ActionProps> & OwnProps;

interface State {
    code: string;
    state: 'idle' | 'busy';
    error: string | null;
}

class CodeForm extends Component<Props, State> {
    private static isCodeValid(code: string): boolean {
        return /^\d{6}$/u.test(code);
    }

    public state: Readonly<State> = {
        code: '',
        state: 'idle',
        error: null,
    };

    private readonly _inputRef: RefObject<HTMLInputElement> = createRef();

    public componentDidMount(): void {
        this._inputRef.current?.focus();
    }

    public componentDidUpdate(): void {
        this._inputRef.current?.focus();
    }

    private readonly _onResetClicked = (e: Event): void => {
        e.preventDefault();
        this.props.onReset();
    };

    private readonly _onCodeFormSubmit = async (e: Event): Promise<void> => {
        e.preventDefault();

        const verifyResult = await API.verifyCode(this.props.email, this.state.code);
        if (!verifyResult.success) {
            this.setState({
                error: decodeErrorResponse(verifyResult),
                state: 'idle',
                code: '',
            });

            return;
        }

        const { token } = verifyResult;

        const r = await API.login(token);
        if (r.success) {
            lsSet('token', token);
            this.props.setUser(token);
            route('/search');
        } else {
            this.setState({
                error: decodeErrorResponse(r),
                state: 'idle',
                code: '',
            });
        }
    };

    private readonly _onInputChanged = ({ currentTarget }: h.JSX.TargetedEvent<HTMLInputElement>): void => {
        const { value } = currentTarget;
        this.setState({ code: value });
    };

    public render(): ComponentChild {
        const { email, onIssues } = this.props;
        const { code, error, state } = this.state;
        return (
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            <form className="block" onSubmit={this._onCodeFormSubmit}>
                <header className="block__header">Підтвердьте вашу адресу електронної пошти</header>

                {error && <div className="alert">{error}</div>}

                <p>
                    Будь ласка, введіть 6-значний код, який ми надіслали на{' '}
                    {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                    <a href="#" onClick={this._onResetClicked} role="button">
                        {email}
                    </a>
                </p>

                <label htmlFor="code" for="code">
                    Код:
                </label>
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

                <p>
                    <button type="button" onClick={onIssues} className="link">
                        Проблеми з отриманням електронних листів?
                    </button>
                </p>
            </form>
        );
    }
}

function mapStateToProps(state: AppState): Partial<AppState> {
    return state;
}

export default connect<OwnProps, unknown, AppState, unknown, ActionProps>(mapStateToProps, {
    setUser,
})(CodeForm);
