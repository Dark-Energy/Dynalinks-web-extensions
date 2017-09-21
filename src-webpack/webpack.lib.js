var path = require('path');
var webpack = require('webpack')

module.exports = {
  entry: './components/lib.js',
  output: {
    filename: 'render.js',
	library: 'DAE',
	libraryTarget: 'var',
    path: path.resolve(__dirname, 'build')
  },
     externals: [
      'vue',
    ],
	
   module: { rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
          }
          // other vue-loader options go here
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules|externals/
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]'
        }
      }
    ], 
	},	

};


if (process.env.NODE_ENV === 'production') {
  module.exports.devtool = '#source-map'
  // http://vue-loader.vuejs.org/en/workflow/production.html
  
  if (module.exports.plugins === undefined) {
      module.exports.plugins = [];
  }
  
  var process_env = new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    });
    
  module.exports.plugins.push(process_env);
  
  var uglify = new webpack.optimize.UglifyJsPlugin({
      mangle: false,
      beautify: false,      
      sourceMap: true,
      compress: {
        warnings: false
      }
    });
    
    //module.exports.plugins.push(uglify);
    
    var options_loader = new webpack.LoaderOptionsPlugin({
      minimize: true
    });
  
    //module.exports.plugins.push(options_loader);
} 