import { h } from 'preact';

export default function Contacts(): h.JSX.Element {
    return (
        <section className="Contacts">
            <div className="block">
                <header className="block__header">Контакти</header>

                <p>
                    E-mail: <a href="mailto:id24082016@gmail.com">id24082016@gmail.com</a>
                </p>
                <p>
                    Підтримка або технічні питання:{' '}
                    <a href="mailto:support@myrotvorets.center?subject=IDentigraF">support@myrotvorets.center</a>
                </p>

                <p>
                    <a href="https://myrotvorets.news/donate/" target="_blank" rel="noopener noreferrer">
                        <img
                            src="https://psb4ukr.natocdn.net/images/donate.png"
                            alt="Допомога проекту"
                            className="block--centered"
                        />
                    </a>
                </p>
            </div>
        </section>
    );
}
