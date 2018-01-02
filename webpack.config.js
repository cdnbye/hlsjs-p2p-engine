/**
 * Created by xieting on 2018/1/2.
 */


const path = require('path');
const webpack = require('webpack');

const uglifyJsOptions = {
    screwIE8: true,
    stats: true,
    compress: {
        warnings: false
    },
    mangle: {
        toplevel: true,
        eval: true
    },
    output: {
        comments: false,  // remove all comments
        preamble: "/* A p2p-based hls player powered by WebRTC data channel. @author XieTing <86755838@qq.com> <https://github.com/snowinszu> */"
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

function getPluginsForConfig(minify = false) {
    // common plugins.
    const plugins = [
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.optimize.ModuleConcatenationPlugin()
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

const multiConfig = [
        {
            name: 'debug-hls-peerify',
            entry: './src/index.hls-peerify.js',
            output: {
                filename: 'hls-peerify.js',
                sourceMapFilename: 'hls-peerify.js.map',
                path: path.resolve(__dirname, 'dist'),
                publicPath: '/dist/',
                library: ['HlsPeerify'],
                libraryTarget: 'umd'
            },
            plugins: getPluginsForConfig(),
            devtool: 'source-map',
        },
        {
            name: 'debug-hls-peerify-bundle',
            entry: './src/index.hls-peerify-bundle.js',
            output: {
                filename: 'hls-peerify-bundle.js',
                sourceMapFilename: 'hls-peerify-bundle.js.map',
                path: path.resolve(__dirname, 'dist'),
                publicPath: '/dist/',
                library: ['Hls'],
                libraryTarget: 'umd'
            },
            plugins: getPluginsForConfig(),
            devtool: 'source-map',
        },
        {
            name: 'dist-hls-peerify',
            entry: './src/index.hls-peerify.js',
            output: {
                filename: 'hls-peerify.min.js',
                path: path.resolve(__dirname, 'dist'),
                publicPath: '/dist/',
                library: ['HlsPeerify'],
                libraryTarget: 'umd'
            },
            plugins: getPluginsForConfig(true)
        },
        {
            name: 'dist-hls-peerify-bundle',
            entry: './src/index.hls-peerify-bundle.js',
            output: {
                filename: 'hls-peerify-bundle.min.js',
                path: path.resolve(__dirname, 'dist'),
                publicPath: '/dist/',
                library: ['Hls'],
                libraryTarget: 'umd'
            },
            plugins: getPluginsForConfig(true)
        }
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

