import { Fragment, h } from 'preact';
import { MatchedFace as FoundFace } from '../../api';

type Props = FoundFace;

export default function MatchedFace(props: Props): h.JSX.Element {
    return (
        <Fragment>
            <strong class="name">
                <a href={props.link ?? '#'} target="_blank" rel="noopener noreferrer">
                    {props.name ?? 'Невідома людина'}
                </a>
            </strong>
            <div className="image-container">
                <img src={`data:image/jpeg;base64,${props.face}`} className="face" alt="Обличчя" />
            </div>
            <div className="info">
                {props.country && <p>Країна: {props.country}</p>}
                {props.matchedPhoto && (
                    <p>
                        <a
                            href={props.matchedPhoto}
                            target="_blank"
                            rel="noopener noreferrer"
                            data-mediabox={props.matchedPhoto}
                        >
                            Світлина, яка збіглась
                        </a>
                    </p>
                )}
                {props.primaryPhoto && (
                    <p>
                        <a
                            href={props.primaryPhoto}
                            target="_blank"
                            rel="noopener noreferrer"
                            data-mediabox={props.primaryPhoto}
                        >
                            Основна світлина
                        </a>
                    </p>
                )}
                <p>Схожість: {props.similarity}%</p>
            </div>
        </Fragment>
    );
}
