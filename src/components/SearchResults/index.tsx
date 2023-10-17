import { h } from 'preact';
import { useCallback, useState } from 'preact/hooks';
import { Alert } from 'react-bootstrap';
import { WaitForm } from '../WaitForm';
import API, { type CapturedFace as RecognizedFace, decodeErrorResponse } from '../../api';
import { NoResults } from './NoResults';
import { Results } from './Results';
import { useTimer } from '../../hooks/usetimer';

interface Props {
    guid: string;
}

export default function SearchResults({ guid }: Props): h.JSX.Element {
    const [error, setError] = useState('');
    const [checkInterval, setCheckInterval] = useState<number>(0);
    const [trigger, setTrigger] = useState(0);
    const [capturedFaces, setCapturedFaces] = useState<RecognizedFace[] | null>(null);

    const checkStatus = useCallback((): void => {
        void API.checkSearchStatus(guid).then((r) => {
            if (r.success) {
                if (r.status === 'inprogress') {
                    setTrigger(Date.now());
                    setCheckInterval(3000);
                } else {
                    setCapturedFaces(r.faces);
                }
            } else {
                setError(decodeErrorResponse(r));
            }
        });
    }, [guid]);

    useTimer(checkStatus, checkInterval, trigger);

    if (error) {
        return <Alert variant="danger">{error}</Alert>;
    }

    if (capturedFaces === null) {
        return <WaitForm />;
    }

    if (capturedFaces.length === 0) {
        return <NoResults />;
    }

    return <Results guid={guid} capturedFaces={capturedFaces} />;
}
