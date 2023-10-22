import { h } from 'preact';
import { FourOhFour } from '../components/FourOhFour';
import { useDocumentTitle } from '../hooks/usedocumenttitle';
import { useTrackPageView } from '../hooks/usetrackpageview';

export default function HomeRoute(): h.JSX.Element {
    useDocumentTitle('404: Нічого не знайдено');
    useTrackPageView();
    return <FourOhFour />;
}
