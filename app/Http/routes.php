<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/

Route::get('/', function () {
	return view('spark::welcome');
});



Route::group(['middleware' => 'auth'], function(){
	Route::get('home', function () {
		return view('home');
	});


	// Route::get('/items', 'ItemsController@index');
	Route::resource('items','ItemsController');
	Route::resource('items.movements', 'MovementsController');
	Route::get('/items/{items}/movements/create/{direction}', 'MovementsController@create');

	Route::group(['prefix' => 'api/v1'], function(){
		Route::get('dashboard', 'API\DashboardController@index');
		Route::resource('items','API\ItemsController');
		Route::resource('clients','API\ClientController');
		Route::get('items/find/{string}', 'Api\ItemsController@find');

		Route::resource('items.movements', 'API\MovementsController');

	});
});


