import { type RenderableProps, h } from 'preact';
import './modal.scss';

export function Modal({ children }: RenderableProps<unknown>): h.JSX.Element {
    return (
        <div className="Modal">
            <div className="inner">{children}</div>
        </div>
    );
}
