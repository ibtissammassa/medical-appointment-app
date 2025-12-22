<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Doctor;

class DoctorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        Doctor::create([
            'name' => 'Dr. Smith',
            'specialization' => 'Cardiology',
        ]);

        Doctor::create([
            'name' => 'Dr. Johnson',
            'specialization' => 'Dermatology',
        ]);
    }
}
