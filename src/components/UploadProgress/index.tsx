import { h } from 'preact';

import './uploadprogress.scss';

interface Props {
    progress: number | null | undefined;
}

export default function UploadProgress({ progress }: Props): h.JSX.Element | null {
    if (progress === null || progress === undefined) {
        return null;
    }

    return (
        <div className="upload-progress">
            Завантаження:
            <progress max={100} value={-1 === progress ? undefined : progress} />
            {progress !== -1 ? <span>{progress.toFixed(2)}%</span> : undefined}
        </div>
    );
}
