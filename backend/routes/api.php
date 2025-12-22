<?php
 
use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\DoctorController;
use Illuminate\Support\Facades\Route;

Route::get('/doctors', [DoctorController::class, 'index']);
Route::get('/doctors/{id}/availability', [DoctorController::class, 'availability']);
Route::post('/appointments', [AppointmentController::class, 'store']);
