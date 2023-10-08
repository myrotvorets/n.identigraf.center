import { h, render } from 'preact';
import { Provider } from 'unistore/preact';
import App from './components/App';
import ErrorBoundary from './components/ErrorBoundary';
import store from './redux/store';
import './lib/bugsnag';

export default function Application(): h.JSX.Element {
    return (
        <ErrorBoundary>
            <Provider store={store}>
                <App />
            </Provider>
        </ErrorBoundary>
    );
}

if (!process.env.BUILD_SSR) {
    const body = document.body;
    while (body.firstChild) {
        body.removeChild(body.firstChild);
    }

    render(<Application />, body);

    if (
        'serviceWorker' in navigator &&
        process.env.NODE_ENV === 'production' &&
        !/^((127|192\.168|10)\.|localhost)/u.test(window.location.hostname)
    ) {
        navigator.serviceWorker
            .register('/sw.js')
            .then((reg) =>
                reg.addEventListener('updatefound', () => {
                    const installingWorker = reg.installing;
                    installingWorker?.addEventListener('statechange', () => {
                        if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            // eslint-disable-next-line promise/no-nesting
                            reg.update().catch((e) => console.error(e));
                        }
                    });
                }),
            )
            .catch((e) => {
                console.error(e);
            });
    }

    const ver = document.getElementById('version');
    if (ver) {
        ver.addEventListener('click', () => {
            if (self.caches) {
                self.caches
                    .keys()
                    .then((keyList) => Promise.all(keyList.map((key) => self.caches.delete(key))))
                    .then(() => ('serviceWorker' in navigator ? navigator.serviceWorker.getRegistration() : null))
                    .then((reg) => reg?.unregister())
                    .then(() => self.location.reload())
                    .catch((e) => {
                        console.error(e);
                        self.location.reload();
                    });
            } else {
                self.location.reload();
            }
        });
    }
}
