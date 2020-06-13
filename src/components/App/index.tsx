import { ComponentChild, ComponentType, Fragment, RenderableProps, h } from 'preact';
import { PureComponent, Suspense, lazy as loafing } from 'preact/compat';
import { Route, Router } from 'preact-router';
import { ActionBinder, connect } from 'unistore/preact';
import { ActionMap } from 'unistore';
import { AppState } from '../../redux/store';
import { setLoggedIn, setLoggedOut } from '../../redux/actions';
import API from '../../api';
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

function suspenseWrapper<T>(Component: ComponentType<T>): (props: RenderableProps<T>) => h.JSX.Element {
    if (process.env.BUILD_SSR) {
        return (props: RenderableProps<T>): h.JSX.Element => (
            <main>
                <Component {...props} />
            </main>
        );
    }

    return (props: RenderableProps<T>): h.JSX.Element => (
        <main>
            <Suspense fallback={<Loader />}>
                <Component {...props} />
            </Suspense>
        </main>
    );
}

const HomeRoute = lazy(() =>
    import(
        /* webpackChunkName: "home" */
        /* webpackPrefetch: true */
        '../../components/Home'
    ),
);

const SearchRoute = lazy(() =>
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

const LoginRoute = lazy(() =>
    import(
        /* webpackChunkName: "login" */
        /* webpackPrefetch: true */
        '../../components/Login'
    ),
);

const LogoutRoute = process.env.BUILD_SSR
    ? (): null => null
    : lazy(() =>
          import(
              /* webpackChunkName: "logout" */
              /* webpackMode: "eager" */
              '../../components/Logout'
          ),
      );

const ContactsRoute = lazy(() => import(/* webpackChunkName: "contacts" */ '../../components/Contacts'));
const GuideRoute = lazy(() => import(/* webpackChunkName: "guide" */ '../../components/Guide'));
const RequirementsRoute = lazy(() => import(/* webpackChunkName: "reqs" */ '../../components/Requirements'));

type OwnProps = {};
interface MappedProps {
    loggedIn: boolean | null;
}

interface ActionProps extends ActionMap<AppState> {
    setLoggedIn: typeof setLoggedIn;
    setLoggedOut: typeof setLoggedOut;
}

type Props = OwnProps & MappedProps & ActionBinder<AppState, ActionProps>;

interface State {
    isRussia: boolean;
    isFrame: boolean;
}

class App extends PureComponent<Props, State> {
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
    }

    public componentDidMount(): void {
        if (null === this.props.loggedIn) {
            API.checkSession().then((res: string): void => {
                if (res === '+') {
                    this.props.setLoggedIn();
                } else {
                    if (res === 'A') {
                        this.setState({ isRussia: true });
                    }

                    this.props.setLoggedOut();
                }
            });
        }
    }

    public render(): ComponentChild {
        const { isFrame, isRussia } = this.state;

        return (
            <Fragment>
                {isFrame ? null : <Header />}
                {isRussia ? (
                    <main>
                        <RussiaIsNotWelcomeHere />
                    </main>
                ) : (
                    <Fragment>
                        {isFrame ? null : <NavBar />}

                        <Router>
                            <Route path="/" component={suspenseWrapper(HomeRoute)} />
                            <Route path="/contacts" component={suspenseWrapper(ContactsRoute)} />
                            <Route path="/guide" component={suspenseWrapper(GuideRoute)} />
                            <Route path="/requirements" component={suspenseWrapper(RequirementsRoute)} />
                            <Route path="/login" component={suspenseWrapper<{}>(LoginRoute)} />
                            <Route path="/search/:guid" component={suspenseWrapper(SearchResultsRoute)} />
                            <Route path="/search" component={suspenseWrapper(SearchRoute)} />
                            <Route path="/compare/:guid" component={suspenseWrapper(CompareResultsRoute)} />
                            <Route path="/compare" component={suspenseWrapper(CompareRoute)} />
                            <Route path="/logout" component={suspenseWrapper<{}>(LogoutRoute)} />
                            <Route default component={suspenseWrapper(FourOhFourRoute)} />
                        </Router>
                    </Fragment>
                )}
                {isFrame ? null : <Footer />}
            </Fragment>
        );
    }
}

function mapStateToProps(state: AppState): MappedProps {
    return {
        loggedIn: state.loggedIn,
    };
}

export default connect<OwnProps, {}, AppState, MappedProps, ActionProps>(mapStateToProps, {
    setLoggedIn,
    setLoggedOut,
})(App);
