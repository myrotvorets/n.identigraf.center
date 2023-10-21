import { h } from 'preact';
import { Card } from 'react-bootstrap';
import { CardHeader } from '../CardHeader';
import { Paragraph } from '../Paragraph';
import { SmallLoader } from '../SmallLoader';

export function WaitForm(): h.JSX.Element {
    return (
        <Card className="w-100">
            <CardHeader>Обробка запиту</CardHeader>
            <Card.Body>
                <Paragraph>Зачекайте, будь ласка…</Paragraph>
                <SmallLoader width={200} />
            </Card.Body>
        </Card>
    );
}
