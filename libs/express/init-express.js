var compression = require('compression');
var favicon = require('serve-favicon');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var morgan = require('morgan');
var errorHandler = require('errorhandler');
var cors = require('cors');

exports.init = function(app) {
  var env = app.get('env');

  app.use(cors());
  app.use(favicon('res/favicon.ico'));
  app.use(compression());
  app.use(bodyParser.urlencoded({
    extended: false
  }));
  app.use(bodyParser.json());
  app.use(methodOverride());

  if ('development' === env) {
    app.use(morgan('dev'));
    app.use(errorHandler());
  }
};