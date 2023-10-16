import type { AppState } from '../store';

export function setUser(state: AppState, user: string | null): Partial<AppState> {
    return {
        user,
    };
}
