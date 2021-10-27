import { Component, ComponentChild, ComponentType, Fragment, RenderableProps, h } from 'preact';
import { Suspense, lazy as loafing } from 'preact/compat';
import { Route, Router } from 'preact-router';
import { ActionBinder, connect } from 'unistore/preact';
import { ActionMap } from 'unistore';
import { initializeApp } from 'firebase/app';
import { Unsubscribe, User, getAuth } from 'firebase/auth';
import firebaseConfig from '../../config/firebase';
import { AppState } from '../../redux/store';
import { setUser } from '../../redux/actions';
import Header from '../Header';
import NavBar from '../NavBar';
import Loader from '../Loader';
import Footer from '../Footer';
import RussiaIsNotWelcomeHere from '../RussiaNotWelcomeHere';

import './app.scss';

function lazy<T>(loader: () => Promise<{ default: T }> | { default: T }): T {
    if (process.env.BUILD_SSR) {
        return (loader() as { default: T }).default;
    }

    return loafing(loader as () => Promise<{ default: T }>);
}

function suspenseWrapper<T>(C: ComponentType<T>): (props: RenderableProps<T>) => h.JSX.Element {
    if (process.env.BUILD_SSR) {
        // eslint-disable-next-line react/display-name
        return (props: RenderableProps<T>): h.JSX.Element => (
            <main>
                <C {...props} />
            </main>
        );
    }

    // eslint-disable-next-line react/display-name
    return (props: RenderableProps<T>): h.JSX.Element => (
        <main>
            <Suspense fallback={<Loader />}>
                <C {...props} />
            </Suspense>
        </main>
    );
}

const HomeRoute = lazy(
    () =>
        import(
            /* webpackChunkName: "home" */
            /* webpackPrefetch: true */
            '../../components/Home'
        ),
);

const SearchRoute = lazy(
    () =>
        import(
            /* webpackChunkName: "search" */
            /* webpackPrefetch: true */
            '../../components/SearchForm'
        ),
);

const SearchResultsRoute = lazy(() => import(/* webpackChunkName: "srchres" */ '../../components/SearchResults'));
const CompareRoute = lazy(() => import(/* webpackChunkName: "compare" */ '../../components/CompareForm'));
const CompareResultsRoute = lazy(() => import(/* webpackChunkName: "cmpres" */ '../../components/CompareResults'));
const FourOhFourRoute = lazy(() => import(/* webpackMode: "eager" */ '../../components/FourOhFour'));

const LoginRoute = lazy(
    () =>
        import(
            /* webpackChunkName: "login" */
            /* webpackPrefetch: true */
            '../../components/Login'
        ),
);

const LogoutRoute = process.env.BUILD_SSR
    ? (): null => null
    : lazy(
          () =>
              import(
                  /* webpackChunkName: "logout" */
                  /* webpackMode: "eager" */
                  '../../components/Logout'
              ),
      );

const ContactsRoute = lazy(() => import(/* webpackChunkName: "contacts" */ '../../components/Contacts'));
const GuideRoute = lazy(() => import(/* webpackChunkName: "guide" */ '../../components/Guide'));
const RequirementsRoute = lazy(() => import(/* webpackChunkName: "reqs" */ '../../components/Requirements'));

type OwnProps = unknown;
interface MappedProps {
    user: User | null | undefined;
}

interface ActionProps extends ActionMap<AppState> {
    setUser: typeof setUser;
}

type Props = OwnProps & MappedProps & ActionBinder<AppState, ActionProps>;

interface State {
    isRussia: boolean;
    isFrame: boolean;
}

class App extends Component<Props, State> {
    public constructor(props: Props) {
        super(props);
        let isFrame = false;

        if (typeof window !== 'undefined') {
            const url = new URL(self.location.href);
            isFrame = url.searchParams.has('iframe');
        }

        this.state = {
            isRussia: false,
            isFrame,
        };

        initializeApp(firebaseConfig);
        getAuth().useDeviceLanguage();
    }

    public componentDidMount(): void {
        this._unsub = getAuth().onAuthStateChanged((user: User | null): void => {
            this.props.setUser(user);
        });
    }

    public componentWillUnmount(): void {
        this._unsub?.();
    }

    private _unsub: Unsubscribe | undefined;

    public render(): ComponentChild {
        const { isFrame, isRussia } = this.state;

        return (
            <Fragment>
                {!isFrame && <Header />}
                {isRussia ? (
                    <main>
                        <RussiaIsNotWelcomeHere />
                    </main>
                ) : (
                    <Fragment>
                        {!isFrame && <NavBar />}

                        <Router>
                            <Route path="/" component={suspenseWrapper(HomeRoute)} />
                            <Route path="/contacts" component={suspenseWrapper(ContactsRoute)} />
                            <Route path="/guide" component={suspenseWrapper(GuideRoute)} />
                            <Route path="/requirements" component={suspenseWrapper(RequirementsRoute)} />
                            <Route path="/login" component={suspenseWrapper(LoginRoute)} />
                            <Route path="/search/:guid" component={suspenseWrapper(SearchResultsRoute)} />
                            <Route path="/search" component={suspenseWrapper(SearchRoute)} />
                            <Route path="/compare/:guid" component={suspenseWrapper(CompareResultsRoute)} />
                            <Route path="/compare" component={suspenseWrapper(CompareRoute)} />
                            <Route path="/logout" component={suspenseWrapper(LogoutRoute)} />
                            <Route default component={suspenseWrapper(FourOhFourRoute)} />
                        </Router>
                    </Fragment>
                )}
                {!isFrame && <Footer />}
            </Fragment>
        );
    }
}

function mapStateToProps(state: AppState): MappedProps {
    return {
        user: state.user,
    };
}

export default connect<OwnProps, State, AppState, MappedProps, ActionProps>(mapStateToProps, { setUser })(App);
