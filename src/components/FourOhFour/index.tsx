import { h } from 'preact';
import Alert from '../Alert';

export default function FourOhFour(): h.JSX.Element {
    return (
        <Alert>
            <p>
                <strong>
                    Ти вступаєш в річку,
                    <br />
                    Але річка не залишається колишньою.
                    <br />
                    Цієї web-сторінки тут вже немає 😞
                </strong>
            </p>
            <p>
                <a href="/">Повернутися до головної сторинки</a>
            </p>
        </Alert>
    );
}
