import { h } from 'preact';
import { useCallback, useState } from 'preact/hooks';
import { Alert } from 'react-bootstrap';
import { NoResults } from './NoResults';
import { Results } from './Results';
import { WaitForm } from '../WaitForm';
import API, { decodeErrorResponse } from '../../api';
import { useTimer } from '../../hooks/usetimer';

interface Props {
    guid: string;
}

export function CompareResults({ guid }: Readonly<Props>): h.JSX.Element {
    const [error, setError] = useState('');
    const [checkInterval, setCheckInterval] = useState<number>(0);
    const [trigger, setTrigger] = useState(0);
    const [results, setResults] = useState<Record<string, number>>({});
    const [done, setDone] = useState(false);

    const checkStatus = useCallback(() => {
        void API.checkCompareStatus(guid).then((r) => {
            if (r.success) {
                if (r.status === 'inprogress') {
                    setTrigger(Date.now());
                    setCheckInterval(3000);
                } else {
                    if (r.status === 'complete') {
                        setResults(r.matches);
                    }

                    setDone(true);
                }
            } else {
                setError(decodeErrorResponse(r));
            }

            return null;
        });
    }, [guid]);

    useTimer(checkStatus, checkInterval, trigger);

    if (error) {
        return <Alert variant="danger">{error}</Alert>;
    }

    if (!done) {
        return <WaitForm />;
    }

    if (Object.keys(results).length === 0) {
        return <NoResults />;
    }

    return <Results guid={guid} results={results} />;
}
