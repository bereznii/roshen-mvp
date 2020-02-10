<?php

namespace Tests\Feature;

use App\Repositories\PropertyRepository;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class PropertiesTest extends TestCase
{
    /**
     * Test if PropertyRepository::getProperties returns collection.
     *
     * @return void
     */
    public function testGettingPropertiesReturnsCollection()
    {
        $this->assertInstanceOf(Collection::class, (new PropertyRepository())->getProperties());
    }

    /**
     * There is properties in database. More that 0.
     *
     * @return void
     */
    public function testGettingPropertiesReturnsNotEmptyCollection()
    {
        $this->assertGreaterThan(0, (new PropertyRepository())->getProperties()->count());
    }
}
