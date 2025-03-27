<?php

namespace App\Http\Controllers;

use App\Clients\S3Client;
use App\Models\Enums\FOLDERS;
use App\Models\Image;
use Illuminate\Contracts\Routing\ResponseFactory;
use Illuminate\Foundation\Application;
use Illuminate\Http\File;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class ImagesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        return response()->json(Image::all()->toArray());
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'image' => ['required', 'mimes:jpg,png,jpeg', 'max:1024'],
        ]);

        if ($validator->fails()) {
            return \response()->json($validator->errors()->getMessages(), 400);
        }

        $image = $request->file('image');
        if ($image === null) {
            return response()->json(['msg' => 'Image not valid', 400]);
        }

        /** @var S3Client $s3Client */
        $s3Client = app(S3Client::class);
        $imgPath = $s3Client->putImg($image, FOLDERS::PRODUCTS);
        if (empty($imgPath)) {
            return response()->json(['msg' => 'Failed load image', 500]);
        }

        /** @var Image $image */
        $image = Image::query()->create(['address' => $imgPath]);
        $image = Image::query()->find($image->id);
        return \response()->json($image);
    }

    /**
     * Display the specified resource.
     */
    public function show(Image $image): Application|Response|\Illuminate\Contracts\Foundation\Application|ResponseFactory
    {
        return response($image->getImgContent())->header('Content-Type', $image->getMimeType());
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Image $image): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'image' => ['mimes:jpg,png,jpeg', 'max:1024'],
        ]);

        if ($validator->fails()) {
            return \response()->json($validator->errors()->getMessages(), 400);
        }

        if (!$image->exists) {
            return response()->json(['msg' => 'image not found'],400);
        }

        $newImgFile = $request->file('image') ?: null;
        /** @var S3Client $s3Client */
        $s3Client = app(S3Client::class);
        $newImgPath = $s3Client->putImg($newImgFile, FOLDERS::PRODUCTS);
        if (empty($newImgPath)) {
            return response()->json(['msg' => 'Failed load image', 500]);
        }

        $isDeleted = $s3Client->deleteImg($image->url);
        if (!$isDeleted) {
            return response()->json(['msg' => 'Failed delete oldImage image', 500]);
        }

        $image->url = $newImgPath;
        $image->save();
        return response()->json($image);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Image $image): JsonResponse
    {
        $isDeleted = $image->deleteFromS3();
        if (!$isDeleted) {
            return response()->json(['msg' => 'Failed delete oldImage image', 500]);
        }

        Image::query()->find($image->id)->delete();
        return response()->json(['result' => 'success']);
    }
}
