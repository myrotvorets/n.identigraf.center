import { ComponentChild, h } from 'preact';
import { PureComponent } from 'preact/compat';

interface State {
    open: boolean;
}

export default class MenuBar extends PureComponent<{}, State> {
    public state: Readonly<State> = {
        open: false,
    };

    private _onMenuOpenClicked = (): void => {
        this.setState(
            (prevState: Readonly<State>): Partial<State> => ({
                open: !prevState.open,
            }),
        );
    };

    private _onMouseLeaveHandler = (): void => {
        this.setState({
            open: false,
        });
    };

    public render(): ComponentChild {
        const { open } = this.state;
        return (
            <nav className="nav" onMouseLeave={this._onMouseLeaveHandler}>
                <label className="nav__btn" onClick={this._onMenuOpenClicked}>
                    <svg width="34" height="34">
                        <path
                            d="M0 28.332h34v-3.777H0zm0-9.441h34v-3.782H0zM0 5.668v3.777h34V5.668"
                            stroke="#FFF"
                            fill="#FFF"
                        />
                    </svg>
                </label>
                <ul className={`nav__menu${open ? ' nav__menu--open' : ''}`}>{this.props.children}</ul>
            </nav>
        );
    }
}
