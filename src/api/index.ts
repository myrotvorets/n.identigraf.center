import Bugsnag from '@bugsnag/js';
import type {
    CheckPhoneResponse,
    CompareStatusResponse,
    ErrorResponse,
    LoginResponse,
    MatchedFacesResponse,
    SearchStatusResponse,
    VerifyCodeResponse,
    VerifyTokenResponse,
} from './types';
export * from './errors';
export * from './types';

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export default class API {
    public static async sendCode(email: string): Promise<ErrorResponse | true> {
        const headers: Record<string, string> = {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        };

        try {
            const response = await fetch('https://api2.myrotvorets.center/identigraf-auth/v2/send-code', {
                headers,
                method: 'POST',
                body: JSON.stringify({ email }),
            });

            if (response.status === 204) {
                return true;
            }

            return {
                success: false,
                status: response.status,
                code: 'UNKNOWN_ERROR',
                message: 'Невідома помилка',
            };
        } catch (e) {
            Bugsnag.notify(e as Error);
            return {
                success: false,
                status: 502,
                code: 'COMM_ERROR',
                message: 'Помилка спілкування з сервером',
            };
        }
    }

    public static verifyCode(email: string, code: string): Promise<VerifyCodeResponse | ErrorResponse> {
        return API.post('/identigraf-auth/v2/verify-code', { email, code });
    }

    public static async verifyToken(token: string): Promise<ErrorResponse | string | false> {
        const headers: Record<string, string> = {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        };

        try {
            const response = await fetch('https://api2.myrotvorets.center/identigraf-auth/v2/verify-jwt', {
                headers,
                method: 'POST',
                body: JSON.stringify({ token }),
            });

            const data = (await response.json()) as VerifyTokenResponse | ErrorResponse;

            if (response.status === 200 && data.success) {
                return data.login;
            }

            if (response.status === 401) {
                return false;
            }

            return {
                success: false,
                status: response.status,
                code: data.success ? 'UNKNOWN_ERROR' : data.code,
                message: data.success ? 'Невідома помилка' : data.message,
            };
        } catch (e) {
            Bugsnag.notify(e as Error);
            return {
                success: false,
                status: 502,
                code: 'COMM_ERROR',
                message: 'Помилка спілкування з сервером',
            };
        }
    }

    public static checkPhone(phone: string): Promise<CheckPhoneResponse | ErrorResponse> {
        return API.post('/identigraf-auth/v2/checkphone', { phone });
    }

    public static login(token: string): Promise<LoginResponse | ErrorResponse> {
        return API.post('/identigraf-auth/v2/login', undefined, token);
    }

    public static checkCompareStatus(guid: string): Promise<CompareStatusResponse | ErrorResponse> {
        return API.get(`/identigraf/v2/compare/${guid}`);
    }

    public static checkSearchStatus(guid: string): Promise<SearchStatusResponse | ErrorResponse> {
        return API.get(`/identigraf/v2/search/${guid}`);
    }

    public static getMatchedFaces(guid: string, faceID: number): Promise<MatchedFacesResponse | ErrorResponse> {
        return API.get(`/identigraf/v2/search/${guid}/matches/${faceID}/0/20`);
    }

    private static post<R>(endpoint: string, body: unknown, auth?: string): Promise<R | ErrorResponse> {
        const headers: Record<string, string> = {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        };

        if (auth) {
            headers.Authorization = `Bearer ${auth}`;
        }

        return API.fetch<R>(`https://api2.myrotvorets.center${endpoint}`, {
            method: 'POST',
            headers,
            body: body !== undefined ? JSON.stringify(body) : undefined,
        });
    }

    private static get<R>(endpoint: string, auth?: string): Promise<R | ErrorResponse> {
        const headers: Record<string, string> = {
            Accept: 'application/json',
        };

        if (auth) {
            headers.Authorization = `Bearer ${auth}`;
        }

        return API.fetch<R>(`https://api2.myrotvorets.center${endpoint}`, { headers });
    }

    private static fetch<R>(endpoint: string, init: RequestInit): Promise<R | ErrorResponse> {
        let r: Response | undefined;
        return fetch(endpoint, init)
            .then((response) => {
                r = response;
                return response.json() as Promise<R>;
            })
            .catch((e: Error) => {
                e.message += ` (${init.method ?? 'GET'} ${endpoint}) => ${r?.status ?? 'unknown'}}`;
                Bugsnag.notify(e);
                return {
                    success: false,
                    status: 502,
                    code: 'COMM_ERROR',
                    message: 'Помилка спілкування з сервером',
                };
            });
    }
}
