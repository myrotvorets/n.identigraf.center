import type { User } from 'firebase/auth';
import type { AppState } from '../store';

export function setUser(state: AppState, user: User | null): Partial<AppState> {
    return {
        user,
    };
}
