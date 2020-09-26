import { Component, ComponentChild, RefObject, createRef, h } from 'preact';

import './alert.scss';

interface Props {
    message?: string;
    className?: string;
}

export default class Alert extends Component<Props> {
    private _ref: RefObject<HTMLDivElement> = createRef();

    public componentDidMount(): void {
        if (this.props.message) {
            this._ref.current?.scrollIntoView(true);
        }
    }

    public render(): ComponentChild {
        return (
            <div className={`alert ${this.props.className || ''}`} role="alert" ref={this._ref}>
                {this.props.message ? this.props.message : this.props.children}
            </div>
        );
    }
}
