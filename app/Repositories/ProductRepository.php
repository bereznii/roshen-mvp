<?php

namespace App\Repositories;

use App\Models\Product;

class ProductRepository
{
    /**
     * Returns all products.
     *
     * @return mixed
     */
    public function getProducts()
    {
        return Product::select(['id', 'name'])->get();
    }

    /**
     * Returns product image;
     *
     * @return mixed
     */
    public function getProductImage()
    {
        $productId = request('id');

        return Product::find($productId)->image ?? '';
    }

    /**
     * Returns specified product.
     *
     * @param int $productId
     * @return mixed
     */
    public function getProduct(int $productId)
    {
        return Product::find($productId);
    }
}