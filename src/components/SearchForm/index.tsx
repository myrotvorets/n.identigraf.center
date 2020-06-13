import { ComponentChild, h } from 'preact';
import { PureComponent } from 'preact/compat';
import { Link, route } from 'preact-router';
import { connect } from 'unistore/preact';
import { AppState } from '../../redux/store';
import Alert from '../Alert';
import Loader from '../Loader';

import './searchform.scss';

type OwnProps = {};
interface MappedProps {
    loggedIn: boolean | null;
}

type Props = OwnProps & MappedProps;

interface State {
    image: string;
    uploadProgress: number | null;
    error: string | null;
    disabled: boolean;
}

interface UploadResponse {
    success: true;
    guid: string;
}

class SearchForm extends PureComponent<Props, State> {
    public state: Readonly<State> = {
        image: '',
        uploadProgress: null,
        error: null,
        disabled: false,
    };

    private _onFileChange = ({ target }: Event): void => {
        this.setState({ error: null });
        if (target) {
            const { files } = target as HTMLInputElement;
            if (files && files.length !== 0) {
                const f = files[0];
                if (f.type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.addEventListener('load', ({ target }: ProgressEvent<FileReader>): void => {
                        if (target) {
                            this.setState({ image: target.result as string });
                        }
                    });

                    reader.readAsDataURL(f);
                }
            } else {
                this.setState({ image: '' });
            }
        }
    };

    private _onFormSubmit = (e: h.JSX.TargetedEvent<HTMLFormElement>): void => {
        e.preventDefault();
        const form = e.currentTarget;

        this.setState({ uploadProgress: 0, error: null });

        const req = new XMLHttpRequest();
        req.withCredentials = true;
        req.upload.addEventListener('progress', this._onUploadProgress);
        req.addEventListener('error', this._onUploadFailed);
        req.addEventListener('abort', this._onUploadAborted);
        req.addEventListener('timeout', this._onUploadTimeout);
        req.addEventListener('load', this._onUploadSucceeded);
        req.open('POST', '/api/search/upload');

        req.send(new FormData(form));
    };

    private _onUploadProgress = (e: ProgressEvent<XMLHttpRequestEventTarget>): void => {
        let progress: number;
        if (e.lengthComputable) {
            progress = (e.loaded / e.total) * 100;
        } else {
            progress = -1;
        }

        this.setState({
            uploadProgress: progress,
        });
    };

    private _setError(error: string): void {
        this.setState({ uploadProgress: null, error });
    }

    private _onUploadFailed = (/* e: ProgressEvent<XMLHttpRequestEventTarget> */): void => {
        this._setError('Помилка вивантаження файлу');
    };

    private _onUploadTimeout = (): void => {
        this._setError('Час очікування вивантаження вичерпано');
    };

    private _onUploadAborted = (): void => {
        this._setError('Вивантаження перервано');
    };

    private _onUploadSucceeded = (e: ProgressEvent<XMLHttpRequestEventTarget>): void => {
        this.setState({
            uploadProgress: 100,
        });

        const req = e.currentTarget as XMLHttpRequest;
        if (req.status === 403) {
            route('/logout');
        } else if (req.status === 429) {
            this._setError('Кількість безкоштовних спроб досягнуто. Будь ласка, спробуйте ще раз завтра.');
        } else if (req.status === 451) {
            this.setState({
                uploadProgress: null,
                error: 'Цю дію можна здійснити лише з території вільної України.',
                disabled: true,
            });
        } else if (req.status !== 200) {
            this._setError('Помилка вивантаження файлу');
        } else {
            try {
                const body: UploadResponse = JSON.parse(req.responseText);
                route(`/search/${body.guid}`);
            } catch (e) {
                this._setError('Несподівана помилка під час аналізу відповіді сервера');
            }
        }
    };

    public render(): ComponentChild {
        const { loggedIn } = this.props;
        const { disabled, error, image, uploadProgress } = this.state;

        if (loggedIn === null) {
            return <Loader />;
        }

        if (loggedIn === false) {
            route('/', true);
            return null;
        }

        return (
            <section className="searchform">
                <Alert className="info">
                    <strong>Уважно</strong> прочитайте{' '}
                    <Link href="/requirements">Вимоги до підготовки фотоматеріалів</Link>.
                </Alert>

                <form className="block" onSubmit={this._onFormSubmit}>
                    <header className="block__header">Завантажити світлину для пошуку</header>

                    {error && <Alert message={error} />}

                    <label htmlFor="photo" className="required">
                        Світлина для розпізнавання
                    </label>
                    <input
                        type="file"
                        id="photo"
                        name="photo"
                        onChange={this._onFileChange}
                        required
                        accept="image/png, image/jpeg"
                        disabled={uploadProgress !== null}
                    />

                    {image.length > 0 ? <img src={image} alt="Завантажена світлина" className="photo" /> : null}

                    {uploadProgress !== null && (
                        <div className="upload-progress">
                            Вивантаження:
                            <progress max={100} value={-1 === uploadProgress ? undefined : uploadProgress} />
                            {uploadProgress !== -1 ? <span>{uploadProgress.toFixed(2)}%</span> : undefined}
                        </div>
                    )}

                    <button type="submit" disabled={image.length === 0 || uploadProgress !== null || disabled}>
                        {uploadProgress !== null
                            ? uploadProgress === 100
                                ? 'Обробка світлини…'
                                : uploadProgress > 0
                                ? `Вивантаження (${Math.floor(uploadProgress)}%)…`
                                : 'Вивантаження…'
                            : 'Відправити'}
                    </button>
                </form>
            </section>
        );
    }
}

function mapStateToProps(state: AppState): MappedProps {
    return {
        loggedIn: state.loggedIn,
    };
}

export default connect<OwnProps, {}, AppState, MappedProps>(mapStateToProps)(SearchForm);
