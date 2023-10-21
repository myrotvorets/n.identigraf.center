import { h } from 'preact';
import { useContext } from 'preact/hooks';
import { Button, Card } from 'react-bootstrap';
import { CardHeader } from '../CardHeader';
import { Paragraph } from '../Paragraph';
import { SmallLoader } from '../SmallLoader';
import { AppContext } from '../../context';

export default function Home(): h.JSX.Element {
    const { user } = useContext(AppContext)!;
    return (
        <Card className="w-100">
            <CardHeader>IDentigraF</CardHeader>
            <Card.Body>
                <Paragraph>
                    Працювати з Системою можуть громадяни, які знаходяться на території вільної України і користуються
                    мобільним зв’язком українських операторів.
                </Paragraph>

                <Paragraph>
                    Кожен пересічний користувач має можливість здійснити лише 5 (п’ять) спроб розпізнавання на добу за
                    допомогою одного мобільного пристрою.
                </Paragraph>

                {user === undefined ? (
                    <SmallLoader text="Триває перевірка…" />
                ) : (
                    <Button href={user !== null ? '/search' : '/login'} className="d-block" size="lg">
                        Почати
                    </Button>
                )}
            </Card.Body>
        </Card>
    );
}
