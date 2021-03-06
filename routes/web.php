<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::group(['prefix' => 'admin', 'namespace' => 'Admin'], function () {
    Route::get('/', function () {
        return view('admin.admin');
    });
    Route::get('/statistics', function () {
        return view('admin.admin');
    });
});

Route::any('/product/{any}', function () {
    return view('index');
});

Route::get('/', function () {
    return view('index');
});
