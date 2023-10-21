import { h } from 'preact';

import refresh from '../../assets/refresh.svg';

export function Footer(): h.JSX.Element {
    return (
        <footer className="bg-primary text-center p-2">
            <p className="my-1">
                &copy; {new Date().getFullYear()} <a href="https://myrotvorets.center/">Myrotvorets Research Center</a>
            </p>
            <p className="my-1">
                Версія:{' '}
                <span id="version">
                    {process.env.APP_VERSION} <img src={refresh} alt="" width={17} height={17} />
                </span>{' '}
                &nbsp;
                <a href="mailto:support@myrotvorets.center">Щось не працює?</a>
            </p>
        </footer>
    );
}
