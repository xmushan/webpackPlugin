/**
 * 功能： 
 * 1. 把css解析为一个抽象语法树
 * 2. 调用插件处理抽象语法树并添加功能
 */

module.exports = {
    plugins: [
        // autoprefixer插件的作用是为我们的css内容添加浏览器厂商前缀兼容
        require('autoprefixer'),
        // cssnano的作用是尽可能小的压缩我们的css代码。
        require('cssnano')({
            preset: 'default',
        }),
    ],
}