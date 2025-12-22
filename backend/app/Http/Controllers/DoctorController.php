<?php

namespace App\Http\Controllers;

use App\Models\Doctor;
use App\Models\Appointment;
use Carbon\Carbon;
use Illuminate\Http\Request;


class DoctorController extends Controller
{
    public function index()
    {
        return response()->json(Doctor::all());
    }

    public function availability($id, Request $request)
    {
        $date = Carbon::parse($request->query('date'));

        // Working hours
        $start = $date->copy()->setTime(9, 0);
        $end   = $date->copy()->setTime(17, 0);

        // Generate all 30-min slots
        $slots = [];
        while ($start < $end) {
            $slots[] = $start->copy();
            $start->addMinutes(30);
        }

        // Fetch existing appointments for that doctor & date
        $appointments = Appointment::where('doctor_id', $id)
            ->whereDate('start_time', $date)
            ->get();

        // Filter out booked slots
        $available = array_filter($slots, function ($slot) use ($appointments) {
            foreach ($appointments as $appointment) {
                if ($slot->equalTo(Carbon::parse($appointment->start_time))) {
                    return false;
                }
            }
            return true;
        });

        return response()->json(array_values(
            array_map(fn($s) => $s->format('H:i'), $available)
        ));
    }

}
