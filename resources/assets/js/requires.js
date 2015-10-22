Vue.http.headers.common['X-CSRF-TOKEN'] = document.querySelector('#token').getAttribute('value');
Vue.config.debug = true; // turn on debugging mode
var $ = require('jquery');
var _ = require('underscore');
var moment = require('moment');
var tz = require('moment-timezone');
require('./bootstrap3-typeahead.js');
require('../../../node_modules/tablesaw/dist/tablesaw.js');
require("jquery-autocomplete");
