import { h } from 'preact';
import { memo } from 'preact/compat';

import './waitform.scss';

function WaitForm(): h.JSX.Element {
    return (
        <section className="WaitForm">
            <div className="block">
                <header className="block__header">Обробка запиту</header>
                <p>Зачекайте, будь ласка…</p>
                <p>
                    <progress max="100" />
                </p>
            </div>
        </section>
    );
}

export default memo(WaitForm);
