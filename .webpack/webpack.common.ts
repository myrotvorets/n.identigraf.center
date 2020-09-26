import webpack from 'webpack';
import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import { InjectManifest } from 'workbox-webpack-plugin';
import { HwpAttributesPlugin } from 'hwp-attributes-plugin';
import ServiceWorkerPlugin from './ServiceWorkerPlugin';

const isProd = process.env.NODE_ENV === 'production';

const config: webpack.Configuration = {
    context: path.resolve(__dirname, '..'),
    entry: {
        bundle: path.resolve(__dirname, '../src/index.tsx'),
    },
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: '[name].[contenthash:5].min.mjs',
        chunkFilename: '[name].[chunkhash:5].min.mjs',
        publicPath: '/',
        pathinfo: !isProd,
        globalObject: 'self',
        jsonpScriptType: 'module',
    },
    node: false,
    devtool: isProd ? 'source-map' : 'cheap-eval-source-map',
    mode: (process.env.NODE_ENV || 'development') as 'development' | 'production' | 'none',
    resolve: {
        extensions: ['.mjs', '.js', '.jsx', '.ts', '.tsx'],
        alias: {
            react: 'preact/compat',
            'react-dom/test-utils': 'preact/test-utils',
            'react-dom': 'preact/compat',
        },
    },
    devServer: {
        headers: {
            'Access-Control-Allow-Origin': '*',
        },
        contentBase: path.resolve(__dirname, '../dist'),
        compress: true,
        port: 8081,
        historyApiFallback: true,
        writeToDisk: true,
        disableHostCheck: true,
    },
    module: {
        rules: [
            {
                enforce: 'pre',
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                },
            },
            {
                test: /\.(svg|png)$/,
                loader: 'file-loader',
                options: {
                    name: '[name].[contenthash:5].[ext]',
                    esModule: false,
                },
            },
            {
                test: /\.json$/,
                issuer: /\.html$/,
                type: 'javascript/auto',
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[contenthash:5].[ext]',
                            esModule: false,
                        },
                    },
                    {
                        loader: 'extract-loader',
                    },
                    {
                        loader: 'ref-loader',
                    },
                ],
            },
        ],
    },
    plugins: [
        new CleanWebpackPlugin(),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(isProd ? 'production' : 'development'),
            'process.env.BUILD_SSR': JSON.stringify(false),
        }),
        new webpack.ProvidePlugin({
            h: ['preact', 'h'],
            Fragment: ['preact', 'Fragment'],
        }),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: '!!ejs-webpack-loader!./src/index.html',
            xhtml: true,
            minify: {
                collapseWhitespace: true,
                removeComments: true,
                removeRedundantAttributes: true,
                removeScriptTypeAttributes: true,
                removeStyleLinkTypeAttributes: true,
                useShortDoctype: true,
                keepClosingSlash: true,
                html5: true,
                minifyCSS: true,
                sortAttributes: true,
                sortClassName: true,
            },
        }),
        new InjectManifest({
            swSrc: './src/sw.ts',
            include: ['index.html', /\.js$/, /\.svg$/, /\.css$/],
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            dontCacheBustURLsMatching: /\.[0-9a-f]{5}\.min\.(js|css)/,
        }),
        new ServiceWorkerPlugin(),
        new HwpAttributesPlugin({
            module: ['/**.mjs'],
        }),
    ],
};

export default config;
