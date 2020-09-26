import { h } from 'preact';

import './waitform.scss';

export default function WaitForm(): h.JSX.Element {
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
