var fs = require('fs');
var getConfig = require('hjs-webpack');

let cfg = getConfig({
  // entry point for the app
  in: './src/app.js',

  // Name or full path of output directory
  // commonly named `www` or `public`. This
  // is where your fully static site should
  // end up for simple deployment.
  out: 'build',

  // This will destroy and re-create your
  // `out` folder before building so you always
  // get a fresh folder. Usually you want this
  // but since it's destructive we make it
  // false by default
  clearBeforeBuild: true,
});
//cfg.entry = ['babel-polyfill', ...cfg.entry];
console.log(cfg);
module.exports = cfg;
