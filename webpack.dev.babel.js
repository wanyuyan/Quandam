import path from 'path';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ESLintPlugin from 'eslint-webpack-plugin';
import {CleanWebpackPlugin} from 'clean-webpack-plugin';
import {antTheme} from './package.json';


module.exports = (arg1, arg2) => {
    return ({
        mode: 'development',
        entry: './src/app.jsx',
        output: {
            filename: '[name].[hash:8].file.js',
            chunkFilename: '[name].[contenthash:8].chunk.js',
            path: path.resolve(__dirname, 'dist'),
            publicPath: '/'
        },
        devtool: 'inline-source-map',
        devServer: {
            // contentBase: './dist',
            // https: true,
            host: 'localhost',
            port: 9000,
            historyApiFallback: true
        },
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
                    test: /\.less$/,
                    include: /node_modules/,
                    exclude: path.resolve(__dirname, 'src'),
                    use: [
                        'style-loader',
                        'css-loader',
                        {
                            loader: 'less-loader',
                            options: {
                                modifyVars: antTheme,
                                javascriptEnabled: true
                            }
                        }
                    ]
                },
                {
                    test: /\.css$/,
                    include: [/public/, /node_modules/],
                    exclude: /src/,
                    use: [
                        {loader: 'style-loader'},
                        {loader: 'css-loader'},
                        {loader: 'postcss-loader'}
                    ]
                },
                {
                    test: /\.scss$/,
                    include: /src/,
                    exclude: /node_modules/,
                    use: [
                        {
                            loader: 'style-loader',               // creates style nodes from JS strings, 把css文件变成style标签插入head中
                            options: {
                                sourceMap: true
                            }
                        },
                        {
                            loader: 'css-loader',                 // translates CSS into CommonJS, 用来处理css中url的路径
                            options: {
                                importLoaders: 1,
                                sourceMap: true
                            }
                        },
                        {
                            loader: 'postcss-loader'
                        }
                    ]
                },
                // file-loader 解决css等文件中引入图片路径的问题，解析图片地址，把图片从源文件拷贝到目标文件并修改源文件名字
                // url-loader 在文件比较小时，直接转变成base64字符串内嵌到页面中
                // 当转换成base64字符串时，jsx 中不能直接通过<img src=...> 或 style={{background: url(...)}} 的形式引到图片，可以先import，所以图片引用优先写在css文件中
                {
                    test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                    exclude: path.resolve(__dirname, 'public/imgs/icons'),
                    use: [
                        {
                            loader: 'url-loader',
                            options: {
                                limit: 6000
                            }
                        }
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
            ]
        },
        // optimization: {
        //     namedModules: true,
        //     runtimeChunk: {
        //         name: 'runtime'
        //     },
        //     splitChunks: {
        //         cacheGroups: {
        //             vendor: {
        //                 test: /[\\/]node_modules[\\/]/,
        //                 name: 'vendors',
        //                 chunks: 'all'
        //             }
        //         }
        //     }
        // },
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
        },
        plugins: [
            new CleanWebpackPlugin(),
            new HtmlWebpackPlugin({
                template: 'src/index.html',
                filename: 'index.html',
                title: 'HotChpotch'
            }),
            new webpack.HotModuleReplacementPlugin(),
            new ESLintPlugin({
                context: path.resolve(__dirname, 'src')
            }),
            new webpack.DefinePlugin({
                ENV: JSON.stringify('dev')
            })
        ]
    });
};