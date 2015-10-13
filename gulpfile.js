var elixir = require('laravel-elixir');

/*
 |--------------------------------------------------------------------------
 | Elixir Asset Management
 |--------------------------------------------------------------------------
 |
 | Elixir provides a clean, fluent API for defining some basic Gulp tasks
 | for your Laravel application. By default, we are compiling the Less
 | file for our application, as well as publishing vendor resources.
 |
 */

elixir(function(mix) {
    mix.sass('app.scss')
       .browserify('app.js')
        .browserify('requires.js');

 mix.scripts([
      "item-movement.js",
     "item-list.js",
         "dashboard.js",
         "item_show.js",
      "utils.js",
         "bootstrap3-typeahead.js"
     ],
     "public/js/inventory-app.js")

});
