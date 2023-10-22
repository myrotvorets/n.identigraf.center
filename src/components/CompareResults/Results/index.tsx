import { h } from 'preact';
import { Button, Card, Carousel, Image } from 'react-bootstrap';
import { useDocumentTitle } from '../../../hooks/usedocumenttitle';
import { useTrackPageView } from '../../../hooks/usetrackpageview';

interface Props {
    guid: string;
    results: Record<string, number>;
}

export function Results({ guid, results }: Readonly<Props>): h.JSX.Element {
    const title = useDocumentTitle('Результати порівняння');
    useTrackPageView();
    const similarities = Object.values(results);

    return (
        <Card className="w-100">
            <Card.Header className="text-bg-primary">{title}</Card.Header>

            <Card.Body>
                <Image
                    fluid
                    className="d-block mx-auto mb-3"
                    src={`https://api2.myrotvorets.center/identigraf-upload/v1/get/${guid}/0`}
                    alt="Завантажена світлина"
                    style={{ maxHeight: '35vh' }}
                />

                <Carousel interval={null} fade style={{ height: '40vh' }} className="mb-3">
                    {similarities.map((similarity, index) => (
                        <Carousel.Item key={index /* NOSONAR */}>
                            <Image
                                fluid
                                className="d-block mx-auto"
                                src={`https://api2.myrotvorets.center/identigraf-upload/v1/get/${guid}/${index + 1}`}
                                alt={`Світлина ${index + 1}`}
                                style={{ maxHeight: '35vh' }}
                            />
                            <Carousel.Caption>
                                <strong>Схожість:</strong> {similarity}%
                            </Carousel.Caption>
                        </Carousel.Item>
                    ))}
                </Carousel>
                <Button variant="primary" href="/compare">
                    Ще одне порівняння
                </Button>
            </Card.Body>
        </Card>
    );
}
