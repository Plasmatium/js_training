console.log('app.js is running');

require('./global_install');
require('./request');
require('./observer')
require('./generator_promise')
require('./str_exp2num')
//require('./dpf_test.js')

module.hot.accept();
