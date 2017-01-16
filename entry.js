/**
 * Created by congchen on 1/16/17.
 */
require('babel-register')({
    plugins: ['transform-async-to-generator']
});

require('./server');