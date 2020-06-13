import { ComponentChild, h } from 'preact';
import { PureComponent } from 'preact/compat';

export default class MenuItem extends PureComponent {
    public render(): ComponentChild {
        return <li className="nav__menuitem">{this.props.children}</li>;
    }
}
