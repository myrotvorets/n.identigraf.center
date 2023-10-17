import { h } from 'preact';
import { useCallback, useEffect, useRef, useState } from 'preact/hooks';
import { Alert, Button, Card, Form } from 'react-bootstrap';
import { CardHeader } from '../../CardHeader';

export type EmailFormState = 'initial' | 'sending';

interface Props {
    error: string;
    email: string;
    state: EmailFormState;
    onSubmit: (email: string) => unknown;
}

export function EmailForm({ email: propsEmail, error, onSubmit, state }: Props): h.JSX.Element {
    const [email, setEmail] = useState(propsEmail);
    const [emailValid, setEmailValid] = useState<boolean | undefined>(undefined);
    const ref = useRef<HTMLInputElement>(null);

    const emailUpdateHandler = useCallback(({ currentTarget }: h.JSX.TargetedEvent<HTMLInputElement>): void => {
        const { value } = currentTarget;
        setEmail(value);
        setEmailValid(currentTarget.checkValidity());
    }, []);

    const onFormSubmit = useCallback(
        (e: Event): void => {
            e.preventDefault();
            let valid;
            if (emailValid === undefined) {
                valid = ref.current?.checkValidity();
                setEmailValid(valid);
            } else {
                valid = emailValid;
            }

            if (valid) {
                onSubmit(email);
            } else {
                ref.current?.focus();
                ref.current?.reportValidity();
            }
        },
        [email, emailValid, onSubmit],
    );

    useEffect(() => {
        ref.current?.focus();
    }, []);

    return (
        <Card onSubmit={onFormSubmit} as="form" className="w-100">
            <CardHeader>Увійти</CardHeader>
            <Card.Body>
                {error && <Alert variant="danger">{error}</Alert>}

                <Form.Group className="mb-3" controlId="email">
                    <Form.Label>
                        Електронна адреса<span className="sr-only"> (обов'язкове поле)</span>:
                    </Form.Label>
                    <Form.Control
                        type="email"
                        inputMode="email"
                        required
                        value={email}
                        onChangeCapture={emailUpdateHandler}
                        isInvalid={emailValid === false}
                        isValid={emailValid === true}
                        readOnly={state === 'sending'}
                        aria-invalid={emailValid !== undefined ? `${!emailValid}` : undefined}
                        aria-describedby={emailValid !== false ? undefined : 'email-error'}
                        aria-disabled={state === 'sending' ? 'true' : 'false'}
                        ref={ref}
                    />
                    {emailValid === false && (
                        <Form.Control.Feedback type="invalid" id="email-error">
                            Невірна адреса електронної пошти.
                        </Form.Control.Feedback>
                    )}
                </Form.Group>

                <Button
                    variant="primary"
                    type="submit"
                    aria-disabled={state === 'sending' || !emailValid ? 'true' : 'false'}
                >
                    {state !== 'sending' ? 'Далі…' : 'Відправлення посилання…'}
                </Button>
            </Card.Body>
        </Card>
    );
}
