import { h } from 'preact';
import { Card } from 'react-bootstrap';
import { CardHeader } from '../CardHeader';
import { Paragraph } from '../Paragraph';

export function RussiaIsNotWelcomeHere(): h.JSX.Element {
    return (
        <Card className="text-bg-danger">
            <CardHeader className="text-bg-danger">Доступ заборонено</CardHeader>
            <Card.Body>
                <Paragraph>
                    Особам, які перебувають на території країни-агресора та окупованих нею територіях, країни, яка
                    фінансує та постачає зброю терористам, <strong>доступ до сайту заборонено</strong>.
                </Paragraph>
            </Card.Body>
        </Card>
    );
}
