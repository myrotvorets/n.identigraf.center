import { Component, ComponentChild, h } from 'preact';
import API, { decodeErrorResponse } from '../../api';
import Alert from '../Alert';
import WaitForm from '../WaitForm';

import './compareresults.scss';

interface Props {
    guid: string;
}

type TheState = 'check' | 'done' | 'nofaces';

interface State {
    state: TheState;
    error: string;
    results: Record<string, number>;
    numFiles: number;
}

export default class CompareResults extends Component<Props, State> {
    public state: Readonly<State> = {
        state: 'check',
        error: '',
        results: {},
        numFiles: 0,
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

    private readonly _checkStatus = (): void => {
        this._timerId = null;

        const { guid } = this.props;

        /* checkCompareStatus() cannot fail */
        // eslint-disable-next-line no-void
        void API.checkCompareStatus(guid).then((r) => {
            if (r.success) {
                if (r.status === 'inprogress') {
                    this._timerId = self.setTimeout(this._checkStatus, 1_000);
                } else {
                    this.setState({
                        state: r.status === 'complete' ? 'done' : 'nofaces',
                        results: r.matches,
                        numFiles: r.numFiles,
                    });
                }
            } else {
                this.setState({ state: 'done', error: decodeErrorResponse(r) });
            }

            return null;
        });
    };

    private readonly _renderPhoto = (similarity: number, index: number): ComponentChild => {
        const { guid } = this.props;
        return (
            <li key={index}>
                <img
                    src={`https://api2.myrotvorets.center/identigraf-upload/v1/get/${guid}/${index + 1}`}
                    alt={`Світлина ${index + 1}`}
                    aria-describedby={`#photo-${index + 1}`}
                />
                <p id={`photo-${index + 1}`}>
                    <strong>Схожість:</strong> {similarity}%
                </p>
            </li>
        );
    };

    private _renderResults(): ComponentChild {
        const { guid } = this.props;
        const results = Object.values(this.state.results);
        return (
            <section className="CompareResults">
                <div className="block">
                    <header className="block__header">Результати порівняння</header>

                    {this.state.state === 'nofaces' && (
                        <Alert message="На жаль, система не змогла розпізнати обличчя на фотографії, або на фотографії кілька облич." />
                    )}

                    <ul>
                        <li>
                            <p id="source-photo">
                                <strong>Світлина, яка порівнюється</strong>
                            </p>
                            <img
                                src={`https://api2.myrotvorets.center/identigraf-upload/v1/get/${guid}/0`}
                                alt="Завантажена світлина"
                                aria-describedby="#source-photo"
                            />
                        </li>
                        {results.map(this._renderPhoto)}
                    </ul>
                </div>
            </section>
        );
    }

    public render(): ComponentChild {
        const { error, state } = this.state;
        if (state === 'check') {
            return <WaitForm />;
        }

        if (error) {
            return <Alert message={error} />;
        }

        return this._renderResults();
    }
}
