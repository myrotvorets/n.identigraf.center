import createStore from 'unistore';

export interface AppState {
    loggedIn: boolean | null;
}

const initialState: AppState = {
    loggedIn: null,
};

export default createStore(initialState);
