<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

//Route::middleware('auth:api')->get('/user', function (Request $request) {
//    return $request->user();
//});


Route::post('/vote', 'RatingController@create')->name('vote');

Route::get('/product/{id}', 'ProductController@show');

Route::post('/login', 'LoginController@authenticate');

Route::group(['prefix' => 'admin'], function () {
    Route::get('/', 'ProductController@index');

    Route::get('/product', 'RatingController@show');
});


