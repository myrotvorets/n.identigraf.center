import firebase from 'firebase/app';
import { AppState } from '../store';

export function setUser(state: AppState, user: firebase.User | null): Partial<AppState> {
    return {
        user,
    };
}
