<?php

namespace App\Models;

use App\Clients\S3Client;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

/**
 * @property int $id
 * @property string $address
 */
class Image extends Model
{
    use HasFactory;

    public const PATH = 'http://localhost:8000/api/images/';

    public const TABLE_NAME = 'images';

    protected $table = self::TABLE_NAME;

    public $timestamps = false;

    protected $fillable = [
        'address',
    ];

    public function getUrl(): string
    {
        return self::PATH . $this->id;
    }

    public function getMimeType(): string
    {
        /** @var S3Client $s3Client */
        $s3Client = app(S3Client::class);
        return $s3Client->getMimeType($this->address);
    }

    public function getImgContent(): string
    {
        /** @var S3Client $s3Client */
        $s3Client = app(S3Client::class);
        return $s3Client->getImgContent($this->address);
    }

    public function deleteFromS3(): bool
    {
        /** @var S3Client $s3Client */
        $s3Client = app(S3Client::class);
        return $s3Client->deleteImg($this->address);
    }

    public function products(): BelongsToMany
    {
        return $this->belongsToMany(
            Product::class,
            ProductImageRelation::TABLE_NAME,
            'id_image',
            'id_product'
        );
    }
}
