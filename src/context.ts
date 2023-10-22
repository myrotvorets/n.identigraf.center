import { createContext } from 'react';

export interface ApplicationContext {
    token: string | null | undefined;
    userLogin: string;
    setToken(this: void, user: string | null): void;
    setUserLogin(this: void, userLogin: string): void;
}

export const AppContext = createContext<ApplicationContext | undefined>(undefined);
