<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use Carbon\Carbon;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

class AppointmentController extends Controller
{
public function store(Request $request)
{
    try {
        return DB::transaction(function () use ($request) {

            $start = Carbon::parse($request->start_time);
            $end = $start->copy()->addMinutes(30);

            $existing = Appointment::where('doctor_id', $request->doctor_id)
                ->where('start_time', $start)
                ->lockForUpdate()
                ->first();

            if ($existing) {
                abort(409, 'Slot was just booked. Please choose another time.');
            }

            return Appointment::create([
                'doctor_id' => $request->doctor_id,
                'patient_name' => 'Demo Patient',
                'start_time' => $start,
                'end_time' => $end,
                'status' => 'booked',
            ]);
        });

    } catch (QueryException $e) {
        abort(409, 'Slot was just booked. Please choose another time.');
    }
}
}