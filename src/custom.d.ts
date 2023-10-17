declare module '*.svg' {
    const content: string;
    export default content;
}

declare namespace React {
    interface ImgHTMLAttributes<T> extends React.HTMLAttributes<T> {
        alt?: string | undefined;
        crossOrigin?: React.CrossOrigin;
        decoding?: 'async' | 'auto' | 'sync' | undefined;
        height?: number | string | undefined;
        loading?: 'eager' | 'lazy' | undefined;
        referrerPolicy?: React.HTMLAttributeReferrerPolicy | undefined;
        sizes?: string | undefined;
        src?: string | undefined;
        srcSet?: string | undefined;
        useMap?: string | undefined;
        width?: number | string | undefined;
    }
}
