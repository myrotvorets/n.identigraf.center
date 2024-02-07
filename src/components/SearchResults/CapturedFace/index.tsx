import { h } from 'preact';
import { Col, ListGroup, Row } from 'react-bootstrap';
import { Face } from './Face';
import { MatchedFaces } from '../MatchedFaces';
import { CapturedFace as RecognizedFace } from '../../../api';

interface Props {
    face: RecognizedFace;
    guid: string;
    index: number;
}

export function CapturedFace({ face, guid, index }: Readonly<Props>): h.JSX.Element {
    return (
        <ListGroup.Item as="li">
            <Row>
                <Col>
                    <h3>Обличчя {index + 1}</h3>
                </Col>
            </Row>
            <Row>
                <Col md={2} className="position-sticky bg-white" style={{ zIndex: 1000, top: 0 }}>
                    <Face {...face} />
                </Col>
                <Col>
                    <MatchedFaces faceID={face.faceID} guid={guid} />
                </Col>
            </Row>
        </ListGroup.Item>
    );
}
