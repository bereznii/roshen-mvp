<?php

use Illuminate\Database\Seeder;

class UsersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        \DB::table('users')->truncate();

        $timestamps = \Carbon\Carbon::now()->startOfDay()->format('Y-m-d H:i:s');

        $arrayToInsert[] = [
            'name' => 'Admin',
            'email' => 1,
            'email_verified_at' => $timestamps,
            'password' => '$2y$10$dagANe/HBYQ8AB4uFfejbe/XW4eZdOfckbME.3SalLxDEjbFx5McG',
            'created_at' => $timestamps,
            'updated_at' => $timestamps
        ];

        \DB::table('users')->insert($arrayToInsert);
    }
}
