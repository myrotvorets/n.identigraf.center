import { h } from 'preact';
import { SearchForm } from '../components/SearchForm';
import { useDocumentTitle } from '../hooks/usedocumenttitle';
import { useTrackPageView } from '../hooks/usetrackpageview';

export default function SearchRoute(): h.JSX.Element {
    useDocumentTitle('Пошук');
    useTrackPageView();
    return <SearchForm />;
}
