const webpack = require('webpack');

module.exports = {
   context: __dirname,
   entry: "./src/main.js",
    output: {
        path: __dirname + "/dist",
        filename: "bundle.js"
    }
}