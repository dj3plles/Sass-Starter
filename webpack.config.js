var path = require('path');
var HTMLWebPackPlugin = require('html-webpack-plugin');
var MiniCssExtractPlugin = require('mini-css-extract-plugin');
var BrowserSyncPlugin = require('browser-sync-webpack-plugin');

module.exports = (env, argv) => {
  var isDevMode = argv.mode === 'development';
  var distFolder = path.resolve(__dirname + '/dist');

  return {
    mode: isDevMode ? 'development' : 'production',
    devtool: isDevMode ? 'source-map' : false,
    entry: {
      main: ['./src/index.js']
    },
    module: {
      rules: [
        // Fonts
        {
          test: /\.(otf|ttf|woff|woff2)$/i,
          loader: 'file-loader',
          options: {
            outputPath: distFolder + '/fonts/'
          }
        },
        // Images
        {
          test: /\.(svg|jpe?g|png|gif)$/i,
          loader: 'file-loader',
          options: {
            outputPath: distFolder + '/images/'
          }
        },
        // Javascript
        {
          test: /\.js$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [['@babel/preset-env', { modules: false }]]
            }
          }
        },
        // SASS
        {
          test: /\.s[ac]ss$/i,
          use: [
            MiniCssExtractPlugin.loader,
            // "style-loader",
            'css-loader',
            'sass-loader'
          ]
        },
        // HTML
        {
          test: /\.php$/,
          loader: 'html-loader'
        }
      ]
    },
    output: {
      path: distFolder,
      filename: '[name].min.js?[hash]'
    },
    plugins: [
      new BrowserSyncPlugin(
        {
          host: 'localhost',
          port: 3000,
          files: ['**/*.js', '**/*.scss', '**/*.sass']
        },
        {
          // prevent BrowserSync from reloading the page
          // and let Webpack Dev Server take care of this
          reload: false
        }
      ),
      new MiniCssExtractPlugin({
        filename: 'styles.css?[hash]',
        chunkFilename: 'chunk.css'
      }),
      new HTMLWebPackPlugin({
        template: './src/index.html'
      })
    ]
  };
};
