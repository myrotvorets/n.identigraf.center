import { type ComponentChildren, h } from 'preact';

interface Props extends h.JSX.HTMLAttributes<HTMLParagraphElement> {
    children?: ComponentChildren;
}

export function Text({ children, className, ...props }: Props): h.JSX.Element {
    className = typeof className !== 'object' ? `mb-1 ${className ?? ''}` : className;
    return (
        <p className={className} {...props}>
            {children}
        </p>
    );
}
