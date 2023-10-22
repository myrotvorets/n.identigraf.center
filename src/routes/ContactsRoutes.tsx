import { h } from 'preact';
import { Contacts } from '../components/Contacts';
import { useDocumentTitle } from '../hooks/usedocumenttitle';
import { useTrackPageView } from '../hooks/usetrackpageview';

export default function SearchRoute(): h.JSX.Element {
    useDocumentTitle('Контакти');
    useTrackPageView();
    return <Contacts />;
}
