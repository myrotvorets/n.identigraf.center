import { h } from 'preact';
import { useCallback, useEffect, useState } from 'preact/hooks';
import { route } from 'preact-router';
import { Alert, Card, Form } from 'react-bootstrap';
import Bugsnag from '@bugsnag/js';
import { CardHeader } from '../CardHeader';
import { Paragraph } from '../Paragraph';
import { ReadRequirements } from '../ReadRequirements';
import { UploadProgress } from '../UploadProgress';
import { UploadSubmitButton } from '../UploadSubmitButton';
import { type CompareUploadResponse, type ErrorResponse, decodeErrorResponse } from '../../api';
import { withLoginCheck } from '../../hocs/withLoginCheck';
import { useXHR } from '../../hooks/usexhr';

interface Props {
    token?: string;
}

function CompareFormInternal({ token }: Readonly<Props>): h.JSX.Element {
    const [error, setError] = useState<string>('');
    const [data, setData] = useState<FormData | undefined>(undefined);
    const [hasPhoto1, setHasPhoto1] = useState(false);
    const [hasPhoto2, setHasPhoto2] = useState(false);

    const {
        progress: uploadProgress,
        error: xhrError,
        response,
        finished,
    } = useXHR('https://api2.myrotvorets.center/identigraf/v2/compare', token!, data);

    const onFileChange = useCallback(({ currentTarget }: h.JSX.TargetedEvent<HTMLInputElement>): void => {
        const { files, id } = currentTarget;
        const value = files !== null && files.length > 0;
        if (id === 'photo1') {
            setHasPhoto1(value);
        } else if (id === 'photo2') {
            setHasPhoto2(value);
        }
    }, []);

    const onFormSubmit = useCallback(
        (e: h.JSX.TargetedEvent<HTMLFormElement>): void => {
            e.preventDefault();
            if (hasPhoto1 && hasPhoto2 && isNaN(uploadProgress)) {
                setData(new FormData(e.currentTarget));
            }
        },
        [hasPhoto1, hasPhoto2, uploadProgress],
    );

    useEffect(() => setError(xhrError ? 'Помилка вивантаження файлу' : ''), [xhrError]);

    useEffect(() => {
        if (finished) {
            try {
                const body = JSON.parse(response!.response) as CompareUploadResponse | ErrorResponse;
                if (body.success) {
                    route(`/compare/${body.guid}`);
                } else if (response!.status === 401) {
                    route('/logout');
                } else {
                    setError(decodeErrorResponse(body));
                }
            } catch (err) {
                Bugsnag.notify(err as Error);
                setError('Несподівана помилка під час аналізу відповіді сервера');
            }
        }
    }, [finished, response]);

    return (
        <section className="d-flex flex-column w-100">
            <ReadRequirements />

            <Card as="form" onSubmit={onFormSubmit}>
                <CardHeader>Порівняння</CardHeader>
                <Card.Body>
                    {error && <Alert variant="danger">{error}</Alert>}

                    <Form.Group controlId="photo1" className="mb-3">
                        <Form.Label>Світлина, яка порівнюється</Form.Label>
                        <Form.Control
                            name="photos"
                            type="file"
                            required
                            accept="image/png, image/jpeg"
                            disabled={!isNaN(uploadProgress)}
                            onChange={onFileChange}
                        />
                    </Form.Group>

                    <Form.Group controlId="photo2" className="mb-3">
                        <Form.Label>Еталонні світлини (до 10 файлів)</Form.Label>
                        <Form.Control
                            name="photos"
                            type="file"
                            required
                            multiple
                            accept="image/png, image/jpeg"
                            disabled={!isNaN(uploadProgress)}
                            onChange={onFileChange}
                        />
                        <Form.Text className="text-muted">
                            Порада: щоб вибрати кілька файлів, утримуйте клавіші Shift або Ctrl при виборі файлів
                        </Form.Text>
                    </Form.Group>

                    <UploadProgress progress={uploadProgress} />

                    <Paragraph>
                        <UploadSubmitButton
                            disabled={!hasPhoto1 || !hasPhoto2 || !isNaN(uploadProgress)}
                            progress={uploadProgress}
                        />
                    </Paragraph>
                </Card.Body>
            </Card>
        </section>
    );
}

export const CompareForm = withLoginCheck(CompareFormInternal);
