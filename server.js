
var path = require('path');

try {
  require.paths = require.paths.unshift(__dirname + '/../node_modules');
} catch(e) {
  process.env.NODE_PATH = path.join(__dirname, '/../node_modules') + ':' + process.env.NODE_PATH
}

//require('./lib/exceptions');
console.log(process.env.NODE_ENV);
if(!process.env.NODE_ENV) {
  process.env.NODE_ENV = "development";
}

var app = require('./config/app')();
var port = process.env.PORT || (process.env.NODE_ENV == 'production') ? 80 : 3000;

app.listen(port);

console.log('OFS App',
  app.set('version'),
  app.set('env'),
  app.set('host'),
  app.set('port')
);
