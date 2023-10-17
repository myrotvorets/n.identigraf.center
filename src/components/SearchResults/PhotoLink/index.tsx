import { h } from 'preact';
import { useCallback } from 'preact/hooks';
import { Text } from '../../Text';

interface Props {
    link: string | null;
    text: string;
    onClick: (link: string) => unknown;
}

export function PhotoLink({ link, text, onClick }: Props): h.JSX.Element | null {
    const onLinkClicked = useCallback(
        (e: h.JSX.TargetedMouseEvent<HTMLAnchorElement>): void => {
            e.preventDefault();
            onClick(e.currentTarget.href);
        },
        [onClick],
    );

    if (link) {
        return (
            <Text>
                <a href={link} target="_blank" rel="noopener noreferrer" onClick={onLinkClicked}>
                    {text}
                </a>
            </Text>
        );
    }

    return null;
}
