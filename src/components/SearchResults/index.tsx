import { ComponentChild, Fragment, h } from 'preact';
import { PureComponent } from 'preact/compat';
import API, { MatchedFaceFailure, MatchedFaceResponse, MatchedFaceSuccess } from '../../api';
import SmallLoader from '../SmallLoader';
import CapturedFace, { RecognizedFace } from '../CapturedFace';
import MatchedFace from '../MatchedFace';
import WaitForm from '../WaitForm';

import './searchresults.scss';

if (process.env.BUILD_SSR === undefined) {
    require('wa-mediabox/dist/wa-mediabox.min.js');
    require('wa-mediabox/dist/wa-mediabox.min.css');
}

interface Props {
    guid: string;
}

type TheState = 'check' | 'get_captured' | 'get_matched' | 'done' | 'failure';

interface State {
    state: TheState;
    counts: number[];
    jpeg: string;
    webp: string;
    capturedFaces: RecognizedFace[];
    matchedFaces: MatchedFaceResponse;
}

export default class SearchResults extends PureComponent<Props, State> {
    public state: Readonly<State> = {
        state: 'check',
        counts: [],
        jpeg: '',
        webp: '',
        capturedFaces: [],
        matchedFaces: {},
    };

    private _timerId: number | null = null;

    public componentDidMount(): void {
        this._timerId = self.setTimeout(this._checkStatus, 0);
    }

    public componentDidUpdate(): void {
        if (this.state.state === 'done') {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (self as any).WAMediaBox.bindAll(document.documentElement);
        }
    }

    public componentWillUnmount(): void {
        if (this._timerId !== null) {
            self.clearTimeout(this._timerId);
        }
    }

    private _onImageLoadFailed = (): void => {
        if (this.state.webp.length) {
            this.setState({ webp: '' });
        } else {
            this.setState({ jpeg: '' });
        }
    };

    private _checkStatus = (): void => {
        this._timerId = null;

        const { guid } = this.props;
        API.checkSearchStatus(guid).then((r): void => {
            switch (r.status) {
                case 'success':
                    this.setState({ state: 'get_captured', counts: r.counts, jpeg: r.pathJ, webp: r.pathW });
                    this._getCapturedFaces(guid);
                    break;

                case 'failed':
                    this.setState({ state: 'failure' });
                    break;

                case 'inprogress':
                    this._timerId = self.setTimeout(this._checkStatus, 10_000);
                    break;
            }
        });
    };

    private _getCapturedFaces(guid: string): void {
        API.getCapturedFaces(guid).then((r): void => {
            if (r.status === 'inprogress') {
                console.warn('WARNING: getCapturedFaces() unexpectly returned INPROGRESS response');
                this.setState({ state: 'check' });
            } else if (r.status === 'failed') {
                this.setState({ state: 'failure' });
            } else {
                this.setState({ state: 'get_matched', capturedFaces: r.faces });
                this._getMatchedFaces(guid, this.state.counts.length);
            }
        });
    }

    private _getMatchedFaces(guid: string, count: number): void {
        API.getMatchedFaces(guid, count).then((r): void => {
            this.setState({
                state: 'done',
                matchedFaces: r,
            });
        });
    }

    private _renderMatchedFace(face: MatchedFaceSuccess | MatchedFaceFailure, index: number): ComponentChild {
        return <li key={index}>{'status' in face ? <p>Помилка!</p> : <MatchedFace {...face} />}</li>;
    }

    private _renderMatchedFaces(index: number): ComponentChild {
        const { matchedFaces, state } = this.state;
        return (
            <div className="matched-faces">
                {state === 'get_matched' ? (
                    <SmallLoader />
                ) : matchedFaces[index].length ? (
                    <Fragment>
                        <h4 className="d-sm-none">Збіги</h4>
                        <ol>{matchedFaces[index].map(this._renderMatchedFace)}</ol>
                    </Fragment>
                ) : (
                    <p>Збігів немає</p>
                )}
            </div>
        );
    }

    private _renderCapturedFace(face: RecognizedFace): ComponentChild {
        return (
            <div className="card" key={face.index}>
                <header className="card__header">Обличчя {face.index}</header>
                <div className="row">
                    <CapturedFace {...face} />

                    {this._renderMatchedFaces(face.index)}
                </div>
            </div>
        );
    }

    private _renderCapturedFaces(): ComponentChild {
        const { capturedFaces, counts, state } = this.state;
        return counts.length ? (
            <div className="results">
                <h3>Результати пошуку</h3>
                {state === 'get_captured' ? <SmallLoader /> : capturedFaces.map(this._renderCapturedFace, this)}
            </div>
        ) : (
            <div className="results">
                <h3>Результати пошуку</h3>

                <p>На жаль, система не змогла розпізнати жодне обличчя на світлині.</p>
            </div>
        );
    }

    private _renderResults(): ComponentChild {
        const { counts, jpeg, webp } = this.state;
        return (
            <section className="SearchResults">
                <div className="block">
                    <header className="block__header">Облич розпізнано на фото: {counts.length}</header>

                    {jpeg.length ? (
                        <picture>
                            {webp.length ? <source type="image/webp" srcSet={webp} /> : null}
                            <img
                                src={jpeg}
                                alt="Завантажена світлина"
                                className="uploadedPhoto"
                                onError={this._onImageLoadFailed}
                            />
                        </picture>
                    ) : null}

                    {this._renderCapturedFaces()}
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
