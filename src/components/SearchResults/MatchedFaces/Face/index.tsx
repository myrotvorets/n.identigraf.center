import { h } from 'preact';
import { Col, Image, ListGroup, Row } from 'react-bootstrap';
import { Text } from '../../../Text';
import { PhotoLink } from '../../PhotoLink';
import { MatchedFace as FoundFace } from '../../../../api';

type Props = FoundFace & {
    onClick: (link: string) => unknown;
};

export function Face({
    country,
    face,
    link,
    matchedPhoto,
    name,
    onClick,
    primaryPhoto,
    similarity,
}: Readonly<Props>): h.JSX.Element {
    return (
        <ListGroup.Item as="li">
            <Row>
                <Col>
                    <a
                        href={link ?? '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-danger fw-bold text-decoration-none fs-3"
                    >
                        {name ?? 'Невідома людина'}
                    </a>
                </Col>
            </Row>
            <Row>
                <Col sm="auto">
                    <Image
                        fluid
                        thumbnail
                        src={`data:image/jpeg;base64,${face}`}
                        className="d-block mb-2"
                        alt="Обличчя"
                    />
                </Col>
                <Col sm={4}>
                    {country && <Text>Країна: {country}</Text>}
                    <PhotoLink link={matchedPhoto} text="Світлина, яка збіглась" onClick={onClick} />
                    <PhotoLink link={primaryPhoto} text="Основна світлина" onClick={onClick} />
                    <Text>Схожість: {similarity}%</Text>
                </Col>
            </Row>
        </ListGroup.Item>
    );
}
