
var  path = require('path');

module.exports = {
    // entry: 'target/webapp/module/index/index.html',
    // resolve: {
    //     alias: {
    //         plugins: path.resolve(__dirname, './src/main/webapp/plugins/')
    //     },
    //     modules: ['./src/main/webapp/plugins', 'node_modules']
    // },
    // output: {
    //     filename: '[name].js',
    //     chunkFilename: "[name].[chunkHash:8].js",
    //     path: path.resolve(__dirname, 'src/main/webapp/dependence/AWEB/js'),
    //     libraryTarget: 'amd'
    // },
    devServer: {
        contentBase: [path.join(__dirname, 'target/webapp'), path.join(__dirname, 'target/webapp/module/index')],
        // compress: true,
        port: 9000,
        overlay: {
            warnings: true,
            errors: true
        },
        proxy: {

            '/afa':{
              target: 'https://afa.awebide.com',
              changeOrigin: true,
              secure:false,
              rewrite: {},
              pathRewrite:{
                '/afa':''
              },
              onProxyRes: function (proxyRes, req, res) {
                var cookies = proxyRes.headers['set-cookie'];
                var cookieRegex = /Path=\/XXX\//i;
                //修改cookie Path
                if (cookies) {
                  var newCookie = cookies.map(function (cookie) {
                    if (cookieRegex.test(cookie)) {
                      return cookie.replace(cookieRegex, 'Path=/');
                    }
                    return cookie;
                  });
                  //修改cookie path
                  delete proxyRes.headers['set-cookie'];
                  proxyRes.headers['set-cookie'] = newCookie;
                }
              }
            }
        }        
    },
    module: {
        noParse: function(content) {
            return /controller-core.js$/.test(content);
        }
    }
};