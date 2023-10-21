import type * as React from 'react';

declare module 'react' {
    type ImgHTMLAttributes<T> = React.HTMLAttributes<T>;
}
