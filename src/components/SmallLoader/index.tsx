import { h } from 'preact';

import logo from '../../assets/identigraf-logo.svg';
import './smallloader.scss';

interface Props {
    width?: number;
    text?: string;
    justifyContent?: string;
    alignItems?: string;
}

export function SmallLoader({
    text,
    width = 100,
    justifyContent = 'center',
    alignItems = 'center',
}: Readonly<Props>): h.JSX.Element {
    return (
        <div className={`d-flex justify-content-${justifyContent} align-items-${alignItems}`}>
            <img src={logo} alt={text ? '' : 'Зачекайте…'} width={width} className="SmallLoader" />
            {text && <span className="px-2">{text}</span>}
        </div>
    );
}
