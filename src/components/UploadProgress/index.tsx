import { h } from 'preact';

interface Props {
    progress: number;
}

export function UploadProgress({ progress }: Readonly<Props>): h.JSX.Element | null {
    if (isNaN(progress)) {
        return null;
    }

    return (
        <div className="d-flex align-items-center mb-3">
            Завантаження:{' '}
            <progress max={100} value={-1 === progress ? undefined : progress} className="flex-grow-1 ms-1" />{' '}
            {progress !== -1 ? <span className="ms-1">{progress.toFixed(2)}%</span> : undefined}
        </div>
    );
}
