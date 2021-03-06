import { h } from 'preact';
import { Link } from 'preact-router';

export default function Guide(): h.JSX.Element {
    return (
        <section className="Guide">
            <div className="block">
                <header className="block__header">Керівництво з оцінки результатів</header>

                <p>
                    <strong>
                        З метою отримання якісних результатів порівняння необхідно дотримуватися{' '}
                        <Link href="/requirements">
                            Вимог до підготовки фотоматеріалів для використання в системі розпізнавання облич
                        </Link>
                        .
                    </strong>
                </p>

                <h2>Оцінка результатів порівняння 1:1 (один до одного)</h2>

                <p>
                    За умов дотримання вимог до підготовки фотоматеріалів, якщо при порівняння двох фотографій за
                    допомогою Системи розпізнавання система надає 90-100% схожості, за цих умов можна з високим ступенем
                    вірогідності стверджувати, що на цих фотографіях присутнє обличчя однієї й тієї ж особи (емпірично
                    встановлено, що з 82%).
                </p>

                <p>
                    За умов використання при порівнянні фотографій, які суттєво відрізняються від рекомендованих,
                    ступінь схожості може бути 70-100% для однієї й тієї ж особи. Це є цілком нормальним, бо навіть
                    обличчя однієї й тієї ж особи в різних ракурсах може суттєво відрізнятися, а за умов використання
                    неякісних фотоматеріалі при порівнянні, якість розпізнавання може суттєво зменшуватися.
                </p>

                <p>
                    Чим вище процент схожості, тим більше вірогідність того, що на фотографіях, що порівнюються,
                    присутнє обличчя однієї й тієї ж особи. При отриманні проценту схожості 60-80% є висока
                    вірогідність, що фотографії, які порівнювалися, належать різним особам.
                </p>

                <p>
                    У будь якому випадку при отриманні результатів порівняння зі ступенем схожості меншим ніж 95-100%,
                    вірогідність того, що фотографії, які порівнювалися, належать одній й тій же особі, падає разом зі
                    зменшенням проценту схожості, який надає система розпізнавання обличь.
                </p>

                <h2>Оцінка результатів пошуку в базі даних в режимі один до багатьох (1:N)</h2>

                <p>
                    В режимі порівняння один до багатьох (1:N) результат порівняння обличь дуже суттєво залежить від
                    якості фотографії, яка подається на пошук, та якості фотографій, які використовувалися при занесенні
                    до бази даних системи розпізнавання обличь.
                </p>

                <p>
                    В цьому режимі отримання результату порівняння 90-100% схожості є ознакою, що фотографія, яка була
                    використана для пошуку, та обличчя, що зображені на фотографіях як результати пошуку, з високим
                    ступенем вірогідності може належати одній й тій ж особі. В деяких випадках на фотоматеріалах низької
                    якості ступінь схожості однієї й тієї ж особи може бути меншим та складати 70-100%, а система
                    розпізнавання за результатами пошуку та порівняння може видати інших осіб, які схожі на особу, що
                    порівнюється. Такий результат пошуку є цілком нормальним, оскільки дуже залежить від якості
                    фотоматеріалів, які використовувалися для розпізнавання. Зазвичай система розпізнавання надає
                    можливість в результатах пошуку надавати пов’язаних осіб, які були присутні на групових фотографіях
                    разом з особою, що порівнювалася. Це надає додаткові можливості більш точної ідентифікації осіб за
                    результатами пошуку.
                </p>

                <p>
                    Особливістю роботи системи розпізнавання є те, що зазвичай на одну й ту ж особу в базу даних
                    занесені декілька обличь, які були взяті з різних фотоматеріалів. В цих випадках результатом
                    розпізнавання будуть всі порівняння по всіх фотографіях, які були занесені в базу даних, з
                    обов’язковим наданням посилань на оригінали фотографій, з яких бралися обличчя при занесенні до бази
                    даних. Оскільки всі фотоматеріали в пошуковій системі проіндексовані та пов’язані з великими базами
                    накопичених додаткових (структурованих та неструктурованих) даних, при прийнятті рішення про ступінь
                    схожості обличчя, що використовувалося для пошуку, з обличчями в пошуковій базі даних системи
                    розпізнавання обличь слід використовувати усю інформацію, яка надається як результат пошуку.
                </p>

                <h2>Оцінка результатів пошуку в базі даних в режимі група до багатьох (N:M)</h2>

                <p>
                    Система розпізнавання обличь має змогу опрацьовувати групові фотографії, які можуть надаватися
                    системі для подальшого пошуку та розпізнавання. В цьому режимі з групової фотографії, яка надається
                    для розпізнавання, на подальше розпізнавання направляються всі обличчя, які були виявлені та
                    захоплені системою розпізнавання. З метою отримання якісних результатів захоплення та порівняння
                    обличь в цьому режимі слід суворо дотримуватися{' '}
                    <Link href="/requirements">
                        Вимог до підготовки фотоматеріалів для використання в системі розпізнавання облич
                    </Link>
                    .
                </p>

                <p>
                    Оцінка результатів пошуку в цьому режимі виконується аналогічно режиму порівняння один до багатьох
                    (1:N) з однією суттєвою відмінністю – система надає результати пошуку по всіх захоплених обличчях
                    групового фото, що може складати великий масив інформації, до оцінювання якої слід відноситися дуже
                    уважно, з урахуванням всіх додаткових (структурованих та неструктурованих) даних, які надаються як
                    результат пошуку.
                </p>

                <h2>Оцінка негативних результатів пошуку та розпізнавання облич</h2>

                <p>
                    У випадках, коли система розпізнавання не надає позитивних результатів пошуку в базі даних
                    розпізнавання облич, причини можуть бути різні:
                </p>

                <ol>
                    <li>
                        Обличчя особи (осіб) з фотографії (групової фотографії), яка надавалась для розпізнавання,
                        дійсно відсутнє в базі даних системи розпізнавання або ступінь схожості за результатами
                        порівняння виявилася невисокою (менш ніж 60%). В особливих випадках можна спробувати пізніше
                        через деякий час ще раз направити фотографію на розпізнавання, оскільки база данних системи
                        розпізнавання безперервно поповнюється та вдосконалюється. Не виключено, що після повторного
                        запиту результати розпізнавання можуть бути позитивними.
                    </li>
                    <li>
                        Були порушені{' '}
                        <Link href="/requirements">
                            Вимоги до підготовки фотоматеріалів для використання в системі розпізнавання облич
                        </Link>
                        . В цьому випадку необхідно ще раз уважно вивчити ці Вимоги, спробувати виправити порушення та
                        ще раз направити фотографію на розпізнавання.
                    </li>
                    <li>
                        Система розпізнавання обличь на момент відправлення запиту була перевантажена обробкою інших,
                        запитів, які надійшли раніше. В цьому випадку слід почекати відповіді системи, спробувати
                        відправити свій запит ще раз, або зробити це пізніше, коли спаде пік навантаження системи
                        розпізнавання.
                    </li>
                    <li>
                        В окремих особливих випадках система розпізнавання може видавати помилки або незрозумілі
                        користувачам результати розпізнавання. Робота над удосконаленням системи розпізнавання
                        продовжується постійно, розробники будуть вдячні за надання зауважень та пропозицій по роботі
                        системи розпізнавання за електронною адресою, вказаною у розділі{' '}
                        <Link href="/contacts">Контакти</Link>.
                    </li>
                </ol>
            </div>
        </section>
    );
}
