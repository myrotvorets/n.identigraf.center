import { h } from 'preact';
import { Link } from 'preact-router';
import Alert from '../Alert';

export default function ReadRequirements(): h.JSX.Element {
    return (
        <Alert className="info">
            <strong>Уважно</strong> прочитайте <Link href="/requirements">Вимоги до підготовки фотоматеріалів</Link>.
        </Alert>
    );
}
