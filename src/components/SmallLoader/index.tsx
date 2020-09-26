import { h } from 'preact';

import logo from '../../assets/identigraf-logo.svg';
import './smallloader.scss';

interface Props {
    width: number;
}

export default function SmallLoader({ width }: Props): h.JSX.Element {
    return (
        <div className="SmallLoader">
            <img src={logo} alt="Зачекайте…" width={width} />
        </div>
    );
}

SmallLoader.defaultProps = {
    width: 100,
};
