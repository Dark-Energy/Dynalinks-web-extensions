var webpack = require('webpack');
var path = require('path');


var webpack_module  = {};
webpack_module.rules = [];

var vue_loader = 
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
          }
          // other vue-loader options go here
        }
      };

var babel_loader =       
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules|external/,
        options: {
              "presets": [
                ["env", { "modules": false }]
            ] 
        }
      };
      

webpack_module.rules.push(vue_loader);
webpack_module.rules.push(babel_loader);

module.exports = {
  entry: './components/index.js',
  devtool: 'inline-source-map',
  output: {
    filename: 'build.js',
	library: 'DAE',
	libraryTarget: 'umd',
    path: path.resolve(__dirname, 'build')
  },
  
  externals: [
    'vue'
  ],
   module: webpack_module,
  
};

//production config
module.exports.devtool = '#source-map';


  // http://vue-loader.vuejs.org/en/workflow/production.html
  /*
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.optimize.UglifyJsPlugin({
      beautify: false,
      sourceMap: true,
      mangle: false,
      //mangle: {
        //keep_fnames: true, //dont mangle function names
        //keep_classnames: true, //dont mangle class names
      },
      compress: false,
      comments: false
    })
  ]) ;*/
  
