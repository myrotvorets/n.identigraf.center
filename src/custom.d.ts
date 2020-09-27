/* eslint-disable @typescript-eslint/no-explicit-any */

declare module '*.svg' {
    const content: any;
    export default content;
}

declare module '*.lazy.scss' {
    export function use(): void;
    export function unuse(): void;
}

declare module 'unistore/preact' {
    import { AnyComponent, ComponentConstructor } from 'preact';
    import { ActionCreator, ActionFn, ActionMap, StateMapper } from 'unistore';

    type TupleTail<T extends any[], R> = T['length'] extends 0
        ? never
        : ((...tail: T) => R) extends (head: any, ...tail: infer I) => R
        ? I
        : never;

    type MakeBoundAction<K, A extends (...args: any) => Promise<Partial<K>> | Partial<K> | void> = (
        ...args: TupleTail<Parameters<A>, ReturnType<A>>
    ) => ReturnType<A>;

    type BoundActionFn<K, F extends ActionFn<K>> = MakeBoundAction<K, F>;

    export type ActionBinder<K, T extends ActionMap<K>> = {
        [P in keyof T]: BoundActionFn<K, T[P]>;
    };

    export function connect<T, S, K, I, A extends ActionMap<K>>(
        mapStateToProps: string | string[] | StateMapper<T, K, I>,
        actions: ActionCreator<K> | A,
    ): (
        Child: ComponentConstructor<T & I & ActionBinder<K, A>, S> | AnyComponent<T & I & ActionBinder<K, A>, S>,
    ) => ComponentConstructor<T | (T & I & ActionBinder<K, A>), S>;
}

declare module 'wa-mediabox' {
    export class WAMediaBox {
        public lang: {
            prev: string;
            next: string;
            close: string;
            openInNew: string;
        };

        public galleries: Record<string | number, any>;

        public openGallery(gallery: string | number, index: number): void;
        public addImage(gallery: string | number, src: string, title: string): void;
        public addIframe(
            gallery: string | number,
            src: string,
            title: string,
            width: string | number,
            height: string | number,
        ): void;
        public bind(el: HTMLElement): void;
        public bindAll(el: HTMLElement): void;
    }
}
