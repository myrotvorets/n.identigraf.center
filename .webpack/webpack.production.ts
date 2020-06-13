/* eslint-disable @typescript-eslint/camelcase */
import webpack from 'webpack';
import webpackMerge from 'webpack-merge';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import PurgecssPlugin from 'purgecss-webpack-plugin';
import SriPlugin from 'webpack-subresource-integrity';
import InlineRuntimePlugin from 'html-webpack-inline-runtime-plugin';
import glob from 'glob';
import path from 'path';
import commonConfig from './webpack.common';

export default function (): webpack.Configuration {
    return webpackMerge(commonConfig, {
        mode: 'production',
        output: {
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
                                config: {
                                    path: path.resolve(path.join(__dirname, '..')),
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
            new webpack.optimize.ModuleConcatenationPlugin(),
            new PurgecssPlugin({
                paths: glob.sync(`${path.join(__dirname, '../src')}/**/*`, {
                    nodir: true,
                }),
                whitelistPatterns: [/wa-mediabox/],
                whitelistPatternsChildren: [/wa-mediabox/],
            }),
            new MiniCssExtractPlugin({
                filename: '[name].[contenthash:5].min.css',
                chunkFilename: '[name].[contenthash:5].min.css',
            }),
            new SriPlugin({
                hashFuncNames: ['sha384'],
            }),
            new InlineRuntimePlugin(),
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
