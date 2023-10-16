import { h } from 'preact';

interface Props {
    onBackClicked: () => unknown;
    onRetryClicked: () => unknown;
}

export default function EmailTroubles({ onBackClicked, onRetryClicked }: Props): h.JSX.Element {
    return (
        <div className="block block--centered">
            <header className="block__header">Проблеми з отриманням електронних листів?</header>
            <p>Будь ласка, скористайтеся порадами нижче, щоб вирішити проблему:</p>
            <ul>
                <li>Перевірте, можливо, електронний лист позначено як спам або відфільтровано.</li>
                <li>Перевірте інтернет-з’єднання.</li>
                <li>Переконайтеся, що ви правильно вказали електронну адресу.</li>
                <li>Перевірте доступний обсяг пам’яті для папки "Вхідні" та інші можливі проблеми з налаштуваннями.</li>
            </ul>
            <p>
                Якщо наведені вище поради не допомагають, спробуйте знову надіслати електронний лист{' '}
                <strong>
                    (у такому разі посилання в попередньому листі стане <em>неактивним</em>)
                </strong>
                .
            </p>
            <div className="button-container">
                <button type="button" onClick={onBackClicked}>
                    Повернутись назад
                </button>{' '}
                <button type="button" onClick={onRetryClicked}>
                    Надіслати ще раз
                </button>
            </div>
        </div>
    );
}
