import webpack from 'webpack';
import path from 'path';

export default {
    devtool: 'cheap-module-eval-source-map',
    entry: [
        'webpack-hot-middleware/client?reload=true',
        path.resolve(__dirname,'src/index')
    ],
    target: 'web',
    output: {
        path: __dirname + '/dist',
        publicPath: '/',
        filename: 'bundle.js'
    },
    devServer: {
        contentBase: path.resolve(__dirname, 'src')
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin()
    ],
    module: {
        loaders: [
            {test: /\.js$/, include: path.join(__dirname, 'src'), loaders: ['babel-loader']},
            {test: /(\.css)$/, loaders: ['style-loader', 'css-loader']},
            {test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: 'file-loader'},
            {test: /\.(woff|woff2)$/, loader: 'url-loader?prefix=font/&limit=5000'},
            {test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: 'url-loader?limit=10000&mimetype=application/octet-stream'},
            {test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: 'url-loader?limit=10000&mimetype=image/svg+xml'},
            {test: /\.(png|jpg|gif)$/, include: path.join(__dirname, 'images'), loader: 'url-loader?limit=8192'},
            {test: /\.glsl$/, include: path.join(__dirname, 'src'), loader: 'webpack-glsl-loader'},
            {test: /\.json$/, include: path.join(__dirname, 'data'), loader: 'json-loader'},
            {test: /\.mp4$/, include: path.join(__dirname, 'resources'), loader: 'url-loader?limit=10000&mimetype=video/mp4'}
        ]
    }
};