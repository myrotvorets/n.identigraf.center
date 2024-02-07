import { h } from 'preact';
import { useCallback, useEffect, useRef, useState } from 'preact/hooks';
import { Alert, Button, Card, Form } from 'react-bootstrap';
import { CardHeader } from '../../CardHeader';
import { Paragraph } from '../../Paragraph';
import { useDocumentTitle } from '../../../hooks/usedocumenttitle';
import { useTrackPageView } from '../../../hooks/usetrackpageview';

export type CodeFormState = 'link_sent' | 'verifying';

interface Props {
    email: string;
    error: string;
    state: CodeFormState;
    onIssues: () => unknown;
    onReset: () => unknown;
    onSubmit: (code: string) => unknown;
}

const isCodeValid = (code: string): boolean => /^\d{6}$/u.test(code);

export function CodeForm({ email, error, onIssues, onReset, onSubmit, state }: Readonly<Props>): h.JSX.Element {
    const [code, setCode] = useState('');
    const [codeValid, setCodeValid] = useState<boolean | undefined>(undefined);
    const ref = useRef<HTMLInputElement>(null);

    let title: string;
    if (state === 'verifying') {
        title = 'Перевірка коду…';
    } else {
        title = 'Підтвердьте адресу електронної пошти';
    }

    useDocumentTitle(title);
    useTrackPageView();

    const onFormSubmit = useCallback(
        (e: h.JSX.TargetedSubmitEvent<HTMLFormElement>) => {
            e.preventDefault();
            if (codeValid) {
                onSubmit(code);
            } else {
                ref.current?.focus();
                ref.current?.reportValidity();
            }
        },
        [code, codeValid, onSubmit],
    );

    const onCodeUpdate = useCallback(({ currentTarget }: h.JSX.TargetedEvent<HTMLInputElement>): void => {
        const { value } = currentTarget;
        setCode(value);
        setCodeValid(isCodeValid(value));
    }, []);

    const onCancelClicked = useCallback(() => {
        if (state !== 'verifying') {
            onReset();
        }
    }, [state, onReset]);

    const onIssuesClicked = useCallback(() => {
        if (state !== 'verifying') {
            onIssues();
        }
    }, [state, onIssues]);

    useEffect(() => {
        ref.current?.focus();
    }, []);

    return (
        <Card as="form" onSubmit={onFormSubmit}>
            <CardHeader>{title}</CardHeader>
            <Card.Body>
                {error && <Alert variant="danger">{error}</Alert>}
                <Paragraph>
                    Будь ласка, введіть 6-значний код, який ми надіслали на <strong>{email}</strong>
                </Paragraph>
                <Form.Group className="mb-3" controlId="code">
                    <Form.Label>
                        Код перевірки<span className="sr-only"> (обов'язкове поле)</span>:
                    </Form.Label>
                    <Form.Control
                        type="text"
                        inputMode="numeric"
                        required
                        value={code}
                        onChangeCapture={onCodeUpdate}
                        isInvalid={codeValid === false}
                        isValid={codeValid === true}
                        readOnly={state === 'verifying'}
                        aria-invalid={codeValid !== undefined ? `${!codeValid}` : undefined}
                        aria-describedby={codeValid !== false ? undefined : 'email-error'}
                        aria-disabled={state === 'verifying' ? 'true' : 'false'}
                        ref={ref}
                        format="[0-9]{6}"
                    />
                    {codeValid === false && (
                        <Form.Control.Feedback type="invalid" id="email-error">
                            Невірний формат коду перевірки.
                        </Form.Control.Feedback>
                    )}
                </Form.Group>
                <Button
                    type="submit"
                    variant="primary"
                    className="mb-2"
                    aria-disabled={state === 'verifying' || !codeValid ? 'true' : 'false'}
                >
                    {state !== 'verifying' ? 'Продовжити' : 'Перевірка триває…'}
                </Button>{' '}
                <Button
                    type="button"
                    variant="danger"
                    className="mb-2"
                    onClick={onCancelClicked}
                    aria-disabled={state === 'verifying' ? 'true' : 'false'}
                >
                    Скасувати
                </Button>
            </Card.Body>
            <Card.Footer>
                <Button
                    variant="link"
                    onClick={onIssuesClicked}
                    aria-disabled={state === 'verifying' ? 'true' : 'false'}
                >
                    Проблеми з отриманням електронних листів?
                </Button>
            </Card.Footer>
        </Card>
    );
}
