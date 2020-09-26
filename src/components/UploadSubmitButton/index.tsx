import { h } from 'preact';

interface Props extends h.JSX.HTMLAttributes {
    progress: number | null;
}

export default function UploadSubmitButton({ progress, disabled }: Props): h.JSX.Element {
    return (
        <button type="submit" disabled={disabled}>
            {progress !== null
                ? progress === 100
                    ? 'Обробка…'
                    : progress > 0
                    ? `Вивантаження (${Math.floor(progress)}%)…`
                    : 'Вивантаження…'
                : 'Відправити'}
        </button>
    );
}
