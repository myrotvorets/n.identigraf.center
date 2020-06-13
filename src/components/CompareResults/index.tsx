import { ComponentChild, h } from 'preact';
import { PureComponent } from 'preact/compat';
import API from '../../api';
import WaitForm from '../WaitForm';

import './compareresults.scss';

interface Props {
    guid: string;
}

type TheState = 'check' | 'done' | 'failure';

interface State {
    state: TheState;
    results: Record<string, [string, string, number]>;
}

export default class CompareResults extends PureComponent<Props, State> {
    public state: Readonly<State> = {
        state: 'check',
        results: {},
    };

    private _timerId: number | null = null;

    public componentDidMount(): void {
        this._timerId = self.setTimeout(this._checkStatus, 0);
    }

    public componentWillUnmount(): void {
        if (this._timerId !== null) {
            self.clearTimeout(this._timerId);
        }
    }

    private _checkStatus = (): void => {
        this._timerId = null;

        const { guid } = this.props;
        API.checkCompareStatus(guid).then((r): void => {
            switch (r.status) {
                case 'success':
                    this.setState({ state: 'done', results: r.results });
                    break;

                case 'failed':
                    this.setState({ state: 'failure' });
                    break;

                case 'inprogress':
                    this._timerId = self.setTimeout(this._checkStatus, 1_000);
                    break;
            }
        });
    };

    private _renderResults(): ComponentChild {
        const { 0: ref, ...others } = this.state.results;
        return (
            <section className="CompareResults">
                <div className="block">
                    <header className="block__header">Результати порівняння</header>

                    <ul>
                        <li>
                            <p id="source-photo">
                                <strong>Світлина, яка порівнюється</strong>
                            </p>
                            <img src={ref[0]} alt="Завантажена світлина" aria-describedby="#source-photo" />
                        </li>
                        {Object.values(others).map((item, key) => (
                            <li key={key}>
                                <img src={item[0]} alt={`Світлина ${key + 1}`} aria-describedby={`#photo-${key + 1}`} />
                                <p>
                                    <strong>Схожість:</strong> {item[2]}%
                                </p>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>
        );
    }

    public render(): ComponentChild {
        const { state } = this.state;
        if (state === 'check') {
            return <WaitForm />;
        }

        return this._renderResults();
    }
}
