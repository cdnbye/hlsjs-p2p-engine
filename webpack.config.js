/**
 * Created by xieting on 2018/1/2.
 */

const pkgJson = require('./package.json');
const path = require('path');
const webpack = require('webpack');

const uglifyJsOptions = {
    screwIE8: true,
    stats: true,
    compress: {
        warnings: false,
        drop_debugger: true,
        drop_console: true
    },
    mangle: {
        toplevel: true,
        eval: true
    },
    output: {
        comments: false,  // remove all comments
        preamble: "/* A P2P-CDN supporting hls player built on WebRTC Data Channels API. @author XieTing <86755838@qq.com> <https://github.com/snowinszu> */"
    }
};

const commonConfig = {

    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: [
                    path.resolve(__dirname, 'node_modules')
                ],
                use: {
                    loader: 'babel-loader',
                }
            }
        ]
    }
};

function getPluginsForConfig(minify = false, type) {
    // common plugins.
    const plugins = [
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.optimize.ModuleConcatenationPlugin(),
        new webpack.DefinePlugin(getConstantsForConfig(type))
    ];

    if (minify) {
        // minification plugins.
        return plugins.concat([
            new webpack.optimize.UglifyJsPlugin(uglifyJsOptions),
            new webpack.LoaderOptionsPlugin({
                minimize: true,
                debug: true
            })
        ]);
    }

    return plugins;
}

function getConstantsForConfig(type) {                                             //嵌入全局变量

    return {
        __VERSION__: JSON.stringify(pkgJson.version),
    };
}

function getAliasesForLightDist() {
    let aliases = {};

    aliases = Object.assign({}, aliases, {
        './bittorrent': './empty.js'
    });


    return aliases;
}

const multiConfig = [
        {
            name: 'bundle-engine',
            entry: './src/index.engine.js',
            output: {
                filename: './hlsjs-p2p-engine.js',
                sourceMapFilename: './hlsjs-p2p-engine.js.map',
                path: path.resolve(__dirname, 'dist'),
                // publicPath: '/src/',
                library: ['CDNBye'],
                libraryTarget: 'umd'
            },
            plugins: getPluginsForConfig(),
            devtool: 'source-map',
        },
        {
            name: 'bundle-hlsjs',
            entry: './src/index.hls.js',
            output: {
                filename: 'hls.js',
                sourceMapFilename: './hls.js.map',
                path: path.resolve(__dirname, 'dist'),
                library: ['Hls'],
                libraryTarget: 'umd'
            },
            plugins: getPluginsForConfig(),
            devtool: 'source-map',
        },
        {
            name: 'release-engine',
            entry: './src/index.engine.js',
            output: {
                filename: 'hlsjs-p2p-engine.min.js',
                path: path.resolve(__dirname, 'dist'),
                // publicPath: '/src/',
                library: ['CDNBye'],
                libraryTarget: 'umd'
            },
            plugins: getPluginsForConfig(true)
        },
        {
            name: 'release-hlsjs',
            entry: './src/index.hls.js',
            output: {
               filename: 'hls.min.js',
               path: path.resolve(__dirname, 'dist'),
               library: ['Hls'],
               libraryTarget: 'umd'
            },
            plugins: getPluginsForConfig(true)
         },
         {
            name: 'release-hlsjs-light',
            entry: './src/index.hls.light.js',
            output: {
                filename: 'hls.light.min.js',
                path: path.resolve(__dirname, 'dist'),
                library: ['Hls'],
                libraryTarget: 'umd'
            },
        plugins: getPluginsForConfig(true)
    },
        //test
        {
            name: 'test-bundle',
            entry: './test/bundle/index.bundle.js',
            output: {
                filename: 'test-bundle.js',
                // sourceMapFilename: 'hls-peerify-bundle.js.map',
                path: path.resolve(__dirname, 'test/bundle')
            },
            plugins: getPluginsForConfig()
        },
    ].map(fragment => Object.assign({}, commonConfig, fragment));

// webpack matches the --env arguments to a string; for example, --env.debug.min translates to { debug: true, min: true }
module.exports = (envArgs) => {
    if (!envArgs) {
        // If no arguments are specified, return every configuration
        return multiConfig;
    }
    // Find the first enabled config within the arguments array
    const enabledConfigName = Object.keys(envArgs).find(envName => envArgs[envName]);
    let enabledConfig = multiConfig.find(config => config.name === enabledConfigName);

    if (!enabledConfig) {
        console.error(`Couldn't find a valid config with the name "${enabledConfigName}". Known configs are: ${multiConfig.map(config => config.name).join(', ')}`);
        return;
    }

    return enabledConfig;
};

