<?php

namespace App\Models;

use App\Models\Responses\CoverageResponse;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property string $name
 * @property string $description
 * @property float $price
 */
class Coverage extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'price',
        'id_image',
    ];

    protected $table = 'coverages';

    public $timestamps = false;

    public function image(): BelongsTo
    {
        return $this->belongsTo(Image::class, 'id_image', 'id');
    }

    public function toResponse(): CoverageResponse
    {
        /** @var Image $image */
        $image = $this->image()->first();
        return new CoverageResponse(
            $this->id,
            $this->name,
            $this->description,
            $this->price,
            $image->toResponse(),
        );
    }
}
