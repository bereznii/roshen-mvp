<?php

use Illuminate\Database\Seeder;

class RatingsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('ratings')->truncate();

        $periods = [
            [
                'from' => '2019-12-01',
                'till' => '2019-12-31'
            ],
            [
                'from' => '2020-01-01',
                'till' => '2020-01-31'
            ],
            [
                'from' => '2020-02-01',
                'till' => '2020-02-29'
            ]
        ];

        foreach ($periods as $period) {
            $this->insertRecords($period);
        }
    }

    /**
     * Insert records to database for given period.
     * Done mainly to avoid limitation of placeholders during insertion to db.
     *
     * @param array $period
     */
    private function insertRecords(array $period)
    {
        $period = \Carbon\CarbonPeriod::create($period['from'], $period['till']);
        $arrayToInsert = [];

        foreach ($period as $date) {
            $timestamp = $date->format('Y-m-d H:i:s');

            for ($i = 0; $i < 240; $i++) {
                $arrayToInsert[] = [
                    'properties_id' => rand(1,4),
                    'product_id' => rand(1,6),
                    'value' => rand(1,5),
                    'created_at' => $timestamp,
                    'updated_at' => $timestamp
                ];
            }
        }

        DB::table('ratings')->insert($arrayToInsert);
    }
}
