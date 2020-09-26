import webpack from 'webpack';
import { merge } from 'webpack-merge';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import PurgecssPlugin from 'purgecss-webpack-plugin';
import SriPlugin from 'webpack-subresource-integrity';
import { HwpInlineRuntimeChunkPlugin } from 'hwp-inline-runtime-chunk-plugin';
import glob from 'glob';
import path from 'path';
import commonConfig from './webpack.common';

export default function (): webpack.Configuration {
    return merge(commonConfig, {
        mode: 'production',
        output: {
            pathinfo: false,
            crossOriginLoading: 'anonymous',
        },
        module: {
            rules: [
                {
                    test: /\.s?css$/,
                    loaders: [
                        MiniCssExtractPlugin.loader,
                        {
                            loader: 'css-loader',
                            options: {
                                sourceMap: false,
                                importLoaders: 1,
                            },
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                sourceMap: false,
                                postcssOptions: {
                                    config: path.resolve(path.join(__dirname, '..')),
                                },
                            },
                        },
                        {
                            loader: 'sass-loader',
                            options: {
                                sourceMap: false,
                            },
                        },
                    ],
                },
            ],
        },
        plugins: [
            new webpack.HashedModuleIdsPlugin(),
            new PurgecssPlugin({
                paths: glob.sync(`${path.join(__dirname, '../src')}/**/*`, {
                    nodir: true,
                }),
                safelist: [/wa-mediabox/],
            }),
            new MiniCssExtractPlugin({
                filename: '[name].[contenthash:5].min.css',
                chunkFilename: '[name].[contenthash:5].min.css',
            }),
            new HwpInlineRuntimeChunkPlugin({ removeSourceMap: true }),
            new SriPlugin({
                hashFuncNames: ['sha384'],
            }),
        ],
        optimization: {
            moduleIds: 'hashed',
            minimizer: [
                new TerserPlugin({
                    terserOptions: {
                        output: {
                            comments: false,
                            ecma: 8,
                            safari10: true,
                        },
                        sourceMap: true,
                        mangle: true,
                        compress: {
                            ecma: 8,
                            module: true,
                            keep_fargs: false,
                            pure_getters: true,
                            hoist_funs: true,
                            pure_funcs: [
                                'classCallCheck',
                                '_classCallCheck',
                                '_possibleConstructorReturn',
                                'Object.freeze',
                                'invariant',
                                'warning',
                            ],
                        },
                    },
                    extractComments: false,
                }),
            ],
            minimize: true,
            runtimeChunk: {
                name: 'runtime',
            },
        },
    } as webpack.Configuration);
}
