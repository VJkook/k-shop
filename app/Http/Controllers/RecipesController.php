<?php

namespace App\Http\Controllers;

use App\Models\Requests\Recipes\IngredientForRecipeRequest;
use App\Repositories\RecipesRepository;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use function response;

class RecipesController extends Controller
{
    public function __construct(protected RecipesRepository $recipesRepo)
    {
    }

    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $recipes = $this->recipesRepo->all();
        return response()->json($recipes);
    }
    
    /**
     * Show the form for creating a new resource.
     */
    public function createForReadyCake(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => ['string', 'required'],
            'description' => ['string', 'nullable'],
            'id_ready_cake' => ['integer', 'numeric', 'required'],
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors()->getMessages(), 400);
        }

        $response = $this->recipesRepo->createForReadyCake(
            $request->name,
            $request->description ?? null,
            $request->id_ready_cake
        );
        return response()->json($response);
    }

    public function createForFilling(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => ['string', 'required'],
            'description' => ['string', 'nullable'],
            'id_filling' => ['integer', 'numeric', 'required'],
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors()->getMessages(), 400);
        }

        $response = $this->recipesRepo->createForFilling(
            $request->get('name'),
            $request->get('description'),
            $request->get('id_filling')
        );
        return response()->json($response);
    }

    public function createForDecor(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => ['string', 'required'],
            'description' => ['string', 'nullable'],
            'id_decor' => ['integer', 'numeric', 'required'],
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors()->getMessages(), 400);
        }

        $response = $this->recipesRepo->createForDecor(
            $request->get('name'),
            $request->get('description'),
            $request->get('id_decor')
        );
        return response()->json($response);
    }

    public function addTechnologicalMap(Request $request, int $id_recipe): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'id_technological_map' => ['integer', 'numeric', 'required'],
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors()->getMessages(), 400);
        }

        $response = $this->recipesRepo->addTechnologicalMap(
            $id_recipe,
            $request->get('id_technological_map')
        );

        return response()->json($response);
    }

    public function addIngredients(Request $request, int $id_recipe): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'ingredients' => ['array', 'required'],
            'ingredients.*.id' => ['integer', 'required'],
            'ingredients.*.quantity' => ['decimal:0,2', 'required'],
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors()->getMessages(), 400);
        }

        /** @var IngredientForRecipeRequest[] $ingredients */
        $ingredients = [];
        foreach ($request->get('ingredients') as $ingredient) {
            $ingredients[] = new IngredientForRecipeRequest($ingredient['id'], $ingredient['quantity']);
        }
        $response = $this->recipesRepo->addIngredients(
            $id_recipe,
            $ingredients
        );

        return response()->json($response);
    }

    /**
     * Display the specified resource.
     */
    public function show(int $id): JsonResponse
    {
        $response = $this->recipesRepo->getById($id);
        return response()->json($response);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => ['string'],
            'price_by_kg' => ['decimal:0,2'],
            'description' => ['string', 'nullable'],
            'id_image' => ['integer', 'numeric',],
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors()->getMessages(), 400);
        }

        $attributes = [];
        if (!is_null($request->name)) {
            $attributes['name'] = $request->name;
        }
        if (!is_null($request->price_by_kg)) {
            $attributes['price_by_kg'] = $request->price_by_kg;
        }
        if (!is_null($request->description)) {
            $attributes['description'] = $request->description;
        }
        if (!is_null($request->id_image)) {
            $attributes['id_image'] = $request->id_image;
        }

        if (empty($attributes)) {
            $fillingResponse = $this->recipesRepo->getById($id);
            return response()->json($fillingResponse);
        }

        $fillingResponse = $this->recipesRepo->updateById($id, $attributes);
        return response()->json($fillingResponse);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id): JsonResponse
    {

        $isSuccess = $this->recipesRepo->deleteById($id);
        if (!$isSuccess) {
            return response()->json(['result' => 'error'], 500);
        }

        return response()->json(['result' => 'success']);
    }
}
