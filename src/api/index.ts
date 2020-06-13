import Bugsnag from '@bugsnag/js';

interface InProgressResponse {
    status: 'inprogress';
}

interface FailedResponse {
    status: 'failed';
}

interface SearchCompletedResponse {
    status: 'success';
    counts: number[];
    pathJ: string;
    pathW: string;
}

interface Face {
    index: number;
    minSimilarity: number;
    maxSimilarity: number;
    face: string;
}

interface CapturedFacesSuccessResponse {
    status: 'success';
    faces: Face[];
}

export interface MatchedFaceSuccess {
    similarity: number;
    face: string;
    name: string;
    link: string;
    country: string;
    mphoto: string;
    pphoto: string;
}

export interface MatchedFaceFailure {
    status: 'failed';
}

interface CompareCompletedResponse {
    status: 'success';
    results: Record<string, [string, string, number]>;
}

type CheckSearchStatusResponse = InProgressResponse | FailedResponse | SearchCompletedResponse;
type CheckCompareStatusResponse = InProgressResponse | FailedResponse | CompareCompletedResponse;
type CapturedFacesResponse = InProgressResponse | FailedResponse | CapturedFacesSuccessResponse;
export type MatchedFaceResponse = Record<number, (MatchedFaceSuccess | MatchedFaceFailure)[]>;

export default class API {
    public static async startSession(token: string): Promise<string> {
        try {
            const r = await fetch('/api/user/startSession', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token }),
            });

            if (r.ok) {
                return '+';
            }

            if (r.status === 403) {
                const json = await r.json();
                return 'reason' in json ? json.reason : '-';
            }

            if (r.status === 429) {
                return 'Z';
            }

            return '-';
        } catch (e) {
            Bugsnag.notify(e);
            return '-';
        }
    }

    public static async checkSession(): Promise<string> {
        try {
            const r = await fetch('/api/user/verify', {
                method: 'POST',
                credentials: 'include',
            });

            switch (r.status) {
                case 204:
                    return '+';
                case 403:
                    return 'A';
                default:
                    return '-';
            }
        } catch (e) {
            Bugsnag.notify(e);
            return '-';
        }
    }

    public static async logout(): Promise<boolean> {
        try {
            const r = await fetch('/api/user/logout', {
                method: 'POST',
                credentials: 'include',
            });

            return r.ok;
        } catch (e) {
            Bugsnag.notify(e);
            return false;
        }
    }

    public static async checkSearchStatus(guid: string): Promise<CheckSearchStatusResponse> {
        try {
            const r = await fetch(`/api/search/status/${guid}`);
            return await r.json();
        } catch (e) {
            Bugsnag.notify(e);
            return { status: 'failed' };
        }
    }

    public static async getCapturedFaces(guid: string): Promise<CapturedFacesResponse> {
        try {
            const r = await fetch(`/api/search/captured/${guid}`);
            return await r.json();
        } catch (e) {
            Bugsnag.notify(e);
            return { status: 'failed' };
        }
    }

    public static async getMatchedFaces(guid: string, count: number): Promise<MatchedFaceResponse> {
        try {
            const r = await fetch(`/api/search/matched/${guid}/${count}`);
            return await r.json();
        } catch (e) {
            Bugsnag.notify(e);
            const result: MatchedFaceResponse = {};
            for (let i = 1; i <= count; ++i) {
                result[i] = [{ status: 'failed' }];
            }

            return result;
        }
    }

    public static async checkCompareStatus(guid: string): Promise<CheckCompareStatusResponse> {
        try {
            const r = await fetch(`/api/compare/status/${guid}`);
            return await r.json();
        } catch (e) {
            Bugsnag.notify(e);
            return { status: 'failed' };
        }
    }
}
