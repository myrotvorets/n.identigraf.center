import webpack from 'webpack';
import { merge } from 'webpack-merge';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';

import commonConfig from './webpack.common';

export default function (): webpack.Configuration {
    return merge(commonConfig, {
        mode: 'development',
        module: {
            rules: [
                {
                    test: /\.s?css$/u,
                    loaders: ['style-loader', 'css-loader', 'sass-loader'],
                },
            ],
        },
        plugins: [
            new ForkTsCheckerWebpackPlugin({
                eslint: {
                    enabled: true,
                    files: ['src/**/*.{ts,tsx}'],
                },
            }),
        ],
    } as webpack.Configuration);
}
