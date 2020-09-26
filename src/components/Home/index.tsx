import { h } from 'preact';
import { Link } from 'preact-router';
import { connect } from 'unistore/preact';
import { AppState } from '../../redux/store';

import './home.scss';

type OwnProps = unknown;
interface MappedProps {
    loggedIn: boolean;
}

type Props = OwnProps & MappedProps;

function Home({ loggedIn }: Props): h.JSX.Element {
    return (
        <section className="Home">
            <div className="block">
                <header className="block__header">IDentigraF</header>

                <p>
                    Працювати з Системою можуть громадяни, які знаходяться на території вільної України і користуються
                    мобільним зв’язком українських операторів.
                </p>

                <p>
                    Кожен пересічний користувач має можливість здійснити лише 5 (п’ять) спроб розпізнавання на добу за
                    допомогою одного мобільного пристрою.
                </p>

                {loggedIn === null ? (
                    <button disabled>Триває перевірка…</button>
                ) : (
                    <Link href={loggedIn ? '/search' : '/login'}>Почати</Link>
                )}
            </div>
        </section>
    );
}

function mapStateToProps(state: AppState): MappedProps {
    return {
        loggedIn: !!state.user,
    };
}

export default connect<OwnProps, unknown, AppState, MappedProps>(mapStateToProps)(Home);
