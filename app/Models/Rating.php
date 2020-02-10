<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Rating extends Model
{
    /**
     * Get the product that has this statistic.
     */
    public function product()
    {
        return $this->belongsTo('App\Models\Product');
    }

    /**
     * Get the property that has this statistic.
     */
    public function property()
    {
        return $this->belongsTo('App\Models\Property');
    }
}
