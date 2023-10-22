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
            '../../../routes/HomeRoute'
        ),
);

export const SearchRoute = lazy(
    () =>
        import(
            /* webpackChunkName: "search" */
            /* webpackPrefetch: true */
            '../../../routes/SearchRoute'
        ),
);

export const SearchResultsRoute = lazy(
    () => import(/* webpackChunkName: "srchres" */ '../../../routes/SearchResultsRoute'),
);

export const CompareRoute = lazy(() => import(/* webpackChunkName: "compare" */ '../../../routes/CompareRoute'));
export const CompareResultsRoute = lazy(
    () => import(/* webpackChunkName: "cmpres" */ '../../../routes/CompareResultsRoute'),
);

export const FourOhFourRoute = lazy(() => import(/* webpackMode: "eager" */ '../../../routes/FourOhFourRoute'));

export const LoginRoute = lazy(
    () =>
        import(
            /* webpackChunkName: "login" */
            /* webpackPrefetch: true */
            '../../../routes/LoginRoute'
        ),
);

export const LogoutRoute = process.env.BUILD_SSR
    ? (): null => null
    : lazy(
          () =>
              import(
                  /* webpackChunkName: "logout" */
                  /* webpackMode: "eager" */
                  '../../../routes/LogoutRoute'
              ),
      );

export const ContactsRoute = lazy(() => import(/* webpackChunkName: "contacts" */ '../../../routes/ContactsRoute'));
export const GuideRoute = lazy(() => import(/* webpackChunkName: "about" */ '../../../routes/GuideRoute'));
export const RequirementsRoute = lazy(
    () => import(/* webpackChunkName: "about" */ '../../../routes/RequirementsRoute'),
);
