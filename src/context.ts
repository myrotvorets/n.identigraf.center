import { createContext } from 'react';

export interface ApplicationContext {
    user: string | null | undefined;
    userLogin: string;
    setUser(this: void, user: string | null): void;
    setUserLogin(this: void, userLogin: string): void;
}

export const AppContext = createContext<ApplicationContext | undefined>(undefined);
