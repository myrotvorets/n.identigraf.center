import { ComponentChild, h } from 'preact';
import { PureComponent } from 'preact/compat';
import { Link, route } from 'preact-router';
import { connect } from 'unistore/preact';
import { AppState } from '../../redux/store';
import Bugsnag from '@bugsnag/js';
import Alert from '../Alert';
import Loader from '../Loader';

import '../SearchForm/searchform.scss';

type OwnProps = {};
interface MappedProps {
    loggedIn: boolean | null;
}

type Props = OwnProps & MappedProps;

interface State {
    error: string | null;
    uploadProgress: number | null;
    hasPhoto1: boolean;
    hasPhoto2: boolean;
    disabled: boolean;
}

interface UploadResponse {
    success: true;
    guid: string;
}

class CompareForm extends PureComponent<Props, State> {
    public state: Readonly<State> = {
        error: null,
        uploadProgress: null,
        hasPhoto1: false,
        hasPhoto2: false,
        disabled: false,
    };

    private _onFileChange = ({ target }: Event): void => {
        if (target) {
            const { files, id } = target as HTMLInputElement;
            const value = files && files.length > 0;
            const key = 'has' + id[0].toUpperCase() + id.substring(1);
            this.setState({ [key]: value });
        }
    };

    private _onFormSubmit = (e: h.JSX.TargetedEvent<HTMLFormElement>): void => {
        e.preventDefault();
        const { currentTarget: form } = e;

        this.setState({ uploadProgress: 0, error: null });

        const req = new XMLHttpRequest();
        req.withCredentials = true;
        req.upload.addEventListener('progress', this._onUploadProgress);
        req.addEventListener('error', this._onUploadFailed);
        req.addEventListener('abort', this._onUploadAborted);
        req.addEventListener('timeout', this._onUploadTimeout);
        req.addEventListener('load', this._onUploadSucceeded);
        req.open('POST', '/api/compare/upload');

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

    private _onUploadAborted = (): void => {
        this._setError('Вивантаження перервано');
    };

    private _onUploadTimeout = (): void => {
        this._setError('Час очікування вивантаження вичерпано');
    };

    private _onUploadSucceeded = (e: ProgressEvent<XMLHttpRequestEventTarget>): void => {
        this.setState({ uploadProgress: 100 });

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
                route(`/compare/${body.guid}`);
            } catch (e) {
                Bugsnag.notify(e);
                this._setError('Несподівана помилка під час аналізу відповіді сервера');
            }
        }
    };

    public render(): ComponentChild {
        const { loggedIn } = this.props;
        const { disabled, error, hasPhoto1, hasPhoto2, uploadProgress } = this.state;

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
                    <header className="block__header">Завантажити світлину для порівняння</header>

                    {error && <Alert message={error} />}

                    <label htmlFor="photo1" className="required">
                        Світлина, яка порівнюється
                    </label>
                    <input
                        type="file"
                        id="photo1"
                        name="photo"
                        onChange={this._onFileChange}
                        required
                        accept="image/png, image/jpeg"
                        disabled={uploadProgress !== null}
                    />

                    <label htmlFor="photo2" className="required">
                        Еталонні світлини (до 10 файлів)
                    </label>
                    <input
                        type="file"
                        multiple
                        id="photo2"
                        name="photo"
                        onChange={this._onFileChange}
                        required
                        accept="image/png, image/jpeg"
                        disabled={uploadProgress !== null}
                    />

                    <small>Порада: щоб вибрати кілька файлів, утримуйте клавіші Shift або Ctrl при виборі файлів</small>

                    {uploadProgress !== null && (
                        <div className="upload-progress">
                            Завантаження:
                            <progress max={100} value={-1 === uploadProgress ? undefined : uploadProgress} />
                            {uploadProgress !== -1 ? <span>{uploadProgress.toFixed(2)}%</span> : undefined}
                        </div>
                    )}

                    <button type="submit" disabled={!hasPhoto1 || !hasPhoto2 || uploadProgress !== null || disabled}>
                        {uploadProgress !== null
                            ? uploadProgress === 100
                                ? 'Обробка зображень…'
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

export default connect<OwnProps, {}, AppState, MappedProps>(mapStateToProps)(CompareForm);
