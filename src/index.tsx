import { h, render } from 'preact';
import { Provider } from 'unistore/preact';
import App from './components/App';
import store from './redux/store';
import './lib/bugsnag';

export default function Application(): h.JSX.Element {
    return (
        <Provider store={store}>
            <App />
        </Provider>
    );
}

if (!process.env.BUILD_SSR) {
    render(<Application />, document.getElementById('site') as HTMLElement);

    if (
        'serviceWorker' in navigator &&
        process.env.NODE_ENV === 'production' &&
        !/^(127|192\.168|10)\./u.test(window.location.hostname)
    ) {
        navigator.serviceWorker
            .register('/sw.js')
            .then((reg: ServiceWorkerRegistration): void => {
                // eslint-disable-next-line no-param-reassign
                reg.onupdatefound = (): void => {
                    const installingWorker = reg.installing;
                    if (installingWorker) {
                        installingWorker.onstatechange = (): void => {
                            if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                reg.update().catch(() => {
                                    /* Do nothing */
                                });
                            }
                        };
                    }
                };
            })
            .catch((): void => {
                /* Do nothing */
            });
    }
}
