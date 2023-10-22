import { h } from 'preact';
import { CompareForm } from '../components/CompareForm';
import { useDocumentTitle } from '../hooks/usedocumenttitle';
import { useTrackPageView } from '../hooks/usetrackpageview';

export default function CompareRoute(): h.JSX.Element {
    useDocumentTitle('Порівняння');
    useTrackPageView();
    return <CompareForm />;
}
