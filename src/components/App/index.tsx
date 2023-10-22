import { Fragment, h } from 'preact';
import { useCallback, useEffect, useMemo, useState } from 'preact/hooks';
import { Route, Router, RouterOnChangeArgs, getCurrentUrl } from 'preact-router';
import { Header } from '../Header';
import { NavBar } from '../NavBar';
import { Footer } from '../Footer';
import { RussiaIsNotWelcomeHere } from '../RussiaNotWelcomeHere';
import {
    CompareResultsRoute,
    CompareRoute,
    ContactsRoute,
    FourOhFourRoute,
    GuideRoute,
    HomeRoute,
    LoginRoute,
    LogoutRoute,
    RequirementsRoute,
    SearchResultsRoute,
    SearchRoute,
} from './routes';
import { lsGet } from '../../utils/localstorage';
import { suspenseWrapper } from '../../utils/suspensewrapper';
import API, { type ErrorResponse, type GeoResponse } from '../../api';
import { setPageURL, setUserID, trackPageView } from '../../api/tracker';
import { AppContext, type ApplicationContext } from '../../context';
import './app.scss';

export default function App(): h.JSX.Element {
    const [isRussia, setIsRussia] = useState(false);
    const [user, setUser] = useState<string | null | undefined>(undefined);
    const [userLogin, setUserLogin] = useState('');
    const [url, setUrl] = useState<string>(getCurrentUrl());
    let isFrame = false;

    if (typeof window !== 'undefined') {
        isFrame = new URL(self.location.href).searchParams.has('iframe');
    }

    const setUserLoginAndTrack = useCallback(
        (login: string) => {
            setUserLogin(login);
            if (login) {
                setUserID(login);
            }

            trackPageView();
        },
        [setUserLogin],
    );

    const ctx: ApplicationContext = useMemo(() => {
        return {
            user,
            userLogin,
            setUser,
            setUserLogin: setUserLoginAndTrack,
        };
    }, [user, userLogin, setUser, setUserLoginAndTrack]);

    useEffect(() => {
        async function checkCountry(): Promise<void> {
            try {
                const response = await fetch('https://api2.myrotvorets.center/ipgeo/v2/country');
                const data = (await response.json()) as GeoResponse | ErrorResponse;
                setIsRussia(data.success && data.response.cc === 'RU');
            } catch (e) {
                console.error(e);
            }
        }

        async function checkToken(): Promise<void> {
            const token = lsGet('token');
            if (token) {
                const valid = await API.verifyToken(token);
                if (valid === true) {
                    setUser(token);
                    return;
                }
            }

            setUser(null);
        }

        void Promise.all([checkCountry(), checkToken()]);
    }, []);

    const onRouteChange = useCallback((e: RouterOnChangeArgs): void => {
        setUrl(e.url);
        setPageURL(e.url, e.previous);
    }, []);

    return (
        <AppContext.Provider value={ctx}>
            {!isFrame && <Header />}
            {isRussia ? (
                <main className="container d-flex flex-grow-1 align-items-center justify-content-center p-4">
                    <RussiaIsNotWelcomeHere />
                </main>
            ) : (
                <Fragment>
                    {!isFrame && <NavBar url={url} />}

                    <main className="container d-flex flex-grow-1 align-items-center justify-content-center p-4">
                        <Router onChange={onRouteChange}>
                            <Route path="/" component={suspenseWrapper(HomeRoute)} />
                            <Route path="/contacts" component={suspenseWrapper(ContactsRoute)} />
                            <Route path="/about/guide" component={suspenseWrapper(GuideRoute)} />
                            <Route path="/about/requirements" component={suspenseWrapper(RequirementsRoute)} />
                            <Route path="/login" component={suspenseWrapper(LoginRoute)} />
                            <Route path="/search/:guid" component={suspenseWrapper(SearchResultsRoute)} />
                            <Route path="/search" component={suspenseWrapper(SearchRoute)} />
                            <Route path="/compare/:guid" component={suspenseWrapper(CompareResultsRoute)} />
                            <Route path="/compare" component={suspenseWrapper(CompareRoute)} />
                            <Route path="/logout" component={suspenseWrapper(LogoutRoute)} />
                            <Route default component={suspenseWrapper(FourOhFourRoute)} />
                        </Router>
                    </main>
                </Fragment>
            )}
            {!isFrame && <Footer />}
        </AppContext.Provider>
    );
}
