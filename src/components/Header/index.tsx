import { h } from 'preact';
import './header.scss';

export function Header(): h.JSX.Element {
    return (
        <header className="app-header">
            <h1>
                <a href="/">IDentigraF</a>
            </h1>
        </header>
    );
}
