import { useContext, useEffect } from 'preact/hooks';
import { AppContext } from '../context';
import { setUserID, trackPageView } from '../api/tracker';

export function useTrackPageView(): void {
    const { userLogin } = useContext(AppContext)!;
    useEffect(() => {
        if (userLogin) {
            setUserID(userLogin);
        }

        trackPageView(document.title);
    }, [userLogin]);
}
