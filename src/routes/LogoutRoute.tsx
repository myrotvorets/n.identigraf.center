import { useContext } from 'preact/hooks';
import { route } from 'preact-router';
import { useDocumentTitle } from '../hooks/usedocumenttitle';
import { useTrackPageView } from '../hooks/usetrackpageview';
import { AppContext } from '../context';

export default function LogoutRoute(): null {
    useDocumentTitle('Вийти');
    useTrackPageView();
    const { setToken, setUserLogin } = useContext(AppContext)!;
    setToken(null);
    setUserLogin('');
    route('/');
    return null;
}
