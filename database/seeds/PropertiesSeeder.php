<?php

use Illuminate\Database\Seeder;

class PropertiesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('properties')->truncate();

        DB::table('properties')->insert([
            [
                'name' => 'Смак'
            ],
            [
                'name' => 'Аромат'
            ],
            [
                'name' => 'Текстура'
            ],
            [
                'name' => 'Враження'
            ],
        ]);
    }
}
