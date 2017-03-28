console.log('app.js is running');

require('./global_install');
require('./request');
require('./observer.js')
//require('./dpf_test.js')

module.hot.accept();
