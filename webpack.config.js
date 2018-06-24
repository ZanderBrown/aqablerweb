const path = require('path');

module.exports = [{
  entry: "./index.js",
  output: {
    path: path.resolve(__dirname, "docs"),
    filename: "index.js",
  },
  mode: "development"
},{
  entry: "./service.js",
  output: {
    path: path.resolve(__dirname, "docs"),
    filename: "service.js",
  },
  mode: "development"
}];