import { h } from 'preact';
import { createPortal } from 'preact/compat';
import logo from '../../assets/identigraf-logo.svg';

import './loader.scss';

export default function Loader(): h.JSX.Element | null {
    if (process.env.BUILD_SSR) {
        return null;
    }

    return createPortal(
        <div className="loader">
            <div className="loader__inner">
                <img src={logo} alt="Зачекайте, будь ласка" />
            </div>
        </div>,
        document.body,
    );
}
