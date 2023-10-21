import { h } from 'preact';
import { Card } from 'react-bootstrap';

export default function FourOhFour(): h.JSX.Element {
    return (
        <Card className="bg-danger">
            <Card.Body className="fw-bold">
                Ти вступаєш в річку,
                <br />
                Але річка не залишається колишньою.
                <br />
                Цієї web-сторінки тут вже немає 😞
            </Card.Body>
            <Card.Footer>
                <a href="/" className="text-white">
                    Повернутися до головної сторинки
                </a>
            </Card.Footer>
        </Card>
    );
}
