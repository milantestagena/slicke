<?php

use App\Http\Controllers\Api\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\CollectionController;
use App\Http\Controllers\Api\ConversationController;

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

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::controller(ConversationController::class)->group(function () {
        Route::get('/conversations', 'getConversations');
        Route::get('/conversation/{with}', 'getConversation');
        Route::post('/send_message/{to}', 'sendMessage');
    });
    Route::controller(CollectionController::class)->group(function () {
        Route::get('/collections', 'getCollectionsForUser');
        Route::get('/collection/{id}', 'getCollectionForUser');
        Route::post('/collection/{id}', 'updateCollectionForUser');
    });
});

Route::post('/signup', [AuthController::class, 'signup']);
Route::post('/login', [AuthController::class, 'login']);
