import { h } from 'preact';
import { Requirements } from '../components/Requirements';
import { useDocumentTitle } from '../hooks/usedocumenttitle';
import { useTrackPageView } from '../hooks/usetrackpageview';

export default function RequirementsRoute(): h.JSX.Element {
    useDocumentTitle('Вимоги до підготовки фотоматеріалів');
    useTrackPageView();
    return <Requirements />;
}
