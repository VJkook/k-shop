<?php

namespace App\Http\Controllers;

use App\Repositories\ConfectionerRepository;
use Illuminate\Http\JsonResponse;

class ConfectionersController extends Controller
{
    public function __construct(protected ConfectionerRepository $confectionerRepo)
    {
    }

    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $confectioners = $this->confectionerRepo->all();
        return response()->json($confectioners);
    }
}
