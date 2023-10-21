import { h } from 'preact';
import { Link } from 'preact-router';
import { Card } from 'react-bootstrap';
import { CardHeader } from '../CardHeader';
import { Paragraph } from '../Paragraph';

export default function Guide(): h.JSX.Element {
    return (
        <Card as="article">
            <CardHeader>Керівництво з оцінки результатів</CardHeader>
            <Card.Body>
                <Paragraph>
                    <strong>
                        З метою отримання якісних результатів порівняння необхідно дотримуватися{' '}
                        <Link href="/about/requirements">
                            Вимог до підготовки фотоматеріалів для використання в системі розпізнавання облич
                        </Link>
                        .
                    </strong>
                </Paragraph>

                <section className="mb-4">
                    <h3>Оцінка результатів порівняння 1:1 (один до одного)</h3>

                    <Paragraph>
                        За умов дотримання вимог до підготовки фотоматеріалів, якщо при порівняння двох фотографій за
                        допомогою Системи розпізнавання система надає 90-100%&nbsp;схожості, за цих умов можна з високим
                        ступенем ймовірності стверджувати, що на цих фотографіях присутнє обличчя однієї й тієї ж особи
                        (емпірично встановлено, що&nbsp;з&nbsp;82%).
                    </Paragraph>

                    <Paragraph>
                        За умов використання при порівнянні фотографій, які суттєво відрізняються від рекомендованих,
                        ступінь схожості може бути&nbsp;70-100% для однієї й тієї ж особи. Це є цілком нормальним, бо
                        навіть обличчя однієї й тієї ж особи в різних ракурсах може суттєво відрізнятися, а за умов
                        використання неякісних фотоматеріалів при порівнянні, якість розпізнавання може суттєво
                        зменшуватися.
                    </Paragraph>

                    <Paragraph>
                        Чим вище відсоток схожості, тим більше ймовірность того, що на фотографіях, що порівнюються,
                        присутнє обличчя однієї й тієї ж особи. При отриманні відсотку схожості&nbsp;60-80% є висока
                        ймовірность, що фотографії, які порівнювалися, належать різним особам.
                    </Paragraph>

                    <Paragraph>
                        У будь якому випадку при отриманні результатів порівняння зі ступенем схожості меншим
                        ніж&nbsp;95-100%, ймовірность того, що фотографії, які порівнювалися, належать одній й тій же
                        особі, падає разом зі зменшенням відсотку схожості, який надає система розпізнавання облич.
                    </Paragraph>
                </section>

                <section className="mb-4">
                    <h3>Оцінка результатів пошуку в базі даних в режимі «один до багатьох» (1:N)</h3>

                    <Paragraph>
                        В режимі порівняння «один до багатьох» (1:N), результат порівняння облич дуже суттєво залежить
                        від якості фотографії, яка подається на пошук, та якості фотографій, які використовувалися при
                        занесенні до бази даних системи розпізнавання облич.
                    </Paragraph>

                    <Paragraph>
                        В цьому режимі отримання результату порівняння 90-100%&nbsp;схожості є ознакою, що фотографія,
                        яка була використана для пошуку, та обличчя, що зображені на фотографіях як результати пошуку, з
                        високим ступенем вірогідності може належати одній й тій ж особі. В деяких випадках на
                        фотоматеріалах низької якості ступінь схожості однієї й тієї ж особи може бути меншим та
                        складати&nbsp;70-100%, а система розпізнавання за результатами пошуку та порівняння може видати
                        інших осіб, які схожі на особу, що порівнюється. Такий результат пошуку є цілком нормальним,
                        оскільки дуже залежить від якості фотоматеріалів, які використовувалися для розпізнавання.
                        Зазвичай система розпізнавання надає можливість в результатах пошуку надавати пов’язаних осіб,
                        які були присутні на групових фотографіях разом з особою, що порівнювалася. Це надає додаткові
                        можливості більш точної ідентифікації осіб за результатами пошуку.
                    </Paragraph>

                    <Paragraph>
                        Особливістю роботи системи розпізнавання є те, що зазвичай на одну й ту ж особу в базу даних
                        занесені декілька облич, які були взяті з різних фотоматеріалів. В цих випадках результатом
                        розпізнавання будуть всі порівняння по всіх фотографіях, які були занесені в базу даних, з
                        обов’язковим наданням посилань на оригінали фотографій, з яких бралися обличчя при занесенні до
                        бази даних. Оскільки всі фотоматеріали в пошуковій системі проіндексовані та пов’язані з
                        великими базами накопичених додаткових (структурованих та неструктурованих) даних, при прийнятті
                        рішення про ступінь схожості обличчя, що використовувалося для пошуку, з обличчями в пошуковій
                        базі даних системи розпізнавання облич слід використовувати усю інформацію, яка надається як
                        результат пошуку.
                    </Paragraph>
                </section>

                <section className="mb-4">
                    <h3>Оцінка результатів пошуку в базі даних в режимі «група до багатьох» (N:M)</h3>

                    <Paragraph>
                        Система розпізнавання облич має змогу опрацьовувати групові фотографії, які можуть надаватися
                        системі для подальшого пошуку та розпізнавання. В цьому режимі з групової фотографії, яка
                        надається для розпізнавання, на подальше розпізнавання направляються всі обличчя, які були
                        виявлені та захоплені системою розпізнавання. З метою отримання якісних результатів захоплення
                        та порівняння облич в цьому режимі слід суворо дотримуватися{' '}
                        <Link href="/about/requirements">
                            Вимог до підготовки фотоматеріалів для використання в системі розпізнавання облич
                        </Link>
                        .
                    </Paragraph>

                    <Paragraph>
                        Оцінка результатів пошуку в цьому режимі виконується аналогічно режиму порівняння «один до
                        багатьох» (1:N) з однією суттєвою відмінністю&nbsp;— система надає результати пошуку по всіх
                        захоплених обличчях групового фото, що може складати великий масив інформації, до оцінювання
                        якої слід відноситися дуже уважно, з урахуванням всіх додаткових (структурованих та
                        неструктурованих) даних, які надаються як результат пошуку.
                    </Paragraph>
                </section>

                <section className="mb-4">
                    <h3>Оцінка негативних результатів пошуку та розпізнавання облич</h3>

                    <Paragraph>
                        У випадках, коли система розпізнавання не надає позитивних результатів пошуку в базі даних
                        розпізнавання облич, причини можуть бути різні:
                    </Paragraph>

                    <ol>
                        <li>
                            Обличчя особи (осіб) з фотографії (групової фотографії), яка надавалась для розпізнавання,
                            дійсно відсутнє в базі даних системи розпізнавання або ступінь схожості за результатами
                            порівняння виявилася невисокою (менш ніж&nbsp;60%). В особливих випадках можна спробувати
                            пізніше через деякий час ще раз направити фотографію на розпізнавання, оскільки база данних
                            системи розпізнавання безперервно поповнюється та вдосконалюється. Не виключено, що після
                            повторного запиту результати розпізнавання можуть бути позитивними.
                        </li>
                        <li>
                            Були порушені{' '}
                            <Link href="/about/requirements">
                                Вимоги до підготовки фотоматеріалів для використання в системі розпізнавання облич
                            </Link>
                            . В цьому випадку необхідно ще раз уважно вивчити ці Вимоги, спробувати виправити порушення
                            та ще раз направити фотографію на розпізнавання.
                        </li>
                        <li>
                            Система розпізнавання облич на момент відправлення запиту була перевантажена обробкою інших
                            запитів, які надійшли раніше. В цьому випадку слід почекати відповіді системи, спробувати
                            відправити свій запит ще раз, або зробити це пізніше, коли спаде пік навантаження системи
                            розпізнавання.
                        </li>
                        <li>
                            В окремих особливих випадках система розпізнавання може видавати помилки або незрозумілі
                            користувачам результати розпізнавання. Робота над удосконаленням системи розпізнавання
                            продовжується постійно, розробники будуть вдячні за надання зауважень та пропозицій по
                            роботі системи розпізнавання за електронною адресою, вказаною у розділі{' '}
                            <Link href="/contacts">Контакти</Link>.
                        </li>
                    </ol>
                </section>
            </Card.Body>
        </Card>
    );
}
