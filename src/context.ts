import { createContext } from 'react';

export interface ApplicationContext {
    user: string | null | undefined;
    setUser(this: void, user: string | null): void;
}

export const AppContext = createContext<ApplicationContext | undefined>(undefined);
