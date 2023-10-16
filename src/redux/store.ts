import createStore from 'unistore';

export interface AppState {
    user: string | null | undefined;
}

const initialState: AppState = {
    user: undefined,
};

export default createStore(initialState);
