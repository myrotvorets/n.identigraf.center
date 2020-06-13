import { h } from 'preact';
import { memo } from 'preact/compat';

export interface RecognizedFace {
    index: number;
    minSimilarity: number;
    maxSimilarity: number;
    face: string;
}

type Props = RecognizedFace;

function CapturedFace({ minSimilarity, maxSimilarity, face }: Props): h.JSX.Element {
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

export default memo(CapturedFace);
