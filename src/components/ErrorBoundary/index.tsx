import { Component, ComponentChild, h } from 'preact';
import Bugsnag from '@bugsnag/js';
import { Card } from 'react-bootstrap';
import { Paragraph } from '../Paragraph';

interface Props {
    error?: Error;
}

interface State {
    error?: Error;
}

export default class ErrorBoundary extends Component<Props, State> {
    public state: Readonly<State> = {
        error: this.props.error,
    };

    public static getDerivedStateFromProps(props: Readonly<Props>, prevState: Readonly<State>): Partial<State> | null {
        if (prevState.error) {
            return null;
        }

        return { error: props.error };
    }

    public static getDerivedStateFromError(error: Error): Partial<State> {
        return { error };
    }

    // eslint-disable-next-line @typescript-eslint/class-methods-use-this
    public componentDidCatch(error: Error): void {
        Bugsnag.notify(error);
        if (error.name === 'ChunkLoadError') {
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
            if (self.caches) {
                // eslint-disable-next-line promise/no-promise-in-callback
                self.caches
                    .keys()
                    // eslint-disable-next-line promise/no-promise-in-callback
                    .then((keyList) => Promise.all(keyList.map((key) => self.caches.delete(key))))
                    .then(() => ('serviceWorker' in navigator ? navigator.serviceWorker.getRegistration() : null))
                    .then((reg) => reg?.unregister())
                    .then(() => self.location.reload())
                    .catch((e: unknown) => {
                        console.error(e);
                        self.location.reload();
                    });
            } else {
                self.location.reload();
            }
        }
    }

    public render(): ComponentChild {
        const { error } = this.state;
        if (error) {
            return (
                <main className="container d-flex flex-grow-1 align-items-center justify-content-center p-4">
                    <Card className="text-bg-danger">
                        <Card.Body>
                            <Paragraph>
                                <strong>
                                    Програма закривається.
                                    <br />
                                    Закрий все, над чим ти працював:
                                    <br />
                                    Ти запросив занадто багато.
                                </strong>
                            </Paragraph>
                            <hr />
                            <Paragraph>А насправді сталася несподівана помилка 😭😭😭</Paragraph>
                            <Paragraph>
                                Наша команда вже повідомлена про цей інцидент. Ми докладаємо всіх зусиль, щоб виправити
                                цю проблему.
                            </Paragraph>
                            <hr />
                            <details>
                                <summary>Технічні деталі</summary>
                                <strong>{error.name}</strong>
                                <Paragraph>{error.message}</Paragraph>
                            </details>
                        </Card.Body>
                    </Card>
                </main>
            );
        }

        return this.props.children;
    }
}
