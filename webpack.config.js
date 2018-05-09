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
                debug: false
            })
        ]);
    }

    return plugins;
}

function getConstantsForConfig(type) {                                             //嵌入全局变量

    return {
        __VERSION__: JSON.stringify(pkgJson.version),
        __EXCLUDE_LIVE__: type === 'vod',
        __EXCLUDE_VOD__: type === 'live'
    };
}

function getAliasesForLightDist(target = 'vod') {
    let aliases = {};

    if (target === 'vod') {
        aliases = Object.assign({}, aliases, {
            './fastmesh': './empty.js'
        });
    } else if (target === 'live') {
        aliases = Object.assign({}, aliases, {
            './bittorrent': './empty.js'
        });
    }


    return aliases;
}

const multiConfig = [
        {
            name: 'build-hls-peerify',
            entry: './lib/index.hls-peerify.js',
            output: {
                filename: './hls-peerify.js',
                sourceMapFilename: './hls-peerify.js.map',
                path: path.resolve(__dirname),
                // path: path.resolve(__dirname, 'dist'),
                // publicPath: '/src/',
                library: ['HlsPeerify'],
                libraryTarget: 'umd'
            },
            plugins: getPluginsForConfig(),
            devtool: 'source-map',
        },
        {
            name: 'bundle-peerify-hls',
            entry: './peerify-hls.js',
            output: {
                filename: 'peerify-hls-bundle.js',
                sourceMapFilename: './peerify-hls-bundle.js.map',
                path: path.resolve(__dirname),
                // publicPath: '/dist/',
                library: ['Hls'],
                libraryTarget: 'umd'
            },
            plugins: getPluginsForConfig(),
            devtool: 'source-map',
        },
        {
            name: 'release-hls-peerify',
            entry: './lib/index.hls-peerify.js',
            output: {
                filename: 'hls-peerify.min.js',
                path: path.resolve(__dirname, 'dist'),
                // publicPath: '/src/',
                library: ['HlsPeerify'],
                libraryTarget: 'umd'
            },
            plugins: getPluginsForConfig(true)
        },
        {
            name: 'release-hls-peerify-vod',
            entry: './lib/index.hls-peerify.js',
            output: {
               filename: 'hls-peerify-vod.min.js',
               path: path.resolve(__dirname, 'dist'),
                // publicPath: '/src/',
               library: ['HlsPeerify'],
               libraryTarget: 'umd'
            },
            resolve: {
                alias: getAliasesForLightDist('vod')
            },
            plugins: getPluginsForConfig(true, 'vod')
         },
        {
            name: 'release-hls-peerify-live',
            entry: './lib/index.hls-peerify.js',
            output: {
                filename: 'hls-peerify-live.min.js',
                path: path.resolve(__dirname, 'dist'),
                // publicPath: '/src/',
                library: ['HlsPeerify'],
                libraryTarget: 'umd'
            },
            resolve: {
                alias: getAliasesForLightDist('live')
            },
            plugins: getPluginsForConfig(true, 'live')
        },
        {
            name: 'release-peerify-hls',
            entry: './peerify-hls.js',
            output: {
                filename: 'peerify-hls-bundle.js',
                path: path.resolve(__dirname, 'dist'),
                // publicPath: '/dist/',
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

