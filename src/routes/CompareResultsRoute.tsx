import { h } from 'preact';
import { CompareResults } from '../components/CompareResults';
import { useDocumentTitle } from '../hooks/usedocumenttitle';
import { useTrackPageView } from '../hooks/usetrackpageview';

interface Props {
    guid: string;
}

export default function SearchRoute({ guid }: Readonly<Props>): h.JSX.Element {
    useDocumentTitle('Запит результатів порівняння');
    useTrackPageView();
    return <CompareResults guid={guid} />;
}
