import { h } from 'preact';
import { Button } from 'react-bootstrap';

interface Props extends h.JSX.HTMLAttributes {
    progress: number;
}

function progressToText(progress: number): string {
    switch (true) {
        case isNaN(progress):
            return 'Відправити';

        case progress === 100:
            return 'Обробка…';

        case progress > 0:
            return `Вивантаження (${Math.floor(progress)}%)…`;

        default:
            return 'Вивантаження…';
    }
}

export function UploadSubmitButton({ progress }: Readonly<Props>): h.JSX.Element {
    return (
        <Button type="submit" variant="primary">
            {progressToText(progress)}
        </Button>
    );
}
