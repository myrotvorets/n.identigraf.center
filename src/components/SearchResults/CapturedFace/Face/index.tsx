import { h } from 'preact';
import { Image } from 'react-bootstrap';
import { Paragraph } from '../../../Paragraph';
import { CapturedFace as RecognizedFace } from '../../../../api';

type Props = RecognizedFace;

export function Face({ minSimilarity, maxSimilarity, face }: Props): h.JSX.Element {
    return (
        <div className="d-flex flex-column position-sticky bg-white" style={{ top: '2rem' }}>
            <h4 className="d-sm-none">Розпізнане обличчя</h4>
            <Image fluid rounded className="mt-3rounded" src={`data:image/jpeg;base64,${face}`} alt="" />
            <Paragraph aria-label="Схожість" className="text-center">
                {minSimilarity}…{maxSimilarity}%
            </Paragraph>
        </div>
    );
}
