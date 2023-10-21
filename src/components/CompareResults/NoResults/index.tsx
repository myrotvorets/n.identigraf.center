import { h } from 'preact';
import { Button, Card } from 'react-bootstrap';

export function NoResults(): h.JSX.Element {
    return (
        <Card className="w-100">
            <Card.Header as="header" className="text-bg-danger">
                <h2 className="my-0 h5">Результати порівняння</h2>
            </Card.Header>
            <Card.Body>
                <Card.Text className="text-danger">
                    На жаль, система не змогла розпізнати обличчя на фотографії, або на фотографії кілька облич.
                </Card.Text>
                <Button variant="primary" href="/compare">
                    Повернутися до порівняння
                </Button>
            </Card.Body>
        </Card>
    );
}
