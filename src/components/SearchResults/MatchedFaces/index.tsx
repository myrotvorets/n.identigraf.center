import { Fragment, h } from 'preact';
import { useCallback, useEffect, useState } from 'preact/hooks';
import { Alert, Card, ListGroup } from 'react-bootstrap';
// eslint-disable-next-line import/no-named-as-default
import Lightbox from 'yet-another-react-lightbox';
import Fullscreen from 'yet-another-react-lightbox/plugins/fullscreen';
import API, { type MatchedFace as FoundFace, decodeErrorResponse } from '../../../api';
import { SmallLoader } from '../../SmallLoader';
import { Face } from './Face';

import 'yet-another-react-lightbox/styles.css';

interface Props {
    faceID: number;
    guid: string;
}

export function MatchedFaces({ faceID, guid }: Readonly<Props>): h.JSX.Element {
    const [matchedFaces, setMatchedFaces] = useState<FoundFace[]>([]);
    const [error, setError] = useState('');
    const [done, setDone] = useState(false);
    const [lightbox, setLightbox] = useState<string>('');

    const onFaceLinkClicked = useCallback((link: string): void => {
        setLightbox(link);
    }, []);

    const onLightboxClose = useCallback((): void => {
        setLightbox('');
    }, []);

    useEffect(() => {
        const getMatchedFaces = async (): Promise<void> => {
            const response = await API.getMatchedFaces(guid, faceID);
            if (response.success) {
                setMatchedFaces(response.matches);
            } else {
                setError(decodeErrorResponse(response));
            }

            setDone(true);
        };

        void getMatchedFaces();
    }, [faceID, guid]);

    if (!done) {
        return (
            <Card.Body>
                <SmallLoader text="Завантаження…" justifyContent="start" />
            </Card.Body>
        );
    }

    if (error) {
        return (
            <Card.Body>
                <Alert variant="danger">Помилка завантаження: {error}</Alert>;
            </Card.Body>
        );
    }

    return (
        <Fragment>
            <ListGroup variant="flush" as="ol">
                {matchedFaces.map((face, index) => (
                    <Face {...face} key={index /* NOSONAR */} onClick={onFaceLinkClicked} />
                ))}
            </ListGroup>
            {lightbox && (
                <Lightbox
                    open
                    close={onLightboxClose}
                    slides={[{ src: lightbox }]}
                    fullscreen={{ auto: false }}
                    plugins={[Fullscreen]}
                />
            )}
        </Fragment>
    );
}
