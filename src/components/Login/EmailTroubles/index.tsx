import { h } from 'preact';
import { Button, Card } from 'react-bootstrap';
import { CardHeader } from '../../CardHeader';
import { Paragraph } from '../../Paragraph';
import { useDocumentTitle } from '../../../hooks/usedocumenttitle';
import { useTrackPageView } from '../../../hooks/usetrackpageview';

interface Props {
    onBackClicked: () => unknown;
    onRetryClicked: () => unknown;
}

export function EmailTroubles({ onBackClicked, onRetryClicked }: Readonly<Props>): h.JSX.Element {
    const title = useDocumentTitle('Проблеми з отриманням електронних листів?');
    useTrackPageView();

    return (
        <Card>
            <CardHeader>{title}</CardHeader>
            <Card.Body>
                <Paragraph>Будь ласка, скористайтеся порадами нижче, щоб вирішити проблему:</Paragraph>
                <ul>
                    <li>Перевірте, можливо, електронний лист позначено як спам або відфільтровано.</li>
                    <li>Перевірте інтернет-з’єднання.</li>
                    <li>Переконайтеся, що ви правильно вказали електронну адресу.</li>
                    <li>
                        Перевірте доступний обсяг пам’яті для папки «Вхідні» та інші можливі проблеми з налаштуваннями.
                    </li>
                </ul>
                <Paragraph>
                    Якщо наведені вище поради не допомагають, спробуйте знову надіслати електронний лист{' '}
                    <strong className="text-danger-emphasis">
                        (у такому разі посилання в попередньому листі стане <em>неактивним</em>)
                    </strong>
                    .
                </Paragraph>
                <Button variant="primary" onClick={onBackClicked} className="mb-2">
                    Повернутись назад
                </Button>{' '}
                <Button variant="warning" onClick={onRetryClicked} className="mb-2">
                    Надіслати ще раз
                </Button>
            </Card.Body>
        </Card>
    );
}
