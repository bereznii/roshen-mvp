<?php

namespace App\Http\Controllers;

use App\Repositories\ProductRepository;
use App\Repositories\RatingRepository;
use Illuminate\Support\Facades\Log;

class RatingController extends Controller
{
    private $ratingRepository;

    /**
     * RatingController constructor.
     * @param RatingRepository $ratingRepository
     */
    public function __construct(RatingRepository $ratingRepository)
    {
        $this->ratingRepository = $ratingRepository;
    }

    /**
     * Create record in database about user's vote.
     *
     * @Route("api/vote" , methods={"POST"})
     * @return \Illuminate\Contracts\Routing\ResponseFactory|\Illuminate\Http\Response
     */
    public function create()
    {
        try {
            $response = $this->ratingRepository->saveRating();

            return response()->json($response);
        } catch (\Exception $e) {
            Log::error('Voting failed, caused by ' . $e->getMessage());

            return response()->json(['status' => 'error'], 500);
        }
    }

    /**
     * Show product with it's statistics.
     *
     * @Route("api/admin/product" , methods={"GET"})
     * @param ProductRepository $productRepository
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(ProductRepository $productRepository)
    {
        $productImg = $productRepository->getProductImage();
        $statistics = $this->ratingRepository->getProductRatings();

        return response()->json(['status' => 'success', 'product_img' => $productImg, 'statistics' => $statistics]);
    }
}
