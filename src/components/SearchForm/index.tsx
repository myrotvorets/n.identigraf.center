import { h } from 'preact';
import { useCallback, useEffect, useState } from 'preact/hooks';
import { route } from 'preact-router';
import { Alert, Card, Form, Image, InputGroup } from 'react-bootstrap';
import Bugsnag from '@bugsnag/js';
import { CardHeader } from '../CardHeader';
import { ReadRequirements } from '../ReadRequirements';
import { UploadProgress } from '../UploadProgress';
import { UploadSubmitButton } from '../UploadSubmitButton';
import { type ErrorResponse, type SearchUploadResponse, decodeErrorResponse } from '../../api';
import { useXHR } from '../../hooks/usexhr';
import { withLoginCheck } from '../../hocs/withLoginCheck';
import { Paragraph } from '../Paragraph';

interface Props {
    token?: string;
}

function SearchFormInternal({ token }: Readonly<Props>): h.JSX.Element {
    const [image, setImage] = useState('');
    const [error, setError] = useState<string>('');
    const [minSimilarity, setMinSimilarity] = useState<number>(30);
    const [data, setData] = useState<FormData | undefined>(undefined);

    const {
        progress: uploadProgress,
        error: xhrError,
        response,
        finished,
    } = useXHR('https://api2.myrotvorets.center/identigraf/v2/search', token!, data);

    const onFileChange = useCallback(({ currentTarget }: h.JSX.TargetedEvent<HTMLInputElement>): void => {
        setError('');
        const { files } = currentTarget;
        const f = files?.[0];
        if (f?.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.addEventListener('load', ({ target }: ProgressEvent<FileReader>): void => {
                setImage(target!.result as string);
            });

            reader.readAsDataURL(f);
        } else {
            setImage('');
        }
    }, []);

    const onSimilarityChange = useCallback(({ currentTarget }: h.JSX.TargetedInputEvent<HTMLInputElement>): void => {
        const value = currentTarget.valueAsNumber;
        if (value < 5) {
            setMinSimilarity(5);
        } else if (value > 80) {
            setMinSimilarity(80);
        } else {
            setMinSimilarity(value);
        }
    }, []);

    const onFormSubmit = useCallback(
        (e: h.JSX.TargetedSubmitEvent<HTMLFormElement>): void => {
            e.preventDefault();
            if (image.length !== 0 && isNaN(uploadProgress)) {
                setData(new FormData(e.currentTarget));
            }
        },
        [image, uploadProgress],
    );

    useEffect(() => setError(xhrError ? 'Помилка вивантаження файлу' : ''), [xhrError]);

    useEffect(() => {
        if (finished && response) {
            try {
                const body = JSON.parse(response.response) as SearchUploadResponse | ErrorResponse;
                if (body.success) {
                    route(`/search/${body.guid}`);
                } else if (response.status === 401) {
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
                <CardHeader>Пошук</CardHeader>
                <Card.Body>
                    {error && <Alert variant="danger">{error}</Alert>}

                    <Form.Group controlId="photo" className="mb-3">
                        <Form.Label>Світлина для розпізнавання:</Form.Label>
                        <Form.Control
                            type="file"
                            required
                            accept="image/png, image/jpeg"
                            disabled={!isNaN(uploadProgress)}
                            onChange={onFileChange}
                            name="photo"
                        />
                    </Form.Group>

                    <Form.Group controlId="minSimilarity" className="mb-3">
                        <Form.Label>Мінімальна схожість:</Form.Label>
                        <InputGroup>
                            <Form.Control
                                type="number"
                                value={minSimilarity}
                                required
                                name="minSimilarity"
                                min={5}
                                max={80}
                                onInput={onSimilarityChange}
                            />
                            <InputGroup.Text>%</InputGroup.Text>
                        </InputGroup>
                    </Form.Group>

                    {image.length > 0 ? (
                        <Image src={image} alt="Завантажена світлина" className="img-fluid mb-3" />
                    ) : null}

                    <UploadProgress progress={uploadProgress} />

                    <Paragraph>
                        <UploadSubmitButton
                            disabled={image.length === 0 || !isNaN(uploadProgress)}
                            progress={uploadProgress}
                        />
                    </Paragraph>
                </Card.Body>
            </Card>
        </section>
    );
}

export const SearchForm = withLoginCheck(SearchFormInternal);
