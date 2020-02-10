<?php

namespace Tests\Feature;

use Tests\TestCase;

class VotingTest extends TestCase
{
    /**
     * Test if vote is saving properly.
     */
    public function testVoteSaving()
    {
        $response = $this->post('/api/vote',
            [
                'product_id' => rand(1,6),
                'vote' => [
                    [
                        'property_id' => 1,
                        'value' => rand(1,5)
                    ],
                    [
                        'property_id' => 2,
                        'value' => rand(1,5)
                    ],
                    [
                        'property_id' => 3,
                        'value' => rand(1,5)
                    ],
                    [
                        'property_id' => 4,
                        'value' => rand(1,5)
                    ]
                ]
            ]);

        $response->assertJsonFragment(['status' => 'success']);
    }
}
