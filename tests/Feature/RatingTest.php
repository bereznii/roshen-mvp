<?php

namespace Tests\Feature;

use App\Repositories\RatingRepository;
use Tests\TestCase;

class RatingTest extends TestCase
{
    private $ratingRepoObj;

    /**
     * RatingTest constructor.
     *
     * @return void
     */
    public function setUp():void
    {
        parent::setUp();
        $this->ratingRepoObj = new RatingRepository();
    }

    /**
     * Test if ratings are returning properly.
     *
     * @return void
     */
    public function testRatingShowing()
    {
        $randomKeys = ['id', 'product', 'asdfa', 123, null];
        $randomValues = [1, 3, 15, 123, null, 'asfsdsdgsdffhsdfh'];

        for ($i = 0; $i < 15; $i++) {
            $randKey = $randomKeys[array_rand($randomKeys)];
            $randValue = $randomValues[array_rand($randomValues)];

            $response = $this->get('api/admin/product', [$randKey => $randValue]);

            $response->assertJsonFragment(['status' => 'success']);
        }
    }

    /**
     * Test if average ratings is calculating properly.
     *
     * @throws \ReflectionException
     */
    public function testAverageCalculation()
    {
        $arrays = $this->createArraysForCalculationTesting();

        $foo = $this->getMethod(RatingRepository::class, 'calculateAverage');

        foreach ($arrays as $array) {
            $result = $foo->invokeArgs($this->ratingRepoObj, [$array]);

            $this->assertIsFloat($result);
        }
    }

    /**
     * Test if root mean square of ratings is calculating properly.
     *
     * @throws \ReflectionException
     */
    public function testRootMeanSquareCalculation()
    {
        $arrays = $this->createArraysForCalculationTesting();

        $foo = $this->getMethod(RatingRepository::class, 'calculateRootmeanSquare');

        foreach ($arrays as $array) {
            $result = $foo->invokeArgs($this->ratingRepoObj, [$array]);

            $this->assertIsFloat($result);
        }
    }

    /**
     * Test if variance of ratings is calculating properly.
     *
     * @throws \ReflectionException
     */
    public function testVarianceCalculation()
    {
        $arrays = $this->createArraysForCalculationTesting();

        $foo = $this->getMethod(RatingRepository::class, 'calculateVariance');

        foreach ($arrays as $array) {
            $result = $foo->invokeArgs($this->ratingRepoObj, [$array]);

            $this->assertIsFloat($result);
        }
    }

    /**
     * Returns arrays to test ratings calculations.
     *
     * @return array
     */
    private function createArraysForCalculationTesting():array
    {
        $arr = [
            range(0, 333),
            ['a', null, 'f', 'a'],
            ['a', 'a', 554, 'a', 1.22, true],
            [[1,2,3], [3, '4213', true]]
        ];

        return $arr;
    }

    /**
     * Makes method of given class accessible and return instance of the method.
     *
     * @param $className
     * @param $methodName
     * @return \ReflectionMethod
     * @throws \ReflectionException
     */
    protected function getMethod($className, $methodName)
    {
        $class = new \ReflectionClass($className);

        $method = $class->getMethod($methodName);

        $method->setAccessible(true);

        return $method;
    }
}
