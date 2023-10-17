import { h } from 'preact';
import { Card, Image } from 'react-bootstrap';
import { CardHeader } from '../CardHeader';
import { Paragraph } from '../Paragraph';

export default function Contacts(): h.JSX.Element {
    return (
        <Card>
            <CardHeader>Контакти</CardHeader>
            <Card.Body>
                <Paragraph>
                    E-mail: <a href="mailto:id24082016@gmail.com">id24082016@gmail.com</a>
                </Paragraph>
                <Paragraph>
                    Підтримка або технічні питання:{' '}
                    <a href="mailto:support@myrotvorets.center?subject=IDentigraF">support@myrotvorets.center</a>
                </Paragraph>
                <Paragraph>
                    <a href="https://myrotvorets.news/donate/" target="_blank" rel="noopener noreferrer">
                        <Image fluid src="https://cdn.myrotvorets.center/m/images/donate.png" alt="Допомога проекту" />
                    </a>
                </Paragraph>
            </Card.Body>
        </Card>
    );
}
