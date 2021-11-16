const path = require('path')
const htmlWebpackPlugin = require("html-webpack-plugin")
const { CleanWebpackPlugin } = require("clean-webpack-plugin")
const TerserPlugin = require("terser-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin") // css 抽离
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin") // css 压缩
const chalk = require('chalk')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')
module.exports = {
    mode: "development",
    entry: './src/index.jsx',
    output: {
        path: __dirname + "/dist", // 输出文件路径
        // 给打包过后的文件名字加上hash
        // [contenthash:8] - 本应用打包输出文件级别的更新，导致输出文件名变化
        filename: "[name]-[contenthash:8].js",
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                use: "babel-loader",
            },
            //  asset/inline:导出一个资源的 data URI。之前通过使用 url-loader 实现
            {
                test: /\.(png|jpe?g|svg|gif)$/,
                type: "asset/inline",
            },
            //  asset/resource:发送一个单独的文件并导出 URL。之前通过使用 file-loader 实现
            {
                test: /\.(eot|ttf|woff|woff2)$/,
                type: "asset/resource",
                generator: {
                    filename: "fonts/[hash][ext][query]",
                },
            },
            {
                test: /\.(sa|sc|le|c)ss$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                    },
                    "css-loader",
                    "postcss-loader",
                    // 当解析antd.less，必须写成下面格式，否则会报Inline JavaScript is not enabled错误
                    // { loader: "less-loader", options: { lessOptions: { javascriptEnabled: true } } },
                ],
            },
        ]
    },
    plugins: [
        // html 模版
        new htmlWebpackPlugin({
            filename: "index.html",
            template: './pubilc/index.html',
            // template: path.resolve(__dirname, "public/index.html") // 写绝对路径会提示找不到这个文件
        }),
        // 打包前，将本地已有的打包后的资源清空
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: "assets/[name].css",
        }),
        // 进度条
        new ProgressBarPlugin({
            format: `:msg [:bar] ${chalk.green.bold(':percent')} (:elapsed s)`
        })
    ],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
        mainFiles: ["index", "main"],
    },
    // 优化
    optimization: {
        minimizer: [
            // JS压缩
            new TerserPlugin({
                parallel: 4,
                terserOptions: {
                    parse: {
                        ecma: 8,
                    },
                    compress: {
                        ecma: 5,
                        warnings: false,
                        comparisons: false,
                        inline: 2,
                    },
                    mangle: {
                        safari10: true,
                    },
                    output: {
                        ecma: 5,
                        comments: false,
                        ascii_only: true,
                    },
                },
            }),
            // css 压缩
            new CssMinimizerPlugin({
                parallel: 4,
            }),
        ]
    },
    devServer: {
        // 当使用 [HTML5 History API] 时，任意的 `404` 响应被替代为 `index.html`
        historyApiFallback: true,
        open: true, // 自动打开浏览器
        // 默认为true
        hot: true,
        // 是否开启代码压缩
        compress: true,
        // 启动的端口
        port: 9090,
    },
}