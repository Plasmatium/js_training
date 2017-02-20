console.log('app.js is running');

require('./global_install');

global.func = (x,y,z,a,b,c) => console.log(x,y,z,a,b,c);
