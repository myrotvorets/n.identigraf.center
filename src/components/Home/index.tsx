import { ComponentChild, h } from 'preact';
import { PureComponent } from 'preact/compat';
import { Link } from 'preact-router';
import { connect } from 'unistore/preact';
import { AppState } from '../../redux/store';

import './home.scss';

type OwnProps = {};
interface MappedProps {
    loggedIn: boolean;
}

type Props = OwnProps & MappedProps;

class Home extends PureComponent<Props> {
    public render(): ComponentChild {
        const { loggedIn } = this.props;

        return (
            <section className="Home">
                <div className="block">
                    <header className="block__header">IDentigraF</header>

                    <p>
                        Працювати з Системою можуть громадяни, які знаходяться на території вільної України і
                        користуються мобільним зв’язком українських операторів.
                    </p>

                    <p>
                        Кожен пересічний користувач має можливість здійснити лише 5 (п’ять) спроб розпізнавання на добу
                        за допомогою одного мобільного пристрою.
                    </p>

                    <p>
                        <strong>
                            <em>
                                Використання Системи правоохоронними органами та силовими структурами України,
                                спецслужбами країн-членів NATO та країн-партнерів, здійснюється на інших умовах, які не
                                підлягають розголошенню.
                            </em>
                        </strong>
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
}

function mapStateToProps(state: AppState): MappedProps {
    return {
        loggedIn: state.loggedIn === true,
    };
}

export default connect<OwnProps, {}, AppState, MappedProps>(mapStateToProps)(Home);
