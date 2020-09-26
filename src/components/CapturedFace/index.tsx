import { h } from 'preact';
import { CapturedFace as RecognizedFace } from '../../api';

type Props = RecognizedFace;

export default function CapturedFace({ minSimilarity, maxSimilarity, face }: Props): h.JSX.Element {
    return (
        <div className="recognized-face">
            <h4 className="d-sm-none">Розпізнане обличчя</h4>
            <img className="face" src={`data:image/jpeg;base64,${face}`} alt="Обличчя" />
            <small aria-label="Схожість">
                {minSimilarity}…{maxSimilarity}%
            </small>
        </div>
    );
}
