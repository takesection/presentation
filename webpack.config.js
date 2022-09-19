const path = require("path");

module.exports = {
    entry: './src/_script/index.js',
    output: {
        path: path.resolve(__dirname, './src/script'),
        filename: 'bundle.js'
    }
};
