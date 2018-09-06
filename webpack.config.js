var path = require("path");
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var extractCSS = new ExtractTextPlugin("css/[name].css");
// var extractSASS = new ExtractTextPlugin('scss/[name].css');
var extractSASS = new ExtractTextPlugin({
  filename: "./css/bundle.css"
});

module.exports = {
  context: path.resolve(__dirname, "src"),
  entry: {
    index: "./js/index.js"
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "./js/[name].js"
  },
  devServer: {
    compress: true,
    port: 3000,
    stats: {
      assets: true,
      cached: false,
      chunkModules: false,
      chunkOrigins: false,
      chunks: false,
      colors: true,
      hash: false,
      modules: false,
      reasons: false,
      source: false,
      version: false,
      warnings: false
    }
  },
  resolve: {
    modules: [
      path.resolve("src"),
      path.resolve("src/js"),
      path.resolve("src/css"),
      path.resolve("src/scss"),
      path.resolve("src/images"),
      path.resolve("node_modules")
    ],
    extensions: [".js"]
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[path][name].[ext]"
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: extractCSS.extract(["css-loader"])
      },
      {
        test: /\.(sass|scss)$/,
        use: extractSASS.extract({
          use: ["css-loader", "sass-loader"]
        })
      },
      {
        test: /\.(js)$/,
        use: "babel-loader"
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 2000,
              name: "[path][name].[ext]?[hash:8]"
            }
          },
          {
            loader: "image-webpack-loader",
            options: {
              mozjpeg: {
                progressive: true,
                quality: 65
              },
              optipng: {
                enabled: false
              },
              pngquant: {
                quality: "65-90",
                speed: 4
              },
              gifsicle: {
                interlaced: false
              }
            }
          }
        ]
      }
    ]
  },
  plugins: [extractCSS, extractSASS]
};
