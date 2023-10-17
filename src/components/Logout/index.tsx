import { useContext } from 'preact/hooks';
import { route } from 'preact-router';
import { AppContext } from '../../context';

export default function LogoutRoute(): null {
    const { setUser } = useContext(AppContext)!;
    setUser(null);
    route('/');
    return null;
}
