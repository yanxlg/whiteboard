/**
 * 'pdf.worker': 'pdfjs-dist/build/pdf.worker.entry'
 * @disc:rc-tools webpack extension
 * @author:yanxinaliang
 * @time：2018/7/18 8:56
 */
const path = require('path');

module.exports=function(webpackConfig) {
    // 修改svg loader
/*    webpackConfig.module.rules.forEach((rule)=>{
        if("svg-sprite"===rule.loader){
            rule.test=/^(?!.*icon).*\.svg$/
        }
    });*/
    webpackConfig.resolve.alias["@"]=path.resolve(__dirname, "src");
    
    //{test: /\.(png|jpg|jpeg|webp)$/i, loader: 'file' },
    
    // console.log(webpackConfig.module.rules);
/*    webpackConfig.module.rules.unshift({
        test: /\.(png|jpg|jpeg|webp|gif)$/i,
        use: { loader: 'file',options:{name: 'examples/[hash].[ext]',publicPath:"../"}},
    });*/
/*    webpackConfig.module.rules.unshift({
        test:/\.worker\.js$/,
        use: { loader: 'worker-loader',options: { name: 'examples/[hash].worker.js',publicPath:"../"}}
    });*/
/*    webpackConfig.module.rules.push({
        test: /.pdf$/,
        use: { loader: 'file-loader',options: { name: 'examples/[hash].pdf',publicPath:"../"}}
    });*/
    webpackConfig.module.rules.unshift({
        test: /\S*.svg$/,
        use: { loader: 'raw-loader'},
    });
    webpackConfig.module.rules.unshift({
        test: /iconfont.svg$/,
        loader: 'file',
    });
    webpackConfig.module.rules.push({
        test: /.cur$/,
        use: { loader: 'file-loader',options: { name: 'examples/[hash].pdf',publicPath:"../"}}
    });
    webpackConfig.module.rules.splice(3,1);// svg-sprite
    return webpackConfig;
};