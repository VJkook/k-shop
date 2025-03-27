<?php

namespace App\Clients;

use App\Models\Enums\FOLDERS;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class S3Client
{
    private const FOLDER_PRODUCTS = 'products';
    private const DISK_NAME = 'public';

    /**
     * @param UploadedFile[] $images
     * @param FOLDERS $folderType
     * @return string[]
     */
    public function putImages(array $images, FOLDERS $folderType): array
    {
        $urls = [];
        foreach ($images as $image) {
            $imgUrl = $this->putImg($image, $folderType);
            if (!empty($imgUrl)) {
                $urls[] = $imgUrl;
            }
        }

        return $urls;
    }

    public function putImg(UploadedFile $image, FOLDERS $folderType): string
    {
        $folderName = $this->getFolder($folderType);
        /** @var  $uploadedImage string|false */
        $uploadedImage = Storage::disk(self::DISK_NAME)->put('images/' . $folderName, $image);
        if (!$uploadedImage) {
            return '';
        }

        return $uploadedImage;
    }

    public function deleteImg(string $url): bool
    {
        $imageHost = config('app.image_host');
        $path = str_replace($imageHost, '', $url);
        $exists = Storage::disk(self::DISK_NAME)->exists($path);
        if (!$exists) {
            return false;
        }

        return Storage::disk(self::DISK_NAME)->delete($path);
    }

    private function getFolder(FOLDERS $folder): string
    {
        return match ($folder) {
            FOLDERS::PRODUCTS => self::FOLDER_PRODUCTS,
        };
    }

    public function getImgContent(string $path): string
    {
        $exists = Storage::disk(self::DISK_NAME)->exists($path);
        if (!$exists) {
            return false;
        }

        return Storage::disk(self::DISK_NAME)->get($path);
    }

    public function getMimeType(string $path): string
    {
        $exists = Storage::disk(self::DISK_NAME)->exists($path);
        if (!$exists) {
            return false;
        }

        return Storage::disk(self::DISK_NAME)->mimeType($path);
    }
}
