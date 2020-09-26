import { h } from 'preact';
import { Link } from 'preact-router';
import { connect } from 'unistore/preact';
import { AppState } from '../../redux/store';
import MenuBar from './MenuBar';
import MenuItem from './MenuItem';
import Submenu from './Submenu';

import './navbar.scss';

type OwnProps = unknown;
interface MappedProps {
    loggedIn: boolean;
}

type Props = OwnProps & MappedProps;

function NavBar({ loggedIn }: Props): h.JSX.Element {
    return (
        <MenuBar>
            {!loggedIn && (
                <MenuItem>
                    <Link href="/">Головна</Link>
                </MenuItem>
            )}
            {loggedIn && (
                <MenuItem>
                    <Link href="/search">Пошук</Link>
                </MenuItem>
            )}
            {loggedIn && (
                <MenuItem>
                    <Link href="/compare">Порівняння</Link>
                </MenuItem>
            )}
            <Submenu title="Про сайт">
                <MenuItem>
                    <a href="https://identigraf.center/terms-of-service/">Правила користування</a>
                </MenuItem>
                <MenuItem>
                    <Link href="/requirements">Вимоги до фото для розпізнавання</Link>
                </MenuItem>
                <MenuItem>
                    <Link href="/guide">Оцінка результатів розпізнавання</Link>
                </MenuItem>
                <MenuItem>
                    <a href="https://identigraf.center/identigraf-dlya-chajnikiv/">IDentigraF для чайників</a>
                </MenuItem>
                <MenuItem>
                    <a href="https://identigraf.center/pro-identigraf/" target="_blank" rel="noopener noreferrer">
                        Сторінка Головного Каратєля
                    </a>
                </MenuItem>
            </Submenu>
            <MenuItem>
                <Link href="/contacts">Контакти</Link>
            </MenuItem>
            {loggedIn && (
                <MenuItem>
                    <Link href="/logout">Вийти</Link>
                </MenuItem>
            )}
        </MenuBar>
    );
}

function mapStateToProps(state: AppState): MappedProps {
    return {
        loggedIn: !!state.user,
    };
}

export default connect<OwnProps, unknown, AppState, MappedProps>(mapStateToProps)(NavBar);
