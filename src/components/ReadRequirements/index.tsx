import { h } from 'preact';
import { Link } from 'preact-router';
import { Alert } from 'react-bootstrap';

export function ReadRequirements(): h.JSX.Element {
    return (
        <Alert variant="info">
            <strong>Уважно</strong> прочитайте{' '}
            <Link href="/about/requirements">Вимоги до підготовки фотоматеріалів</Link>.
        </Alert>
    );
}
