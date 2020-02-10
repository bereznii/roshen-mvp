<?php

namespace App\Http\Controllers;

use App\Repositories\ProductRepository;
use App\Repositories\PropertyRepository;
use Illuminate\Support\Facades\Log;

class ProductController extends Controller
{
    private $productRepository;

    /**
     * ProductController constructor.
     * @param ProductRepository $productRepository
     */
    public function __construct(ProductRepository $productRepository)
    {
        $this->productRepository = $productRepository;
    }

    /**
     * Returns data for the product.
     *
     * @Route("api/product/{id}" , methods={"GET"})
     * @param $productId
     * @param PropertyRepository $propertyRepository
     * @return \Illuminate\Http\Response
     */
    public function show($productId, PropertyRepository $propertyRepository)
    {
        try {
            $product = $this->productRepository->getProduct($productId);
            $properties = $propertyRepository->getProperties();

            return response()->json([
                'status' => 'success',
                'product' => $product,
                'properties' => $properties
            ]);
        } catch (\Exception $e) {
            Log::error('Product index page failed, caused by ' . $e->getMessage());

            return response()->json([
                'status' => 'error'
            ], 500);
        }
    }

    /**
     * Shows initial page with list of products.
     *
     * @Route("api/admin" , methods={"GET"})
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $products = $this->productRepository->getProducts();

        return response()->json([
            'status' => 'success',
            'products' => $products
        ]);
    }
}
