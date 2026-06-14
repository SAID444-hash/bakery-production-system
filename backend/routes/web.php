<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    echo "Welcome to the Bakery production api";
    return view('welcome');
});
