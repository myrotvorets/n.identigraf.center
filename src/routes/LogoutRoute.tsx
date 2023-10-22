import { useContext } from 'preact/hooks';
import { route } from 'preact-router';
import { useDocumentTitle } from '../hooks/usedocumenttitle';
import { useTrackPageView } from '../hooks/usetrackpageview';
import { AppContext } from '../context';
import { lsSet } from '../utils/localstorage';

export default function LogoutRoute(): null {
    useDocumentTitle('Вийти');
    useTrackPageView();
    const { setUser, setUserLogin } = useContext(AppContext)!;
    setUser(null);
    setUserLogin('');
    lsSet('token', '');
    route('/');
    return null;
}
