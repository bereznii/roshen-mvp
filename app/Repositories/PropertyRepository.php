<?php

namespace App\Repositories;

use App\Models\Property;

class PropertyRepository
{
    /**
     * Returns all properties.
     *
     * @return Property[]|\Illuminate\Database\Eloquent\Collection
     */
    public function getProperties()
    {
        return Property::all();
    }
}