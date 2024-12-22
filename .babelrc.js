module.exports = function (api) {
    api.cache(() => [process.env.NODE_ENV || 'development', process.env.BUILD_SSR || 'false'].join(':'));

    const config = {
        presets: [
            '@babel/preset-typescript',
            [
                '@babel/env',
                {
                    modules: false,
                    loose: true,
                    bugfixes: true,
                    targets: {
                        esmodules: true,
                    },
                },
            ],
        ],
        plugins: [
            [
                '@babel/plugin-transform-react-jsx',
                {
                    pragma: 'h',
                    pragmaFrag: 'Fragment',
                },
            ],
            process.env.BUILD_SSR ? ['babel-plugin-dynamic-import-node-sync'] : null,
        ].filter(Boolean),
    };

    return config;
};
