import path from 'node:path';
import type { Configuration } from 'webpack';
import { merge } from 'webpack-merge';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import { PurgeCSSPlugin } from 'purgecss-webpack-plugin';
import { SubresourceIntegrityPlugin } from 'webpack-subresource-integrity';
import { HwpInlineRuntimeChunkPlugin } from 'hwp-inline-runtime-chunk-plugin';
import { sync } from 'glob';
import { commonConfiguration } from './webpack.common';

export function productionConfiguration(): Configuration {
    return merge(commonConfiguration, {
        mode: 'production',
        output: {
            pathinfo: false,
            crossOriginLoading: 'anonymous',
        },
        module: {
            rules: [
                {
                    test: /\.s?css$/u,
                    use: [
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
            new PurgeCSSPlugin({
                paths: sync(`${path.join(__dirname, '../src')}/**/*`, {
                    nodir: true,
                }),
                blocklist: [],
                safelist: {
                    greedy: [/wa-mediabox/u],
                },
            }),
            new MiniCssExtractPlugin({
                filename: '[name].[contenthash:5].min.css',
                chunkFilename: '[name].[contenthash:5].min.css',
            }),
            new HwpInlineRuntimeChunkPlugin({ removeSourceMap: true }),
            new SubresourceIntegrityPlugin({
                hashFuncNames: ['sha384'],
            }),
        ],
        optimization: {
            runtimeChunk: 'single',
            moduleIds: 'deterministic',
            minimizer: [
                new TerserPlugin({
                    terserOptions: {
                        output: {
                            comments: false,
                            ecma: 2017,
                            safari10: true,
                        },
                        sourceMap: true,
                        mangle: true,
                        compress: {
                            ecma: 2017,
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
        },
    } as Configuration);
}
