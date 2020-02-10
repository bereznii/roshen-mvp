<?php

namespace App\Repositories;

use App\Models\Property;
use App\Models\Rating;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class RatingRepository
{
    /**
     * Returns product statistics in given period.
     *
     * @return array
     */
    public function getProductRatings()
    {
        $productId = request('id');
        $ratings = [];
        $properties = Property::all();
        $from = Carbon::parse(request('from'))->startOfDay()->format('Y-m-d H:i:s');
        $till = Carbon::parse(request('till'))->endOfDay()->format('Y-m-d H:i:s');

        foreach ($properties as $key => $property) {
            $ratingsFetched = Rating::where('product_id', $productId)
                ->where('properties_id', $property->id)
                ->whereBetween('created_at', [$from, $till])
                ->get();

            $ratingsParsed = $this->parseRatings($ratingsFetched);

            $ratings[$property->id]['name'] = $property->name;
            $ratings[$property->id]['property_id'] = $property->id;
            $ratings[$property->id]['statistics'] = $ratingsParsed;
        }

        return array_values($ratings);
    }


    /**
     * Collects results of needed calculation.
     *
     * @param $ratings
     * @return array
     */
    private function parseRatings($ratings):array
    {
        $result['amountOfEachGrade'] = [];
        $result['average'] = 0;
        $result['rootmeanSquare'] = 0;
        $result['variance'] = 0;
        $result['ratingsNumber'] = 0;

        try {
            $numbers = $ratings->pluck('value')->toArray();

            $result['amountOfEachGrade'] = $this->calculateAmountOfEachGrade($ratings);

            if (count($numbers) > 0) {
                $result['average'] = $this->calculateAverage($numbers);
                $result['rootmeanSquare'] = $this->calculateRootmeanSquare($numbers);
                $result['variance'] = $this->calculateVariance($numbers);
                $result['ratingsNumber'] = $this->calculateRatingsNumber($numbers);
            }
        } catch (\Exception $e) {
            Log::error('Parsing statistics failed, caused by ' . $e->getMessage());
        }

        return $result;
    }

    /**
     * Calculates quantity of records with each grade from 1 to 5.
     *
     * @param $numbers
     * @return float
     */
    private function calculateAverage($numbers):float
    {
        $value = array_sum($numbers) / count($numbers);

        return $this->getFormattedNumber($value);
    }

    /**
     * Count number of ratings.
     *
     * @param $numbers
     * @return float
     */
    private function calculateRatingsNumber($numbers):float
    {
        return $this->getFormattedNumber(count($numbers));
    }

    /**
     * Calculates root mean square, which is square root of quotient
     * of sum of element's square divided by their quantity.
     *
     * @param $numbers
     * @return float
     */
    private function calculateRootmeanSquare($numbers):float
    {
        $value = sqrt(array_reduce($numbers, function($prev, $item) {
                return $prev + pow((int)$item, 2);
            }, 0) / count($numbers));

        return $this->getFormattedNumber($value);
    }

    /**
     * Calculates variance (дисперсiя or Sample Variance) of records value fields.
     *
     * @param $numbers
     * @return float
     */
    private function calculateVariance($numbers):float
    {
        $fMean = array_sum($numbers) / count($numbers);

        $value = array_sum(array_map(function ($x) use ($fMean) {
                return pow((int)$x - $fMean, 2);
            }, $numbers)) / (count($numbers) - 1);

        return $this->getFormattedNumber($value);
    }

    /**
     * Calculates quantity of records with each grade from 1 to 5.
     *
     * @param $statistics
     * @return array
     */
    private function calculateAmountOfEachGrade($statistics):array
    {
        for ($i = 1; $i <= 5; $i++) {
            $result[$i]['grade'] = $i;
            $result[$i]['amount'] = $statistics->where('value', $i)->count();
        }

        return array_values($result);
    }

    /**
     * Transforms input value into float number with 2 digits after point. For ex, 2.34
     *
     * @param $value
     * @return float
     */
    private function getFormattedNumber($value):float
    {
        return number_format((float)$value, 2, '.', '');
    }

    /**
     * Stores user vote into database and returns response.
     *
     * @return array
     */
    public function saveRating():array
    {
        $vote = request('vote');

        $validator = $this->validateRequest($vote);

        if($validator->fails()){
            return ['status' => 'error', 'message' => 'validation failed'];
        }

        $arrayToInsert = $this->buildArrayForRatingSaving($vote);

        Rating::insert($arrayToInsert);

        return ['status' => 'success'];
    }

    /**
     * Validate request and return validator object.
     *
     * @return \Illuminate\Contracts\Validation\Validator
     */
    private function validateRequest($vote)
    {
        request()->merge(['vote' => $vote]);

        $validator = Validator::make(request()->all(), [
            'product_id' => 'required|numeric',
            'vote' => 'required|filled',
            'vote.*.value' => 'required|numeric|min:1|max:5',
            'vote.*.property_id' => 'required|numeric'
        ]);

        return $validator;
    }

    /**
     * Creates array to be inserted into database for this rating.
     *
     * @param array $rating
     * @return array
     */
    private function buildArrayForRatingSaving(array $rating):array
    {
        $arrayToInsert = [];
        $product_id = request('product_id');
        $timestamp = Carbon::now()->format('Y-m-d H:i:s');

        foreach ($rating as $key => $property) {
            $arrayToInsert[$key]['properties_id'] = $property['property_id'];
            $arrayToInsert[$key]['value'] = $property['value'];
            $arrayToInsert[$key]['product_id'] = $product_id;
            $arrayToInsert[$key]['created_at'] = $timestamp;
            $arrayToInsert[$key]['updated_at'] = $timestamp;
        }

        return $arrayToInsert;
    }
}