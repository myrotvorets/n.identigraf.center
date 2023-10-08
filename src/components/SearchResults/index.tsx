import { Component, ComponentChild, Fragment, h } from 'preact';
import Bugsnag from '@bugsnag/js';
import { WAMediaBox } from 'wa-mediabox';
import API, { MatchedFace as FoundFace, CapturedFace as RecognizedFace, decodeErrorResponse } from '../../api';
import SmallLoader from '../SmallLoader';
import Alert from '../Alert';
import CapturedFace from '../CapturedFace';
import MatchedFace from '../MatchedFace';
import WaitForm from '../WaitForm';

import './searchresults.scss';

if (!process.env.BUILD_SSR) {
    require('wa-mediabox/dist/wa-mediabox.min.js');
    require('wa-mediabox/dist/wa-mediabox.min.css');
}

interface Props {
    guid: string;
}

type TheState = 'check' | 'done';

interface State {
    state: TheState;
    error: string;
    capturedFaces: RecognizedFace[];
    matchedFaces: (FoundFace[] | null)[];
}

declare global {
    interface Window {
        WAMediaBox: WAMediaBox;
    }
}

export default class SearchResults extends Component<Props, State> {
    public state: Readonly<State> = {
        state: 'check',
        error: '',
        capturedFaces: [],
        matchedFaces: [],
    };

    private _timerId: number | null = null;

    public componentDidMount(): void {
        this._timerId = self.setTimeout(this._checkStatus, 0);
    }

    public componentDidUpdate(): void {
        if (this.state.state === 'done') {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            self.WAMediaBox.bindAll(document.documentElement);
        }
    }

    public componentWillUnmount(): void {
        if (this._timerId !== null) {
            self.clearTimeout(this._timerId);
        }
    }

    private readonly _checkStatus = (): void => {
        this._timerId = null;

        const { guid } = this.props;

        /* checkSearchStatus() cannot fail */
        // eslint-disable-next-line no-void
        void API.checkSearchStatus(guid).then((r) => {
            if (r.success) {
                if (r.status === 'inprogress') {
                    this._timerId = self.setTimeout(this._checkStatus, 2_000);
                } else {
                    this.setState({ capturedFaces: r.faces }, () => this._getMatchedFaces());
                }
            } else {
                this.setState({ state: 'done', error: decodeErrorResponse(r) });
            }

            return null;
        });
    };

    private _addMatches(matches: FoundFace[] | null): void {
        this.setState((prevState) => ({ matchedFaces: [...prevState.matchedFaces, matches] }));
    }

    private _getMatchedFaces(): void {
        const { guid } = this.props;
        const { capturedFaces } = this.state;

        Promise.all(capturedFaces.map(({ faceID }) => API.getMatchedFaces(guid, faceID)))
            .then((responses) => {
                responses.forEach((response) => this._addMatches(response.success ? response.matches : null));
                return this.setState({ state: 'done' });
            })
            .catch((e: Error) => Bugsnag.notify(e));
    }

    // eslint-disable-next-line class-methods-use-this
    private readonly _renderMatchedFace = (face: FoundFace, index: number): ComponentChild => {
        return (
            <li key={index}>
                <MatchedFace {...face} />
            </li>
        );
    };

    private _renderMatchedFaces(faceID: number, index: number): ComponentChild {
        const { matchedFaces } = this.state;
        const faces = matchedFaces[index];
        return (
            <div className="matched-faces">
                {faces === undefined ? (
                    <SmallLoader />
                ) : faces === null ? (
                    <p>Помилка!</p>
                ) : faces.length > 0 ? (
                    <Fragment>
                        <h4 className="d-sm-none">Збіги</h4>
                        <ol>{faces.map(this._renderMatchedFace)}</ol>
                    </Fragment>
                ) : (
                    <p>Збігів немає</p>
                )}
            </div>
        );
    }

    private readonly _renderCapturedFace = (face: RecognizedFace, index: number): ComponentChild => {
        return (
            <div className="card" key={face.faceID}>
                <header className="card__header">Обличчя {index + 1}</header>
                <div className="row">
                    <CapturedFace {...face} />

                    {this._renderMatchedFaces(face.faceID, index)}
                </div>
            </div>
        );
    };

    private _renderCapturedFaces(): ComponentChild {
        const { capturedFaces } = this.state;
        return capturedFaces.length ? (
            <div className="results">
                <h3>Результати пошуку</h3>
                {capturedFaces.map(this._renderCapturedFace)}
            </div>
        ) : (
            <div className="results">
                <h3>Результати пошуку</h3>

                <p>На жаль, система не змогла розпізнати жодне обличчя на світлині.</p>
            </div>
        );
    }

    private _renderResults(): ComponentChild {
        const { guid } = this.props;
        const { capturedFaces } = this.state;
        return (
            <section className="SearchResults">
                <div className="block">
                    <header className="block__header">Облич розпізнано на фото: {capturedFaces.length}</header>

                    <img
                        src={`https://api2.myrotvorets.center/identigraf-upload/v1/get/${guid}`}
                        alt="Завантажена світлина"
                        className="uploadedPhoto"
                    />

                    {this._renderCapturedFaces()}
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
