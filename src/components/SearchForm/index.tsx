import { Component, ComponentChild, h } from 'preact';
import { route } from 'preact-router';
import Bugsnag from '@bugsnag/js';
import type { User } from 'firebase/auth';
import { TargetedEvent } from 'preact/compat';
import Alert from '../Alert';
import ReadRequirements from '../ReadRequirements';
import UploadProgress from '../UploadProgress';
import UploadSubmitButton from '../UploadSubmitButton';
import { withLoginCheck } from '../../hocs/withLoginCheck';
import {
    ErrorResponse,
    FirebaseError,
    SearchUploadResponse,
    decodeErrorResponse,
    decodeFirebaseError,
} from '../../api';

import './searchform.scss';

interface Props {
    user: User | null | undefined;
}

interface State {
    image: string;
    uploadProgress: number | null;
    error: string | null;
    minSimilarity: number;
}

class SearchForm extends Component<Props, State> {
    public state: Readonly<State> = {
        image: '',
        uploadProgress: null,
        error: null,
        minSimilarity: 30,
    };

    private readonly _onFileChange = ({ currentTarget }: h.JSX.TargetedEvent<HTMLInputElement>): void => {
        this.setState({ error: null });
        const { files } = currentTarget;
        const f = files?.[0];
        if (f?.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.addEventListener('load', ({ target }: ProgressEvent<FileReader>): void => {
                this.setState({ image: (target as FileReader).result as string });
            });

            reader.readAsDataURL(f);
        } else {
            this.setState({ image: '' });
        }
    };

    private readonly _onFormSubmit = (e: h.JSX.TargetedEvent<HTMLFormElement>): void => {
        e.preventDefault();
        const user = this.props.user as User;
        const data = new FormData(e.currentTarget);

        this.setState({ uploadProgress: 0, error: null });
        user.getIdToken()
            .then((token) => {
                const req = new XMLHttpRequest();
                req.upload.addEventListener('progress', this._onUploadProgress);
                req.addEventListener('error', this._onUploadFailed);
                req.addEventListener('abort', this._onUploadAborted);
                req.addEventListener('timeout', this._onUploadTimeout);
                req.addEventListener('load', this._onUploadSucceeded);
                req.open('POST', 'https://api2.myrotvorets.center/identigraf/v2/search');
                req.setRequestHeader('Authorization', `Bearer ${token}`);
                return req.send(data);
            })
            .catch((err: FirebaseError) => this._setError(decodeFirebaseError(err.code, err.message)));
    };

    private readonly _onSimilarityChange = ({ currentTarget }: TargetedEvent<HTMLInputElement>): void => {
        let value = currentTarget.valueAsNumber;
        if (value < 5) {
            value = 5;
        }

        if (value > 80) {
            value = 80;
        }

        this.setState({ minSimilarity: value });
    };

    private readonly _onUploadProgress = (e: ProgressEvent<XMLHttpRequestEventTarget>): void => {
        const progress = e.lengthComputable ? (e.loaded / e.total) * 100 : -1;
        this.setState({ uploadProgress: progress });
    };

    private readonly _onUploadFailed = (/* e: ProgressEvent<XMLHttpRequestEventTarget> */): void => {
        this._setError('Помилка вивантаження файлу');
    };

    private readonly _onUploadTimeout = (): void => {
        this._setError('Час очікування вивантаження вичерпано');
    };

    private readonly _onUploadAborted = (): void => {
        this._setError('Вивантаження перервано');
    };

    private readonly _onUploadSucceeded = (e: ProgressEvent<XMLHttpRequestEventTarget>): void => {
        this.setState({ uploadProgress: 100 });
        const req = e.currentTarget as XMLHttpRequest;
        try {
            const body = JSON.parse(req.responseText) as SearchUploadResponse | ErrorResponse;
            if (body.success) {
                route(`/search/${body.guid}`);
            } else if (req.status === 401) {
                route('/logout');
            } else {
                this._setError(decodeErrorResponse(body));
            }
        } catch (err) {
            Bugsnag.notify(err as Error);
            this._setError('Несподівана помилка під час аналізу відповіді сервера');
        }
    };

    private _setError(error: string): void {
        this.setState({ uploadProgress: null, error });
    }

    public render(): ComponentChild {
        const { error, image, minSimilarity, uploadProgress } = this.state;

        return (
            <section className="searchform">
                <ReadRequirements />

                <form className="block" onSubmit={this._onFormSubmit}>
                    <header className="block__header">Пошук</header>

                    {error && <Alert message={error} />}

                    <label for="photo" htmlFor="photo" className="required">
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

                    <label for="minSimilarity" htmlFor="minSimilarity">
                        Мінімальна схожість:
                    </label>
                    <div className="input-group">
                        <input
                            type="number"
                            required
                            value={minSimilarity}
                            min={5}
                            max={80}
                            step={1}
                            id="minSimilarity"
                            name="minSimilarity"
                            onInput={this._onSimilarityChange}
                            className="form-control"
                        />
                        <div className="input-group-append">
                            <span className="input-group-text">%</span>
                        </div>
                    </div>

                    {image.length > 0 ? <img src={image} alt="Завантажена світлина" className="photo" /> : null}

                    <UploadProgress progress={uploadProgress} />

                    <UploadSubmitButton
                        disabled={image.length === 0 || uploadProgress !== null}
                        progress={uploadProgress}
                    />
                </form>
            </section>
        );
    }
}

export default withLoginCheck(SearchForm);
