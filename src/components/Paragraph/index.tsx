import { type ComponentChildren, h } from 'preact';

interface Props extends h.JSX.HTMLAttributes<HTMLParagraphElement> {
    children?: ComponentChildren;
}

export function Paragraph({ children, className, ...props }: Props): h.JSX.Element {
    className = typeof className !== 'object' ? `mb-3 ${className ?? ''}` : className;
    return (
        <p className={className} {...props}>
            {children}
        </p>
    );
}
