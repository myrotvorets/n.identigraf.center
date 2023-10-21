import { type ComponentChildren, h } from 'preact';
import { Card } from 'react-bootstrap';

interface Props extends h.JSX.HTMLAttributes<HTMLElement> {
    children: ComponentChildren;
}

export function CardHeader({ children, className, ...attrs }: Readonly<Props>): h.JSX.Element {
    className = typeof className !== 'object' ? `text-bg-primary ${className ?? ''}` : className;
    return (
        <Card.Header as="header" className={className} {...attrs}>
            <h2 className="my-0 h5">{children}</h2>
        </Card.Header>
    );
}
