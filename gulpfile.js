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


    mix.scripts([
            "inventory.js",
            "item-movement.js",
            "item-list.js",
            "item-movement-show.js",
            "dashboard.js",
            "item_show.js",
            "utils.js",
        ],
        "resources/assets/js/inventory-app.js").browserify('inventory-app.js');

    mix.sass('app.scss')
       .browserify('app.js')
        .browserify('requires.js')
        .browserify('inventory-app.js');


});
