import { h } from 'preact';

export default function RussiaIsNotWelcomeHere(): h.JSX.Element {
    return (
        <section>
            <div className="block">
                <header className="block__header block__header--error">Доступ заборонено</header>

                <p>
                    Особам, які перебувають на території країни-агресора та окупованих нею територіях, країни, яка
                    фінансує та постачає зброю терористам, <strong>доступ до сайту заборонено</strong>.
                </p>
            </div>
        </section>
    );
}
