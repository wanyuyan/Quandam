import path from 'path';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import ManifestPlugin from 'webpack-manifest-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import { antTheme } from './package.json';

// const PurifyCSSPlugin = require('purifycss-webpack');
// const glob = require('glob');

const publicPath = '/wanyy/';

module.exports = (arg1, arg2) => {
    // const deployEnv = arg2['DEPLOY_ENV'];

    const date = new Date();
    const time =
        date.getFullYear().toString()
        + (date.getMonth() + 1).toString()
        + date.getDate().toString()
        + date.getHours().toString()
        + date.getMinutes().toString();
    const buildPkg = `build/${time}`;

    return ({
        mode: 'production',
        entry: './src/app.jsx',
        output: {
            filename: 'static/js/[name].[hash:8].js',
            chunkFilename: 'static/js/[name].[contenthash:8].js',
            path: path.resolve(__dirname, buildPkg),
            publicPath: publicPath,
        },
        devtool: 'source-map',
        module: {
            rules: [
                {
                    test: /\.m?jsx|js$/,
                    exclude: /(node_modules|bower_components)/,
                    use: {
                        loader: 'babel-loader'
                    }
                },
                {
                    test: /\.css$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        'css-loader',
                        'postcss-loader'
                    ]
                },
                {
                    test: /\.less$/,
                    include: /node_modules/,
                    use: [
                        'style-loader',
                        'css-loader',
                        {
                            loader: 'less-loader', options: {
                                modifyVars: antTheme,
                                javascriptEnabled: true
                            }
                        },
                    ]
                },
                {
                    test: /\.scss$/,
                    exclude: /node_modules/,
                    use: [
                        // 如果不做配置，我们的css是直接打包进js里面的，我们希望能单独生成css文件。 因为单独生成css,css可以和js并行下载，提高页面加载效率
                        MiniCssExtractPlugin.loader,
                        'css-loader',
                        'postcss-loader'
                    ]
                },
                // file-loader 解决css等文件中引入图片路径的问题，解析图片地址，把图片从源文件拷贝到目标文件并修改源文件名字
                // url-loader 在文件比较小时，直接转变成base64字符串内嵌到页面中
                {
                    test: /\.(png|jpe?g|gif|svg)$/,
                    exclude: path.resolve(__dirname, 'public/imgs/icons'),
                    use: [
                        {
                            loader: 'url-loader',
                            options: {
                                name: '[path][name].[hash:7].[ext]',
                                limit: 6000
                            }
                        },
                    ]
                },
                {
                    test: /\.svg$/,
                    loader: 'svg-sprite-loader',
                    include: path.resolve(__dirname, 'public/imgs/icons')
                },
                {
                    test: /\.(woff|woff2|eot|ttf|otf)$/,
                    use: {
                        loader: 'url-loader',
                        options: {
                            name: '[name]-[hash:5].min.[ext]',
                            limit: 5000,        // fonts file size <= 5KB, use 'base64'; else, output svg file
                            publicPath: 'fonts/',
                            outputPath: 'fonts/'
                        }
                    }
                }
            ],
        },
        plugins: [
            new CleanWebpackPlugin(),
            new HtmlWebpackPlugin({
                template: 'src/index.html',
                filename: 'index.html',
                title: 'Caching',
                publicPath: publicPath,
                hash: true,
                minify: {
                    removeAttributeQuotes: true  // 压缩，去掉引号
                },
                buildPkg: buildPkg
            }),
            new MiniCssExtractPlugin({
                // Options similar to the same options in webpackOptions.output
                filename: 'static/css/[name].[contenthash:8].css',
                chunkFilename: 'static/css/[name].[contenthash:8].css'
            }),
            // new PurifyCSSPlugin({        // 清除冗余的 css, 需要对 html 文件进行 tree shaking
            //   paths: glob.sync(path.join(__dirname, 'src/*.html'))
            // }),
            new ManifestPlugin({
                fileName: 'asset-manifest.json',
                publicPath: publicPath,
                generate: (seed, files) => {
                    const manifestFiles = files.reduce(function (manifest, file) {
                        manifest[file.name] = file.path;
                        return manifest;
                    }, seed);
                    return {
                        files: manifestFiles,
                    };
                },
            }),
            new webpack.DefinePlugin({
                ENV: JSON.stringify('prod'),
                // DEPLOY_ENV: JSON.stringify(deployEnv)
            })
        ],
        optimization: {
            runtimeChunk: 'single',
            usedExports: true,       // js treeshaking
            minimizer: [
                new TerserPlugin({
                    parallel: true,        // improve the build speed
                    sourceMap: true
                }),
                new CssMinimizerPlugin({
                    parallel: 4
                })
            ]
        },
        resolve: {
            extensions: ['.js', '.jsx', '.scss', '.css'],
            alias: {
                Constants: path.join(__dirname, './src/constants/'),
                Components: path.resolve(__dirname, 'src/components/'),
                Imgs: path.resolve(__dirname, 'public/imgs/'),
                Icons: path.resolve(__dirname, 'public/imgs/icons/'),
                Styles: path.resolve(__dirname, 'src/styles'),
                Utils: path.resolve(__dirname, 'src/utils')
            }
        }
    });
};
