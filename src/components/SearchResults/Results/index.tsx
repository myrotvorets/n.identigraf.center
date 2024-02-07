import { h } from 'preact';
import { Button, Card, ListGroup } from 'react-bootstrap';
import { CapturedFace } from '../CapturedFace';
import { CapturedFace as RecognizedFace } from '../../../api';
import { useDocumentTitle } from '../../../hooks/usedocumenttitle';
import { useTrackPageView } from '../../../hooks/usetrackpageview';

interface Props {
    guid: string;
    capturedFaces: RecognizedFace[];
}

export function Results({ capturedFaces, guid }: Readonly<Props>): h.JSX.Element {
    const title = useDocumentTitle('Результати пошуку');
    useTrackPageView();

    return (
        <Card className="w-100">
            <Card.Header as="header" className="text-bg-primary">
                <h2 className="my-0 h5">{title}</h2>
            </Card.Header>
            <ListGroup variant="flush" as="ol">
                {capturedFaces.map((face, index) => (
                    <CapturedFace face={face} index={index} key={face.faceID} guid={guid} />
                ))}
            </ListGroup>
            <Card.Footer>
                <Button variant="primary" href="/search">
                    Новий пошук
                </Button>
            </Card.Footer>
        </Card>
    );
}
