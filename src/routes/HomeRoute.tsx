import { h } from 'preact';
import { Home } from '../components/Home';
import { useDocumentTitle } from '../hooks/usedocumenttitle';
import { useTrackPageView } from '../hooks/usetrackpageview';

export default function HomeRoute(): h.JSX.Element {
    useDocumentTitle('IDentigraF');
    useTrackPageView();
    return <Home />;
}
