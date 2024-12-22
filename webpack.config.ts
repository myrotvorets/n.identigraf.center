import type { Configuration } from 'webpack';

export default async function (_env: Record<string, unknown>, args: Record<string, unknown>): Promise<Configuration> {
    if (args.mode === 'production') {
        process.env.NODE_ENV = 'production';
        const { productionConfiguration } = await import('./.webpack/webpack.production');
        return productionConfiguration();
    }

    process.env.NODE_ENV = 'development';
    const { developmentConfiguration } = await import('./.webpack/webpack.development');
    return developmentConfiguration();
}
