import { AppState } from '../store';

export function setLoggedIn(): Partial<AppState> {
    return {
        loggedIn: true,
    };
}

export function setLoggedOut(): Partial<AppState> {
    return {
        loggedIn: false,
    };
}
