import { lazy as loafing } from 'preact/compat';

function lazy<T>(loader: () => Promise<{ default: T }> | { default: T }): T {
    if (process.env.BUILD_SSR) {
        return (loader() as { default: T }).default;
    }

    return loafing(loader as () => Promise<{ default: T }>);
}

export const HomeRoute = lazy(
    () =>
        import(
            /* webpackChunkName: "home" */
            /* webpackPrefetch: true */
            '../../../components/Home'
        ),
);

export const SearchRoute = lazy(
    () =>
        import(
            /* webpackChunkName: "search" */
            /* webpackPrefetch: true */
            '../../../components/SearchForm'
        ),
);

export const SearchResultsRoute = lazy(
    () => import(/* webpackChunkName: "srchres" */ '../../../components/SearchResults'),
);
export const CompareRoute = lazy(() => import(/* webpackChunkName: "compare" */ '../../../components/CompareForm'));
export const CompareResultsRoute = lazy(
    () => import(/* webpackChunkName: "cmpres" */ '../../../components/CompareResults'),
);
export const FourOhFourRoute = lazy(() => import(/* webpackMode: "eager" */ '../../../components/FourOhFour'));

export const LoginRoute = lazy(
    () =>
        import(
            /* webpackChunkName: "login" */
            /* webpackPrefetch: true */
            '../../../components/Login'
        ),
);

export const LogoutRoute = process.env.BUILD_SSR
    ? (): null => null
    : lazy(
          () =>
              import(
                  /* webpackChunkName: "logout" */
                  /* webpackMode: "eager" */
                  '../../../components/Logout'
              ),
      );

export const ContactsRoute = lazy(() => import(/* webpackChunkName: "contacts" */ '../../../components/Contacts'));
export const GuideRoute = lazy(() => import(/* webpackChunkName: "about" */ '../../../components/Guide'));
export const RequirementsRoute = lazy(() => import(/* webpackChunkName: "about" */ '../../../components/Requirements'));
