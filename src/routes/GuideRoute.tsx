import { h } from 'preact';
import { Guide } from '../components/Guide';
import { useDocumentTitle } from '../hooks/usedocumenttitle';
import { useTrackPageView } from '../hooks/usetrackpageview';

export default function GuideRoute(): h.JSX.Element {
    useDocumentTitle('Керівництво з оцінки результатів');
    useTrackPageView();
    return <Guide />;
}
