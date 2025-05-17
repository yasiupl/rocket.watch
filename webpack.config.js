const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');
const WorkboxPlugin = require('workbox-webpack-plugin');
const path = require('path');

module.exports = {
    mode: 'production',
    entry: ['./src/app.js', './src/style.scss'],
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
        hashFunction: 'sha256'
    },
    devServer: {
        static: path.join(__dirname, 'dist'),
        compress: true,
        port: 8080
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'style.css'
        }),
        new HtmlWebpackPlugin({
            hash: true,
            title: 'rocket.watch',
            template: './src/index.html',
            filename: './index.html',
            favicon: './src/assets/favicon.ico'
        }),
        new WebpackPwaManifest({
            fingerprints: false,
            name: 'rocket.watch',
            short_name: 'rocket.watch',
            description: 'Watch rocket launches live!',
            background_color: '#151b23',
            theme_color: '#1c2530',
            start_url: '/?utm_source=a2hs',
            display: 'fullscreen',
            ios: {
                'apple-mobile-web-app-status-bar-style': 'black'
            },
            icons: [{
                    src: path.resolve('src/assets/icon.png'),
                    destination: './icons/',
                    sizes: [96, 128, 192, 256, 384, 512],
                    ios: true
                },
                {
                    src: path.resolve('src/assets/icon.png'),
                    destination: './icons/',
                    size: 512,
                    ios: 'startup'
                }
            ],
            gcm_sender_id: "482941778795",
            gcm_sender_id_comment: "Do not change the GCM Sender ID",
            related_applications: [{
                "platform": "play",
                "id": "pl.yasiu.rocketwatch"
            }]
        }),
        new WorkboxPlugin.InjectManifest({
            swSrc: './src/serviceworker.js',
            swDest: 'OneSignalSDKWorker.js'
        }),
    ],
    module: {
        rules: [{
                test: /\.s[ac]ss$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader',
                ],
            },
            {
                test: /\.(jpe?g|gif|png|svg|woff|ttf|wav|mp3)$/,
                type: "asset/resource"
            }
        ]
    }
}