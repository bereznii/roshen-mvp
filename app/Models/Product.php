<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $hidden = [
        'created_at',
        'updated_at'
    ];

    /**
     * Get the all statistics for this product.
     */
    public function statistics()
    {
        return $this->hasMany('App\Models\Statistic');
    }
}
