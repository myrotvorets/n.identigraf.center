import type { Configuration } from 'webpack';
import { merge } from 'webpack-merge';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import { commonConfiguration } from './webpack.common';

export function developmentConfiguration(): Configuration {
    return merge(commonConfiguration, {
        mode: 'development',
        module: {
            rules: [
                {
                    test: /\.s?css$/u,
                    use: ['style-loader', 'css-loader', 'sass-loader'],
                },
            ],
        },
        plugins: [new ForkTsCheckerWebpackPlugin()],
    } as Configuration);
}
