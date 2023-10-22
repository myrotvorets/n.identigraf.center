import { h } from 'preact';
import { Button, Card } from 'react-bootstrap';
import { useDocumentTitle } from '../../../hooks/usedocumenttitle';
import { useTrackPageView } from '../../../hooks/usetrackpageview';

export function NoResults(): h.JSX.Element {
    const title = useDocumentTitle('Нічого не знайдено');
    useTrackPageView();

    return (
        <Card className="w-100">
            <Card.Header as="header" className="text-bg-danger">
                <h2 className="my-0 h5">{title}</h2>
            </Card.Header>
            <Card.Body>
                <Card.Text>На жаль, система не змогла розпізнати жодне обличчя на світлині.</Card.Text>
                <Button variant="primary" href="/search">
                    Повернутися до пошуку
                </Button>
            </Card.Body>
        </Card>
    );
}
