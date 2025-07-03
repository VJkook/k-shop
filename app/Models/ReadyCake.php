<?php

namespace App\Models;

use App\Models\Responses\ImageResponse;
use App\Models\Responses\ReadyCakeResponse;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

/**
 * @property int $id
 * @property string $name
 * @property float $weight
 * @property string $composition
 * @property string $description
 * @property float $price
 */
class ReadyCake extends Model
{
    use HasFactory;

    protected $table = 'ready_cakes';

    public $timestamps = false;

    protected $fillable = [
        'name',
        'weight',
        'composition',
        'description',
        'price',
    ];

    public function images(): BelongsToMany
    {
        return $this->belongsToMany(
            Image::class,
            ReadyCakeImageRelation::TABLE_NAME,
            'id_ready_cake',
            'id_image'
        );
    }

    public function product(): HasOne
    {
        return $this->hasOne(Product::class, 'id_ready_cake', 'id');
    }

    public function recipe(): HasOne
    {
        return $this->hasOne(Recipe::class, 'id_ready_cake', 'id');
    }
    
    public function toResponse(): ReadyCakeResponse
    {
        /** @var Product $product */
        $product = $this->product()->first();
        $response = new ReadyCakeResponse(
            $this->id,
            $this->name,
            $this->description,
            $this->composition,
            $this->weight,
            $this->price,
            $product->id
        );
        $imagesResponses = [];

        /** @var Image[] $images */
        $images = $this->images()->get();
        foreach ($images as $image) {
            $imagesResponses[] = new ImageResponse(
                $image->id,
                $image->getUrl()
            );
        }

        $response->setImages($imagesResponses);
        return $response;
    }
}
