import webpack from 'webpack';
import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import { InjectManifest } from 'workbox-webpack-plugin';
import { HwpAttributesPlugin } from 'hwp-attributes-plugin';
import { execSync } from 'child_process';
import { extendDefaultPlugins } from 'svgo';

let version: string;
try {
    version = execSync('git describe --always --long', { cwd: path.resolve(path.join(__dirname, '..')) })
        .toString()
        .trim();
} catch (e) {
    version = 'development';
}

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
        assetModuleFilename: '[name].[contenthash:5][ext]',
        publicPath: '/',
        pathinfo: !isProd,
        globalObject: 'self',
        scriptType: 'module',
        crossOriginLoading: 'anonymous',
    },
    node: false,
    devtool: isProd ? 'source-map' : 'eval-cheap-source-map',
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
                test: /\.tsx?$/u,
                exclude: /node_modules/u,
                use: {
                    loader: 'babel-loader',
                },
            },
            {
                test: /\.png$/u,
                issuer: /\.json$/u,
                type: 'javascript/auto',
                loader: 'file-loader',
                options: {
                    name: '[name].[contenthash:5].[ext]',
                    esModule: false,
                },
            },
            {
                test: /\.(png|jpe?g|webp)$/u,
                type: 'asset/resource',
            },
            {
                test: /\.svg$/u,
                type: 'asset',
                parser: {
                    dataUrlCondition: {
                        maxSize: 1024,
                    },
                },
                use: [
                    {
                        loader: 'svgo-loader',
                        options: {
                            multipass: true,
                            plugins: extendDefaultPlugins([
                                {
                                    name: 'removeEmptyContainers',
                                    active: false,
                                },
                            ]),
                        },
                    },
                ],
            },
            {
                test: /\.json$/u,
                issuer: /\.html$/u,
                type: 'asset/resource',
                use: ['extract-loader', 'ref-loader'],
            },
        ],
    },
    plugins: [
        new CleanWebpackPlugin(),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(isProd ? 'production' : 'development'),
            'process.env.BUILD_SSR': JSON.stringify(false),
            'process.env.APP_VERSION': JSON.stringify(version),
        }),
        new webpack.ProvidePlugin({
            h: ['preact', 'h'],
            Fragment: ['preact', 'Fragment'],
        }),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: '!!ejs-compiled-loader!./src/index.html',
            templateParameters: {
                version,
            },
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
            include: ['index.html', /\.js$/u, /\.svg$/u, /\.css$/u],
            dontCacheBustURLsMatching: /\.[0-9a-f]{5}\.min\.(js|css)/u,
        }),
        new HwpAttributesPlugin({
            module: ['/**.mjs'],
        }),
    ],
};

export default config;
