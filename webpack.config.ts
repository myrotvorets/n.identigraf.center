/* eslint-disable @typescript-eslint/no-var-requires */
import type { Configuration } from 'webpack';

export default function (_env: Record<string, unknown>, args: Record<string, unknown>): Configuration {
    if (args.mode && args.mode === 'production') {
        process.env.NODE_ENV = 'production';
        return (
            require('./.webpack/webpack.production.ts') as typeof import('./.webpack/webpack.production.ts')
        ).productionConfiguration();
    }

    process.env.NODE_ENV = 'development';
    return (
        require('./.webpack/webpack.development.ts') as typeof import('./.webpack/webpack.development.ts')
    ).developmentConfiguration();
}
