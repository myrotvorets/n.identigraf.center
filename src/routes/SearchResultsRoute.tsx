import { h } from 'preact';
import { SearchResults } from '../components/SearchResults';
import { useDocumentTitle } from '../hooks/usedocumenttitle';
import { useTrackPageView } from '../hooks/usetrackpageview';

interface Props {
    guid: string;
}

export default function SearchRoute({ guid }: Props): h.JSX.Element {
    useDocumentTitle('Запит результатів пошуку');
    useTrackPageView();
    return <SearchResults guid={guid} />;
}
