<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

class AppointmentController extends Controller
{
public function store(Request $request)
{
    try {
        return DB::transaction(function () use ($request) {

            $existing = Appointment::where('doctor_id', $request->doctor_id)
                ->where('start_time', $request->start_time)
                ->lockForUpdate()
                ->first();

            if ($existing) {
                abort(409, 'Slot was just booked. Please choose another time.');
            }

            return Appointment::create($request->all());
        });

    } catch (QueryException $e) {
        abort(409, 'Slot was just booked. Please choose another time.');
    }
}
}