import { Fragment, h } from 'preact';
import { useContext } from 'preact/hooks';
import { Nav, NavDropdown, Navbar } from 'react-bootstrap';
import { AppContext } from '../../context';

interface Props {
    url: string;
}

export function NavBar({ url }: Props): h.JSX.Element {
    const { user } = useContext(AppContext)!;
    return (
        <Navbar expand="md" variant="dark">
            <Navbar.Toggle aria-controls="navbar-nav" />
            <Navbar.Collapse id="navbar-nav">
                <Nav activeKey={url}>
                    {typeof user !== 'string' && (
                        <Nav.Item>
                            <Nav.Link href="/">Головна</Nav.Link>
                        </Nav.Item>
                    )}
                    {typeof user === 'string' && (
                        <Fragment>
                            <Nav.Item>
                                <Nav.Link href="/search">Пошук</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link href="/compare">Порівняння</Nav.Link>
                            </Nav.Item>
                        </Fragment>
                    )}
                    <NavDropdown title="Про сайт" menuVariant="dark" active={url.startsWith('/about/')}>
                        <NavDropdown.Item href="https://identigraf.center/terms-of-service/">
                            Правила користування
                        </NavDropdown.Item>
                        <NavDropdown.Item href="/about/requirements" eventKey="/about/requirements">
                            Вимоги до фото для розпізнавання
                        </NavDropdown.Item>
                        <NavDropdown.Item href="/about/guide" eventKey="/about/guide">
                            Оцінка результатів розпізнавання
                        </NavDropdown.Item>
                        <NavDropdown.Item href="https://identigraf.center/identigraf-dlya-chajnikiv/">
                            IDentigraF для чайників
                        </NavDropdown.Item>
                        <NavDropdown.Item
                            href="https://identigraf.center/pro-identigraf/"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Сторінка Головного Каратєля
                        </NavDropdown.Item>
                    </NavDropdown>
                    <Nav.Item>
                        <Nav.Link href="/contacts">Контакти</Nav.Link>
                    </Nav.Item>
                    {typeof user === 'string' && (
                        <Nav.Item>
                            <Nav.Link href="/logout">Вийти</Nav.Link>
                        </Nav.Item>
                    )}
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
}
