import { Component, ComponentChild, h } from 'preact';
import { route } from 'preact-router';
import Bugsnag from '@bugsnag/js';
import type firebase from 'firebase';
import Alert from '../Alert';
import ReadRequirements from '../ReadRequirements';
import UploadProgress from '../UploadProgress';
import UploadSubmitButton from '../UploadSubmitButton';
import { withLoginCheck } from '../../hocs/withLoginCheck';
import {
    CompareUploadResponse,
    ErrorResponse,
    FirebaseError,
    decodeErrorResponse,
    decodeFirebaseError,
} from '../../api';

import '../SearchForm/searchform.scss';

interface Props {
    user: firebase.User | null | undefined;
}

interface State {
    error: string | null;
    uploadProgress: number | null;
    hasPhoto1: boolean;
    hasPhoto2: boolean;
}

class CompareForm extends Component<Props, State> {
    public state: Readonly<State> = {
        error: null,
        uploadProgress: null,
        hasPhoto1: false,
        hasPhoto2: false,
    };

    private readonly _onFileChange = ({ currentTarget }: h.JSX.TargetedEvent<HTMLInputElement>): void => {
        const { files, id } = currentTarget;
        const value = files && files.length > 0;
        const key = `has${id[0].toUpperCase()}${id.substring(1)}`;
        this.setState({ [key]: value });
    };

    private readonly _onFormSubmit = (e: h.JSX.TargetedEvent<HTMLFormElement>): void => {
        e.preventDefault();
        const user = this.props.user as firebase.User;
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
                req.open('POST', 'https://api2.myrotvorets.center/identigraf/v2/compare');
                req.setRequestHeader('Authorization', `Bearer ${token}`);
                req.send(data);
            })
            .catch((err: FirebaseError) => this._setError(decodeFirebaseError(err.code, err.message)));
    };

    private readonly _onUploadProgress = (e: ProgressEvent<XMLHttpRequestEventTarget>): void => {
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

    private readonly _onUploadFailed = (/* e: ProgressEvent<XMLHttpRequestEventTarget> */): void => {
        this._setError('Помилка вивантаження файлу');
    };

    private readonly _onUploadAborted = (): void => {
        this._setError('Вивантаження перервано');
    };

    private readonly _onUploadTimeout = (): void => {
        this._setError('Час очікування вивантаження вичерпано');
    };

    private readonly _onUploadSucceeded = (e: ProgressEvent<XMLHttpRequestEventTarget>): void => {
        this.setState({ uploadProgress: 100 });

        const req = e.currentTarget as XMLHttpRequest;
        try {
            const body = JSON.parse(req.responseText) as CompareUploadResponse | ErrorResponse;
            if (body.success) {
                route(`/compare/${body.guid}`);
            } else if (req.status === 401) {
                route('/logout');
            } else {
                this._setError(decodeErrorResponse(body));
            }
        } catch (err) {
            Bugsnag.notify(err);
            this._setError('Несподівана помилка під час аналізу відповіді сервера');
        }
    };

    private _setError(error: string): void {
        this.setState({ uploadProgress: null, error });
    }

    public render(): ComponentChild {
        const { error, hasPhoto1, hasPhoto2, uploadProgress } = this.state;

        return (
            <section className="searchform">
                <ReadRequirements />

                <form className="block" onSubmit={this._onFormSubmit} encType="multipart/form-data">
                    <header className="block__header">Порівняння</header>

                    {error && <Alert message={error} />}

                    <label htmlFor="photo1" className="required">
                        Світлина, яка порівнюється
                    </label>
                    <input
                        type="file"
                        id="photo1"
                        name="photos"
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
                        name="photos"
                        onChange={this._onFileChange}
                        required
                        accept="image/png, image/jpeg"
                        disabled={uploadProgress !== null}
                    />

                    <small>Порада: щоб вибрати кілька файлів, утримуйте клавіші Shift або Ctrl при виборі файлів</small>

                    <UploadProgress progress={uploadProgress} />

                    <UploadSubmitButton
                        disabled={!hasPhoto1 || !hasPhoto2 || uploadProgress !== null}
                        progress={uploadProgress}
                    />
                </form>
            </section>
        );
    }
}

export default withLoginCheck(CompareForm);
