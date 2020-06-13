import { h } from 'preact';
import { Link } from 'preact-router';
import logo from '../../assets/identigraf-logo.svg';
import './header.scss';

export default function Header(): h.JSX.Element {
    return (
        <header className="app-header">
            <Link href="/">
                <img src={logo} alt="IDentigraF" />
            </Link>
        </header>
    );
}
