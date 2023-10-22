import { Fragment, h } from 'preact';
import { route } from 'preact-router';
import { useCallback, useEffect, useState } from 'preact/hooks';
import { Loader } from '../Loader';
import { CodeForm, type CodeFormState } from './CodeForm';
import { EmailForm, type EmailFormState } from './EmailForm';
import { EmailTroubles } from './EmailTroubles';
import type { ApplicationContext } from '../../context';
import API, { type ErrorResponse, decodeErrorResponse } from '../../api';
import { lsSet } from '../../utils/localstorage';
import { withVisitorCheck } from '../../hocs/withLoginCheck';

type LoginFormState = EmailFormState | CodeFormState | 'troubles' | 'logged_in';

const sendCode = async (email: string): Promise<true | ErrorResponse> => {
    const response = await API.checkPhone(email);
    if (!response.success) {
        return response;
    }

    return API.sendCode(email);
};

const verifyCode = async (email: string, code: string): Promise<string | ErrorResponse> => {
    const verifyResult = await API.verifyCode(email, code);
    if (!verifyResult.success) {
        return verifyResult;
    }

    const { token } = verifyResult;

    const r = await API.login(token);
    return r.success ? token : r;
};

interface Props {
    setToken?: ApplicationContext['setToken'];
    setLogin?: ApplicationContext['setUserLogin'];
}

function LoginFormInternal({ setToken, setLogin }: Readonly<Props>): h.JSX.Element | null {
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [state, setState] = useState<LoginFormState>('initial');

    const onEmailSubmit = useCallback((value: string) => {
        setState('sending');
        setEmail(value);
    }, []);

    const onCodeSubmit = useCallback((value: string) => {
        setState('verifying');
        setCode(value);
    }, []);

    const onBackClicked = useCallback(() => {
        setState('link_sent');
        setError('');
    }, []);
    const onRetryClicked = useCallback(() => setState('sending'), []);
    const onEmailIssues = useCallback(() => setState('troubles'), []);
    const onResetClicked = useCallback(() => {
        setState('initial');
        setError('');
    }, []);

    useEffect(() => {
        const handlePromise = (
            promise: Promise<string | true | ErrorResponse>,
            nextState: LoginFormState,
            errorState: LoginFormState,
        ): Promise<string | true | null> =>
            promise
                .then((result) => {
                    if (typeof result === 'string' || true === result) {
                        setState(nextState);
                        setError('');
                        return result;
                    }

                    setState(errorState);
                    setError(decodeErrorResponse(result));
                    return null;
                })
                .catch((_err) => {
                    setState(errorState);
                    setError('Виникла несподівана помилка.');
                    return null;
                });

        if (state === 'sending') {
            void handlePromise(sendCode(email), 'link_sent', 'initial');
        } else if (state === 'verifying') {
            void handlePromise(verifyCode(email, code), 'logged_in', 'link_sent').then((result) => {
                if (typeof result === 'string') {
                    lsSet('token', result);
                    setToken!(result);
                    setLogin!(email);
                    route('/search');
                }
            });
        }
    }, [state, email, code, setToken, setLogin]);

    switch (state) {
        case 'initial':
        case 'sending':
            return (
                <Fragment>
                    <EmailForm email={email} error={error} state={state} onSubmit={onEmailSubmit} />
                    {state === 'sending' && <Loader />}
                </Fragment>
            );

        case 'link_sent':
        case 'verifying':
            return (
                <Fragment>
                    <CodeForm
                        email={email}
                        error={error}
                        state={state}
                        onIssues={onEmailIssues}
                        onReset={onResetClicked}
                        onSubmit={onCodeSubmit}
                    />
                    {state === 'verifying' && <Loader />}
                </Fragment>
            );

        case 'troubles':
            return <EmailTroubles onBackClicked={onBackClicked} onRetryClicked={onRetryClicked} />;

        default:
            return <Loader />;
    }
}

export const LoginForm = withVisitorCheck(LoginFormInternal);
