<?php

use Illuminate\Database\Seeder;

class ProductsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('products')->truncate();

        $timestamp = \Carbon\Carbon::now()->format('Y-m-d H:i:s');

        DB::table('products')->insert([
            [
                'name' => 'Candy Nut',
                'image' => '/img/products/candy-nut.png',
                'created_at' => $timestamp,
                'updated_at' => $timestamp
            ],
            [
                'name' => 'Барбариска',
                'image' => '/img/products/barbariska.png',
                'created_at' => $timestamp,
                'updated_at' => $timestamp
            ],
            [
                'name' => 'Коровка',
                'image' => '/img/products/korovka.png',
                'created_at' => $timestamp,
                'updated_at' => $timestamp
            ],
            [
                'name' => 'РОШЕН 56%',
                'image' => '/img/products/dark-chocolate.png',
                'created_at' => $timestamp,
                'updated_at' => $timestamp
            ],
            [
                'name' => 'РОШЕН 70%',
                'image' => '/img/products/extra-dark-chocolate.png',
                'created_at' => $timestamp,
                'updated_at' => $timestamp
            ],
            [
                'name' => 'Моментс',
                'image' => '/img/products/moments.png',
                'created_at' => $timestamp,
                'updated_at' => $timestamp
            ]
        ]);
    }
}
