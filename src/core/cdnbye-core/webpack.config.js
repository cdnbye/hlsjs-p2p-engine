var webpack = require('webpack');
var path = require('path');

const uglifyJsOptions = {
    screwIE8: true,
    stats: true,
    compress: {
        warnings: false,
        drop_debugger: false,
        drop_console: false
    },
    mangle: {
        toplevel: true,
        eval: true
    },
    output: {
        comments: false,  // remove all comments
        preamble: "/*The core component of cdnbye project*/"
    }
};

module.exports = {
    entry:'./src/index.js',
    output:{
        path:path.resolve(__dirname, './dist/'),
        filename:'cdnbye-core.js',
        library: ['CDNByeCore'],
        libraryTarget: 'umd'
    },
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
    },
    plugins:[
        new webpack.optimize.UglifyJsPlugin(uglifyJsOptions)
    ]
};