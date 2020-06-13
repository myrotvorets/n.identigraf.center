import webpack from 'webpack';
import webpackMerge from 'webpack-merge';

import commonConfig from './webpack.common';

export default function (): webpack.Configuration {
    return webpackMerge(commonConfig, {
        mode: 'development',
        module: {
            rules: [
                {
                    test: /\.s?css$/,
                    loaders: ['style-loader', 'css-loader', 'sass-loader'],
                },
            ],
        },
        plugins: [],
    } as webpack.Configuration);
}
