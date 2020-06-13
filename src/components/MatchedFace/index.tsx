import { Fragment, h } from 'preact';
import { memo } from 'preact/compat';
import { MatchedFaceSuccess } from '../../api';

type Props = MatchedFaceSuccess;

function MatchedFace(props: Props): h.JSX.Element {
    return (
        <Fragment>
            <strong class="name">
                <a href={props.link} target="_blank" rel="noopener">
                    {props.name}
                </a>
            </strong>
            <div className="image-container">
                <img src={`data:image/jpeg;base64,${props.face}`} className="face" alt="Обличчя" />
            </div>
            <div className="info">
                {props.country ? <p>Країна: {props.country}</p> : null}
                {props.mphoto ? (
                    <p>
                        <a href={props.mphoto} target="_blank" data-mediabox={props.mphoto}>
                            Світлина, яка збіглась
                        </a>
                    </p>
                ) : null}
                {props.pphoto ? (
                    <p>
                        <a href={props.pphoto} target="_blank" data-mediabox={props.pphoto}>
                            Основна світлина
                        </a>
                    </p>
                ) : null}
                <p>Схожість: {props.similarity}%</p>
            </div>
        </Fragment>
    );
}

export default memo(MatchedFace);
