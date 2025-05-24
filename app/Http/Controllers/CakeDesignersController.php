<?php

namespace App\Http\Controllers;

use App\Models\Requests\DecorRequest;
use App\Models\Requests\TierRequest;
use App\Models\User;
use App\Repositories\CakeDesignerRepository;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class CakeDesignersController extends Controller
{
    public function __construct(protected CakeDesignerRepository $cakeDesignerRepo)
    {
    }

    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $fillings = $this->cakeDesignerRepo->all();
        return response()->json($fillings);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => ['string', 'required'],
            'description' => ['string', 'nullable'],
            'weight' => ['decimal:0,2', 'required'],
            'id_coverage' => ['integer', 'numeric', 'required'],
            'id_cake_form' => ['integer', 'numeric', 'required'],

            'tiers' => ['array', 'required'],
            'tiers.*.weight' => ['decimal:0,2', 'required'],
            'tiers.*.id_filling' => ['integer', 'required'],

            'decors' => ['array', 'required'],
            'decors.*.id' => ['integer', 'required'],
            'decors.*.count' => ['integer', 'required'],

            'total_cost' => ['decimal:0,2', 'required'],
        ]);

        if ($validator->fails()) {
            return \response()->json($validator->errors()->getMessages(), 400);
        }

        $attributes = [
            'name' => $request->name,
            'weight' => $request->weight,
            'id_coverage' => $request->id_coverage,
            'total_cost' => $request->total_cost,
            'description' => $request->description,
            'filling_ids' => $request->filling_ids,
            'id_cake_form' => $request->id_cake_form,
        ];

        $decorsRequest = [];
        if (isset($request->decors)) {
            foreach ($request->decors as $decor) {
                $decorsRequest[] = new DecorRequest($decor['id'], $decor['count']);
            }
        }
        $attributes['decors'] = $decorsRequest;

        $tiersRequest = [];
        if (isset($request->tiers)) {
            foreach ($request->tiers as $tier) {
                $tiersRequest[] = new TierRequest($tier['id_filling'], $tier['weight']);
            }
        }
        $attributes['tiers'] = $tiersRequest;

        /** @var User $user */
        $user = Auth::user();
        $attributes['id_user'] = $user->id;
        $fillingResponse = $this->cakeDesignerRepo->create($attributes);
        return \response()->json($fillingResponse);
    }

    /**
     * Display the specified resource.
     */
    public function show(int $id): JsonResponse
    {
        $response = $this->cakeDesignerRepo->getById($id);
        return response()->json($response);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => ['string', 'required'],
            'description' => ['string', 'nullable'],
            'weight' => ['decimal:0,2',],
            'id_coverage' => ['integer', 'numeric', 'required'],
            'id_cake_form' => ['integer', 'numeric', 'required'],

            'tiers' => ['array', 'required'],
            'tiers.*.id_cake_sponge' => ['integer', 'required'],
            'tiers.*.id_filling' => ['integer', 'required'],

            'decors' => ['array', 'required'],
            'decors.*.id' => ['integer', 'required'],
            'decors.*.count' => ['integer', 'required'],

            'total_cost' => ['decimal:0,2'],
        ]);

        if ($validator->fails()) {
            return \response()->json($validator->errors()->getMessages(), 400);
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
        if (!is_null($request->id_cake_form)) {
            $attributes['id_cake_form'] = $request->id_cake_form;
        }

        if (empty($attributes)) {
            $fillingResponse = $this->cakeDesignerRepo->getById($id);
            return response()->json($fillingResponse);
        }

        $fillingResponse = $this->cakeDesignerRepo->updateById($id, $attributes);
        return response()->json($fillingResponse);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id): JsonResponse
    {
        $isSuccess = $this->cakeDesignerRepo->deleteById($id);
        if (!$isSuccess) {
            return response()->json(['result' => 'error'], 500);
        }

        return response()->json(['result' => 'success']);
    }
}
